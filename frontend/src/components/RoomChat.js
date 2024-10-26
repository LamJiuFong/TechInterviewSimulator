import './component-styles/RoomChat.css'
import React, { useState } from 'react'
import SendIcon from '@mui/icons-material/Send';

export default function RoomChat({userId, roomId}) {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const handleSendMessage = () => {
        console.log('Sending message:', input);
        setInput('');
    }

  return (
    <div className='chat-container'>
        <div className='messages'>
            Messages here
        </div>
        <div className='input'>
            <input
                type='text'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Type a message...'
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>
                <SendIcon />
            </button>
        </div>
    </div>
  )
}
