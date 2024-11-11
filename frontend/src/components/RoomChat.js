import './component-styles/RoomChat.css'
import React, { useState, useEffect, useRef } from 'react'
import SendIcon from '@mui/icons-material/Send';
import { sendMessage} from '../api/collaborationApi';

export default function RoomChat({userId, roomId, messages}) {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const handleSendMessage = () => {
        if (!input || !input.trim()) return;
        sendMessage(roomId, userId, input);

        // setMessages((prevMessages) => [
        //     ...prevMessages, 
        //     { sender: userId, content: input, timestamp: new Date().toISOString() }
        // ])
        setInput('');
    }

    // Scroll to the bottom of the messages container when new messages are added
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

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
                            <strong>{msg.sender === userId ? 'You' : 'Partner'}:</strong>
                            <br/>
                            {msg.content}
                        </div>
                    </div>
                    )
                })}
                <div ref={messagesEndRef} />
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
    </div>
  )
}
