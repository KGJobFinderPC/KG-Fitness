// ===============================
// KG FITNESS - EXERCISE LIBRARY
// ===============================

const EXERCISE_IMAGE_FOLDER = "exercise-images/exercises/";
const exercises = [
    // ===============================
    // CHEST
    // ===============================

    {
        name: "Decline Dumbbell Press",
        muscle: "chest",
        image: "images/decline-dumbbell-press.jpg",
        description: "A dumbbell pressing exercise that targets the lower chest.",
        step1: "Lie on a decline bench with a dumbbell in each hand. Start with the dumbbells above your chest and your elbows slightly bent.",
        step2: "Lower the dumbbells slowly toward the sides of your chest, then press them back up until your arms are extended."
    },

    {
        name: "Assisted Chest Dip",
        muscle: "chest",
        image: "images/assisted-chest-dip.jpg",
        description: "A controlled dip variation that targets the chest and triceps.",
        step1: "Place your knees or feet on the assisted platform and hold the dip handles with your body upright.",
        step2: "Lower your body under control, then press through the handles to return to the starting position."
    },

    {
        name: "Cable Front Press",
        muscle: "chest",
        image: "images/cable-front-press.jpg",
        description: "A cable pressing movement that keeps tension on the chest throughout the exercise.",
        step1: "Stand between the cable handles with one foot slightly in front of the other. Hold the handles near chest level.",
        step2: "Press the handles forward until your arms are extended, then slowly return to the starting position."
    },

    {
        name: "Low Cable Fly",
        muscle: "chest",
        image: "images/low-cable-fly.jpg",
        description: "A cable fly variation designed to target the chest.",
        step1: "Set the cables low and hold one handle in each hand. Stand tall with your arms slightly behind your body.",
        step2: "Bring your hands upward and together in front of your chest, then slowly return them to the starting position."
    },

    {
        name: "Dumbbell Fly",
        muscle: "chest",
        image: "images/dumbbell-fly.jpg",
        description: "A chest isolation exercise using dumbbells.",
        step1: "Lie on a bench holding dumbbells above your chest with your arms slightly bent.",
        step2: "Open your arms slowly to the sides, then bring the dumbbells back together above your chest."
    },


    // ===============================
    // BACK
    // ===============================

    {
        name: "Wide Grip Pulldown",
        muscle: "back",
        image: "images/wide-grip-pulldown.jpg",
        description: "A lat pulldown variation that focuses on the upper back and lats.",
        step1: "Sit at the pulldown machine and grip the bar wider than shoulder width. Keep your chest lifted.",
        step2: "Pull the bar toward your upper chest by driving your elbows down, then slowly return the bar upward."
    },

    {
        name: "Landmine Row",
        muscle: "back",
        image: "images/landmine-row.jpg",
        description: "A rowing movement that targets the back and upper body.",
        step1: "Stand over the landmine bar with a stable stance and hinge slightly forward while keeping your back controlled.",
        step2: "Pull the bar toward your torso by driving your elbows back, then lower it slowly."
    },

    {
        name: "Band Lat Pulldown",
        muscle: "back",
        image: "images/band-lat-pulldown.jpg",
        description: "A resistance-band movement that targets the lats.",
        step1: "Secure the resistance band overhead and hold both ends with your arms extended.",
        step2: "Pull your elbows down toward your sides, then slowly allow your arms to return upward."
    },

    {
        name: "Close Grip Cable Row",
        muscle: "back",
        image: "images/close-grip-cable-row.jpg",
        description: "A seated cable row that targets the middle back and lats.",
        step1: "Sit upright and hold the close-grip cable handle with your arms extended.",
        step2: "Pull the handle toward your torso while keeping your elbows close to your body, then slowly extend your arms."
    },

    {
        name: "Stability Ball Back Extension",
        muscle: "back",
        image: "images/stability-ball-back-extension.jpg",
        description: "A controlled back extension movement using a stability ball.",
        step1: "Position your hips and abdomen on the stability ball with your feet firmly supported.",
        step2: "Lift your upper body until your torso is aligned, then lower yourself slowly."
    },


    // ===============================
    // SHOULDERS
    // ===============================

    {
        name: "Partial Lateral Raise",
        muscle: "shoulders",
        image: "images/partial-lateral-raise.jpg",
        description: "A lateral raise variation focusing on the side deltoids.",
        step1: "Stand tall holding light dumbbells at your sides with your elbows slightly bent.",
        step2: "Raise the dumbbells through a controlled partial range, then slowly lower them."
    },

    {
        name: "Band Face Pull",
        muscle: "shoulders",
        image: "images/band-face-pull.jpg",
        description: "A resistance-band exercise for the rear shoulders and upper back.",
        step1: "Attach the band around face height and hold both ends with your arms extended.",
        step2: "Pull the band toward your face while driving your elbows outward, then slowly return."
    },

    {
        name: "Kettlebell Press",
        muscle: "shoulders",
        image: "images/kettlebell-press.jpg",
        description: "An overhead pressing movement using a kettlebell.",
        step1: "Hold the kettlebell at shoulder height with your wrist controlled and your core braced.",
        step2: "Press the kettlebell overhead until your arm is extended, then lower it under control."
    },

    {
        name: "Lateral Raise Machine",
        muscle: "shoulders",
        image: "images/lateral-raise-machine.jpg",
        description: "A machine exercise designed to isolate the side deltoids.",
        step1: "Sit in the machine and position your arms against the pads while keeping your torso upright.",
        step2: "Raise your arms outward against the pads, then slowly lower them."
    },

    {
        name: "High Cable Rear Delt Fly",
        muscle: "shoulders",
        image: "images/high-cable-rear-delt-fly.jpg",
        description: "A cable movement targeting the rear deltoids.",
        step1: "Stand between high cables and hold the opposite handles with your arms in front of you.",
        step2: "Open your arms outward and back, then slowly return to the starting position."
    },


    // ===============================
    // ARMS
    // ===============================

    {
        name: "Reverse Barbell Curl",
        muscle: "arms",
        image: "images/reverse-barbell-curl.jpg",
        description: "A reverse-grip curl that targets the forearms and brachialis.",
        step1: "Stand tall holding a barbell with an overhand grip and your elbows close to your sides.",
        step2: "Curl the bar upward without moving your elbows, then lower it slowly."
    },

    {
        name: "Alternating Dumbbell Curl",
        muscle: "arms",
        image: "images/alternating-dumbbell-curl.jpg",
        description: "A classic biceps exercise performed one arm at a time.",
        step1: "Stand tall holding dumbbells at your sides with your palms facing forward.",
        step2: "Curl one dumbbell toward your shoulder while keeping your elbow stable, then lower it and switch sides."
    },

    {
        name: "Dumbbell Overhead Tricep Extension",
        muscle: "arms",
        image: "images/dumbbell-overhead-tricep-extension.jpg",
        description: "An overhead movement targeting the triceps.",
        step1: "Hold one dumbbell overhead with both hands and keep your upper arms close to your head.",
        step2: "Lower the dumbbell behind your head by bending your elbows, then extend your arms upward."
    },

    {
        name: "Plate Wrist Rotation",
        muscle: "arms",
        image: "images/plate-wrist-rotation.jpg",
        description: "A forearm exercise using controlled wrist rotation.",
        step1: "Hold a small weight plate securely with your arm positioned comfortably in front of you.",
        step2: "Rotate your wrist slowly through a controlled range, then return to the starting position."
    },


    // ===============================
    // LEGS
    // ===============================

    {
        name: "Bulgarian Split Squat",
        muscle: "legs",
        image: "images/bulgarian-split-squat.jpg",
        description: "A single-leg squat variation targeting the quads and glutes.",
        step1: "Place one foot behind you on a bench and position your front foot securely on the floor.",
        step2: "Lower your body by bending the front knee, then drive through the front foot to stand back up."
    },

    {
        name: "Kettlebell Romanian Deadlift",
        muscle: "legs",
        image: "images/kettlebell-romanian-deadlift.jpg",
        description: "A hip-hinge movement targeting the hamstrings and glutes.",
        step1: "Hold the kettlebell in front of your body and stand tall with your feet around hip width.",
        step2: "Push your hips backward while keeping your back controlled, then drive your hips forward to stand tall."
    },

    {
        name: "Cable Glute Abduction",
        muscle: "legs",
        image: "images/cable-glute-abduction.jpg",
        description: "A cable exercise targeting the glutes and hip abductors.",
        step1: "Attach the ankle strap and stand beside the cable machine while holding it for balance.",
        step2: "Move the working leg outward against the cable resistance, then slowly return it."
    },

    {
        name: "Nordic Hamstring Curl",
        muscle: "legs",
        image: "images/nordic-hamstring-curl.jpg",
        description: "A challenging bodyweight exercise for the hamstrings.",
        step1: "Kneel with your ankles securely anchored and keep your body straight from your knees upward.",
        step2: "Lower your body forward slowly using your hamstrings, then return with controlled assistance."
    },

    {
        name: "Reverse Lunge",
        muscle: "legs",
        image: "images/reverse-lunge.jpg",
        description: "A unilateral leg exercise targeting the quads and glutes.",
        step1: "Stand tall with your feet together and keep your torso upright.",
        step2: "Step one leg backward and lower your body, then push through the front foot to return to standing."
    },

    {
        name: "Single Leg Glute Bridge",
        muscle: "legs",
        image: "images/single-leg-glute-bridge.jpg",
        description: "A single-leg glute exercise performed from the floor.",
        step1: "Lie on your back with one foot on the floor and the other leg extended.",
        step2: "Drive through the planted foot to lift your hips, then lower them slowly."
    },

    {
        name: "Hip Hinge",
        muscle: "legs",
        image: "images/hip-hinge.jpg",
        description: "A fundamental movement pattern for the hips, glutes and hamstrings.",
        step1: "Stand tall with your feet stable and keep your spine neutral.",
        step2: "Push your hips backward while slightly bending your knees, then drive your hips forward to stand tall."
    },


    // ===============================
    // CARDIO
    // ===============================

    {
        name: "Jump Rope",
        muscle: "cardio",
        image: "images/jump-rope.jpg",
        description: "A cardio exercise that improves conditioning, coordination and footwork.",
        step1: "Stand upright holding the rope handles with the rope positioned behind your body.",
        step2: "Rotate the rope over your head and jump lightly as it passes underneath your feet."
    }

];


