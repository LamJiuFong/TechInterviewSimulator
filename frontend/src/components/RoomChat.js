import './component-styles/RoomChat.css'
import React, { useEffect, useState } from 'react'
import SendIcon from '@mui/icons-material/Send';
import { initializeSocket, sendMessage, listenForMessages, leaveCollaborationRoom } from '../api/collaborationApi';
import VideoChat from './VideoChat';

export default function RoomChat({userId, roomId}) {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        initializeSocket(userId, roomId)
            .then((socket) => {
                console.log('Socket initialized:', socket);
                listenForMessages((message) => {
                    console.log('Received message:', message);
                    setMessages((prevMessages) => [...prevMessages, message]);
                });
            })
            .catch((error) => {
                console.error('Error initializing socket:', error.message);
            });

        return () => {
            console.log('Leaving room:', roomId);
            leaveCollaborationRoom(roomId, userId);
        }
    }, [userId, roomId]);

    const handleSendMessage = () => {
        if (!input.trim()) return;
        sendMessage(roomId, userId, input);

        setMessages((prevMessages) => [
            ...prevMessages, 
            { sender: userId, content: input, timestamp: new Date().toISOString() }
        ])
        setInput('');
    }

  return (
    <div className='communications'>
        <div className='chat-container'>
            <div className='messages'>
                {messages.map((msg, index) => {
                    return (
                        <div key={index} className={msg.sender === userId ? 'You' : 'Partner'}>
                            <strong>{msg.sender === userId ? 'You' : 'Partner'}:</strong> {msg.content}{msg.content}
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
