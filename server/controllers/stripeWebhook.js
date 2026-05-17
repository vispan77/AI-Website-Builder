import stripe from "../config/stripe.js";
import User from "../models/user.js";

const stripeWebhook = async (req, res) => {
    const signature = req.headers["stripe-signature"];
    let event;
    try {
        event = await stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        )
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while verifying the webhook"
        })
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const userId = session.metadata.userId;
        const credits = Number(session.metadata.credits);
        const plan = session.metadata.plan
    }

    await User.findByIdAndUpdate(
        userId, {
        $inc: { credits: credits },
        $set: { plan: plan }
    }
    )

    return res.status(200).json({
        success: true,
        received: true,
        message: "Webhook verified successfully"
    })

}

export { stripeWebhook }