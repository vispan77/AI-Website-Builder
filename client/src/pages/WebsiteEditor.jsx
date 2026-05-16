import React, { use, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../service/api';
import Header from '../components/Header';
import Chat from '../components/Chat';
import { Code2, MessageSquare, Monitor, Rocket, X } from 'lucide-react';
import { AnimatePresence, easeIn, easeInOut, motion } from "motion/react";
import Editor from '@monaco-editor/react';

function WebsiteEditor() {
    const { id } = useParams();
    const [website, setWebsite] = useState(null);
    const [code, setCode] = useState("");
    const [message, setMessage] = useState([]);
    const [prompt, setPrompt] = useState("");
    const [error, setError] = useState("");
    const iframRef = useRef(null);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [thinkingIndex, setThinkingIndex] = useState(0);
    const [showFullPreview, setShowFullPreview] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const thinkingSteps = [
        "Understanding your request…",
        "Planning layout changes…",
        "Improving responsiveness…",
        "Applying animations…",
        "Finalizing update…",
    ]
    const [showCode, setShowCode] = useState(false);

    const handleUdateLoading = async => {
        if (!updateLoading) {
            return;
        }
        const index = setInterval(() => {
            setThinkingIndex((index) => (index + 1) % thinkingSteps.length);
        }, 1200);

        return () => clearInterval(index);
    }


    const handleUpdate = async () => {
        if (!prompt) {
            return;
        }

        const text = prompt;
        console.log(text)
        setPrompt("");
        setUpdateLoading(true)
        setMessage((previosMessage) => [...previosMessage, { role: "user", content: text }])
        try {
            const result = await api.put(`/website/update/${id}`, { prompt: text });
            setUpdateLoading(false);
            setMessage((previosMessage) => [...previosMessage, { role: "ai", content: result.data.data.message }]);
            setCode(result.data.data.code);

        } catch (error) {
            console.log(error);
            setUpdateLoading(false);
            setError(error.response?.data?.message || "An error occurred while updating");
        }
    }

    const getWebsiteById = async () => {
        try {
            const result = await api.get(`/website/get-by-id/${id}`);
            console.log("result of the websitte", result.data.data);
            setWebsite(result.data.data);
            setCode(result.data.data.latestCode);
            setMessage(result.data.data.conversation)
        } catch (error) {
            console.log(error)
            setError(error.response.data.message);
        }
    }

    useEffect(() => {
        getWebsiteById();
    }, [id]);



    const showWebsite = () => {
        if (!iframRef.current || !code) {
            return;
        }

        const blob = new Blob([code], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        iframRef.current.src = url;
        URL.revokeObjectURL(url);
        return;
    }

    useEffect(() => {
        if (code) {
            showWebsite();
        }
    }, [code]);

    useEffect(() => {
        handleUdateLoading();
    }, [updateLoading])


    if (error) {
        return (
            <div className='h-screen flex items-center justify-center bg-black text-red-400'>
                {error}
            </div>
        )
    }

    if (!website) {
        return (
            <div className='h-screen flex items-center justify-center bg-black text-white'>
                Loading...
            </div>
        )
    }
    return (
        <div className='h-screen w-screen flex bg-black text-white overflow-hidden'>
            <aside className='hidden md:flex w-[380px] flex-col border-r
             border-white/10 bg-black/80'
            >
                <Header website={website}
                    showChat={showChat}
                    setShowChat={setShowChat}
                />
                <Chat
                    website={website}
                    message={message}
                    setPrompt={setPrompt}
                    prompt={prompt}
                    handleUpdate={handleUpdate}
                    handleUdateLoading={handleUdateLoading}
                    updateLoading={updateLoading}
                    thinkingSteps={thinkingSteps}
                    thinkingIndex={thinkingIndex}
                />
            </aside>
            <div className='flex-1 flex flex-col'>
                <div className='h-14 px-4 flex justify-between items-center border-b
                 border-white/10 bg-black/80'>
                    <span className='text-sx text-zinc-400'>Live Preview</span>
                    <div className='flex gap-2'>
                        <button className='flex items-center gap-2 px-4 py-1.5 rounded-lg
                        bg-linear-to-r from-indigo-500 to-purple-500 text-sm font-semibold
                        hover:scale-105 transition cursor-pointer'>
                            <Rocket size={14} /> Deploy
                        </button>
                        <button onClick={() => setShowChat(true)}
                            className='p-2 lg:hidden border border-white/10 rounded-lg bg-white/10
                         hover:bg-white/20 hover:scale-105 transition cursor-pointer'>
                            <MessageSquare size={18} />
                        </button>
                        <button onClick={() => setShowCode(true)}
                            className='p-2 border border-white/10 rounded-lg bg-white/10
                         hover:bg-white/20 hover:scale-105 transition cursor-pointer'
                        >
                            <Code2 size={18} />
                        </button>
                        <button onClick={() => setShowFullPreview(true)}
                            className='p-2 border border-white/10 rounded-lg
                         bg-white/10 hover:bg-white/20 hover:scale-105 transition cursor-pointer'
                        >
                            <Monitor size={18} />
                        </button>
                    </div>

                </div>

                <iframe ref={iframRef} className='flex-1 w-full bg-white' />

            </div>

            <AnimatePresence>
                {showChat && (
                    <motion.div
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        transition={{delay:0.1, animation:easeInOut}}
                        className='fixed inset-0 z-[9999] bg-black flex flex-col'
                    >
                        <Header website={website}
                            showChat={showChat}
                            setShowChat={setShowChat}
                        />
                        <Chat
                            website={website}
                            message={message}
                            setPrompt={setPrompt}
                            prompt={prompt}
                            handleUpdate={handleUpdate}
                            handleUdateLoading={handleUdateLoading}
                            updateLoading={updateLoading}
                            thinkingSteps={thinkingSteps}
                            thinkingIndex={thinkingIndex}
                        />

                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {
                    showCode && (
                        <motion.div
                            initial={{ x: "100%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "100%", opacity: 0 }}
                            transition={{ delay: 0.3, animation: easeInOut }}
                            className='fixed inset-y-0 right-0 w-full lg:w-[45%] z-[9999]
                        bg-[#1e1e1e] flex flex-col'
                        >
                            <div className='h-12 px-4 flex item-center justify-between border-b
                            border-white/10 bg-[#1e1e1e]'>
                                <span className='text-sm font-medium'>index.html</span>
                                <button onClick={() => setShowCode(false)}
                                    className='cursor-pointer hover:scale-105'>
                                    <X size={18} />
                                </button>
                            </div>
                            <Editor
                                theme='vs-dark'
                                language='html'
                                value={code}
                                onChange={(v) => setCode(v)}
                            />

                        </motion.div>
                    )
                }
            </AnimatePresence>

            <AnimatePresence>
                {showFullPreview && (
                    <motion.div className='fixed inset-0 z-[9999] bg-black'>
                        <iframe srcDoc={code} className='w-full h-full bg-white' />
                        <button onClick={() => setShowFullPreview(false)}
                            className='absolute top-4 right-4 p-2 bg-black/70 rounded-lg cursor-pointer'>
                            <X />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )
}

export default WebsiteEditor
