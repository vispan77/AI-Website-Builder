
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


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while generating the website"
        });
    }
}


//controller to get the websiye by id
const getWebsiteById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        const website = await Website.findOne({ _id: id, user: user._id });
        if (!website) {
            return res.status(404).json({
                success: false,
                message: "Website not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Website fetched successfully",
            data: website
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching the website by id"
        });
    }
}

//change the promp for more modification
const changeWebsite = async (req, res) => {
    try {
        const { prompt } = req.body;
        const { websiteId } = req.params;

        if (!prompt) {
            return res.status(404).json({
                success: false,
                message: "Prompt is required"
            })
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        if (user.credits < 25) {
            return res.status(404).json({
                success: false,
                message: "You have not enough credits to change the website"
            })

        }

        const website = await Website.findOne({ _id: websiteId, user: user._id });
        if (!website) {
            return res.status(404).json({
                success: false,
                message: "Website not found"
            })
        }

        const updatePrompt = `
        UPDATE THIS HTML WEBSITE,

        CURRENT CODE: ${website.latestCode}

        USER REQUEST: ${prompt}

        RETURN RAW JSON ONLY: 
        {
            "message": "SHORT CONFIRMATION MESSAGE FROM YOUR SIDE",
            "code": "UPDATED FULL HTML"
        }
        `;

        let raw = "";
        let parsed = null;

        for (let i = 0; i < 2 && !parsed; i++) {
            raw = await generateResponse(updatePrompt);
            parsed = await extractJson(raw);

            if (!parsed) {
                raw = await generateResponse(updatePrompt + "\\n\\nRETURN ONLY RAW JSON.");
                parsed = await extractJson(raw);
            }

        }

        if (!parsed || !parsed.code) {
            return res.status(404).json({
                success: false,
                message: "AI returned invalid response"

            })
        }

        //update the website conversation
        website.conversation.push(
            {
                role: "user",
                content: prompt
            },
            {
                role: "ai",
                content: parsed.message
            }

        )

        website.latestCode = parsed.code;

        await website.save();

        user.credits = user.credits - 25;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Website changed successfully",
            websiteId: website._id,
            message: parsed.message,
            code: parsed.code,
            remainingCredits: user.credits
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating the website"
        })
    }
}


//controller to get all the wesbite created by the user
const getAllWebsites = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        const websites = await Website.find({ user: user._id });

        return res.status(200).json({
            success: true,
            message: "All Websites fetched successfully",
            data: websites
        })
    } catch (error) {

    }
}

//controller for deploy website url
const deployWebsite = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const website = await Website.findOne({ _id: req.params.id, user: user._id });

        if (!website) {
            return res.status(404).json({
                success: false,
                message: "Website not found"
            })
        }

        if (!website.slug) {
            website.slug = website.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 60) +
                website._id.toString().slice(-6);
        }

        website.deployed = true;
        website.deployUrl = `${process.env.FRONTEND_URL}/site/${website.slug}`;

        await website.save();


        return res.status(200).json({
            success: true,
            message: "Website deployed successfully",
            url: website.deployUrl
        })



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deploying the website"
        })

    }
}


//controller for geeting website by slug
const getWebsiteBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        console.log("slug", slug)


        const website = await Website.findOne({ slug: slug });
        console.log("website", website)

        if (!website) {
            return res.status(404).json({
                success: false,
                message: "Website not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Website fetched successfully",
            data: website
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching the website by slug"
        })
    }
}


const deleteWebsite = async (req, res) => {
    try {
        const { id } = req.params;

        const website = await Website.findByIdAndDelete(id);

        if (!website) {
            return res.status(404).json({
                success: false,
                message: "Website not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Website deleted successfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the website"
        })
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

export {
    generateDemo,
    generateWebsite,
    getWebsiteById,
    changeWebsite,
    getAllWebsites,
    deployWebsite,
    getWebsiteBySlug,
    deleteWebsite
}