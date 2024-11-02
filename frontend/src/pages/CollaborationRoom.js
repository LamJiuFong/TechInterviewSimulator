import './page-styles/CollaborationRoom.css';
import RoomChat from "../components/RoomChat";
import QuestionPanel from '../components/QuestionPanel';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CollaborationRoom() {
    const location = useLocation();
    const { roomInfo } = location.state || {};
    const { user } = useAuth();
    console.log(roomInfo);

    return (
        <div className='collaboration-room'>
            {roomInfo && user.id &&
            <>
            <div className='question-panel'>
                <QuestionPanel category={roomInfo.question.category} difficulty={roomInfo.question.difficulty} />
            </div>
            
            <div className='room-chat'>
                <RoomChat userId={user.id} roomId={roomInfo._id}/> 
            </div>
            </>
        }
        </div>
    );
}
