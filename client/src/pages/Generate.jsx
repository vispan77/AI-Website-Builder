import { ArrowLeft } from 'lucide-react';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { motion } from "motion/react"
import { useState } from 'react';
import api from '../service/api';

function Generate() {
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [error, setError] = useState("");
    const PHASES = [
        "Analyzing your idea…",
        "Designing layout & structure…",
        "Writing HTML & CSS…",
        "Adding animations & interactions…",
        "Final quality checks…",
    ];

    const handleGenerateWebsite = async () => {
        setLoading(true);
        try {
            const result = await api.post("/website/generate", { prompt });
            setLoading(false);
            setProgress(100);
            navigate(`/editor/${result.data.websiteId}`)
            console.log("response from the backend from open router", result.data);
        } catch (error) {
            console.log(error);
            setError(error.response.data.message || "Something went wrong");
            setLoading(false);
        }
    };

    const handleProgress = async () => {
        if (!loading) {
            setProgress(0);
            setPhaseIndex(0);
            return;
        }

        let value = 0;
        let phase = 0;

        const interval = setInterval(() => {
            const increment = value < 20 ? Math.random() * 1.5 : value < 60 ? Math.random() * 1.2 :
                Math.random() * 0.6;

            value += increment;

            if (value >= 93) {
                value = 93
            }

            phase = Math.min(Math.floor((value / 100) * PHASES.length), PHASES.length - 1);

            setProgress(Math.floor(value));
            setPhaseIndex(phase);

        }, 1200)

        return () => clearInterval(interval);
    }

    useEffect(() => {
        handleProgress();
    }, [loading])

    return (
        <div className='min-h-screen bg-linear-to-br from-[#050505] 
           via-[#0b0b0b] to-[#050505] text-white'>
            <div className='sticky top-0 z-50 backdrop-blur-xl bg-black/50 border-b border-white/10'>
                <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <button onClick={() => navigate("/dashboard")}
                            className='p-2 rounded-lg hover:bg-white/10 transition'
                        >
                            <ArrowLeft size={16} />
                        </button>
                        <h1 className='text-lg font-semibold'>
                            Genweb<span className='text-zinc-400'>.ai</span>
                        </h1>
                    </div>

                </div>
            </div>

            <div className='max-w-6xl mx-auto px-6 py-16'>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='mb-16 text-center'
                >
                    <h1 className='text-4xl md:text-5xl mb-5 font-bold leading-tight'>
                        Build Website with
                        <span className='block bg-linear-to-r from-white to-zinc-400
                        bg-clip-text text-transparent'>
                            Real AI Power
                        </span>
                    </h1>
                    <p className='text-zinc-400 max-w-2xl mx-auto'>
                        This process may take serveral minutes.
                        Genweb.ai focuses on quality, not shortcuts.
                    </p>
                </motion.div>

                <div className='mb-14'>
                    <h1 className='text-xl font-semibold mb-5 ml-3'>Describe your website</h1>
                    <div className='relative'>
                        <textarea
                            onChange={(event) => setPrompt(event.target.value)}
                            value={prompt}
                            placeholder='Deacribe your website in details...'
                            className='w-full h-56 p-6 rounded-3xl bg-black/60
                            border border-white/10 outline-none resize-none text-sm leading-relaxed
                            focus:ring-2 focus:ring-white/20 transition'
                        />
                    </div>
                    {
                        error && (
                            <p className='mt-4 text-24 text-red-400'>
                                {error}
                            </p>
                        )
                    }
                </div>

                <div className='flex text-center justify-center'>
                    <motion.button
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={!prompt.trim() && loading}
                        className={`px-14 py-4 rounded-2xl text-lg font-semibold
                         ${prompt.trim() && !loading ? "bg-white text-black" :
                                "bg-white/20 text-zinc-400 cursor-not-allowed"}`}
                        onClick={handleGenerateWebsite}
                    >
                        Generate Website
                    </motion.button>

                </div>

                {
                    loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='max-w-xl mx-auto mt-12'
                        >
                            <div className='flex justify-between mt-2 text-sm text-zinc-400'>
                                <span>{PHASES[phaseIndex]}</span>
                                <span>{progress} %</span>
                            </div>

                            <div className='h-2 w-full bg-white/10 rounded-full overflow-hidden mt-2'>
                                <motion.div
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.8, ease: "easeInOut"}}
                                className='h-full bg-linear-to-r from-bg-white to-zinc-300 rounded-full'
                                />      
                            </div>

                            <div className='text-center text-sm text-zinc-400 mt-4'>
                                Estimate time ramainning {" "}
                                <span className='text-white font-medium'>
                                    ~8-12 minutes
                                </span>

                            </div>

                        </motion.div>
                    )
                }

            </div>


        </div>
    )
}

export default Generate
