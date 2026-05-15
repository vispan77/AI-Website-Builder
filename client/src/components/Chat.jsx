import { Send } from 'lucide-react'
import React, { useState } from 'react'

function Chat({ website, message, setPrompt, prompt, handleUpdate }) {



    return (
        <>
            <div className='flex-1 overflow-y-auto px-4 py-4 space-y-4'>
                {
                    message?.map((message, index) => (
                        <div key={index}
                            className={`max-w-[85%] ${message.role === "user" ? "ml-auto" : "mr-auto"}`}
                        >
                            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                    ${message.role === "user" ? "bg-white text-black" :
                                    "bg-white/5 border border-white/10 text-zinc-200"}`}>
                                {message.content}
                            </div>


                        </div>
                    ))
                }

            </div>

            <div className='p-3 border-t border-white/10'>
                <div className='flex gap-2'>
                    <textarea
                        placeholder='Describe Changes...'
                        rows={1}
                        onChange={(event) => setPrompt(event.target.value)}
                        value={prompt}
                        className='flex-1 outline-none resize-none px-4 py-3 rounded-2xl
                             bg-white/5 border border-white/10 text-sm'></textarea>
                    <button
                        onClick={handleUpdate}
                        lassName='px-4 py-3 rounded-2xl bg-white text-black'>
                        <Send size={14} />
                    </button>

                </div>

            </div>
        </>

    )
}

export default Chat
