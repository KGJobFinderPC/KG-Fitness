import {
    pipeline
} from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1";


document.addEventListener(
    "DOMContentLoaded",
    () => {

        const imageInput =
            document.getElementById(
                "machineImageInput"
            );

        const previewCard =
            document.getElementById(
                "previewCard"
            );

        const machinePreview =
            document.getElementById(
                "machinePreview"
            );

        const identifyButton =
            document.getElementById(
                "identifyButton"
            );

        const resultCard =
            document.getElementById(
                "resultCard"
            );

        const machineName =
            document.getElementById(
                "machineName"
            );

        const machineDescription =
            document.getElementById(
                "machineDescription"
            );

        const machineInformation =
            document.getElementById(
                "machineInformation"
            );

        const musclesWorked =
            document.getElementById(
                "musclesWorked"
            );

        const howToUse =
            document.getElementById(
                "howToUse"
            );

        const machineTips =
            document.getElementById(
                "machineTips"
            );


        let classifier = null;

        let selectedImage = null;

        let modelLoading = false;



        /* =========================================
           MACHINE DATABASE
        ========================================= */

        const machineData = {

            "leg press machine": {

                name: "Leg Press Machine",

                muscles: [
                    "Quadriceps",
                    "Glutes",
                    "Hamstrings"
                ],

                instructions: [
                    "Sit comfortably and place your feet on the platform.",
                    "Keep your back and head against the pad.",
                    "Push the platform away using your legs.",
                    "Lower the platform slowly and with control."
                ],

                tips: [
                    "Keep your knees aligned with your feet.",
                    "Do not lock your knees at the top.",
                    "Use a controlled range of motion.",
                    "Choose a weight you can control safely."
                ]

            },


            "chest press machine": {

                name: "Chest Press Machine",

                muscles: [
                    "Chest",
                    "Front Shoulders",
                    "Triceps"
                ],

                instructions: [
                    "Adjust the seat so the handles are around chest height.",
                    "Sit with your back firmly against the pad.",
                    "Grip the handles and push them forward.",
                    "Slowly return the handles to the starting position."
                ],

                tips: [
                    "Keep your shoulders down and back.",
                    "Do not lock your elbows.",
                    "Move the handles in a controlled way.",
                    "Avoid using momentum."
                ]

            },


            "lat pulldown machine": {

                name: "Lat Pulldown Machine",

                muscles: [
                    "Latissimus Dorsi",
                    "Biceps",
                    "Upper Back"
                ],

                instructions: [
                    "Sit down and secure your legs under the pads.",
                    "Grip the bar slightly wider than shoulder width.",
                    "Pull the bar toward your upper chest.",
                    "Slowly return the bar to the starting position."
                ],

                tips: [
                    "Keep your chest lifted.",
                    "Do not swing your body.",
                    "Pull with your elbows.",
                    "Control the bar on the way up."
                ]

            },


            "seated row machine": {

                name: "Seated Row Machine",

                muscles: [
                    "Upper Back",
                    "Latissimus Dorsi",
                    "Biceps"
                ],

                instructions: [
                    "Sit with your feet firmly supported.",
                    "Grip the handles with both hands.",
                    "Pull the handles toward your torso.",
                    "Slowly extend your arms back to the starting position."
                ],

                tips: [
                    "Keep your back neutral.",
                    "Pull your shoulder blades together.",
                    "Do not use momentum.",
                    "Keep the movement controlled."
                ]

            },


            "shoulder press machine": {

                name: "Shoulder Press Machine",

                muscles: [
                    "Shoulders",
                    "Triceps",
                    "Upper Chest"
                ],

                instructions: [
                    "Adjust the seat so the handles are around shoulder level.",
                    "Sit with your back against the pad.",
                    "Press the handles upward.",
                    "Slowly lower the handles back down."
                ],

                tips: [
                    "Keep your back against the pad.",
                    "Do not lock your elbows.",
                    "Keep your wrists straight.",
                    "Use a controlled movement."
                ]

            },


            "leg extension machine": {

                name: "Leg Extension Machine",

                muscles: [
                    "Quadriceps"
                ],

                instructions: [
                    "Adjust the seat and ankle pad correctly.",
                    "Place your ankles behind the pad.",
                    "Extend your legs upward.",
                    "Slowly lower the weight back down."
                ],

                tips: [
                    "Keep your back against the seat.",
                    "Move only through a comfortable range.",
                    "Avoid swinging your legs.",
                    "Use controlled repetitions."
                ]

            },


            "leg curl machine": {

                name: "Leg Curl Machine",

                muscles: [
                    "Hamstrings",
                    "Calves"
                ],

                instructions: [
                    "Adjust the machine so your knees line up with the pivot.",
                    "Place your legs correctly against the pads.",
                    "Curl your legs toward your body.",
                    "Slowly return to the starting position."
                ],

                tips: [
                    "Keep your hips stable.",
                    "Do not use momentum.",
                    "Control the return movement.",
                    "Use a comfortable weight."
                ]

            },


            "hack squat machine": {

                name: "Hack Squat Machine",

                muscles: [
                    "Quadriceps",
                    "Glutes",
                    "Hamstrings"
                ],

                instructions: [
                    "Position your shoulders securely under the pads.",
                    "Place your feet firmly on the platform.",
                    "Lower your body with control.",
                    "Push through your feet to return upward."
                ],

                tips: [
                    "Keep your knees aligned with your feet.",
                    "Keep your back against the pad.",
                    "Do not lock your knees.",
                    "Use controlled repetitions."
                ]

            },


            "pec deck machine": {

                name: "Pec Deck Machine",

                muscles: [
                    "Chest",
                    "Front Shoulders"
                ],

                instructions: [
                    "Adjust the seat so your arms are around chest height.",
                    "Place your arms against the pads or grip the handles.",
                    "Bring your arms together in front of your chest.",
                    "Slowly return to the starting position."
                ],

                tips: [
                    "Keep your chest against the pad.",
                    "Do not use momentum.",
                    "Squeeze your chest at the end of the movement.",
                    "Return slowly."
                ]

            },


            "smith machine": {

                name: "Smith Machine",

                muscles: [
                    "Legs",
                    "Glutes",
                    "Chest",
                    "Shoulders"
                ],

                instructions: [
                    "Set the bar at the correct height.",
                    "Choose the exercise and position yourself correctly.",
                    "Release the bar from the safety hooks.",
                    "Perform the movement with controlled form."
                ],

                tips: [
                    "Always check the safety stops.",
                    "Use appropriate weight.",
                    "Keep your body aligned.",
                    "Ask for assistance when needed."
                ]

            },


            "cable machine": {

                name: "Cable Machine",

                muscles: [
                    "Depends on Exercise"
                ],

                instructions: [
                    "Choose the correct cable attachment.",
                    "Set the pulley at the appropriate height.",
                    "Select a suitable weight.",
                    "Perform the exercise with controlled movement."
                ],

                tips: [
                    "Keep the cable under control.",
                    "Avoid using momentum.",
                    "Use the correct attachment.",
                    "Adjust the pulley height for your exercise."
                ]

            },


            "treadmill": {

                name: "Treadmill",

                muscles: [
                    "Quadriceps",
                    "Hamstrings",
                    "Glutes",
                    "Calves"
                ],

                instructions: [
                    "Stand on the side rails before starting.",
                    "Start the treadmill at a slow speed.",
                    "Step onto the belt carefully.",
                    "Increase speed gradually."
                ],

                tips: [
                    "Keep your posture upright.",
                    "Wear suitable training shoes.",
                    "Do not hold the rails unnecessarily.",
                    "Increase intensity gradually."
                ]

            },


            "exercise bike": {

                name: "Exercise Bike",

                muscles: [
                    "Quadriceps",
                    "Hamstrings",
                    "Glutes",
                    "Calves"
                ],

                instructions: [
                    "Adjust the seat to the correct height.",
                    "Place your feet securely on the pedals.",
                    "Start pedaling at a comfortable pace.",
                    "Increase resistance gradually."
                ],

                tips: [
                    "Keep your knees aligned.",
                    "Maintain good posture.",
                    "Avoid excessive resistance.",
                    "Build intensity gradually."
                ]

            },


            "elliptical machine": {

                name: "Elliptical Machine",

                muscles: [
                    "Legs",
                    "Glutes",
                    "Core",
                    "Upper Body"
                ],

                instructions: [
                    "Step onto the pedals carefully.",
                    "Hold the handles securely.",
                    "Begin moving your legs in a smooth motion.",
                    "Increase resistance or speed gradually."
                ],

                tips: [
                    "Keep your posture upright.",
                    "Use smooth movements.",
                    "Do not lean heavily on the handles.",
                    "Increase intensity gradually."
                ]

            },


            "abdominal machine": {

                name: "Abdominal Machine",

                muscles: [
                    "Abdominals",
                    "Core"
                ],

                instructions: [
                    "Adjust the seat and pads correctly.",
                    "Sit with your back against the pad.",
                    "Brace your core.",
                    "Perform the abdominal movement slowly."
                ],

                tips: [
                    "Do not pull with your arms.",
                    "Keep the movement controlled.",
                    "Avoid using momentum.",
                    "Focus on your abdominal muscles."
                ]

            }

        };



        /* =========================================
           LOAD SIGLIP AI
        ========================================= */

        async function loadModel() {

            if (classifier) {
                return classifier;
            }


            if (modelLoading) {
                return null;
            }


            modelLoading = true;


            machineName.textContent =
                "Loading AI...";


            machineDescription.textContent =
                "KG Fitness is loading the free AI model. The first loading may take a little longer.";


            resultCard.style.display =
                "block";


            machineInformation.style.display =
                "none";


            try {

                classifier =
                    await pipeline(
                        "zero-shot-image-classification",
                        "Xenova/siglip-base-patch16-224"
                    );


                machineName.textContent =
                    "AI Ready";


                machineDescription.textContent =
                    "The machine recognition system is ready.";


                return classifier;


            } catch (error) {

                console.error(
                    "SigLIP loading error:",
                    error
                );


                machineName.textContent =
                    "AI Loading Error";


                machineDescription.textContent =
                    "The free AI model could not be loaded. Please check your internet connection and try again.";


                return null;


            } finally {

                modelLoading = false;

            }

        }



        /* =========================================
           DISPLAY MACHINE INFORMATION
        ========================================= */

        function displayMachineInformation(
            machineKey
        ) {

            const data =
                machineData[machineKey];


            if (!data) {

                machineInformation.style.display =
                    "none";

                return;

            }


            musclesWorked.innerHTML = "";

            howToUse.innerHTML = "";

            machineTips.innerHTML = "";


            data.muscles.forEach(
                muscle => {

                    const li =
                        document.createElement(
                            "li"
                        );

                    li.textContent =
                        muscle;

                    musclesWorked.appendChild(
                        li
                    );

                }
            );


            data.instructions.forEach(
                instruction => {

                    const li =
                        document.createElement(
                            "li"
                        );

                    li.textContent =
                        instruction;

                    howToUse.appendChild(
                        li
                    );

                }
            );


            data.tips.forEach(
                tip => {

                    const li =
                        document.createElement(
                            "li"
                        );

                    li.textContent =
                        tip;

                    machineTips.appendChild(
                        li
                    );

                }
            );


            machineInformation.style.display =
                "grid";

        }



        /* =========================================
           IMAGE UPLOAD
        ========================================= */

        imageInput.addEventListener(
            "change",
            event => {

                const file =
                    event.target.files[0];


                if (!file) {
                    return;
                }


                if (
                    !file.type.startsWith(
                        "image/"
                    )
                ) {

                    alert(
                        "Please select an image file."
                    );


                    imageInput.value =
                        "";


                    return;
                }


                selectedImage =
                    file;


                const imageURL =
                    URL.createObjectURL(
                        file
                    );


                machinePreview.src =
                    imageURL;


                previewCard.style.display =
                    "block";


                resultCard.style.display =
                    "none";


                machineInformation.style.display =
                    "none";

            }
        );



        /* =========================================
           IDENTIFY MACHINE
        ========================================= */

        identifyButton.addEventListener(
            "click",
            async () => {

                if (!selectedImage) {

                    alert(
                        "Please choose a machine image first."
                    );


                    return;
                }


                identifyButton.disabled =
                    true;


                identifyButton.innerHTML =
                    `
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Analyzing...
                    `;


                resultCard.style.display =
                    "block";


                machineInformation.style.display =
                    "none";


                machineName.textContent =
                    "Analyzing Image...";


                machineDescription.textContent =
                    "Please wait while KG Fitness analyzes the machine.";


                try {

                    const ai =
                        await loadModel();


                    if (!ai) {
                        return;
                    }


                    const imageURL =
                        URL.createObjectURL(
                            selectedImage
                        );


                    const results =
                        await ai(
                            imageURL,
                            [
                                "a photo of a leg press machine",
                                "a photo of a chest press machine",
                                "a photo of a lat pulldown machine",
                                "a photo of a seated row machine",
                                "a photo of a shoulder press machine",
                                "a photo of a leg extension machine",
                                "a photo of a leg curl machine",
                                "a photo of a hack squat machine",
                                "a photo of a pec deck machine",
                                "a photo of a smith machine",
                                "a photo of a cable machine",
                                "a photo of a treadmill",
                                "a photo of an exercise bike",
                                "a photo of an elliptical machine",
                                "a photo of an abdominal machine"
                            ],
                            {
                                hypothesis_template:
                                    "{}"
                            }
                        );


                    URL.revokeObjectURL(
                        imageURL
                    );


                    if (
                        !results ||
                        !results.length
                    ) {

                        machineName.textContent =
                            "Machine Not Identified";


                        machineDescription.textContent =
                            "KG Fitness could not identify this machine.";


                        return;
                    }


                    console.log(
                        "SigLIP results:",
                        results
                    );


                    const bestResult =
                        results[0];


                    const confidence =
                        Math.round(
                            bestResult.score * 100
                        );


                    let machineKey =
                        bestResult.label
                            .replace(
                                /^a photo of (an?|the)\s+/i,
                                ""
                            )
                            .toLowerCase()
                            .trim();


                    const data =
                        machineData[machineKey];


                    let formattedName;


                    if (data) {

                        formattedName =
                            data.name;

                    } else {

                        formattedName =
                            bestResult.label
                                .replace(
                                    /^a photo of (an?|the)\s+/i,
                                    ""
                                )
                                .replace(
                                    /\b\w/g,
                                    letter =>
                                        letter.toUpperCase()
                                );

                    }


                    machineName.textContent =
                        formattedName;


                    machineDescription.textContent =
                        `KG Fitness identified this as a ${formattedName}. AI confidence: ${confidence}%.`;


                    /*
                        Show the information
                        when the machine is known.
                    */

                    if (
                        data &&
                        confidence >= 30
                    ) {

                        displayMachineInformation(
                            machineKey
                        );

                    } else {

                        machineInformation.style.display =
                            "none";

                    }


                    console.log(
                        "Identified Machine:",
                        formattedName
                    );


                    console.log(
                        "AI Confidence:",
                        confidence + "%"
                    );


                } catch (error) {

                    console.error(
                        "Machine identification error:",
                        error
                    );


                    machineName.textContent =
                        "Identification Error";


                    machineDescription.textContent =
                        "Something went wrong while analyzing the image. Please try again.";


                    machineInformation.style.display =
                        "none";

                } finally {

                    identifyButton.disabled =
                        false;


                    identifyButton.innerHTML =
                        `
                        <i class="fa-solid fa-magnifying-glass"></i>
                        Identify Machine
                        `;

                }

            }
        );



        /* =========================================
           START AI
        ========================================= */

        loadModel();

    }
);