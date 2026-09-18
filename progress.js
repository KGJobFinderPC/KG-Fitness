// ======================================================
// KG FITNESS - MY PROGRESS
// ======================================================

import { supabase } from "./supabase.js";


// ======================================================
// ELEMENTS
// ======================================================

const userNameElement =
    document.getElementById("userName");

const userGoalElement =
    document.getElementById("userGoal");

const userAvatarElement =
    document.getElementById("userAvatar");

const welcomeTextElement =
    document.getElementById("welcomeText");

const heroCurrentDayElement =
    document.getElementById("heroCurrentDay");

const currentDayElement =
    document.getElementById("currentDay");

const workoutsCompletedElement =
    document.getElementById("workoutsCompleted");

const currentStreakElement =
    document.getElementById("currentStreak");

const completionPercentElement =
    document.getElementById("completionPercent");

const progressPercentageElement =
    document.getElementById("progressPercentage");

const progressDayTextElement =
    document.getElementById("progressDayText");

const progressBarFillElement =
    document.getElementById("progressBarFill");

const workoutProgressTextElement =
    document.getElementById("workoutProgressText");

const personalRecordsGrid =
    document.getElementById("personalRecordsGrid");

const logoutButton =
    document.getElementById("logoutBtn");


// ======================================================
// VARIABLES
// ======================================================

let currentUser = null;

let workoutProgress = [];

let exerciseProgress = [];


// ======================================================
// START
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeProgress
);


// ======================================================
// INITIALIZE
// ======================================================

async function initializeProgress() {

    try {

        const {
            data: {
                user
            },
            error
        } = await supabase.auth.getUser();


        if (error) {

            console.error(
                "Error getting user:",
                error
            );

            return;
        }


        if (!user) {

            window.location.href =
                "login.html";

            return;
        }


        currentUser = user;


        await loadUserInformation();

        await loadWorkoutProgress();

        await loadExerciseProgress();

        updateProgressPage();

    } catch (error) {

        console.error(
            "Progress initialization error:",
            error
        );

    }

}


// ======================================================
// LOAD USER INFORMATION
// ======================================================

async function loadUserInformation() {

    const metadata =
        currentUser.user_metadata || {};


    const fullName =
        metadata.full_name ||
        metadata.name ||
        metadata.username ||
        "User";


    const goal =
        metadata.goal ||
        "Fitness Journey";


    setText(
        userNameElement,
        fullName
    );


    setText(
        userGoalElement,
        formatGoal(goal)
    );


    setText(
        welcomeTextElement,
        `Welcome back, ${fullName}. Keep working toward your goals.`
    );


    if (userAvatarElement) {

        userAvatarElement.textContent =
            getInitials(fullName);

    }

}


// ======================================================
// LOAD WORKOUT PROGRESS
// ======================================================

async function loadWorkoutProgress() {

    const {
        data,
        error
    } = await supabase
        .from("workout_progress")
        .select("*")
        .eq(
            "user_id",
            currentUser.id
        );


    if (error) {

        console.error(
            "Error loading workout progress:",
            error
        );

        workoutProgress = [];

        return;
    }


    workoutProgress =
        Array.isArray(data)
            ? data
            : [];

}


// ======================================================
// LOAD EXERCISE PROGRESS
// ======================================================

async function loadExerciseProgress() {

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
        );


    if (error) {

        console.error(
            "Error loading exercise progress:",
            error
        );

        exerciseProgress = [];

        return;
    }


    exerciseProgress =
        Array.isArray(data)
            ? data
            : [];


    updatePersonalRecords();

}


// ======================================================
// UPDATE PAGE
// ======================================================

function updateProgressPage() {

    const completedDays =
        getCompletedDays();


    const workoutsCompleted =
        completedDays.length;


    const currentDay =
        calculateCurrentDay(
            completedDays
        );


    const completionPercentage =
        Math.min(
            100,
            Math.round(
                (workoutsCompleted / 90) * 100
            )
        );


    const streak =
        calculateStreak(
            completedDays
        );


    updateCurrentDay(
        currentDay
    );


    updateWorkoutCount(
        workoutsCompleted
    );


    updateStreak(
        streak
    );


    updateCompletion(
        completionPercentage
    );


    updateProgramProgress(
        currentDay,
        completionPercentage
    );


    updateWorkoutMessage(
        workoutsCompleted,
        streak
    );

}