// ===============================
// DOM ELEMENTS
// ===============================

const exerciseGrid =
    document.getElementById("exerciseGrid");

const exerciseSearch =
    document.getElementById("exerciseSearch");

const searchExerciseBtn =
    document.getElementById("searchExerciseBtn");

const exerciseCount =
    document.getElementById("exerciseCount");

const noResults =
    document.getElementById("noResults");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const exerciseModal =
    document.getElementById("exerciseModal");

const exerciseModalContent =
    document.getElementById("exerciseModalContent");

const closeExerciseModal =
    document.getElementById("closeExerciseModal");

const modalOverlay =
    document.getElementById("modalOverlay");

const backDashboardBtn =
    document.getElementById("backDashboardBtn");


// ===============================
// CURRENT FILTER
// ===============================

let currentMuscle =
    "all";


// ===============================
// DISPLAY EXERCISES
// ===============================
exercises.forEach(exercise => {
    const fileName = exercise.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    exercise.image = `${EXERCISE_IMAGE_FOLDER}${fileName}.jpg`;
});


function displayExercises(list) {

    if (!exerciseGrid) {
        return;
    }

    exerciseGrid.innerHTML = "";

    if (exerciseCount) {

        exerciseCount.textContent =
            `${list.length} exercise${list.length === 1 ? "" : "s"}`;
    }


    if (list.length === 0) {

        if (noResults) {
            noResults.hidden = false;
        }

        return;
    }


    if (noResults) {
        noResults.hidden = true;
    }


    list.forEach((exercise) => {

        const card =
            document.createElement("article");

        card.className =
            "exercise-card";

        card.innerHTML = `
            <div class="exercise-image">

                <img
                    src="${exercise.image}"
                    alt="${exercise.name}"
                    loading="lazy"
                    onerror="this.style.display='none';"
                >

                <span class="exercise-muscle">
                    ${exercise.muscle.toUpperCase()}
                </span>

            </div>

            <div class="exercise-info">

                <h3>${exercise.name}</h3>

                <p>
                    ${exercise.description}
                </p>

                <span class="exercise-view">
                    VIEW EXERCISE →
                </span>

            </div>
        `;


        card.addEventListener(
            "click",
            () => {
                openExerciseModal(exercise);
            }
        );


        exerciseGrid.appendChild(card);
    });
}


