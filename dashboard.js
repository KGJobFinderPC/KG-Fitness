// ===============================
// KG FITNESS - DASHBOARD JAVASCRIPT
// ===============================

import { supabase } from "./supabase.js";


// ===============================
// PAGE LOADED
// ===============================

document.addEventListener("DOMContentLoaded", async () => {

    console.log("KG Fitness Dashboard loaded successfully.");


    // ===============================
    // GET CURRENT USER
    // ===============================

    const {
        data: {
            user
        },
        error
    } = await supabase.auth.getUser();


    // ===============================
    // CHECK USER
    // ===============================

    if (error || !user) {

        console.error(
            "User not found:",
            error
        );

        window.location.href =
            "login.html";

        return;
    }


    console.log(
        "Logged in user:",
        user
    );


    // ===============================
    // USER DATA
    // ===============================

    const metadata =
        user.user_metadata || {};


    const fullName =
        metadata.full_name || "Athlete";


    const email =
        user.email || "";


    const height =
        metadata.height || "--";


    const weight =
        metadata.weight || "--";


    const age =
        metadata.age || "--";


    const level =
        metadata.level || "--";


    const goal =
        metadata.goal || "--";


    // ===============================
    // USER NAME
    // ===============================

    const userName =
        document.getElementById(
            "userName"
        );


    if (userName) {

        userName.textContent =
            fullName;
    }


    const heroUserName =
        document.getElementById(
            "heroUserName"
        );


    if (heroUserName) {

        heroUserName.textContent =
            fullName;
    }


    // ===============================
    // USER EMAIL
    // ===============================

    const userEmail =
        document.getElementById(
            "userEmail"
        );


    if (userEmail) {

        userEmail.textContent =
            email;
    }


    const profileEmail =
        document.getElementById(
            "profileEmail"
        );


    if (profileEmail) {

        profileEmail.textContent =
            email;
    }


    // ===============================
    // PROFILE NAME
    // ===============================

    const profileName =
        document.getElementById(
            "profileName"
        );


    if (profileName) {

        profileName.textContent =
            fullName;
    }


    // ===============================
    // HEIGHT
    // ===============================

    const profileHeight =
        document.getElementById(
            "profileHeight"
        );


    if (profileHeight) {

        profileHeight.textContent =
            `${height} cm`;
    }


    const profileHeightFull =
        document.getElementById(
            "profileHeightFull"
        );


    if (profileHeightFull) {

        profileHeightFull.textContent =
            `${height} cm`;
    }


    // ===============================
    // WEIGHT
    // ===============================

    const profileWeight =
        document.getElementById(
            "profileWeight"
        );


    if (profileWeight) {

        profileWeight.textContent =
            `${weight} kg`;
    }


    const profileWeightFull =
        document.getElementById(
            "profileWeightFull"
        );


    if (profileWeightFull) {

        profileWeightFull.textContent =
            `${weight} kg`;
    }


    // ===============================
    // AGE
    // ===============================

    const profileAge =
        document.getElementById(
            "profileAge"
        );


    if (profileAge) {

        profileAge.textContent =
            age;
    }


    const profileAgeFull =
        document.getElementById(
            "profileAgeFull"
        );


    if (profileAgeFull) {

        profileAgeFull.textContent =
            age;
    }


    // ===============================
    // FITNESS LEVEL
    // ===============================

    const profileLevel =
        document.getElementById(
            "profileLevel"
        );


    if (profileLevel) {

        profileLevel.textContent =
            formatValue(level);
    }


    const profileLevelFull =
        document.getElementById(
            "profileLevelFull"
        );


    if (profileLevelFull) {

        profileLevelFull.textContent =
            formatValue(level);
    }


    // ===============================
    // GOAL
    // ===============================

    const userGoal =
        document.getElementById(
            "userGoal"
        );


    if (userGoal) {

        userGoal.textContent =
            formatGoal(goal);
    }


    const profileGoalFull =
        document.getElementById(
            "profileGoalFull"
        );


    if (profileGoalFull) {

        profileGoalFull.textContent =
            formatGoal(goal);
    }


    // ===============================
    // STARTING WEIGHT
    // ===============================

    const startingWeight =
        document.getElementById(
            "startingWeight"
        );


    if (startingWeight) {

        startingWeight.textContent =
            `${weight} kg`;
    }


    // ===============================
    // CURRENT WEIGHT
    // ===============================

    const currentWeight =
        document.getElementById(
            "currentWeight"
        );


    if (currentWeight) {

        currentWeight.textContent =
            `${weight} kg`;
    }


    // ===============================
    // WEIGHT CHANGE
    // ===============================

    const weightChange =
        document.getElementById(
            "weightChange"
        );


    if (weightChange) {

        weightChange.textContent =
            "0 kg";
    }


    // ===============================
    // WORKOUT PROGRESS
    // ===============================

    let currentDayNumber = 1;

    let completedDays = [];


    // ===============================
    // SELECTED WORKOUT DAY
    // ===============================

    let selectedDayNumber = null;


    const currentDay =
        document.getElementById(
            "currentDay"
        );


    const programProgress =
        document.getElementById(
            "programProgress"
        );


    const completionPercent =
        document.getElementById(
            "completionPercent"
        );


    const goalProgressText =
        document.getElementById(
            "goalProgressText"
        );


    const goalProgressFill =
        document.getElementById(
            "goalProgressFill"
        );


    const finishDayBtn =
        document.getElementById(
            "finishDayBtn"
        );


    // ===============================
    // LOAD WORKOUT PROGRESS
    // ===============================

    async function loadWorkoutProgress() {

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
                user.id
            )
            .order(
                "day_number",
                {
                    ascending: true
                }
            );


        if (error) {

            console.error(
                "Workout progress error:",
                error
            );

            completedDays = [];

            currentDayNumber = 1;

            selectedDayNumber = 1;

            updateWorkoutUI();

            return;
        }


        completedDays =
            (data || [])
                .filter(
                    item =>
                        item.completed === true
                )
                .map(
                    item =>
                        Number(
                            item.day_number
                        )
                )
                .filter(
                    day =>
                        Number.isFinite(day) &&
                        day > 0
                );


        completedDays =
            [
                ...new Set(
                    completedDays
                )
            ].sort(
                (a, b) => a - b
            );


        let nextDay = 1;


        while (
            completedDays.includes(
                nextDay
            )
        ) {

            nextDay++;
        }


        currentDayNumber =
            nextDay;


        selectedDayNumber =
            currentDayNumber;


        updateWorkoutUI();
    }


    // ===============================
    // UPDATE WORKOUT UI
    // ===============================

    function updateWorkoutUI() {

        const completedCount =
            completedDays.length;


        const progress =
            Math.min(
                100,
                Math.round(
                    (
                        completedCount /
                        90
                    ) * 100
                )
            );


        // ===============================
        // CURRENT DAY
        // ===============================

        if (currentDay) {

            currentDay.textContent =
                `DAY ${currentDayNumber}`;
        }


        // ===============================
        // SELECTED DAY
        // ===============================

        if (
            selectedDayNumber === null
        ) {

            selectedDayNumber =
                currentDayNumber;
        }


        updateSelectedWorkoutDay();


        // ===============================
        // PROGRAM PROGRESS
        // ===============================

        if (programProgress) {

            programProgress.textContent =
                `${progress}%`;
        }


        // ===============================
        // COMPLETION PERCENT
        // ===============================

        if (completionPercent) {

            completionPercent.textContent =
                `${progress}%`;
        }


        // ===============================
        // GOAL PROGRESS
        // ===============================

        if (goalProgressText) {

            goalProgressText.textContent =
                `${progress}%`;
        }


        if (goalProgressFill) {

            goalProgressFill.style.width =
                `${progress}%`;
        }


        // ===============================
        // WORKOUTS COMPLETED
        // ===============================

        const workoutsValue =
            document.getElementById(
                "workoutsValue"
            );


        if (workoutsValue) {

            workoutsValue.textContent =
                completedCount;
        }


        // ===============================
        // STREAK
        // ===============================

        const streakValue =
            document.getElementById(
                "streakValue"
            );


        if (streakValue) {

            let streak = 0;


            for (
                let day =
                    currentDayNumber - 1;

                day >= 1;

                day--
            ) {

                if (
                    completedDays.includes(
                        day
                    )
                ) {

                    streak++;

                } else {

                    break;
                }
            }


            streakValue.textContent =
                `${streak} Day${streak === 1 ? "" : "s"}`;
        }


        // ===============================
        // ACHIEVEMENTS
        // ===============================

        updateAchievements(
            completedCount
        );


        // ===============================
        // CALENDAR
        // ===============================

        renderCalendar();


        // ===============================
        // SELECTED DAY UI
        // ===============================

        updateSelectedWorkoutDay();
    }


    // ===============================
    // RENDER CALENDAR
    // ===============================

    function renderCalendar() {

        const daysGrid =
            document.getElementById(
                "daysGrid"
            );


        if (!daysGrid) {

            return;
        }


        daysGrid.innerHTML =
            "";


        /*
         * We display the first 14 days
         * in the dashboard calendar.
         *
         * The workout system itself is
         * designed to continue beyond
         * Day 90.
         */


        for (
            let day = 1;
            day <= 90;
            day++
        ) {

            const dayElement =
                document.createElement(
                    "div"
                );


            dayElement.classList.add(
                "day"
            );


            const isCompleted =
                completedDays.includes(
                    day
                );


            const isCurrent =
                day === currentDayNumber;


            const isSelected =
                day === selectedDayNumber;


            // ===============================
            // DAY STATUS
            // ===============================

            if (isCompleted) {

                dayElement.classList.add(
                    "completed"
                );

            } else if (isCurrent) {

                dayElement.classList.add(
                    "current"
                );

            } else {

                dayElement.classList.add(
                    "upcoming"
                );
            }


            dayElement.textContent =
                day;

// ===============================
// DAY CLICK
// ===============================

dayElement.style.cursor =
    "pointer";

dayElement.title =
    `Open Day ${day}`;

dayElement.addEventListener(
    "click",
    () => {

        selectedDayNumber =
            day;
localStorage.setItem(
    "selectedWorkoutDay",
    day
);
        updateSelectedWorkoutDay();

        renderCalendar();

        window.location.href =
            `workout.html?day=${day}`;

    }
);


            // ===============================
            // SELECTED DAY HIGHLIGHT
            // ===============================

            if (isSelected) {

                dayElement.style.outline =
                    "2px solid #ffd84d";

                dayElement.style.outlineOffset =
                    "2px";
            }


            daysGrid.appendChild(
                dayElement
            );
        }
    }


    // ===============================
    // UPDATE SELECTED WORKOUT DAY
    // ===============================

    function updateSelectedWorkoutDay() {

        if (
            selectedDayNumber === null
        ) {

            const savedSelectedDay =
    Number(
        localStorage.getItem(
            "selectedWorkoutDay"
        )
    );

if (
    Number.isInteger(savedSelectedDay) &&
    savedSelectedDay > 0
) {
    selectedDayNumber =
        savedSelectedDay;
} else {
    selectedDayNumber =
        currentDayNumber;
}
        }


        const workoutDayBadge =
            document.querySelector(
                ".day-badge"
            );


        if (workoutDayBadge) {

            workoutDayBadge.textContent =
                `DAY ${selectedDayNumber}`;
        }


        if (!finishDayBtn) {

            return;
        }


        // ===============================
        // VIEWING OLD COMPLETED DAY
        // ===============================

        if (
            selectedDayNumber !==
            currentDayNumber
        ) {

            finishDayBtn.textContent =
                `VIEWING DAY ${selectedDayNumber}`;


            finishDayBtn.disabled =
                true;


            finishDayBtn.style.background =
                "rgba(139, 92, 246, 0.18)";


            finishDayBtn.style.color =
                "#8b5cf6";


            finishDayBtn.style.borderColor =
                "rgba(139, 92, 246, 0.4)";


            return;
        }


        // ===============================
        // CURRENT DAY ALREADY COMPLETED
        // ===============================

        if (
            completedDays.includes(
                currentDayNumber
            )
        ) {

            finishDayBtn.textContent =
                "✓ DAY COMPLETED";


            finishDayBtn.disabled =
                true;


            finishDayBtn.style.background =
                "rgba(66, 230, 149, 0.18)";


            finishDayBtn.style.color =
                "#42e695";


            finishDayBtn.style.borderColor =
                "rgba(66, 230, 149, 0.4)";


            return;
        }


        // ===============================
        // CURRENT DAY READY
        // ===============================

        finishDayBtn.textContent =
            "✓ FINISH DAY";


        finishDayBtn.disabled =
            false;


        finishDayBtn.style.background =
            "";


        finishDayBtn.style.color =
            "";


        finishDayBtn.style.borderColor =
            "";
    }


    // ===============================
    // ACHIEVEMENTS
    // ===============================

    function updateAchievements(
        completedCount
    ) {

        const achievementValue =
            document.getElementById(
                "achievementValue"
            );


        let achievements = 0;


        // FIRST WORKOUT

        if (
            completedCount >= 1
        ) {

            achievements++;
        }


        // 7 DAY STREAK

        let sevenDayStreak =
            true;


        for (
            let day = 1;
            day <= 7;
            day++
        ) {

            if (
                !completedDays.includes(
                    day
                )
            ) {

                sevenDayStreak =
                    false;

                break;
            }
        }


        if (
            sevenDayStreak
        ) {

            achievements++;
        }


        // 30 WORKOUTS

        if (
            completedCount >= 30
        ) {

            achievements++;
        }


        // 90 DAY CHAMPION

        if (
            completedCount >= 90
        ) {

            achievements++;
        }


        if (achievementValue) {

            achievementValue.textContent =
                achievements;
        }


        // ===============================
        // ACHIEVEMENT CARDS
        // ===============================

        const achievementCards =
            document.querySelectorAll(
                ".achievement-card"
            );


        achievementCards.forEach(
            (
                card,
                index
            ) => {

                let unlocked =
                    false;


                if (
                    index === 0
                ) {

                    unlocked =
                        completedCount >= 1;
                }


                if (
                    index === 1
                ) {

                    unlocked =
                        sevenDayStreak;
                }


                if (
                    index === 2
                ) {

                    unlocked =
                        completedCount >= 30;
                }


                if (
                    index === 3
                ) {

                    unlocked =
                        completedCount >= 90;
                }


                if (unlocked) {

                    card.classList.remove(
                        "locked"
                    );


                    card.classList.add(
                        "unlocked"
                    );

                } else {

                    card.classList.remove(
                        "unlocked"
                    );


                    card.classList.add(
                        "locked"
                    );
                }
            }
        );
    }


    // ===============================
    // LOAD PROGRESS NOW
    // ===============================

    await loadWorkoutProgress();


    // ===============================
    // LOGOUT
    // ===============================

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            async () => {

                logoutBtn.disabled =
                    true;


                logoutBtn.textContent =
                    "LOGGING OUT...";


                try {

                    const {
                        error
                    } =
                        await supabase
                            .auth
                            .signOut();


                    if (error) {

                        console.error(
                            "Logout error:",
                            error
                        );


                        logoutBtn.disabled =
                            false;


                        logoutBtn.textContent =
                            "LOGOUT";


                        return;
                    }


                    window.location.href =
                        "login.html";

                }

                catch (error) {

                    console.error(
                        "Unexpected logout error:",
                        error
                    );


                    logoutBtn.disabled =
                        false;


                    logoutBtn.textContent =
                        "LOGOUT";
                }
            }
        );
    }


    // ===============================
    // START WORKOUT
    // ===============================

    const startWorkoutBtn =
        document.getElementById(
            "startWorkoutBtn"
        );


    if (startWorkoutBtn) {

        startWorkoutBtn.addEventListener(
            "click",
            () => {

                const workout =
                    document.getElementById(
                        "workout"
                    );


                if (workout) {

                    workout.scrollIntoView({
                        behavior:
                            "smooth"
                    });
                }
            }
        );
    }


    // ===============================
    // VIEW WORKOUT
    // ===============================

    const viewWorkoutBtn =
        document.getElementById(
            "viewWorkoutBtn"
        );


    if (viewWorkoutBtn) {

        viewWorkoutBtn.addEventListener(
            "click",
            () => {

                const exercises =
                    document.getElementById(
                        "exercises"
                    );


                if (exercises) {

                    exercises.scrollIntoView({
                        behavior:
                            "smooth"
                    });
                }
            }
        );
    }


    // ===============================
    // FINISH DAY
    // ===============================

    if (finishDayBtn) {

        finishDayBtn.addEventListener(
            "click",
            async () => {

                // Never allow an old selected day
                // to be accidentally completed.

                if (
                    selectedDayNumber !==
                    currentDayNumber
                ) {

                    return;
                }


                if (
                    completedDays.includes(
                        currentDayNumber
                    )
                ) {

                    return;
                }


                const dayToComplete =
                    currentDayNumber;


                finishDayBtn.disabled =
                    true;


                finishDayBtn.textContent =
                    "SAVING...";


                try {

                    // ===============================
                    // CHECK IF DAY ALREADY EXISTS
                    // ===============================

                    const {
                        data: existingDay,
                        error: findError
                    } =
                        await supabase
                            .from(
                                "workout_progress"
                            )
                            .select(
                                "id, day_number, completed"
                            )
                            .eq(
                                "user_id",
                                user.id
                            )
                            .eq(
                                "day_number",
                                dayToComplete
                            )
                            .maybeSingle();


                    if (findError) {

                        throw findError;
                    }


                    // ===============================
                    // UPDATE EXISTING DAY
                    // ===============================

                    if (existingDay) {

                        const {
                            error:
                                updateError
                        } =
                            await supabase
                                .from(
                                    "workout_progress"
                                )
                                .update({
                                    completed:
                                        true,

                                    completed_at:
                                        new Date()
                                            .toISOString()
                                })
                                .eq(
                                    "id",
                                    existingDay.id
                                )
                                .eq(
                                    "user_id",
                                    user.id
                                );


                        if (updateError) {

                            throw updateError;
                        }

                    }


                    // ===============================
                    // CREATE NEW DAY
                    // ===============================

                    else {

                        const {
                            error:
                                insertError
                        } =
                            await supabase
                                .from(
                                    "workout_progress"
                                )
                                .insert({
                                    user_id:
                                        user.id,

                                    day_number:
                                        dayToComplete,

                                    completed:
                                        true,

                                    completed_at:
                                        new Date()
                                            .toISOString()
                                });


                        if (insertError) {

                            throw insertError;
                        }
                    }


                    // ===============================
                    // RELOAD DATA
                    // ===============================

                    await loadWorkoutProgress();


                    console.log(
                        `Day ${dayToComplete} completed successfully.`
                    );
                }


                catch (error) {

                    console.error(
                        "Finish day error:",
                        error
                    );


                    finishDayBtn.disabled =
                        false;


                    finishDayBtn.textContent =
                        "TRY AGAIN";


                    setTimeout(
                        () => {

                            updateSelectedWorkoutDay();

                        },
                        2000
                    );
                }
            }
        );
    }


    // ===============================
    // CALENDAR BUTTON
    // ===============================

    const viewCalendarBtn =
        document.getElementById(
            "viewCalendarBtn"
        );


    if (viewCalendarBtn) {

        viewCalendarBtn.addEventListener(
            "click",
            () => {

                const calendar =
                    document.getElementById(
                        "calendar"
                    );


                if (calendar) {

                    calendar.scrollIntoView({
                        behavior:
                            "smooth"
                    });
                }
            }
        );
    }


    // ===============================
