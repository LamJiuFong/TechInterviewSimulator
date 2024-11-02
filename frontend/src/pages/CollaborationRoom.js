import './page-styles/CollaborationRoom.css';
import RoomChat from "../components/RoomChat";
import QuestionPanel from '../components/QuestionPanel';
import CodeEditor from '../components/CodeEditor';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from "react";
import { initializeSocket } from '../api/collaborationApi';

export default function CollaborationRoom() {
    const location = useLocation();
    const { roomInfo } = location.state || {};
    const { user } = useAuth();
    const [isSocketConnected, setIsSocketConnected] = useState(false);

    useEffect(() => {
        if (roomInfo && user) {
            initializeSocket(user.id, roomInfo._id)
            .then(() => setIsSocketConnected(true))
            .catch((error) => {
                console.error('Error initializing socket:', error.message);
            });
        }
    }, [roomInfo, user]);

    return (
        <div className='collaboration-room'>
            {roomInfo && user && isSocketConnected &&
            <>
            <div className='question-panel'>
                <QuestionPanel category={roomInfo.question.category} difficulty={roomInfo.question.difficulty} />
            </div>
            <div className='code-editor'>
                <CodeEditor roomId={roomInfo._id}/>
            </div>
            {/* <div className='room-chat'>
                <RoomChat userId={user.id} roomId={roomInfo._id}/> 
            </div> */}
            </>
            }   
        </div>
    );
}