// ===============================
// FILTER + SEARCH
// ===============================

function filterExercises() {

    const searchTerm =
        exerciseSearch
            ? exerciseSearch.value
                .trim()
                .toLowerCase()
            : "";


    const filtered =
        exercises.filter((exercise) => {

            const matchesMuscle =
                currentMuscle === "all" ||
                exercise.muscle === currentMuscle;


            const matchesSearch =
                exercise.name
                    .toLowerCase()
                    .includes(searchTerm) ||

                exercise.description
                    .toLowerCase()
                    .includes(searchTerm);


            return (
                matchesMuscle &&
                matchesSearch
            );
        });


    displayExercises(filtered);
}


// ===============================
// FILTER BUTTONS
// ===============================

filterButtons.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            filterButtons.forEach(
                (item) => {
                    item.classList.remove(
                        "active"
                    );
                }
            );


            button.classList.add(
                "active"
            );


            currentMuscle =
                button.dataset.muscle ||
                "all";


            filterExercises();
        }
    );
});


// ===============================
// SEARCH
// ===============================

if (searchExerciseBtn) {

    searchExerciseBtn.addEventListener(
        "click",
        () => {
            filterExercises();
        }
    );
}


if (exerciseSearch) {

    exerciseSearch.addEventListener(
        "input",
        () => {
            filterExercises();
        }
    );


    exerciseSearch.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter"
            ) {

                filterExercises();
            }
        }
    );
}