// EDIT PROFILE
// ===============================

const editProfileBtn =
    document.getElementById(
        "editProfileBtn"
    );


if (editProfileBtn) {

    editProfileBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "profile.html";

        }
    );

}

    // ===============================
    // MACHINE BUTTONS
    // ===============================

    const machineBtn =
        document.getElementById(
            "machineBtn"
        );


    const identifyMachineBtn =
        document.getElementById(
            "identifyMachineBtn"
        );


    function openMachineSection() {

        const machines =
            document.getElementById(
                "machines"
            );


        if (machines) {

            machines.scrollIntoView({
                behavior:
                    "smooth"
            });
        }
    }


    if (machineBtn) {

        machineBtn.addEventListener(
            "click",
            openMachineSection
        );
    }


    if (identifyMachineBtn) {

    identifyMachineBtn.addEventListener(
        "click",
        () => {
            window.location.href =
                "identify-machine.html";
        }
    );

}

// ===============================
// NUTRITION BUTTON
// ===============================

const nutritionBtn =
    document.getElementById(
        "nutritionBtn"
    );

if (nutritionBtn) {

    nutritionBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "nutrition.html";

        }
    );
}

    // ===============================
    // PROGRESS BUTTON
    // ===============================

  const progressBtn =
    document.getElementById(
        "progressBtn"
    );

