// ===============================
// KG FITNESS - MAIN JAVASCRIPT
// ===============================

import { supabase } from "./supabase.js";


// ===============================
// PAGE LOADED
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    console.log("KG Fitness loaded successfully.");


    // ===============================
    // CREATE ACCOUNT
    // ===============================

    const registerForm =
        document.getElementById("registerForm");

    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();

                const name =
                    document.getElementById("name").value.trim();

                const email =
                    document.getElementById("email").value.trim();

                const password =
                    document.getElementById("password").value;

                const confirmPassword =
                    document.getElementById("confirmPassword").value;

                const height =
                    document.getElementById("height").value;

                const weight =
                    document.getElementById("weight").value;

                const age =
                    document.getElementById("age").value;

                const level =
                    document.getElementById("level").value;

                const goal =
                    document.getElementById("goal").value;

                const message =
                    document.getElementById("registerMessage");


                message.textContent = "";
                message.style.color = "";


                if (
                    !name ||
                    !email ||
                    !password ||
                    !confirmPassword ||
                    !height ||
                    !weight ||
                    !age ||
                    !level ||
                    !goal
                ) {

                    message.textContent =
                        "Please complete all fields.";

                    message.style.color =
                        "#ff6b6b";

                    return;
                }


                if (password !== confirmPassword) {

                    message.textContent =
                        "Passwords do not match.";

                    message.style.color =
                        "#ff6b6b";

                    return;
                }


                if (password.length < 6) {

                    message.textContent =
                        "Password must contain at least 6 characters.";

                    message.style.color =
                        "#ff6b6b";

                    return;
                }


                const submitButton =
                    registerForm.querySelector(
                        ".create-account-submit"
                    );


                submitButton.disabled = true;

                submitButton.textContent =
                    "CREATING ACCOUNT...";


                try {

                    const {
                        data,
                        error
                    } = await supabase.auth.signUp({

                        email: email,

                        password: password,

                        options: {

                            data: {

                                full_name: name,

                                height: Number(height),

                                weight: Number(weight),

                                age: Number(age),

                                level: level,

                                goal: goal

                            }

                        }

                    });


                    if (error) {

                        console.error(
                            "Supabase registration error:",
                            error
                        );

                        message.textContent =
                            error.message;

                        message.style.color =
                            "#ff6b6b";

                        submitButton.disabled =
                            false;

                        submitButton.textContent =
                            "CREATE ACCOUNT";

                        return;
                    }


                    console.log(
                        "Account created successfully:",
                        data
                    );


                    message.textContent =
                        "Account created successfully!";

                    message.style.color =
                        "#42e695";


                    submitButton.textContent =
                        "ACCOUNT CREATED";


                    setTimeout(() => {

                        window.location.href =
                            "login.html";

                    }, 2000);

                }

                catch (error) {

                    console.error(
                        "Unexpected error:",
                        error
                    );

                    message.textContent =
                        "Something went wrong. Please try again.";

                    message.style.color =
                        "#ff6b6b";

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "CREATE ACCOUNT";

                }

            }
        );

    }


    // ===============================
    // LOGIN
    // ===============================

    const loginForm =
        document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                const email =
                    document.getElementById("email").value.trim();

                const password =
                    document.getElementById("password").value;

                const message =
                    document.getElementById("loginMessage");

                const submitButton =
                    loginForm.querySelector(
                        ".login-submit"
                    );


                message.textContent = "";
                message.style.color = "";


                if (!email || !password) {

                    message.textContent =
                        "Please enter your email and password.";

                    message.style.color =
                        "#ff6b6b";

                    return;
                }


                submitButton.disabled = true;

                submitButton.textContent =
                    "LOGGING IN...";


                try {

                    const {
                        data,
                        error
                    } = await supabase.auth.signInWithPassword({

                        email: email,

                        password: password

                    });


                    if (error) {

                        console.error(
                            "Supabase login error:",
                            error
                        );

                        message.textContent =
                            "Invalid email or password.";

                        message.style.color =
                            "#ff6b6b";

                        submitButton.disabled =
                            false;

                        submitButton.textContent =
                            "LOGIN";

                        return;
                    }


                    console.log(
                        "Login successful:",
                        data
                    );


                    message.textContent =
                        "Login successful!";

                    message.style.color =
                        "#42e695";


                    submitButton.textContent =
                        "SUCCESS";


                    setTimeout(() => {

                        window.location.href =
                            "dashboard.html";

                    }, 1000);

                }

                catch (error) {

                    console.error(
                        "Unexpected login error:",
                        error
                    );

                    message.textContent =
                        "Something went wrong. Please try again.";

                    message.style.color =
                        "#ff6b6b";

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "LOGIN";

                }

            }
        );

    }


    // ===============================
    // FORGOT PASSWORD
    // ===============================

    const forgotPassword =
        document.getElementById("forgotPassword");

    const forgotPasswordModal =
        document.getElementById("forgotPasswordModal");

    const closeForgotModal =
        document.getElementById("closeForgotModal");

    const cancelForgotPassword =
        document.getElementById("cancelForgotPassword");

    const sendResetLink =
        document.getElementById("sendResetLink");

    const forgotEmail =
        document.getElementById("forgotEmail");

    const forgotMessage =
        document.getElementById("forgotMessage");


    // ===============================
    // OPEN MODAL
    // ===============================

    if (forgotPassword) {

        forgotPassword.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                console.log(
                    "Forgot Password clicked."
                );


                if (forgotPasswordModal) {

                    forgotPasswordModal.style.display =
                        "flex";
                }


                if (forgotEmail) {

                    forgotEmail.value = "";

                    forgotEmail.focus();
                }


                if (forgotMessage) {

                    forgotMessage.textContent = "";

                    forgotMessage.style.color = "";
                }

            }
        );

    }


    // ===============================
    // CLOSE MODAL
    // ===============================

    function closeForgotPasswordModal() {

        if (forgotPasswordModal) {

            forgotPasswordModal.style.display =
                "none";
        }

    }


    if (closeForgotModal) {

        closeForgotModal.addEventListener(
            "click",
            closeForgotPasswordModal
        );

    }


    if (cancelForgotPassword) {

        cancelForgotPassword.addEventListener(
            "click",
            closeForgotPasswordModal
        );

    }


    // ===============================
    // SEND RESET LINK
    // ===============================

    if (sendResetLink) {

        sendResetLink.addEventListener(
            "click",
            async () => {

                if (!forgotEmail || !forgotMessage) {

                    return;
                }


                const email =
                    forgotEmail.value.trim();


                // ===============================
                // CHECK EMAIL
                // ===============================

                if (!email) {

                    forgotMessage.textContent =
                        "Please enter your email address.";

                    forgotMessage.style.color =
                        "#ff6b6b";

                    forgotEmail.focus();

                    return;
                }


                // ===============================
                // LOADING
                // ===============================

                sendResetLink.disabled =
                    true;

                sendResetLink.textContent =
                    "SENDING...";

                forgotMessage.textContent =
                    "Sending password reset email...";

                forgotMessage.style.color =
                    "#ffd84d";


                try {

                    const {
                        error
                    } =
                        await supabase.auth.resetPasswordForEmail(
                            email,
                            {
 redirectTo:
    "https://kgjobfinderpc.github.io/KG-Fitness/reset-password.html"
                        );


                    if (error) {

                        console.error(
                            "Password reset error:",
                            error
                        );

                        forgotMessage.textContent =
                            error.message;

                        forgotMessage.style.color =
                            "#ff6b6b";

                        sendResetLink.disabled =
                            false;

                        sendResetLink.textContent =
                            "SEND RESET LINK";

                        return;
                    }


                    // ===============================
                    // SUCCESS
                    // ===============================

                    forgotMessage.textContent =
                        "Password reset email sent! Check your inbox.";

                    forgotMessage.style.color =
                        "#ffd84d";

                    sendResetLink.textContent =
                        "EMAIL SENT";


                    console.log(
                        "Password reset email sent."
                    );

                }

                catch (error) {

                    console.error(
                        "Unexpected password reset error:",
                        error
                    );

                    forgotMessage.textContent =
                        "Something went wrong. Please try again.";

                    forgotMessage.style.color =
                        "#ff6b6b";

                    sendResetLink.disabled =
                        false;

                    sendResetLink.textContent =
                        "SEND RESET LINK";

                }

            }
        );

    }


    // ===============================
    // CREATE ACCOUNT BUTTON
    // ===============================

    const createAccountBtn =
        document.getElementById("createAccountBtn");

    if (createAccountBtn) {

        createAccountBtn.addEventListener(
            "click",
            () => {

                window.location.href =
                    "create-account.html";

            }
        );

    }


    // ===============================
    // BACK BUTTON
    // ===============================

    const backBtn =
        document.getElementById("backBtn");

    if (backBtn) {

        backBtn.addEventListener(
            "click",
            () => {

                window.location.href =
                    "index.html";

            }
        );

    }

});