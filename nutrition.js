import { supabase } from "./supabase.js";

import {
    getNutritionDay
} from "./data/nutrition-90-days.js";


let currentUser = null;

let currentLevel = "beginner";

let currentGoal = "Muscle Building";

let currentDay = 1;


// ======================================================
// PAGE LOADED
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "KG Fitness Nutrition loaded successfully."
        );


        const {
            data: {
                user
            },
            error
        } = await supabase.auth.getUser();


        if (error || !user) {

            console.error(
                "User not found:",
                error
            );

            window.location.href =
                "login.html";

            return;
        }


        currentUser = user;


        const metadata =
            user.user_metadata || {};


        const fullName =
            metadata.full_name ||
            "Athlete";


        currentLevel =
            metadata.level ||
            "beginner";


        currentGoal =
            metadata.goal ||
            "Muscle Building";


        const userName =
            document.getElementById(
                "userName"
            );


        if (userName) {

            userName.textContent =
                fullName;
        }


        const userGoal =
            document.getElementById(
                "userGoal"
            );


        if (userGoal) {

            userGoal.textContent =
                formatGoal(currentGoal);
        }


        // ==================================================
        // START ALWAYS FROM DAY 1
        // ==================================================

        currentDay = 1;


        setupDayNavigation();

        setupLogout();

        loadNutritionDay();
    }
);


// ======================================================
// LOAD NUTRITION DAY
// ======================================================

function loadNutritionDay() {

    console.log(
        "Loading nutrition:",
        currentLevel,
        currentGoal,
        "Day:",
        currentDay
    );


    const nutritionDay =
        getNutritionDay(
            currentLevel,
            currentGoal,
            currentDay
        );


    console.log(
        "Nutrition day data:",
        nutritionDay
    );


    if (!nutritionDay) {

        console.error(
            "Nutrition day not found:",
            currentDay
        );

        return;
    }


    // ==================================================
    // DAY NUMBER
    // ==================================================

    setText(
        "currentDay",
        `DAY ${currentDay}`
    );


    setText(
        "selectedDay",
        currentDay
    );


    // ==================================================
    // DESCRIPTION
    // ==================================================

    const heroDescription =
        document.getElementById(
            "heroDescription"
        );


    if (heroDescription) {

        heroDescription.textContent =
            nutritionDay.description || "";
    }


    // ==================================================
    // DAILY TOTALS
    // ==================================================

    setText(
        "caloriesValue",
        nutritionDay.dailyTotals.calories
    );


    setText(
        "proteinValue",
        nutritionDay.dailyTotals.protein
    );


    setText(
        "carbsValue",
        nutritionDay.dailyTotals.carbs
    );


    setText(
        "fatsValue",
        nutritionDay.dailyTotals.fats
    );


    // ==================================================
    // MEALS
    // ==================================================

    renderMeals(
        nutritionDay.meals
    );


    // ==================================================
    // HYDRATION
    // ==================================================

    renderHydration(
        nutritionDay.hydration
    );


    // ==================================================
    // BUTTONS
    // ==================================================

    updateNavigationButtons();
}


// ======================================================
// RENDER MEALS
// ======================================================

function renderMeals(meals) {

    const container =
        document.getElementById(
            "mealsContainer"
        );


    if (!container) {

        console.error(
            "mealsContainer not found."
        );

        return;
    }


    container.innerHTML = "";


    if (
        !Array.isArray(meals)
    ) {

        return;
    }


    setText(
        "mealCount",
        `${meals.length} MEALS`
    );


    meals.forEach(
        (meal) => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "meal-card";


            card.innerHTML = `

                <div class="meal-type">
                    ${escapeHTML(
                        meal.type ||
                        "Meal"
                    )}
                </div>

                <h3>
                    ${escapeHTML(
                        meal.name ||
                        "Nutrition Meal"
                    )}
                </h3>

                <div class="meal-calories">
                    ${meal.calories || 0}
                    kcal
                </div>

                <div class="meal-macros">

                    <div class="macro">
                        Protein:
                        <strong>
                            ${meal.protein || 0}g
                        </strong>
                    </div>

                    <div class="macro">
                        Carbs:
                        <strong>
                            ${meal.carbs || 0}g
                        </strong>
                    </div>

                    <div class="macro">
                        Fats:
                        <strong>
                            ${meal.fats || 0}g
                        </strong>
                    </div>

                </div>
            `;


            container.appendChild(
                card
            );
        }
    );
}


// ======================================================
// RENDER HYDRATION
// ======================================================

function renderHydration(
    hydration
) {

    if (!hydration) {

        return;
    }


    setText(
        "hydrationText",
        hydration.recommendation ||
        "Drink water regularly throughout the day."
    );


    setText(
        "trainingHydrationText",
        hydration.training ||
        "Drink additional water before, during and after training."
    );
}


// ======================================================
// DAY NAVIGATION
// ======================================================

function setupDayNavigation() {

    const previousButton =
        document.getElementById(
            "previousDayBtn"
        );


    const nextButton =
        document.getElementById(
            "nextDayBtn"
        );


    // ==================================================
    // PREVIOUS
    // ==================================================

    if (previousButton) {

        previousButton.onclick =
            function () {

                if (currentDay <= 1) {

                    return;
                }


                currentDay =
                    currentDay - 1;


                loadNutritionDay();


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            };
    }


    // ==================================================
    // NEXT
    // ==================================================

    if (nextButton) {

        nextButton.onclick =
            function () {

                if (currentDay >= 90) {

                    return;
                }


                currentDay =
                    currentDay + 1;


                loadNutritionDay();


                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            };
    }
}


// ======================================================
// UPDATE BUTTONS
// ======================================================

function updateNavigationButtons() {

    const previousButton =
        document.getElementById(
            "previousDayBtn"
        );


    const nextButton =
        document.getElementById(
            "nextDayBtn"
        );


    if (previousButton) {

        previousButton.disabled =
            currentDay <= 1;
    }


    if (nextButton) {

        nextButton.disabled =
            currentDay >= 90;
    }
}


// ======================================================
// LOGOUT
// ======================================================

function setupLogout() {

    const logoutButton =
        document.getElementById(
            "logoutBtn"
        );


    if (!logoutButton) {

        return;
    }


    logoutButton.onclick =
        async function () {

            const {
                error
            } =
                await supabase.auth.signOut();


            if (error) {

                console.error(
                    "Logout error:",
                    error
                );

                alert(
                    "Logout error: " +
                    error.message
                );

                return;
            }


            window.location.href =
                "login.html";
        };
}


// ======================================================
// FORMAT GOAL
// ======================================================

function formatGoal(goal) {

    const goalMap = {

        "weight-loss":
            "Weight Loss",

        "muscle-building":
            "Muscle Building",

        "strength":
            "Strength",

        "mobility-flexibility":
            "Mobility & Flexibility",

        "Weight Loss":
            "Weight Loss",

        "Muscle Building":
            "Muscle Building",

        "Strength":
            "Strength",

        "Mobility & Flexibility":
            "Mobility & Flexibility"
    };


    return (
        goalMap[goal] ||
        "Muscle Building"
    );
}


// ======================================================
// SET TEXT
// ======================================================

function setText(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (element) {

        element.textContent =
            value;
    }
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