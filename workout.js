import { supabase } from "./supabase.js";
import {
    getFitnessProgram,
    getWorkoutDay
} from "./data/programs.js";

let currentUser = null;
let currentLevel = null;
let currentGoal = null;
let currentDayNumber = 1;

let completedExercises = new Set();

let currentWorkout = null;

let exerciseProgressData = new Map();

/* ============================= */
/* START */
/* ============================= */

document.addEventListener("DOMContentLoaded", async () => {

    await loadUser();

    if (!currentUser) {
        return;
    }

    setupFinishButton();

    await loadCurrentDay();

});


/* ============================= */
/* LOAD USER */
/* ============================= */

async function loadUser() {

    const {
        data,
        error
    } = await supabase.auth.getUser();

    if (error || !data.user) {

        window.location.href = "login.html";

        return;
    }

    currentUser = data.user;

    const metadata =
        currentUser.user_metadata || {};

    currentLevel =
        metadata.level || "beginner";

    currentGoal =
        metadata.goal || "Weight Loss";

    console.log(
        "KG Fitness user:",
        currentUser.email
    );

    console.log(
        "Level:",
        currentLevel
    );

    console.log(
        "Goal:",
        currentGoal
    );
}


/* ============================= */
/* LOAD CURRENT DAY */
/* ============================= */

async function loadCurrentDay() {

    try {

        const {
            data,
            error
        } = await supabase
            .from("workout_progress")
            .select(
                "day_number, completed, completed_at"
            )
            .eq(
                "user_id",
                currentUser.id
            )
            .order(
                "day_number",
                {
                    ascending: true
                }
            );

        if (error) {
            throw error;
        }


        const completedDays =
            (data || [])
                .filter(day => day.completed === true)
                .map(day => Number(day.day_number));


        /*
         * Find the first unfinished day.
         */

        const urlParams =
            new URLSearchParams(
                window.location.search
            );

        const requestedDay =
            Number(
                urlParams.get("day")
            );

        if (
            Number.isInteger(requestedDay) &&
            requestedDay > 0
        ) {

            currentDayNumber =
                requestedDay;

        } else {

            currentDayNumber = 1;

            while (
                completedDays.includes(
                    currentDayNumber
                )
            ) {

                currentDayNumber++;
            }
        }


        /*
         * Load the correct workout.
         */

        currentWorkout =
            getWorkoutDay(
                currentLevel,
                currentGoal,
                currentDayNumber
            );


        /*
         * If this day does not exist
         * yet, use the first available day
         * of the selected program.
         */

        if (!currentWorkout) {

            const program =
                getFitnessProgram(
                    currentLevel,
                    currentGoal
                );

            if (!program) {

                showProgramError();

                return;
            }

            const availableDays =
                Object.keys(
                    program.days
                )
                .map(Number)
                .sort(
                    (a, b) => a - b
                );

            if (!availableDays.length) {

                showProgramError();

                return;
            }

            currentDayNumber =
                availableDays[0];

            currentWorkout =
                getWorkoutDay(
                    currentLevel,
                    currentGoal,
                    currentDayNumber
                );
        }


        /*
         * Load saved exercise progress before rendering
         * so Weight / Reps / Sets and completed status
         * appear immediately.
         */

        await loadExerciseProgress();

        renderWorkout();

    } catch (error) {

        console.error(
            "Error loading workout:",
            error
        );

        showProgramError();
    }
}


/* ============================= */
/* RENDER WORKOUT */
/* ============================= */

function renderWorkout() {

    if (!currentWorkout) {
        return;
    }


    const workoutTitle =
        document.getElementById(
            "workoutTitle"
        );

    const dayNumber =
        document.getElementById(
            "dayNumber"
        );


    /*
     * Header
     */

    if (workoutTitle) {

        workoutTitle.textContent =
            `DAY ${currentDayNumber} WORKOUT`;
    }


    if (dayNumber) {

        dayNumber.textContent =
            currentDayNumber;
    }


    /*
     * Main workout title
     */

    const heroTitle =
        document.querySelector(
            ".hero-content h2"
        );

    if (heroTitle) {

        heroTitle.textContent =
            currentWorkout.title;
    }


    /*
     * Description
     */

    const heroDescription =
        document.querySelector(
            ".hero-content p"
        );

    if (
        heroDescription &&
        currentWorkout.description
    ) {

        heroDescription.textContent =
            currentWorkout.description;
    }


    /*
     * Duration / level / focus
     */

    const metaItems =
        document.querySelectorAll(
            ".workout-meta span"
        );

    if (metaItems.length >= 3) {

        metaItems[0].textContent =
            `⏱ ${currentWorkout.duration}`;

        metaItems[1].textContent =
            `💪 ${formatLevel(currentLevel)}`;

        metaItems[2].textContent =
            `🔥 ${currentWorkout.focus}`;
    }


    /*
     * Exercise progress total
     */

    const progressText =
        document.getElementById(
            "exerciseProgress"
        );

    if (progressText) {

        progressText.textContent =
            `${completedExercises.size} / ${currentWorkout.exercises.length}`;
    }


    renderExercises();
}


/* ============================= */
/* RENDER EXERCISES */
/* ============================= */

function renderExercises() {

    const exercisesSection =
        document.querySelector(
            ".exercises-section"
        );

    if (!exercisesSection) {
        return;
    }

    exercisesSection.innerHTML =
        getEquipmentAvailabilityNotice();

    currentWorkout.exercises.forEach(
        (exercise, index) => {

            const card =
                createExerciseCard(
                    exercise,
                    index
                );

            exercisesSection.appendChild(
                card
            );
        }
    );

    setupExercises();

    updateWorkoutProgress();
}


