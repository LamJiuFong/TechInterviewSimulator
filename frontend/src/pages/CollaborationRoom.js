import './page-styles/CollaborationRoom.css';
import RoomChat from "../components/RoomChat";
import QuestionPanel from '../components/QuestionPanel';

export default function CollaborationRoom({userId, roomId}) {
    
    return (
        <div className='collaboration-room'>
            <div className='question-panel'>
                <QuestionPanel/>
            </div>
            <div className='room-chat'>
                <RoomChat userId={userId} roomId={roomId}/>
            </div>
        </div>
    );
}
