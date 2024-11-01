import './page-styles/CollaborationRoom.css';
import RoomChat from "../components/RoomChat";
import QuestionPanel from '../components/QuestionPanel';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CollaborationRoom() {
    const location = useLocation();
    const { roomInfo } = location.state || {};
    const { user } = useAuth();

    return (
        <div className='collaboration-room'>
            <div className='question-panel'>
                <QuestionPanel/>
            </div>
            
            <div className='room-chat'>
                {(roomInfo && user) ? (
                    <RoomChat userId={user.id} roomId={roomInfo._id}/> 
                ) : (
                    <p>Loading Chatroom...</p>
                )}
            </div>
        </div>
    );
}