function getEquipmentAvailabilityNotice() {

    return `
        <div class="equipment-availability-notice">

            <div class="equipment-availability-icon">
                ⚠️
            </div>

            <div class="equipment-availability-content">

                <strong>Important</strong>

                <p>
                    The equipment or machine required for this exercise
                    may not be available at the gym you are currently
                    training in. <strong>Do not skip the exercise or
                    abandon your workout.</strong> Use a suitable
                    alternative that targets the <strong>same muscle
                    group</strong>. If you are not sure which alternative
                    to choose, ask a qualified fitness professional for
                    guidance or choose a safe variation that works the
                    same muscle group.
                </p>

            </div>

        </div>
    `;
}


/* ============================= */
/* CREATE EXERCISE CARD */
/* ============================= */

function createExerciseCard(
    exercise,
    index
) {

    const card =
        document.createElement("article");

    card.className =
        "exercise-card";

    card.dataset.exercise =
        index + 1;


    const exerciseImage =
        getExerciseIcon(
            exercise.name
        );


    const repsLabel =
        exercise.reps
            .toString()
            .toUpperCase();


    const savedProgress =
        exerciseProgressData.get(
            exercise.name
        ) || {};

    const savedWeight =
        savedProgress.weight ?? "";

    const savedReps =
        savedProgress.reps ?? "";

    const savedSets =
        savedProgress.sets ?? "";

    const isCompleted =
        savedProgress.completed === true;


    if (isCompleted) {

        completedExercises.add(
            index + 1
        );
    }


    card.innerHTML = `
        <div class="exercise-image">

            <div class="exercise-placeholder">
                ${exerciseImage}
            </div>

            <span class="exercise-number">
                ${String(index + 1).padStart(2, "0")}
            </span>

        </div>


        <div class="exercise-content">

            <div class="exercise-top">

                <div>

                    <span class="exercise-label">
                        ${escapeHTML(exercise.muscle)}
                    </span>

                    <h3>
                        ${escapeHTML(exercise.name)}
                    </h3>

                </div>

                <span class="exercise-status">
                    ${isCompleted ? "COMPLETED" : "NOT COMPLETED"}
                </span>

            </div>


            <p class="exercise-description">
                ${getExerciseDescription(exercise.name)}
            </p>


            <div class="exercise-details">

                <div>
                    <span>SETS</span>

                    <strong>
                        ${escapeHTML(exercise.sets)}
                    </strong>
                </div>

                <div>

                    <span>
                        ${repsLabel.includes("SEC")
                            ? "TIME"
                            : "REPS"}
                    </span>

                    <strong>
                        ${escapeHTML(exercise.reps)}
                    </strong>

                </div>

                <div>

                    <span>REST</span>

                    <strong>
                        ${escapeHTML(exercise.rest)}
                    </strong>

                </div>

            </div>


            <div class="exercise-progress-inputs">

                <div class="exercise-input-group">

                    <label>WEIGHT (KG)</label>

                    <input
                        type="number"
                        min="0"
                        step="0.5"
                        class="exercise-weight-input"
                        placeholder="0"
                        value="${escapeHTML(savedWeight)}"
                    >

                </div>


                <div class="exercise-input-group">

                    <label>REPS</label>

                    <input
                        type="number"
                        min="0"
                        class="exercise-reps-input"
                        placeholder="0"
                        value="${escapeHTML(savedReps)}"
                    >

                </div>


                <div class="exercise-input-group">

                    <label>SETS</label>

                    <input
                        type="number"
                        min="0"
                        class="exercise-sets-input"
                        placeholder="0"
                        value="${escapeHTML(savedSets)}"
                    >

                </div>

            </div>


            <div class="exercise-info">

                <h4>
                    HOW TO PERFORM
                </h4>

                <p>
                    ${getExerciseInstructions(exercise.name)}
                </p>

            </div>


            <div class="exercise-info warning">

                <h4>
                    COMMON MISTAKES & SAFETY
                </h4>

                <p>
                    ${getExerciseSafety(exercise.name)}
                </p>

            </div>


            <button
                type="button"
                class="complete-exercise-btn"
            >
                ${isCompleted
                    ? "✓ COMPLETED"
                    : "✓ COMPLETE EXERCISE"}
            </button>

        </div>
    `;


    if (isCompleted) {

        card.classList.add(
            "completed"
        );
    }


    return card;
}


/* ============================= */
/* EXERCISE IMAGES */
/* ============================= */

