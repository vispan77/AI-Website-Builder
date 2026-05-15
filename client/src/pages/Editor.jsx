import React, { use, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../service/api';
import Header from '../components/Header';
import Chat from '../components/Chat';
import { Code2, Monitor, Rocket } from 'lucide-react';

function Editor() {
    const { id } = useParams();
    const [website, setWebsite] = useState(null);
    const [code, setCode] = useState("");
    const [message, setMessage] = useState([]);
    const [prompt, setPrompt] = useState("");
    const [error, setError] = useState("");
    const iframRef = useRef(null);

    
    const handleUpdate = async() => {
        setMessage((previosMessage) => [...previosMessage, {role: "user", content: prompt}])
        try {
            const result = await api.put(`/website/update/${id}`, {prompt});
            setMessage((previosMessage) => [...previosMessage, {role: "ai", content: result.data.data.message}]);
            setCode(result.data.data.code);

        } catch (error) {
            console.log(error);
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
    }, [website]);


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
            <aside className='hidden md:flex w-[350px] flex-col border-r
             border-white/10 bg-black/80'
            >
                <Header website={website} />
                <Chat
                    website={website}
                    message={message}
                    setPrompt={setPrompt}
                    prompt={prompt}
                    handleUpdate={handleUpdate}
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
                        <button className='p-2 border border-white/10 rounded-lg bg-white/10
                         hover:bg-white/20 hover:scale-105 transition cursor-pointer'
                        >
                            <Code2 size={18} />
                        </button>
                        <button className='p-2 border border-white/10 rounded-lg
                         bg-white/10 hover:bg-white/20 hover:scale-105 transition cursor-pointer'
                        >
                            <Monitor size={18} />
                        </button>
                    </div>

                </div>

                <iframe ref={iframRef} className='flex-1 w-full bg-white' />

            </div>
        </div>
    )
}

export default Editor
