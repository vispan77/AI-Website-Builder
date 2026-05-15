import React, { useState } from 'react'

function Open() {
    const [text, setText] = useState('');
    const maxtext = 100;

    const handleChange = (event) => {
        if(event.target.value.length <= maxtext){
            setText(event.target.value);
        }
    }
  return (
    <div>
      
    </div>
  )
}

export default Open