const EXERCISE_IMAGES = {

    "Bodyweight Squat":
        "./images/exercises/bodyweight-squat.jpg",

    "Tricep Extension":
        "./images/exercises/tricep-extension.jpg",

    "Push-Ups":
        "./images/exercises/push-ups.jpg",

    "Incline Push-Ups":
        "./images/exercises/incline-push-ups.jpg",

    "Glute Bridge":
        "./images/exercises/glute-bridge.jpg",

    "Dumbbell Wrist Curl":
        "./images/exercises/dumbbell-wrist-curl.jpg",

    "Dumbbell Row":
        "./images/exercises/dumbbell-row.jpg",

    "Dumbbell Lateral Raise":
        "./images/exercises/dumbbell-lateral-raise.jpg",

    "Dumbbell Shoulder Press":
        "./images/exercises/dumbbell-shoulder-press.jpg",

    "Dumbbell Curl":
        "./images/exercises/dumbbell-curl.jpg",

    "Plank":
        "./images/exercises/plank.jpg",

    "Bird Dog":
        "./images/exercises/bird-dog.jpg",

    "Cat-Cow":
        "./images/exercises/cat-cow.jpg",

    "Standing Hip Circles":
        "./images/exercises/standing-hip-circles.jpg",

    "Child's Pose":
        "./images/exercises/childs-pose.jpg",

    "Dumbbell Rear Delt Fly":
        "./images/exercises/dumbbell-rear-delt-fly.jpg",

    "Lat Pulldown":
        "./images/exercises/lat-pulldown.jpg",

    "Barbell Romanian Deadlift":
        "./images/exercises/barbell-romanian-deadlift.jpg",

    "Hip Thrust":
        "./images/exercises/hip-thrust.jpg",

    "Barbell Bent Over Row":
        "./images/exercises/barbell-bent-over-row.jpg",

    "Goblet Squat":
        "./images/exercises/goblet-squat.jpg",

    "Treadmill Incline Walk":
        "./images/exercises/treadmill-incline-walk.jpg",

    "Hammer Curl":
        "./images/exercises/hammer-curl.jpg",

    "Close Grip Bench Press":
        "./images/exercises/close-grip-bench-press.jpg",

    "Barbell Hold":
        "./images/exercises/barbell-hold.jpg",

    "Leg Press":
        "./images/exercises/leg-press.jpg",

    "Lying Leg Curl":
        "./images/exercises/lying-leg-curl.jpg",

    "Standing Calf Raise":
        "./images/exercises/standing-calf-raise.jpg",

    "Incline Dumbbell Press":
        "./images/exercises/incline-dumbbell-press.jpg",

    "Cable Crunch":
        "./images/exercises/cable-crunch.jpg",

    "Landmine Press":
        "./images/exercises/landmine-press.jpg",

    "Machine Shoulder Press":
        "./images/exercises/machine-shoulder-press.jpg",

    "Lean Away Cable Raise":
        "./images/exercises/lean-away-cable-raise.jpg",

    "Face Pull":
        "./images/exercises/face-pull.jpg",

    "Single Arm Lat Pulldown":
        "./images/exercises/single-arm-lat-pulldown.jpg",

    "Chest Supported Row":
        "./images/exercises/chest-supported-row.jpg",

    "Cable Pull Through":
        "./images/exercises/cable-pull-through.jpg",

    "Hip Abduction Machine":
        "./images/exercises/hip-abduction-machine.jpg",

    "Seated Leg Curl":
        "./images/exercises/seated-leg-curl.jpg",

    "Dumbbell Clean":
        "./images/exercises/dumbbell-clean.jpg",

    "Elliptical Trainer":
        "./images/exercises/elliptical-trainer.jpg",

    "Pallof Press":
        "./images/exercises/pallof-press.jpg",

    "Dumbbell Romanian Deadlift":
        "./images/exercises/dumbbell-romanian-deadlift.jpg",

    "Back Extension":
        "./images/exercises/back-extension.jpg",

    "EZ Bar Curl":
        "./images/exercises/ez-bar-curl.jpg",

    "Machine Tricep Extension":
        "./images/exercises/machine-tricep-extension.jpg",

    "Dead Hang":
        "./images/exercises/dead-hang.jpg",

    "Dumbbell Split Squat":
        "./images/exercises/dumbbell-split-squat.jpg",

    "Smith Machine Calf Raise":
        "./images/exercises/smith-machine-calf-raise.jpg",

    "Machine Chest Press":
        "./images/exercises/machine-chest-press.jpg",

    "Reverse Crunch":
        "./images/exercises/reverse-crunch.jpg",

    "Cable Press Around":
        "./images/exercises/cable-press-around.jpg",

    "Single Arm Dumbbell Press":
        "./images/exercises/single-arm-dumbbell-press.jpg",

    "Seated Lateral Raise":
        "./images/exercises/seated-lateral-raise.jpg",

    "Cable Face Pull":
        "./images/exercises/cable-face-pull.jpg",

    "Neutral Grip Pulldown":
        "./images/exercises/neutral-grip-pulldown.jpg",

    "Single Arm Cable Row":
        "./images/exercises/single-arm-cable-row.jpg",

    "Cable Hip Extension":
        "./images/exercises/cable-hip-extension.jpg",

    "Cable Hamstring Curl":
        "./images/exercises/cable-hamstring-curl.jpg",

    "Good Morning":
        "./images/exercises/good-morning.jpg",

    "Kettlebell Clean":
        "./images/exercises/kettlebell-clean.jpg",

    "Sled Push":
        "./images/exercises/sled-push.jpg",

    "Ab Wheel Rollout":
        "./images/exercises/ab-wheel-rollout.jpg",

    "Machine Biceps Curl":
        "./images/exercises/machine-biceps-curl.jpg",

    "Single Arm Cable Pushdown":
        "./images/exercises/single-arm-cable-pushdown.jpg",

    "Towel Grip Hold":
        "./images/exercises/towel-grip-hold.jpg",

    "Step Up":
        "./images/exercises/step-up.jpg",

    "Dumbbell Stiff Leg Deadlift":
        "./images/exercises/dumbbell-stiff-leg-deadlift.jpg",

    "Banded Glute Kickback":
        "./images/exercises/banded-glute-kickback.jpg",

    "Pec Deck":
        "./images/exercises/pec-deck.jpg",

    "Heel Taps":
        "./images/exercises/heel-taps.jpg",

    "Close Grip Push-Ups":
        "./images/exercises/close-grip-push-ups.jpg",

    "Seated Dumbbell Press":
        "./images/exercises/seated-dumbbell-press.jpg",

    "Dumbbell Y Raise":
        "./images/exercises/dumbbell-y-raise.jpg",

    "Bent Over Rear Delt Fly":
        "./images/exercises/bent-over-rear-delt-fly.jpg",

    "Cable Pullover":
        "./images/exercises/cable-pullover.jpg",

    "Wide Grip Seated Row":
        "./images/exercises/wide-grip-seated-row.jpg",

    "Barbell Good Morning":
        "./images/exercises/barbell-good-morning.jpg",

    "Dumbbell Hip Thrust":
        "./images/exercises/dumbbell-hip-thrust.jpg",

    "Stability Ball Leg Curl":
        "./images/exercises/stability-ball-leg-curl.jpg",

    "Kettlebell Deadlift":
        "./images/exercises/kettlebell-deadlift.jpg",

    "Landmine Squat":
        "./images/exercises/landmine-squat.jpg",

    "Medicine Ball Slam":
        "./images/exercises/medicine-ball-slam.jpg",

    "Cable Single Arm Curl":
        "./images/exercises/cable-single-arm-curl.jpg",

    "Reverse Grip Pushdown":
        "./images/exercises/reverse-grip-pushdown.jpg",

    "Suitcase Carry":
        "./images/exercises/suitcase-carry.jpg",

    "Leg Extension":
        "./images/exercises/leg-extension.jpg",

    "Glute Ham Raise":
        "./images/exercises/glute-ham-raise.jpg",

    "Reverse Hyperextension":
        "./images/exercises/reverse-hyperextension.jpg",

    "Chest Press Machine":
        "./images/exercises/chest-press-machine.jpg",

    "Weighted Sit-Up":
        "./images/exercises/weighted-sit-up.jpg",

    "Machine Fly":
        "./images/exercises/machine-fly.jpg",

    "Cable Front Raise":
        "./images/exercises/cable-front-raise.jpg",

    "Band Lateral Raise":
        "./images/exercises/band-lateral-raise.jpg",

    "Rope Face Pull":
        "./images/exercises/rope-face-pull.jpg",

    "Half Kneeling Pulldown":
        "./images/exercises/half-kneeling-pulldown.jpg",

    "Incline Dumbbell Row":
        "./images/exercises/incline-dumbbell-row.jpg",

    "Step Up Glute Focus":
        "./images/exercises/step-up-glute-focus.jpg",

    "Single Leg Hip Hinge":
        "./images/exercises/single-leg-hip-hinge.jpg",

    "Cable Squat to Row":
        "./images/exercises/cable-squat-to-row.jpg",

    "Bike Intervals":
        "./images/exercises/bike-intervals.jpg",

    "Cable Biceps Curl":
        "./images/exercises/cable-biceps-curl.jpg",

    "Overhead Cable Extension":
        "./images/exercises/overhead-cable-extension.jpg",

    "Farmer Carry":
        "./images/exercises/farmer-carry.jpg",

    "Barbell Back Squat":
        "./images/exercises/barbell-back-squat.jpg",

    "Cable Glute Kickback":
        "./images/exercises/cable-glute-kickback.jpg",

    "Barbell Bench Press":
        "./images/exercises/barbell-bench-press.jpg",

    "Bicycle Crunch":
        "./images/exercises/bicycle-crunch.jpg",

    "Single Arm Cable Press":
        "./images/exercises/single-arm-cable-press.jpg",

    "Arnold Press":
        "./images/exercises/arnold-press.jpg",

    "Machine Lateral Raise":
        "./images/exercises/machine-lateral-raise.jpg",

    "Cable Rear Delt Fly":
        "./images/exercises/cable-rear-delt-fly.jpg",

    "Pull-Ups":
        "./images/exercises/pull-ups.jpg",

    "Seated Cable Row":
        "./images/exercises/seated-cable-row.jpg",

    "Rack Pull":
        "./images/exercises/rack-pull.jpg",

    "Kettlebell Swing":
        "./images/exercises/kettlebell-swing.jpg",

    "Rowing Machine":
        "./images/exercises/rowing-machine.jpg",

    "Mountain Climbers":
        "./images/exercises/mountain-climbers.jpg",

    "Incline Dumbbell Curl":
        "./images/exercises/incline-dumbbell-curl.jpg",

    "Skull Crusher":
        "./images/exercises/skull-crusher.jpg",

    "Cable Wrist Curl":
        "./images/exercises/cable-wrist-curl.jpg",

    "Hack Squat":
        "./images/exercises/hack-squat.jpg",

    "Single Leg Romanian Deadlift":
        "./images/exercises/single-leg-romanian-deadlift.jpg",

    "Dumbbell Calf Raise":
        "./images/exercises/dumbbell-calf-raise.jpg",

    "Cable Chest Fly":
        "./images/exercises/cable-chest-fly.jpg",

    "Machine Incline Press":
        "./images/exercises/machine-incline-press.jpg",

    "Seated Barbell Press":
        "./images/exercises/seated-barbell-press.jpg",

    "Resistance Band Lateral Raise":
        "./images/exercises/resistance-band-lateral-raise.jpg",

    "Single Arm Rear Delt Fly":
        "./images/exercises/single-arm-rear-delt-fly.jpg",

    "Straight Arm Pulldown":
        "./images/exercises/straight-arm-pulldown.jpg",

    "Machine Row":
        "./images/exercises/machine-row.jpg",

    "Banded Hip Thrust":
        "./images/exercises/banded-hip-thrust.jpg",

    "Dumbbell Clean & Press":
        "./images/exercises/dumbbell-clean-press.jpg",

    "Battle Rope":
        "./images/exercises/battle-rope.jpg",

    "Hanging Knee Raise":
        "./images/exercises/hanging-knee-raise.jpg",

    "Concentration Curl":
        "./images/exercises/concentration-curl.jpg",

    "Bench Dips":
        "./images/exercises/bench-dips.jpg",

    "Dumbbell Grip Hold":
        "./images/exercises/dumbbell-grip-hold.jpg",

    "Smith Machine Squat":
        "./images/exercises/smith-machine-squat.jpg",

    "Decline Barbell Press":
        "./images/exercises/decline-barbell-press.jpg",

    "Russian Twist":
        "./images/exercises/russian-twist.jpg",

    "Wide Push-Ups":
        "./images/exercises/wide-push-ups.jpg",

    "Push Press":
        "./images/exercises/push-press.jpg",

    "Cable Y Raise":
        "./images/exercises/cable-y-raise.jpg",

    "Chest Supported Rear Delt Fly":
        "./images/exercises/chest-supported-rear-delt-fly.jpg",

    "Machine Pullover":
        "./images/exercises/machine-pullover.jpg",

    "Dumbbell Chest Supported Row":
        "./images/exercises/dumbbell-chest-supported-row.jpg",

    "Smith Machine Hip Thrust":
        "./images/exercises/smith-machine-hip-thrust.jpg",

    "Dumbbell Deadlift":
        "./images/exercises/dumbbell-deadlift.jpg",

    "Dumbbell Snatch":
        "./images/exercises/dumbbell-snatch.jpg",

    "Spider Curl":
        "./images/exercises/spider-curl.jpg",

    "Assisted Dip Machine":
        "./images/exercises/assisted-dip-machine.jpg",

    "Cable Reverse Curl":
        "./images/exercises/cable-reverse-curl.jpg",

    "Walking Lunges":
        "./images/exercises/walking-lunges.jpg",

    "Frog Pumps":
        "./images/exercises/frog-pumps.jpg",

    "High Cable Fly":
        "./images/exercises/high-cable-fly.jpg",

    "Incline Cable Fly":
        "./images/exercises/incline-cable-fly.jpg",

    "Plate Front Raise":
        "./images/exercises/plate-front-raise.jpg",

    "Incline Lateral Raise":
        "./images/exercises/incline-lateral-raise.jpg",

    "Rear Delt Machine":
        "./images/exercises/rear-delt-machine.jpg",

    "Kneeling Lat Pulldown":
        "./images/exercises/kneeling-lat-pulldown.jpg",

    "Hammer Strength Row":
        "./images/exercises/hammer-strength-row.jpg",

    "45 Degree Back Extension":
        "./images/exercises/45-degree-back-extension.jpg",

    "Cable Hip Hinge":
        "./images/exercises/cable-hip-hinge.jpg",

    "Dumbbell Reverse Lunge":
        "./images/exercises/dumbbell-reverse-lunge.jpg",

    "Treadmill Intervals":
        "./images/exercises/treadmill-intervals.jpg",

    "Leg Raise":
        "./images/exercises/leg-raise.jpg",

    "Barbell Curl":
        "./images/exercises/barbell-curl.jpg",

    "Cable Tricep Pushdown":
        "./images/exercises/cable-tricep-pushdown.jpg",

    "Reverse Wrist Curl":
        "./images/exercises/reverse-wrist-curl.jpg",

    "Dumbbell Bench Press":
        "./images/exercises/dumbbell-bench-press.jpg",

    "Dead Bug":
        "./images/exercises/dead-bug.jpg",

    "Dumbbell Squeeze Press":
        "./images/exercises/dumbbell-squeeze-press.jpg",

    "Barbell Overhead Press":
        "./images/exercises/barbell-overhead-press.jpg",

    "Cable Lateral Raise":
        "./images/exercises/cable-lateral-raise.jpg",

    "Reverse Pec Deck":
        "./images/exercises/reverse-pec-deck.jpg",

    "Assisted Pull-Up":
        "./images/exercises/assisted-pull-up.jpg",

    "Trap Bar Deadlift":
        "./images/exercises/trap-bar-deadlift.jpg",

    "Dumbbell Thruster":
        "./images/exercises/dumbbell-thruster.jpg",

    "Stationary Bike":
        "./images/exercises/stationary-bike.jpg",

    "Preacher Curl":
        "./images/exercises/preacher-curl.jpg",

    "Dumbbell Tricep Kickback":
        "./images/exercises/dumbbell-tricep-kickback.jpg",

    "Plate Pinch Hold":
        "./images/exercises/plate-pinch-hold.jpg",

    "Front Squat":
        "./images/exercises/front-squat.jpg",

    "Seated Calf Raise":
        "./images/exercises/seated-calf-raise.jpg",

    "Incline Barbell Press":
        "./images/exercises/incline-barbell-press.jpg",

    "Dumbbell Floor Press":
        "./images/exercises/dumbbell-floor-press.jpg",

    "Landmine Shoulder Press":
        "./images/exercises/landmine-shoulder-press.jpg",

    "Single Arm Lateral Raise":
        "./images/exercises/single-arm-lateral-raise.jpg",

    "Incline Rear Delt Fly":
        "./images/exercises/incline-rear-delt-fly.jpg",

    "Close Grip Lat Pulldown":
        "./images/exercises/close-grip-lat-pulldown.jpg",

    "T-Bar Row":
        "./images/exercises/t-bar-row.jpg",

    "Single Leg Hip Thrust":
        "./images/exercises/single-leg-hip-thrust.jpg",

    "Barbell Complex":
        "./images/exercises/barbell-complex.jpg",

    "Stair Climber":
        "./images/exercises/stair-climber.jpg",

    "Cable Hammer Curl":
        "./images/exercises/cable-hammer-curl.jpg",

    "Rope Overhead Tricep Extension":
        "./images/exercises/rope-overhead-tricep-extension.jpg",

    "Reverse Barbell Curl":
        "./images/exercises/reverse-barbell-curl.jpg",

    "Bulgarian Split Squat":
        "./images/exercises/bulgarian-split-squat.jpg",

    "Kettlebell Romanian Deadlift":
        "./images/exercises/kettlebell-romanian-deadlift.jpg",

    "Cable Glute Abduction":
        "./images/exercises/cable-glute-abduction.jpg",

    "Decline Dumbbell Press":
        "./images/exercises/decline-dumbbell-press.jpg",

    "Assisted Chest Dip":
        "./images/exercises/assisted-chest-dip.jpg",

    "Cable Front Press":
        "./images/exercises/cable-front-press.jpg",

    "Partial Lateral Raise":
        "./images/exercises/partial-lateral-raise.jpg",

    "Band Face Pull":
        "./images/exercises/band-face-pull.jpg",

    "Wide Grip Pulldown":
        "./images/exercises/wide-grip-pulldown.jpg",

    "Landmine Row":
        "./images/exercises/landmine-row.jpg",

    "Stability Ball Back Extension":
        "./images/exercises/stability-ball-back-extension.jpg",

    "Nordic Hamstring Curl":
        "./images/exercises/nordic-hamstring-curl.jpg",

    "Jump Rope":
        "./images/exercises/jump-rope.jpg",

    "Alternating Dumbbell Curl":
        "./images/exercises/alternating-dumbbell-curl.jpg",

    "Dumbbell Overhead Tricep Extension":
        "./images/exercises/dumbbell-overhead-tricep-extension.jpg",

    "Plate Wrist Rotation":
        "./images/exercises/plate-wrist-rotation.jpg",

    "Reverse Lunge":
        "./images/exercises/reverse-lunge.jpg",

    "Single Leg Glute Bridge":
        "./images/exercises/single-leg-glute-bridge.jpg",

    "Low Cable Fly":
        "./images/exercises/low-cable-fly.jpg",

    "Dumbbell Fly":
        "./images/exercises/dumbbell-fly.jpg",

    "Kettlebell Press":
        "./images/exercises/kettlebell-press.jpg",

    "Lateral Raise Machine":
        "./images/exercises/lateral-raise-machine.jpg",

    "High Cable Rear Delt Fly":
        "./images/exercises/high-cable-rear-delt-fly.jpg",

    "Band Lat Pulldown":
        "./images/exercises/band-lat-pulldown.jpg",

    "Close Grip Cable Row":
        "./images/exercises/close-grip-cable-row.jpg",

    "Hip Hinge":
        "./images/exercises/hip-hinge.jpg"

};
/* ============================= */
/* GET EXERCISE IMAGE */
/* ============================= */

