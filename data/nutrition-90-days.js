// ======================================================
// KG FITNESS - 90 DAY NUTRITION SYSTEM
// ======================================================


// ------------------------------------------------------
// NUTRITION DATABASE
// ------------------------------------------------------

const NUTRITION_MEALS = {

    breakfast: [

        {
            name: "Oatmeal with Banana & Greek Yogurt",
            calories: 450,
            protein: 25,
            carbs: 65,
            fats: 10
        },

        {
            name: "Eggs, Whole Grain Toast & Avocado",
            calories: 480,
            protein: 24,
            carbs: 40,
            fats: 24
        },

        {
            name: "Greek Yogurt, Berries & Oats",
            calories: 400,
            protein: 28,
            carbs: 50,
            fats: 9
        },

        {
            name: "Protein Pancakes with Berries",
            calories: 430,
            protein: 30,
            carbs: 52,
            fats: 10
        },

        {
            name: "Scrambled Eggs & Whole Grain Toast",
            calories: 420,
            protein: 27,
            carbs: 38,
            fats: 18
        },

        {
            name: "Overnight Oats with Protein & Berries",
            calories: 440,
            protein: 30,
            carbs: 55,
            fats: 10
        }

    ],


    snacks: [

        {
            name: "Greek Yogurt & Berries",
            calories: 200,
            protein: 18,
            carbs: 22,
            fats: 4
        },

        {
            name: "Apple & Peanut Butter",
            calories: 220,
            protein: 7,
            carbs: 28,
            fats: 10
        },

        {
            name: "Protein Shake & Banana",
            calories: 230,
            protein: 25,
            carbs: 28,
            fats: 3
        },

        {
            name: "Cottage Cheese & Fruit",
            calories: 210,
            protein: 20,
            carbs: 20,
            fats: 5
        },

        {
            name: "Mixed Nuts & Fruit",
            calories: 230,
            protein: 6,
            carbs: 20,
            fats: 15
        },

        {
            name: "Greek Yogurt & Banana",
            calories: 220,
            protein: 18,
            carbs: 30,
            fats: 4
        }

    ],


    lunch: [

        {
            name: "Grilled Chicken, Rice & Vegetables",
            calories: 600,
            protein: 45,
            carbs: 70,
            fats: 12
        },

        {
            name: "Turkey, Rice & Mixed Vegetables",
            calories: 580,
            protein: 44,
            carbs: 68,
            fats: 11
        },

        {
            name: "Chicken Pasta with Vegetables",
            calories: 620,
            protein: 45,
            carbs: 75,
            fats: 13
        },

        {
            name: "Lean Beef, Potatoes & Vegetables",
            calories: 630,
            protein: 43,
            carbs: 62,
            fats: 20
        },

        {
            name: "Chicken Wrap with Salad",
            calories: 560,
            protein: 42,
            carbs: 58,
            fats: 15
        },

        {
            name: "Tuna, Rice & Salad",
            calories: 550,
            protein: 42,
            carbs: 65,
            fats: 10
        }

    ],


    dinner: [

        {
            name: "Grilled Salmon, Potatoes & Vegetables",
            calories: 620,
            protein: 42,
            carbs: 48,
            fats: 25
        },

        {
            name: "Chicken, Sweet Potato & Vegetables",
            calories: 580,
            protein: 45,
            carbs: 55,
            fats: 14
        },

        {
            name: "Lean Beef, Rice & Vegetables",
            calories: 610,
            protein: 44,
            carbs: 60,
            fats: 17
        },

        {
            name: "Turkey, Potatoes & Green Vegetables",
            calories: 570,
            protein: 43,
            carbs: 52,
            fats: 14
        },

        {
            name: "Chicken, Quinoa & Vegetables",
            calories: 590,
            protein: 46,
            carbs: 55,
            fats: 13
        },

        {
            name: "White Fish, Rice & Vegetables",
            calories: 540,
            protein: 43,
            carbs: 58,
            fats: 9
        }

    ]

};


// ------------------------------------------------------
// GOAL SETTINGS
// ------------------------------------------------------

const NUTRITION_GOALS = {

    "Weight Loss": {

        calorieMultiplier: 0.80,

        proteinMultiplier: 1.00,

        description:
            "A balanced nutrition plan focused on supporting fat loss while maintaining muscle."

    },


    "Muscle Building": {

        calorieMultiplier: 1.15,

        proteinMultiplier: 1.15,

        description:
            "A nutrition plan focused on supporting muscle growth and recovery."

    },


    "Strength": {

        calorieMultiplier: 1.05,

        proteinMultiplier: 1.10,

        description:
            "A balanced nutrition plan designed to support strength, training performance and recovery."

    },


    "Mobility & Flexibility": {

        calorieMultiplier: 1.00,

        proteinMultiplier: 1.00,

        description:
            "A balanced nutrition plan focused on supporting recovery, energy and overall fitness."

    }

};


// ------------------------------------------------------
// GOAL NORMALIZATION
// ------------------------------------------------------

