import React from 'react'

function Chat({website}) {
  return (
    <div className='flex-1 overflow-y-auto px-4 py-4 space-y-4'>
        {
            website.conversation?.map((message, index) => (
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
  )
}

export default Chat