function getExerciseIcon(name) {

    const imagePath =
        EXERCISE_IMAGES[name];

    if (imagePath) {

        return `
            <img
                src="${imagePath}"
                alt="${escapeHTML(name)}"
                loading="lazy"
            >
        `;
    }

    return `
        <span
            style="
                font-size:70px;
                display:flex;
                align-items:center;
                justify-content:center;
            "
        >
            🏋️
        </span>
    `;
}


/* ============================= */
/* EXERCISE DESCRIPTIONS */
/* ============================= */

function getExerciseDescription(name) {

    const descriptions = {

        "Bodyweight Squat":
            "A simple lower-body movement that trains the legs and glutes while helping build a strong movement foundation.",

        "Push-Ups":
            "A classic upper-body movement that trains the chest, shoulders and triceps.",

        "Glute Bridge":
            "A beginner-friendly movement focused on the glutes and hip extension.",

        "Dumbbell Row":
            "A pulling movement that targets the back and helps develop upper-body strength.",

        "Dumbbell Shoulder Press":
            "A controlled pressing movement that trains the shoulders and triceps.",

        "Plank":
            "An isometric core exercise that develops stability and body control.",

        "Bird Dog":
            "A controlled core and stability movement that trains coordination and balance.",

        "Cat-Cow":
            "A gentle mobility movement designed to move the spine through a comfortable range of motion.",

        "Standing Hip Circles":
            "A simple mobility exercise designed to move and warm up the hips.",

        "Child's Pose":
            "A gentle recovery position that can help relax the body and encourage comfortable movement."
    };


    return descriptions[name] ||
        "Perform this exercise with controlled movement and good technique.";
}