// ===============================
// OPEN MODAL
// ===============================

function openExerciseModal(exercise) {

    if (
        !exerciseModal ||
        !exerciseModalContent
    ) {
        return;
    }


    exerciseModalContent.innerHTML = `

        <div class="modal-exercise">

            <div class="modal-exercise-image">

                <img
                    src="${exercise.image}"
                    alt="${exercise.name}"
                >

            </div>


            <div class="modal-exercise-details">

                <span class="modal-label">
                    ${exercise.muscle.toUpperCase()}
                </span>

                <h2>
                    ${exercise.name}
                </h2>

                <p class="description">
                    ${exercise.description}
                </p>


                <div class="exercise-steps">

                    <div class="step-box">

                        <span class="step-number">
                            STEP 1
                        </span>

                        <p>
                            ${exercise.step1}
                        </p>

                    </div>


                    <div class="step-box">

                        <span class="step-number">
                            STEP 2
                        </span>

                        <p>
                            ${exercise.step2}
                        </p>

                    </div>

                </div>

            </div>

        </div>
    `;


    exerciseModal.hidden = false;

    document.body.style.overflow =
        "hidden";
}


// ===============================
// CLOSE MODAL
// ===============================

function closeModal() {

    if (!exerciseModal) {
        return;
    }

    exerciseModal.hidden = true;

    document.body.style.overflow =
        "";
}


if (closeExerciseModal) {

    closeExerciseModal.addEventListener(
        "click",
        closeModal
    );
}


if (modalOverlay) {

    modalOverlay.addEventListener(
        "click",
        closeModal
    );
}


document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            exerciseModal &&
            !exerciseModal.hidden
        ) {

            closeModal();
        }
    }
);


// ===============================
// BACK TO DASHBOARD
// ===============================

if (backDashboardBtn) {

    backDashboardBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "dashboard.html";
        }
    );
}


// ===============================
// INITIAL LOAD
// ===============================

displayExercises(exercises);

console.log(
    "KG Fitness Exercise Library loaded successfully."
);