if (progressBtn) {

    progressBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "progress.html";

        }
    );
}
    // ===============================
    // SIDEBAR EXERCISES
    // ===============================

    const exercisesNavItem =
        document.querySelector(
            '.nav-item[href="#exercises"]'
        );

    if (exercisesNavItem) {

        exercisesNavItem.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                const exercises =
                    document.getElementById(
                        "exercises"
                    );

                if (exercises) {

                    exercises.scrollIntoView({
                        behavior:
                            "smooth"
                    });
                }
            }
        );
    }

    // ===============================
    // ALL EXERCISES BUTTON
    // ===============================

    const allExercisesBtn =
        document.getElementById(
            "allExercisesBtn"
        );


    if (allExercisesBtn) {

        allExercisesBtn.addEventListener(
            "click",
            () => {

                const exercises =
                    document.getElementById(
                        "exercises"
                    );


                if (exercises) {

                    exercises.scrollIntoView({
                        behavior:
                            "smooth"
                    });
                }
            }
        );
    }


    // ===============================
    // STAR RATING
    // ===============================

    const stars =
        document.querySelectorAll(
            ".star"
        );


    let selectedRating =
        0;


    stars.forEach(
        (star) => {

            star.addEventListener(
                "click",
                () => {

                    selectedRating =
                        Number(
                            star.dataset.rating
                        );


                    stars.forEach(
                        (item) => {

                            const rating =
                                Number(
                                    item.dataset.rating
                                );


                            if (
                                rating <=
                                selectedRating
                            ) {

                                item.classList.add(
                                    "selected"
                                );

                            } else {

                                item.classList.remove(
                                    "selected"
                                );
                            }
                        }
                    );


                    console.log(
                        "Selected rating:",
                        selectedRating
                    );
                }
            );
        }
    );