/* ============================= */
/* EXERCISE INSTRUCTIONS */
/* ============================= */

function getExerciseInstructions(name) {

    const instructions = {

        "Bodyweight Squat":
            "Stand with your feet about shoulder-width apart. Keep your chest lifted, bend your knees and lower your hips. Push through your feet to return to the starting position.",

        "Push-Ups":
            "Place your hands slightly wider than shoulder-width. Keep your body controlled in a straight line, lower your chest toward the floor and push back up.",

        "Glute Bridge":
            "Lie on your back with your knees bent and feet flat on the floor. Lift your hips while squeezing your glutes, then lower slowly.",

        "Dumbbell Row":
            "Support yourself with one hand and keep your back stable. Pull the dumbbell toward your hip while keeping your elbow close to your body.",

        "Dumbbell Shoulder Press":
            "Hold the dumbbells around shoulder height. Press them upward with control and slowly return them to the starting position.",

        "Plank":
            "Place your forearms on the floor and extend your legs behind you. Keep your body controlled in a straight line and brace your core.",

        "Bird Dog":
            "Start on your hands and knees. Slowly extend one arm and the opposite leg while keeping your torso stable, then return and switch sides.",

        "Cat-Cow":
            "Start on your hands and knees. Slowly move between a comfortable rounded-back position and a gently extended position while breathing normally.",

        "Standing Hip Circles":
            "Stand tall and hold onto a stable support if needed. Move one leg through controlled circular movements without forcing the range.",

        "Child's Pose":
            "From a comfortable kneeling position, move your hips back toward your heels and extend your arms forward. Breathe slowly and stay within a comfortable range."
    };


    return instructions[name] ||
        "Perform the exercise slowly and with controlled movement.";
}