function normalizeNutritionGoal(goal) {

    const value =
        String(goal || "")
            .trim();


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
        goalMap[value] ||
        "Muscle Building"
    );
}


// ------------------------------------------------------
// MEAL ROTATION
// ------------------------------------------------------

function getRotatedMeal(
    meals,
    dayNumber,
    offset = 0
) {

    const index =
        (
            (dayNumber - 1) +
            offset
        ) % meals.length;


    return meals[index];
}


// ------------------------------------------------------
// DAILY NUTRITION GENERATOR
// ------------------------------------------------------

function createNutritionDay(
    goal,
    dayNumber
) {

    const normalizedGoal =
        normalizeNutritionGoal(goal);


    const goalSettings =
        NUTRITION_GOALS[
            normalizedGoal
        ] ||
        NUTRITION_GOALS[
            "Muscle Building"
        ];


    const breakfast =
        getRotatedMeal(
            NUTRITION_MEALS.breakfast,
            dayNumber,
            0
        );


    const snack1 =
        getRotatedMeal(
            NUTRITION_MEALS.snacks,
            dayNumber,
            1
        );


    const lunch =
        getRotatedMeal(
            NUTRITION_MEALS.lunch,
            dayNumber,
            2
        );


    const snack2 =
        getRotatedMeal(
            NUTRITION_MEALS.snacks,
            dayNumber,
            3
        );


    const dinner =
        getRotatedMeal(
            NUTRITION_MEALS.dinner,
            dayNumber,
            4
        );


    const meals = [

        {
            type: "Breakfast",
            ...breakfast
        },

        {
            type: "Snack",
            ...snack1
        },

        {
            type: "Lunch",
            ...lunch
        },

        {
            type: "Snack",
            ...snack2
        },

        {
            type: "Dinner",
            ...dinner
        }

    ];


    const baseCalories =
        meals.reduce(
            (total, meal) =>
                total +
                meal.calories,
            0
        );


    const baseProtein =
        meals.reduce(
            (total, meal) =>
                total +
                meal.protein,
            0
        );


    const baseCarbs =
        meals.reduce(
            (total, meal) =>
                total +
                meal.carbs,
            0
        );


    const baseFats =
        meals.reduce(
            (total, meal) =>
                total +
                meal.fats,
            0
        );


    return {

        day: dayNumber,

        goal: normalizedGoal,

        description:
            goalSettings.description,

        meals: meals,

        dailyTotals: {

            calories:
                Math.round(
                    baseCalories *
                    goalSettings.calorieMultiplier
                ),

            protein:
                Math.round(
                    baseProtein *
                    goalSettings.proteinMultiplier
                ),

            carbs:
                Math.round(
                    baseCarbs *
                    goalSettings.calorieMultiplier
                ),

            fats:
                Math.round(
                    baseFats *
                    goalSettings.calorieMultiplier
                )

        },

        hydration: {

            recommendation:
                "Drink water regularly throughout the day.",

            training:
                "Drink additional water before, during and after training."

        }

    };
}


// ------------------------------------------------------
// BUILD 90 DAYS AUTOMATICALLY
// ------------------------------------------------------

function buildNutrition90Days(goal) {

    const days = {};


    for (
        let day = 1;
        day <= 90;
        day++
    ) {

        days[day] =
            createNutritionDay(
                goal,
                day
            );
    }


    return days;
}


// ------------------------------------------------------
// COMPLETE 90 DAY NUTRITION PROGRAM
// ------------------------------------------------------

const NUTRITION_90_DAYS = {

    beginner: {

        "Weight Loss":
            buildNutrition90Days(
                "Weight Loss"
            ),

        "Muscle Building":
            buildNutrition90Days(
                "Muscle Building"
            ),

        "Strength":
            buildNutrition90Days(
                "Strength"
            ),

        "Mobility & Flexibility":
            buildNutrition90Days(
                "Mobility & Flexibility"
            )

    }

};


// ------------------------------------------------------
// GET NUTRITION DAY
// ------------------------------------------------------

export function getNutritionDay(
    level,
    goal,
    dayNumber
) {

    const normalizedGoal =
        normalizeNutritionGoal(goal);


    const selectedLevel =
        NUTRITION_90_DAYS[level] ||
        NUTRITION_90_DAYS.beginner;


    const selectedGoal =
        selectedLevel[normalizedGoal] ||
        selectedLevel[
            "Muscle Building"
        ];


    const day =
        Number(dayNumber);


    if (
        !Number.isInteger(day) ||
        day < 1 ||
        day > 90
    ) {

        return null;
    }


    return (
        selectedGoal[day] ||
        null
    );
}


// ------------------------------------------------------
// GET COMPLETE NUTRITION PROGRAM
// ------------------------------------------------------

export function getNutritionProgram(
    level,
    goal
) {

    const normalizedGoal =
        normalizeNutritionGoal(goal);


    const selectedLevel =
        NUTRITION_90_DAYS[level] ||
        NUTRITION_90_DAYS.beginner;


    return (
        selectedLevel[normalizedGoal] ||
        selectedLevel[
            "Muscle Building"
        ]
    );
}