// ======================================================
// UPDATE PERSONAL RECORDS
// ======================================================

function updatePersonalRecords() {

    if (!personalRecordsGrid) {
        return;
    }


    const records = {};


    exerciseProgress.forEach(
        record => {

            const exerciseName =
                String(
                    record.exercise_name || ""
                ).trim();


            const weight =
                Number(record.weight);


            if (
                !exerciseName ||
                !Number.isFinite(weight) ||
                weight <= 0
            ) {

                return;
            }


            const key =
                exerciseName.toLowerCase();


            if (
                !records[key] ||
                weight > records[key].weight
            ) {

                records[key] = {

                    name:
                        exerciseName,

                    weight:
                        weight

                };

            }

        }
    );


    const recordList =
        Object.values(records)
            .sort(
                (a, b) =>
                    b.weight - a.weight
            );


    if (
        recordList.length === 0
    ) {

        personalRecordsGrid.innerHTML = `

            <div class="record-card">

                <div class="record-icon">
                    🏆
                </div>

                <div>

                    <span>
                        PERSONAL RECORDS
                    </span>

                    <strong>
                        —
                    </strong>

                </div>

            </div>

        `;

        return;
    }


    personalRecordsGrid.innerHTML =

        recordList
            .map(
                record => `

                    <div class="record-card">

                        <div class="record-icon">
                            🏆
                        </div>


                        <div>

                            <span>
                                ${escapeHTML(
                                    record.name.toUpperCase()
                                )}
                            </span>


                            <strong>
                                ${formatWeight(
                                    record.weight
                                )} kg
                            </strong>

                        </div>

                    </div>

                `
            )
            .join("");

}


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ======================================================
// FORMAT WEIGHT
// ======================================================

function formatWeight(weight) {

    const number =
        Number(weight);


    if (
        !Number.isFinite(number)
    ) {

        return "—";

    }


    return Number.isInteger(number)

        ? String(number)

        : number.toFixed(1);

}


// ======================================================
// GET COMPLETED DAYS
// ======================================================

function getCompletedDays() {

    const days = [];


    workoutProgress.forEach(
        record => {

            const day =
                getDayNumber(record);


            const completed =
                isWorkoutCompleted(record);


            if (
                completed &&
                Number.isInteger(day) &&
                day >= 1 &&
                day <= 90
            ) {

                if (
                    !days.includes(day)
                ) {

                    days.push(day);

                }

            }

        }
    );


    return days.sort(
        (a, b) => a - b
    );

}


// ======================================================
// GET DAY NUMBER
// ======================================================

function getDayNumber(record) {

    const possibleValues = [

        record.day_number,

        record.day,

        record.workout_day,

        record.dayNumber

    ];


    for (
        const value
        of possibleValues
    ) {

        const number =
            Number(value);


        if (
            Number.isInteger(number) &&
            number >= 1 &&
            number <= 90
        ) {

            return number;

        }

    }


    return null;

}


// ======================================================
// CHECK COMPLETION
// ======================================================

function isWorkoutCompleted(record) {

    if (

        record.completed === true ||

        record.is_completed === true ||

        record.complete === true

    ) {

        return true;

    }


    const status =
        String(
            record.status || ""
        ).toLowerCase();


    if (

        status === "completed" ||

        status === "complete" ||

        status === "done"

    ) {

        return true;

    }


    return false;

}


// ======================================================
// CALCULATE CURRENT DAY
// ======================================================

function calculateCurrentDay(
    completedDays
) {

    if (
        completedDays.length === 0
    ) {

        return 1;

    }


    const highestDay =
        Math.max(
            ...completedDays
        );


    return Math.min(
        90,
        highestDay + 1
    );

}


// ======================================================
// CALCULATE STREAK
// ======================================================