/* ============================= */
/* EXERCISE SAFETY */
/* ============================= */

function getExerciseSafety(name) {

    const safety = {

        "Bodyweight Squat":
            "Keep your knees aligned with your feet and avoid rushing the movement. Stop if you experience sharp or unusual pain.",

        "Push-Ups":
            "Keep your body controlled and avoid letting your hips drop. Use an easier variation if necessary.",

        "Glute Bridge":
            "Avoid excessive lower-back arching. Focus on controlled movement and comfortable range of motion.",

        "Dumbbell Row":
            "Avoid twisting your body or using excessive momentum. Choose a manageable weight and maintain good form.",

        "Dumbbell Shoulder Press":
            "Do not use excessive weight. Keep the movement controlled and avoid forcing the shoulders into an uncomfortable position.",

        "Plank":
            "Avoid allowing the lower back to sag. Stop if you can no longer maintain good form.",

        "Bird Dog":
            "Move slowly and avoid rotating your hips or torso. Use a smaller range if balance is difficult.",

        "Cat-Cow":
            "Move gently and never force the spine into a painful position.",

        "Standing Hip Circles":
            "Use support if needed and keep the movement controlled. Do not force the hip through an uncomfortable range.",

        "Child's Pose":
            "Stay within a comfortable range and do not force the stretch. Stop if you experience pain."
    };


    return safety[name] ||
        "Use controlled movement and stop if you experience sharp or unusual pain.";
}


/* ============================= */
/* SETUP EXERCISES */
/* ============================= */

