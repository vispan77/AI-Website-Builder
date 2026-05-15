import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../service/api';
import Header from '../components/Header';
import Chat from '../components/Chat';

function Editor() {
    const { id } = useParams();
    const [website, setWebsite] = useState(null);
    const [error, setError] = useState("");


    const getWebsiteById = async () => {
        try {
            const result = await api.get(`/website/get-by-id/${id}`);
            console.log("result of the websitte", result.data.data);
            setWebsite(result.data.data)
        } catch (error) {
            console.log(error)
            setError(error.response.data.message);
        }
    }

    useEffect(() => {
        getWebsiteById();
    }, [id]);

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
            <aside className='w-80 bg-[#0b0b0b] border-r border-white/10'
            >
                <Header website={website} />
                <Chat website={website} />
            </aside>
            <div className='flex-1 flex flex-col'>

            </div>
        </div>
    )
}

export default Editor