function calculateStreak(
    completedDays
) {

    if (
        completedDays.length === 0
    ) {

        return 0;

    }


    const daySet =
        new Set(
            completedDays
        );


    let streak = 0;


    let day =
        Math.max(
            ...completedDays
        );


    while (
        daySet.has(day)
    ) {

        streak++;

        day--;

    }


    return streak;

}


// ======================================================
// UPDATE CURRENT DAY
// ======================================================

function updateCurrentDay(
    currentDay
) {

    setText(
        heroCurrentDayElement,
        currentDay
    );


    setText(
        currentDayElement,
        currentDay
    );

}


// ======================================================
// UPDATE WORKOUT COUNT
// ======================================================

function updateWorkoutCount(
    count
) {

    setText(
        workoutsCompletedElement,
        count
    );

}


// ======================================================
// UPDATE STREAK
// ======================================================

function updateStreak(
    streak
) {

    setText(
        currentStreakElement,
        streak
    );

}


// ======================================================
// UPDATE COMPLETION
// ======================================================

function updateCompletion(
    percentage
) {

    setText(
        completionPercentElement,
        `${percentage}%`
    );

}


// ======================================================
// UPDATE PROGRAM PROGRESS
// ======================================================

function updateProgramProgress(
    currentDay,
    percentage
) {

    setText(
        progressPercentageElement,
        `${percentage}%`
    );


    const displayedDay =
        Math.min(
            90,
            currentDay
        );


    setText(
        progressDayTextElement,
        `Day ${displayedDay} / 90`
    );


    if (
        progressBarFillElement
    ) {

        progressBarFillElement.style.width =
            `${percentage}%`;

    }

}


// ======================================================
// UPDATE WORKOUT MESSAGE
// ======================================================

function updateWorkoutMessage(
    workoutsCompleted,
    streak
) {

    if (
        !workoutProgressTextElement
    ) {

        return;

    }


    if (
        workoutsCompleted === 0
    ) {

        workoutProgressTextElement.textContent =
            "You have not completed a workout yet. Start your first workout today.";

        return;

    }


    if (
        streak >= 7
    ) {

        workoutProgressTextElement.textContent =
            `Amazing! You have completed ${streak} days in a row. Keep the streak going!`;

        return;

    }


    if (
        workoutsCompleted >= 30
    ) {

        workoutProgressTextElement.textContent =
            `Excellent work! You have completed ${workoutsCompleted} workouts. Keep pushing forward.`;

        return;

    }


    workoutProgressTextElement.textContent =
        `You have completed ${workoutsCompleted} workout${workoutsCompleted === 1 ? "" : "s"}. Keep going!`;

}


// ======================================================
// GOAL FORMAT
// ======================================================

function formatGoal(goal) {

    const normalized =
        String(goal || "")
            .trim()
            .toLowerCase();


    const goals = {

        "weight loss":
            "Weight Loss",

        "muscle building":
            "Muscle Building",

        "strength":
            "Strength",

        "mobility & flexibility":
            "Mobility & Flexibility",

        "mobility":
            "Mobility & Flexibility"

    };


    return (

        goals[normalized] ||

        goal ||

        "Fitness Journey"

    );

}


// ======================================================
// GET INITIALS
// ======================================================

function getInitials(name) {

    const words =
        String(name)
            .trim()
            .split(/\s+/)
            .filter(Boolean);


    if (
        words.length === 0
    ) {

        return "K";

    }


    if (
        words.length === 1
    ) {

        return words[0]
            .charAt(0)
            .toUpperCase();

    }


    return (

        words[0].charAt(0) +

        words[
            words.length - 1
        ].charAt(0)

    ).toUpperCase();

}


// ======================================================
// SET TEXT
// ======================================================

function setText(
    element,
    value
) {

    if (element) {

        element.textContent =
            value;

    }

}


// ======================================================
// LOGOUT
// ======================================================

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            const {
                error
            } = await supabase.auth.signOut();


            if (error) {

                console.error(
                    "Logout error:",
                    error
                );

                return;

            }


            window.location.href =
                "login.html";

        }
    );

}