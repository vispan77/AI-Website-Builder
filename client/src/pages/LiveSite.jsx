import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../service/api';


function LiveSite() {
    const { slug } = useParams();
    console.log("slug", slug)
    const [html, setHtml] = useState("");
    const [error, setError] = useState("");

    const fetchWebsiteBySlug = async () => {
        try {
            const result = await api.get(`/website/get-by-slug/${slug}`);
            console.log(result.data)
            setHtml(result.data.data.latestCode);
        } catch (error) {
            console.log(error)
            setError(error.response.data.message || "An error occurred while fetching the website");
        }
    }

    useEffect(() => {
        fetchWebsiteBySlug();
    }, []);

    if (error) {
        <div className='h-screen flex items-center justify-center bg-black text-red-400'>
            {error}
        </div>
    }
    return (
        <div>

            <iframe
                title='Live Site'
                srcDoc={html} className='w-full h-screen bg-white'
                sandbox='allow-scripts allow-same-origin allow-forms'
            />

        </div>
    )
}

export default LiveSite