function setupExercises() {

    const exerciseCards =
        document.querySelectorAll(
            ".exercise-card"
        );


    exerciseCards.forEach(card => {

        const button =
            card.querySelector(
                ".complete-exercise-btn"
            );

        if (!button) {
            return;
        }


        const exerciseNumber =
            Number(
                card.dataset.exercise
            );

        const exercise =
            currentWorkout?.exercises?.[
                exerciseNumber - 1
            ];


        button.addEventListener(
            "click",
            async () => {

                await toggleExercise(
                    exerciseNumber,
                    card,
                    button
                );
            }
        );


        const inputs =
            card.querySelectorAll(
                ".exercise-progress-inputs input"
            );


        inputs.forEach(input => {

            input.addEventListener(
                "change",
                async () => {

                    if (!exercise) {
                        return;
                    }

                    const completed =
                        completedExercises.has(
                            exerciseNumber
                        );

                    try {

                        await saveExerciseProgress(
                            exercise,
                            card,
                            completed
                        );

                    } catch (error) {

                        console.error(
                            "Error saving exercise progress:",
                            error
                        );
                    }
                }
            );
        });
    });
}


/* ============================= */
/* TOGGLE EXERCISE */
/* ============================= */

async function toggleExercise(
    exerciseNumber,
    card,
    button
) {

    const exercise =
        currentWorkout?.exercises?.[
            exerciseNumber - 1
        ];

    if (!exercise) {
        return;
    }


    const wasCompleted =
        completedExercises.has(
            exerciseNumber
        );

    const newCompletedState =
        !wasCompleted;


    if (newCompletedState) {

        completedExercises.add(
            exerciseNumber
        );

        card.classList.add(
            "completed"
        );

        button.textContent =
            "✓ COMPLETED";

        const status =
            card.querySelector(
                ".exercise-status"
            );

        if (status) {

            status.textContent =
                "COMPLETED";
        }

    } else {

        completedExercises.delete(
            exerciseNumber
        );

        card.classList.remove(
            "completed"
        );

        button.textContent =
            "✓ COMPLETE EXERCISE";

        const status =
            card.querySelector(
                ".exercise-status"
            );

        if (status) {

            status.textContent =
                "NOT COMPLETED";
        }
    }


    updateWorkoutProgress();


    try {

        await saveExerciseProgress(
            exercise,
            card,
            newCompletedState
        );

    } catch (error) {

        console.error(
            "Error saving exercise progress:",
            error
        );


        if (wasCompleted) {

            completedExercises.add(
                exerciseNumber
            );

            card.classList.add(
                "completed"
            );

            button.textContent =
                "✓ COMPLETED";

            const status =
                card.querySelector(
                    ".exercise-status"
                );

            if (status) {

                status.textContent =
                    "COMPLETED";
            }

        } else {

            completedExercises.delete(
                exerciseNumber
            );

            card.classList.remove(
                "completed"
            );

            button.textContent =
                "✓ COMPLETE EXERCISE";

            const status =
                card.querySelector(
                    ".exercise-status"
                );

            if (status) {

                status.textContent =
                    "NOT COMPLETED";
            }
        }

        updateWorkoutProgress();
    }
}


/* ============================= */
/* SAVE EXERCISE PROGRESS */
/* ============================= */

let exerciseSavePromises = new Set();


async function saveExerciseProgress(
    exercise,
    card,
    completed
) {

    if (!currentUser || !exercise || !card) {
        return;
    }


    const weightInput =
        card.querySelector(
            ".exercise-weight-input"
        );

    const repsInput =
        card.querySelector(
            ".exercise-reps-input"
        );

    const setsInput =
        card.querySelector(
            ".exercise-sets-input"
        );


    const weightValue =
        weightInput?.value.trim() || "";

    const repsValue =
        repsInput?.value.trim() || "";

    const setsValue =
        setsInput?.value.trim() || "";


    const weight =
        weightValue === ""
            ? null
            : Number(weightValue);

    const reps =
        repsValue === ""
            ? null
            : Number(repsValue);

    const sets =
        setsValue === ""
            ? null
            : Number(setsValue);


    if (
        weight !== null &&
        !Number.isFinite(weight)
    ) {

        throw new Error(
            "Invalid weight value."
        );
    }


    if (
        reps !== null &&
        !Number.isInteger(reps)
    ) {

        throw new Error(
            "Reps must be a whole number."
        );
    }


    if (
        sets !== null &&
        !Number.isInteger(sets)
    ) {

        throw new Error(
            "Sets must be a whole number."
        );
    }


    const savePromise =
        (async () => {

            const {
                error
            } = await supabase
                .from("exercise_progress")
                .upsert(
                    {
                        user_id:
                            currentUser.id,

                        day_number:
                            currentDayNumber,

                        exercise_name:
                            exercise.name,

                        weight,

                        reps,

                        sets,

                        completed:
                            completed === true,

                        completed_at:
                            completed === true
                                ? new Date().toISOString()
                                : null
                    },
                    {
                        onConflict:
                            "user_id,day_number,exercise_name"
                    }
                );


            if (error) {
                throw error;
            }


            exerciseProgressData.set(
                exercise.name,
                {
                    weight,
                    reps,
                    sets,
                    completed:
                        completed === true
                }
            );

        })();


    exerciseSavePromises.add(
        savePromise
    );


    try {

        await savePromise;

    } finally {

        exerciseSavePromises.delete(
            savePromise
        );
    }
}


/* ============================= */
/* UPDATE PROGRESS */
/* ============================= */

function updateWorkoutProgress() {

    if (!currentWorkout) {
        return;
    }


    const total =
        currentWorkout.exercises.length;

    const completed =
        completedExercises.size;


    const progressText =
        document.getElementById(
            "exerciseProgress"
        );

    const progressFill =
        document.getElementById(
            "exerciseProgressFill"
        );

    const finishButton =
        document.getElementById(
            "finishWorkoutBtn"
        );


    if (progressText) {

        progressText.textContent =
            `${completed} / ${total}`;
    }


    if (progressFill) {

        const percentage =
            total > 0
                ? (completed / total) * 100
                : 0;

        progressFill.style.width =
            `${percentage}%`;
    }


    if (finishButton) {

        finishButton.disabled =
            completed !== total;

        finishButton.textContent =
            `✓ FINISH DAY ${currentDayNumber}`;
    }
}