// ===============================
// LOAD REVIEWS & AVERAGE RATING
// ===============================

async function loadReviews() {

    const averageRating =
        document.getElementById(
            "averageRating"
        );

    const {
        data,
        error
    } = await supabase
        .from("reviews")
        .select("rating");

    if (error) {

        console.error(
            "Load reviews error:",
            error
        );

        return;
    }

    if (!data || data.length === 0) {

        if (averageRating) {
            averageRating.textContent = "0.0";
        }

        return;
    }

    const totalRating =
        data.reduce(
            (total, item) =>
                total + Number(item.rating),
            0
        );

    const average =
        totalRating / data.length;

    if (averageRating) {

        averageRating.textContent =
            average.toFixed(1);
    }

    console.log(
        "Average rating:",
        average.toFixed(1)
    );
}

await loadReviews();


// ===============================
// SUBMIT REVIEW
// ===============================


const submitReviewBtn =
    document.getElementById(
        "submitReviewBtn"
    );


if (submitReviewBtn) {

    submitReviewBtn.addEventListener(
        "click",
        async () => {

            const reviewText =
                document.getElementById(
                    "reviewText"
                );


            const reviewMessage =
                document.getElementById(
                    "reviewMessage"
                );


            if (reviewMessage) {

                reviewMessage.textContent =
                    "";

            }


            // ===============================
            // CHECK RATING
            // ===============================

            if (
                selectedRating === 0
            ) {

                if (reviewMessage) {

                    reviewMessage.textContent =
                        "Please select a rating.";

                    reviewMessage.style.color =
                        "#ff5c5c";

                }

                return;
            }


            // ===============================
            // CHECK REVIEW
            // ===============================

            if (
                !reviewText ||
                !reviewText.value.trim()
            ) {

                if (reviewMessage) {

                    reviewMessage.textContent =
                        "Please write a review.";

                    reviewMessage.style.color =
                        "#ff5c5c";

                }

                return;
            }


            submitReviewBtn.disabled =
                true;


            submitReviewBtn.textContent =
                "SUBMITTING...";


            // ===============================
            // SAVE REVIEW TO SUPABASE
            // ===============================

            const {
                error
            } = await supabase
                .from("reviews")
                .insert([
                    {
                        user_id:
                            user.id,

                        rating:
                            selectedRating,

                        review:
                            reviewText.value.trim()
                    }
                ]);


            // ===============================
            // CHECK DATABASE ERROR
            // ===============================

            if (error) {

                console.error(
                    "Review save error:",
                    error
                );


                if (reviewMessage) {

                    reviewMessage.textContent =
                        "Unable to submit your review. Please try again.";

                    reviewMessage.style.color =
                        "#ff5c5c";

                }


                submitReviewBtn.disabled =
                    false;


                submitReviewBtn.textContent =
                    "SUBMIT REVIEW";


                return;
            }


            // ===============================
            // SUCCESS
            // ===============================

            if (reviewMessage) {

                reviewMessage.textContent =
                    "Thank you for your feedback!";

                reviewMessage.style.color =
                    "#facc15";

            }


            reviewText.value =
                "";


            stars.forEach(
                (star) => {

                    star.classList.remove(
                        "selected"
                    );

                }
            );


            selectedRating =
                0;


            submitReviewBtn.disabled =
                false;


            submitReviewBtn.textContent =
                "SUBMIT REVIEW";

        }
    );

}
// ===============================
// FORMAT VALUE
// ===============================

function formatValue(value) {

    if (
        !value ||
        value === "--"
    ) {

        return "--";
    }


    return String(value)
        .replace(
            /-/g,
            " "
        )
        .replace(
            /\b\w/g,
            (letter) =>
                letter.toUpperCase()
        );
}


// ===============================
// FORMAT GOAL
// ===============================

function formatGoal(goal) {

    if (
        !goal ||
        goal === "--"
    ) {

        return "Not selected";
    }


    const goalMap = {

        "build_muscle":
            "Muscle Building / Hypertrophy",

        "lose_weight":
            "Lose Weight",

        "get_stronger":
            "Get Stronger",

        "improve_fitness":
            "Improve Fitness",

        "maintain":
            "Maintain Fitness"
    };


    if (goalMap[goal]) {

        return goalMap[goal];
    }


    return String(goal)
        .replace(
            /_/g,
            " "
        )
        .replace(
            /\b\w/g,
            (letter) =>
                letter.toUpperCase()
        );
}

});