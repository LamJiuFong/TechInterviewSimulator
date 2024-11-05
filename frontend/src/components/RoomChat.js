import './component-styles/RoomChat.css'
import React, { useEffect, useState } from 'react'
import SendIcon from '@mui/icons-material/Send';
import { sendMessage, listenForMessages, leaveCollaborationRoom } from '../api/collaborationApi';
import VideoChat from './VideoChat';

export default function RoomChat({userId, roomId, messages, setMessages}) {
    const [input, setInput] = useState('');

    const handleSendMessage = () => {
        if (!input || !input.trim()) return;
        sendMessage(roomId, userId, input);

        // setMessages((prevMessages) => [
        //     ...prevMessages, 
        //     { sender: userId, content: input, timestamp: new Date().toISOString() }
        // ])
        setInput('');
    }

  return (
    <div className='communications'>
        <div className='chat-container'>
            <div className='messages'>
                {messages.map((msg, index) => {
                    return (
                        <div
                        key={index}
                        className={`message ${msg.sender === userId ? 'message-you' : 'message-partner'}`}
                    >
                        <div className="message-content">
                            <strong>{msg.sender === userId ? 'You' : 'Partner'}:</strong> {msg.content}
                        </div>
                    </div>
                    )
                })}
            </div>
            <div className='input'>
                <input
                    type='text'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder='Type a message...'
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage}
                />
                <button onClick={handleSendMessage}>
                    <SendIcon />
                </button>
            </div>
        </div>
        {/* <VideoChat userId={userId} roomId={roomId} /> Commented out first due to some bugs - listens to socket before socket is connected */} 
    </div>
  )
}