/* ============================= */
/* LOAD EXERCISE PROGRESS */
/* ============================= */

async function loadExerciseProgress() {

    exerciseProgressData =
        new Map();

    completedExercises =
        new Set();


    if (!currentUser || !currentWorkout) {
        return;
    }


    try {

        const {
            data,
            error
        } = await supabase
            .from("exercise_progress")
            .select(
                "exercise_name, weight, reps, sets, completed"
            )
            .eq(
                "user_id",
                currentUser.id
            )
            .eq(
                "day_number",
                currentDayNumber
            );


        if (error) {
            throw error;
        }


        (data || []).forEach(row => {

            exerciseProgressData.set(
                row.exercise_name,
                {
                    weight: row.weight,
                    reps: row.reps,
                    sets: row.sets,
                    completed:
                        row.completed === true
                }
            );
        });


        currentWorkout.exercises.forEach(
            (exercise, index) => {

                const saved =
                    exerciseProgressData.get(
                        exercise.name
                    );

                if (
                    saved?.completed === true
                ) {

                    completedExercises.add(
                        index + 1
                    );
                }
            }
        );

    } catch (error) {

        console.error(
            "Error loading exercise progress:",
            error
        );


        exerciseProgressData =
            new Map();

        completedExercises =
            new Set();
    }
}


/* ============================= */
/* FINISH BUTTON */
/* ============================= */

function setupFinishButton() {

    const button =
        document.getElementById(
            "finishWorkoutBtn"
        );

    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        finishDay
    );
}


/* ============================= */
/* FINISH DAY */
/* ============================= */

async function finishDay() {

    if (!currentUser) {
        return;
    }

    if (!currentWorkout) {
        return;
    }


    const total =
        currentWorkout.exercises.length;


    if (
        completedExercises.size !==
        total
    ) {
        return;
    }


    const finishButton =
        document.getElementById(
            "finishWorkoutBtn"
        );

    const finishMessage =
        document.getElementById(
            "finishMessage"
        );


    if (finishButton) {

        finishButton.disabled = true;

        finishButton.textContent =
            "SAVING...";
    }


    if (finishMessage) {

        finishMessage.textContent = "";
    }


    try {

        /*
         * Wait for any exercise progress saves
         * that are still in progress.
         */

        if (exerciseSavePromises.size > 0) {

            await Promise.allSettled(
                [...exerciseSavePromises]
            );
        }


        /*
         * Check if this day already exists.
         */

        const {
            data: existingDay,
            error: selectError
        } = await supabase
            .from("workout_progress")
            .select(
                "id, completed"
            )
            .eq(
                "user_id",
                currentUser.id
            )
            .eq(
                "day_number",
                currentDayNumber
            )
            .maybeSingle();


        if (selectError) {
            throw selectError;
        }


        /*
         * Update existing day.
         */

        if (existingDay) {

            const {
                error: updateError
            } = await supabase
                .from("workout_progress")
                .update({
                    completed: true,

                    completed_at:
                        new Date().toISOString()
                })
                .eq(
                    "id",
                    existingDay.id
                )
                .eq(
                    "user_id",
                    currentUser.id
                );


            if (updateError) {
                throw updateError;
            }

        } else {

            /*
             * Insert new completed day.
             */

            const {
                error: insertError
            } = await supabase
                .from("workout_progress")
                .insert({
                    user_id:
                        currentUser.id,

                    day_number:
                        currentDayNumber,

                    completed: true,

                    completed_at:
                        new Date().toISOString()
                });


            if (insertError) {
                throw insertError;
            }
        }


        /*
         * Success.
         */

        if (finishButton) {

            finishButton.textContent =
                `✓ DAY ${currentDayNumber} COMPLETED`;

            finishButton.style.background =
                "#42e695";

            finishButton.disabled = true;
        }


        if (finishMessage) {

            finishMessage.textContent =
                `Excellent work! Day ${currentDayNumber} has been saved successfully.`;
        }


        /*
         * Important:
         * We do NOT automatically move to the next day.
         *
         * The dashboard will calculate the next
         * available day from Supabase.
         */

    } catch (error) {

        console.error(
            "Error finishing workout:",
            error
        );


        if (finishButton) {

            finishButton.disabled = false;

            finishButton.textContent =
                `✓ FINISH DAY ${currentDayNumber}`;
        }


        if (finishMessage) {

            finishMessage.textContent =
                "Something went wrong. Please try again.";
        }
    }
}


/* ============================= */
/* PROGRAM ERROR */
/* ============================= */

function showProgramError() {

    const exercisesSection =
        document.querySelector(
            ".exercises-section"
        );

    if (exercisesSection) {

        exercisesSection.innerHTML = `

            <div style="
                padding: 35px;
                border: 1px solid rgba(255,92,92,0.25);
                border-radius: 16px;
                background: rgba(255,92,92,0.05);
                text-align: center;
            ">

                <h3 style="
                    color: #ff5c5c;
                    margin-bottom: 10px;
                ">
                    Workout Program Not Found
                </h3>

                <p style="
                    color: #a7adbd;
                    line-height: 1.7;
                ">
                    We could not find a workout program
                    for your current fitness level and goal.
                    Please check your profile settings.
                </p>

            </div>
        `;
    }
}


/* ============================= */
/* FORMAT LEVEL */
/* ============================= */

function formatLevel(level) {

    if (!level) {
        return "Beginner";
    }

    return level
        .charAt(0)
        .toUpperCase() +
        level.slice(1);
}


/* ============================= */
/* ESCAPE HTML */
/* ============================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}