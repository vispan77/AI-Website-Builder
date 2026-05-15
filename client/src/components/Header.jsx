import React from 'react'

function Header({ website }) {
    return (
        <div className='h-14 py-5 px-4 flex items-center justify-between border-b border-white/10'>
            <span className="font-semibold truncate">
                {website.title}
            </span>
        </div>
    )
}

export default Header
