import { ArrowLeft, Check, Coins } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from "motion/react"


function Pricing() {
    const navigate = useNavigate();
    const plans = [
        {
            key: "free",
            name: "Free",
            price: "₹0",
            credits: 100,
            description: "Perfect to explore GenWeb.ai",
            features: [
                "AI website generation",
                "Responsive HTML output",
                "Basic animations",
            ],
            popular: false,
            button: "Get Started",
        },
        {
            key: "pro",
            name: "Pro",
            price: "₹499",
            credits: 500,
            description: "For serious creators & freelancers",
            features: [
                "Everything in Free",
                "Faster generation",
                "Edit & regenerate",
            ],
            popular: true,
            button: "Upgrade to Pro",
        },
        {
            key: "enterprise",
            name: "Enterprise",
            price: "₹1499",
            credits: 1000,
            description: "For teams & power users",
            features: [
                "Unlimited iterations",
                "Highest priority",
                "Team collaboration",
                "Dedicated support",
            ],
            popular: false,
            button: "Contact Sales",
        },
    ];
    return (
        <div className='relative min-h-screen overflow-hidden bg-[#050505] text-white px-6 py-16 pb-24'>
            <div className='absolute inset-0 pointer-events-none'>
                <div className='absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-600/20
                rounded-full blur-[120px]'/>
                <div className='absolute right-0 bottom-0 w-[400px] h-[400px] bg-purple-600/20
                rounded-full blur-[120px]'/>
            </div>
            <button onClick={() => navigate("/")}
                className='relative z-10 mb-8 flex items-center gap-2 text-sm text-zinc-400
                hover:text-white transition cursor-pointer'
            >
                <ArrowLeft size={14} /> Back
            </button>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='relative z-10 max-w-4xl mx-auto text-center mb-14'
            >
                <h1 className='text-4xl md:text-5xl font-bold mb-4'>
                    Simple, transparent Pricing
                </h1>
                <p className='text-zinc-400 text-lg'>
                    Buy credits once. Build anytime
                </p>

            </motion.div>

            <div className='relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8'>
                {
                    plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -12, scale: 1.03 }}
                            className={`relative rounded-3xl p-8 border backdrop-blur-xl transition-all
                            ${plan.popular ?
                                    "border-indigo-500 bg-gradient-to-b from-indigo-500/20 to-transparent shadow-2xl shadow-indigo-500/30" :
                                    "border-white/10 bg-white/5 hover:border-indigo-400 hover:bg-white/10"}`}
                        >
                            {
                                plan.popular && (
                                    <span className='absolute top-5 right-5 px-3 py-1 text-sm rounded-full
                                    bg-indigo-500'>
                                        Most Popular
                                    </span>
                                )
                            }
                            <h1 className='text-xl font-semibold mb-2'>
                                {plan.name}
                            </h1>
                            <p className='text-zinc-400 text-sm mb-6'>
                                {plan.description}
                            </p>
                            <div className='flex items-end gap-1 mb-4'>
                                <span className='text-4xl font-bold'>
                                    {plan.price}
                                </span>
                                <span className='text-sm text-zinc-400 mb-1'>
                                    / one-time
                                </span>
                            </div>
                            <div className='flex items-center gap-2 mb-8'>
                                <Coins size={18} className='text-yellow-400' />
                                <span className='font-semibold'>{plan.credits} Credits</span>
                            </div>
                            <ul className='space-y-3 mb-10'>
                                {
                                    plan.features.map((feature, index) => (
                                        <li
                                            key={index}
                                            className='flex item-center gap-2 text-sm text-zinc-400
                                        '>
                                            <Check size={16} className='text-green-400' />
                                            {feature}
                                        </li>
                                    ))
                                }
                            </ul>
                            <motion.button
                                whileTap={{ scale: 0.93 }}
                                className={`w-full py-3 rounded-xl font-semibold transition cursor-pointer
                                    ${plan.popular ?
                                        "bg-indigo-500 hover:bg-indigo-600" :
                                        "bg-white/10 hover:bg-white/20"
                                    } disabled:opacity-60`}
                            >
                                {plan.button}

                            </motion.button>

                        </motion.div>
                    ))
                }
            </div>

        </div>
    )
}

export default Pricing
