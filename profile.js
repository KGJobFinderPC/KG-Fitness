// =================================
// KG FITNESS - MY PROFILE
// =================================

import { supabase } from "./supabase.js";


// =================================
// PAGE LOADED
// =================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "KG Fitness Profile loaded successfully."
        );


        // =================================
        // GET CURRENT USER
        // =================================

        const {
            data: {
                user
            },
            error
        } = await supabase.auth.getUser();


        // =================================
        // CHECK USER
        // =================================

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
            "Profile user:",
            user
        );


        // =================================
        // GET USER METADATA
        // =================================

        const metadata =
            user.user_metadata || {};


        const fullName =
            metadata.full_name || "";


        const height =
            metadata.height || "";


        const weight =
            metadata.weight || "";


        const age =
            metadata.age || "";


        const level =
            metadata.level || "";


        const goal =
            metadata.goal || "";


        const email =
            user.email || "";


        // =================================
        // GET ELEMENTS
        // =================================

        const displayName =
            document.getElementById(
                "displayName"
            );


        const displayEmail =
            document.getElementById(
                "displayEmail"
            );


        const profileInitial =
            document.getElementById(
                "profileInitial"
            );


        const fullNameInput =
            document.getElementById(
                "fullName"
            );


        const emailInput =
            document.getElementById(
                "email"
            );


        const heightInput =
            document.getElementById(
                "height"
            );


        const weightInput =
            document.getElementById(
                "weight"
            );


        const ageInput =
            document.getElementById(
                "age"
            );


        const levelInput =
            document.getElementById(
                "level"
            );


        const goalInput =
            document.getElementById(
                "goal"
            );


        const profileForm =
            document.getElementById(
                "profileForm"
            );


        const cancelBtn =
            document.getElementById(
                "cancelBtn"
            );


        const saveProfileBtn =
            document.getElementById(
                "saveProfileBtn"
            );


        const profileMessage =
            document.getElementById(
                "profileMessage"
            );


        // =================================
        // DISPLAY USER DATA
        // =================================

        if (displayName) {

            displayName.textContent =
                fullName || "Athlete";
        }


        if (displayEmail) {

            displayEmail.textContent =
                email;
        }


        if (profileInitial) {

            const nameForInitial =
                fullName || "Athlete";

            profileInitial.textContent =
                nameForInitial
                    .charAt(0)
                    .toUpperCase();
        }


        // =================================
        // FILL FORM
        // =================================

        if (fullNameInput) {

            fullNameInput.value =
                fullName;
        }


        if (emailInput) {

            emailInput.value =
                email;
        }


        if (heightInput) {

            heightInput.value =
                height;
        }


        if (weightInput) {

            weightInput.value =
                weight;
        }


        if (ageInput) {

            ageInput.value =
                age;
        }


        if (levelInput) {

            levelInput.value =
                level;
        }


        if (goalInput) {

            goalInput.value =
                goal;
        }


        // =================================
        // SHOW MESSAGE
        // =================================

        function showMessage(
            message,
            success = true
        ) {

            if (!profileMessage) {
                return;
            }


            profileMessage.textContent =
                message;


            if (success) {

                profileMessage.style.color =
                    "#facc15";

            } else {

                profileMessage.style.color =
                    "#ff6b6b";
            }

        }


        // =================================
        // SAVE PROFILE
        // =================================

        if (profileForm) {

            profileForm.addEventListener(
                "submit",
                async (event) => {

                    event.preventDefault();


                    // =============================
                    // GET FORM VALUES
                    // =============================

                    const newFullName =
                        fullNameInput
                            ?.value
                            .trim();


                    const newHeight =
                        heightInput
                            ?.value
                            .trim();


                    const newWeight =
                        weightInput
                            ?.value
                            .trim();


                    const newAge =
                        ageInput
                            ?.value
                            .trim();


                    const newLevel =
                        levelInput
                            ?.value
                            .trim();


                    const newGoal =
                        goalInput
                            ?.value
                            .trim();


                    // =============================
                    // VALIDATION
                    // =============================

                    if (!newFullName) {

                        showMessage(
                            "Please enter your full name.",
                            false
                        );

                        fullNameInput?.focus();

                        return;
                    }


                    if (
                        newHeight &&
                        (
                            Number(newHeight) < 1 ||
                            Number(newHeight) > 300
                        )
                    ) {

                        showMessage(
                            "Please enter a valid height.",
                            false
                        );

                        heightInput?.focus();

                        return;
                    }


                    if (
                        newWeight &&
                        (
                            Number(newWeight) < 1 ||
                            Number(newWeight) > 500
                        )
                    ) {

                        showMessage(
                            "Please enter a valid weight.",
                            false
                        );

                        weightInput?.focus();

                        return;
                    }


                    if (
                        newAge &&
                        (
                            Number(newAge) < 1 ||
                            Number(newAge) > 120
                        )
                    ) {

                        showMessage(
                            "Please enter a valid age.",
                            false
                        );

                        ageInput?.focus();

                        return;
                    }


                    // =============================
                    // DISABLE BUTTON
                    // =============================

                    if (saveProfileBtn) {

                        saveProfileBtn.disabled =
                            true;

                        saveProfileBtn.textContent =
                            "SAVING...";
                    }


                    showMessage(
                        "Saving profile..."
                    );


                    // =============================
                    // UPDATE SUPABASE USER
                    // =============================

                    const {
                        data,
                        error:
                            updateError
                    } = await supabase.auth.updateUser({

                        data: {

                            full_name:
                                newFullName,

                            height:
                                newHeight,

                            weight:
                                newWeight,

                            age:
                                newAge,

                            level:
                                newLevel,

                            goal:
                                newGoal
                        }

                    });


                    // =============================
                    // HANDLE ERROR
                    // =============================

                    if (updateError) {

                        console.error(
                            "Profile update error:",
                            updateError
                        );


                        showMessage(
                            "Could not save your profile. Please try again.",
                            false
                        );


                        if (saveProfileBtn) {

                            saveProfileBtn.disabled =
                                false;

                            saveProfileBtn.textContent =
                                "SAVE CHANGES";
                        }


                        return;
                    }


                    // =============================
                    // SUCCESS
                    // =============================

                    console.log(
                        "Profile updated:",
                        data.user
                    );


                    showMessage(
                        "Profile updated successfully!"
                    );


                    // =============================
                    // UPDATE SCREEN
                    // =============================

                    if (displayName) {

                        displayName.textContent =
                            newFullName;
                    }


                    if (profileInitial) {

                        profileInitial.textContent =
                            newFullName
                                .charAt(0)
                                .toUpperCase();
                    }


                    // =============================
                    // RESTORE BUTTON
                    // =============================

                    if (saveProfileBtn) {

                        saveProfileBtn.disabled =
                            false;

                        saveProfileBtn.textContent =
                            "SAVE CHANGES";
                    }

                }
            );

        }


        // =================================
        // CANCEL BUTTON
        // =================================

        if (cancelBtn) {

            cancelBtn.addEventListener(
                "click",
                () => {

                    window.location.href =
                        "dashboard.html";

                }
            );

        }


        // =================================
        // BACK BUTTON
        // =================================

        const backBtn =
            document.getElementById(
                "backBtn"
            );


        if (backBtn) {

            backBtn.addEventListener(
                "click",
                () => {

                    window.location.href =
                        "dashboard.html";

                }
            );

        }


    }
);