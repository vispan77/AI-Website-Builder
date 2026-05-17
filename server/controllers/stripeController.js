import PLANS from "../config/plans.js";
import stripe from "../config/stripe.js";

const stripeCheckout = async (req, res) => {
    try {
        const { planType } = req.body;
        const userId = req.user._id;
        const plan = PLANS[planType];
        console.log(plan)

        if (!plan || plan.price == 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid plan type"
            })
        }

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: `Genweb.ai ${planType.toUpperCase()} Plan`
                        },
                        unit_amount: plan.price * 100
                    },
                    quantity: 1
                }
            ],
            metadata: {
                userId: userId.toString(),
                credits: plan.credits,
                plan: plan.plan
            },
            success_url: `${process.env.FRONTEND_URL}`,
            cancel_url: `${process.env.FRONTEND_URL}/pricing`
        })

        return res.status(200).json({
            success: true,
            sessionUrl: session.url
        })

    } catch (error) {
        console.error("Stripe Checkout Error:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating the checkout session"
        })
    }
}


export { stripeCheckout }