import { ArrowLeft, Check, Rocket, Share2, Trash } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { delay, motion } from "motion/react"
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import api from '../service/api';
import toast from 'react-hot-toast';

function Dashboard() {
    const navigate = useNavigate();
    const { userData } = useSelector((state) => state.user);
    const [website, setWebsite] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [copiedId, setCopiedId] = useState(null);

    const fetchAllWebsites = async () => {
        setLoading(true);
        try {
            const result = await api.get("/website/get-all");
            setLoading(false);
            setWebsite(result.data.data);
            console.log(result.data.data);
        } catch (error) {
            console.log(error);
            setError(error.response.data.message);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAllWebsites()
    }, []);

    const handleDeploy = async (id) => {
        try {
            const result = await api.get(`/website/deploy/${id}`);
            console.log("result", result.data.url);
            window.open(result.data.url, "_blank");
            setWebsite((previosWebsite) => previosWebsite.map((web) =>
                web._id === id ? { ...web, deployed: true, deployUrl: result.data.url } : web
            ))
        } catch (error) {
            console.error("Error deploying website:", error);
        }
    }

    const handleCopy = async (web) => {
        await navigator.clipboard.writeText(web.deployUrl);
        setCopiedId(web._id);
        setTimeout(() => {
            setCopiedId(null);
        }, 2000);

    }

    const deleteWebsite = async (id) => {
        setLoading(true);
        try {
            await api.delete(`/website/delete/${id}`);
            // fetchAllWebsites();
            toast.success("Website deleted successfully");
            setWebsite((previousWebsite) => previousWebsite.filter((web) => web._id !== id))
            setLoading(false);
        } catch (error) {
            console.log(error);
            setError(error.response.data.message);
            setLoading(false);
        }
    }

    return (
        <div className='min-h-screen bg-[#050505] text-white'>
            <div className='sticky top-0 z-50 backdrop-blur-xl bg-black/50 border-b border-white/10'>
                <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <button onClick={() => navigate("/")}
                            className='p-2 rounded-lg hover:bg-white/10 transition'
                        >
                            <ArrowLeft size={16} />
                        </button>
                        <h1 className='text-lg font-semibold'>
                            Dashboard
                        </h1>
                    </div>

                    <button onClick={() => navigate("/generate")}
                        className='px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold
                      hover:scale-105 transition cursor-pointer animate-pulse'
                    >
                        + New Website
                    </button>

                </div>
            </div>

            <div className='max-w-7xl mx-auto px-6 py-10'>
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='mb-10'
                >
                    <p className='text-sm text-zinc-400 mb-1'>Welcome Back</p>
                    <h1 className='text-3xl font-bold'>{userData.name}</h1>
                </motion.div>
                {
                    loading && (
                        <div className='mt-24 text-center text-zinc-400'>
                            Loading your websites...
                        </div>
                    )
                }
                {
                    error && !loading && (
                        <div className='mt-24 text-center text-red-400'>
                            {error}
                        </div>
                    )
                }
                {
                    website.length == 0 && !loading && !error && (
                        <div className='mt-24 text-center text-zinc-400'>
                            You have no websites..
                        </div>
                    )
                }
                {
                    !loading && !error && website.length > 0 && (
                        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8'>
                            {
                                website.map((web, index) => {

                                    const copied = copiedId == web._id;
                                    return <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -6 }}

                                        className="rounded-2xl bg-white/5 hover:bg-white/10 
                                        border border-white/10 overflow-hidden transition 
                                        flex flex-col"

                                    >
                                        <div onClick={() => navigate(`/editor/${web._id}`)}
                                            className='relative h-40 bg-black cursor-pointer'>
                                            <iframe srcDoc={web.latestCode} className='absolute inset-0 w-[140%] h-[140%] 
                                            scale-[0.7] origin-top-left pointer-event-none bg-white'
                                            />
                                            <div className='absolute inset-0 bg-black/30'></div>

                                        </div>
                                        <div className='flex flex-col gap-4 p-5 flex-1'>
                                            <div className='flex items-center justify-between'>
                                                <h1 className='text-base font-semibold line-camp-2 truncate w-80'>
                                                    {web.title}
                                                </h1>
                                                <button
                                                    onClick={() => deleteWebsite(web._id)}
                                                    className='cursor-pointer'
                                                >
                                                    <Trash size={18} className='text-red-500' />
                                                </button>
                                            </div>

                                            <p className='text-sm text-zinc-400'>
                                                Last Updated {" "} {new Date(web.updatedAt).toLocaleDateString()}
                                            </p>


                                            {
                                                !web.deployed ? (
                                                    <button onClick={() => handleDeploy(web._id)}
                                                        className='mt-auto px-4 py-2 rounded-xl gap-2 flex items-center justify-center
                                                    text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 
                                                    transition hover:scale-105 cursor-pointer'>
                                                        <Rocket size={18} /> Deploy
                                                    </button>
                                                ) : (
                                                    <motion.button
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => handleCopy(web)}
                                                        className={`mt-auto flex items-center justify-center gap-2
                                                        px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer
                                                        ${copied ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                                                                "bg-white/10 hover:bg-white/20 border border-white/10"
                                                            } `}
                                                    >
                                                        {copied ? (
                                                            <>
                                                                <Check size={14} /> Link Copied
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Share2 size={14} /> Share Link
                                                            </>
                                                        )}
                                                    </motion.button>
                                                )
                                            }

                                        </div>

                                    </motion.div>
                                })
                            }

                        </div>
                    )
                }

            </div>

        </div>
    )
}

export default Dashboard
