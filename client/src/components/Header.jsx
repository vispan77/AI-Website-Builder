import { X } from 'lucide-react'
import React from 'react'

function Header({ website, showChat, setShowChat}) {
    return (
        <div className='h-14 py-5 px-4 flex items-center justify-between border-b border-white/10'>
            <span className="font-semibold truncate">
                {website.title}
            </span>
            <button onClick={() => setShowChat(false)} className='lg:hidden cursor-pointer'>
                <X size={18}/>
            </button>
        </div>
    )
}

export default Header
