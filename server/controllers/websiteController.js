
import generateResponse from "../config/openRouter.js";
import User from "../models/user.js";
import Website from "../models/webiste.js";
import extractJson from "../utils/extractJson.js";
import masterPrompt from "../utils/prompt.js";

//controller for genearte website
const generateWebsite = async (req, res) => {
    try {
        //fetch the user and the user from the req ki body
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({
                success: false,
                message: "Prompt is required"
            });
        }

        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        };


        if (user.credits < 50) {
            return res.status(400).json({
                success: false,
                message: "You have not enough credits to generate a website"
            });
        }

        //replace user given prompt in the in the master prompt
        const finalPrompt = masterPrompt.replace("USER_PROMPT", prompt);

        //not call the open router function to get the response
        let raw = "";
        let parsed = "";

        for (let i = 0; i < 2 && !parsed; i++) {
            raw = await generateResponse(finalPrompt);
            parsed = await extractJson(raw);

            if (!parsed) {
                raw = await generateResponse(finalPrompt + "\n\nRETURN ONLY RAW JSON.");
                parsed = await extractJson(raw);
            }

        }

        

        if (!parsed || !parsed.code) {
            return res.status(400).json({
                success: false,
                message: "AI returned invalid response"
            })
        }

        //after getting the code from the open router then sabe the data in the db
        const website = await Website.create({
            user: user._id,
            title: prompt.slice(0, 60),
            latestCode: parsed.code,
            conversation: [
                {
                    role: "user",
                    content: prompt
                },
                {
                    role: "ai",
                    content: parsed.message
                }
            ]
        });

        //after website geneartion minus 50 credits from the user
        user.credits = user.credits - 50;
        await user.save();

        //now return the responde with website id and the reamining credits
        return res.status(200).json({
            success: true,
            message: "Website generated successfully",
            websiteId: website._id,
            remainingCredits: user.credits
        })

        console.log("response from the open router" + raw)
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while generating the website"
        });
    }
}



//this is to check the response from the open router
const generateDemo = async (req, res) => {
    try {
        const result = await generateResponse("Hello");
        return res.status(200).json({
            success: true,
            message: "Response generated successfully",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while generating the response"
        });
    }
}

export { generateDemo, generateWebsite }