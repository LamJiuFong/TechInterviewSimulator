import './page-styles/CollaborationRoom.css';
import RoomChat from "../components/RoomChat";
import QuestionPanel from '../components/QuestionPanel';
import CodeEditor from '../components/CodeEditor';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from "react";
import { initializeSocket, leaveCollaborationRoom } from '../api/collaborationApi';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';

export default function CollaborationRoom() {
    const location = useLocation();
    const { roomInfo } = location.state || {};
    const { user } = useAuth();
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [open, setOpen] = useState(false);
    const [partnerHasLeft, setPartnerHasLeft] = useState(false);
    const [showPartnerHasLeftDialog, setShowPartnerHasLeftDialog] = useState(false);
    const navigate = useNavigate();

    function handleQuit() {
        setOpen(false);
        leaveCollaborationRoom(roomInfo._id, user.id);
        navigate("/home");
    }

    useEffect(() => {
        if (roomInfo && user) {
            initializeSocket(user.id, roomInfo._id, setPartnerHasLeft)
            .then(() => setIsSocketConnected(true))
            .catch((error) => {
                console.error('Error initializing socket:', error.message);
            });
        }
    }, [roomInfo, user]);

    useEffect(() => {
        if (partnerHasLeft) {
            setShowPartnerHasLeftDialog(true);
        }
    }, [partnerHasLeft]);

    return (
        <div className='collaboration-room'>
        {roomInfo && user && isSocketConnected &&
            <>
            {console.log(isSocketConnected)}
            <div className='question-panel'>
                <QuestionPanel category={roomInfo.question.category} difficulty={roomInfo.question.difficulty} />
            </div>
            <div className='code-editor'>
                <CodeEditor roomId={roomInfo._id}/>
            </div>
            <div className='room-chat'>
                <RoomChat userId={user.id} roomId={roomInfo._id}/> 
            </div>
            <Button className='quit-btn' onClick={() => setOpen(true)}>
                Quit
            </Button>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
            >
                <DialogTitle>
                    Are you sure you want to quit?
                </DialogTitle>
                <DialogContent>
                <DialogContentText>
                    You cannot rejoin the session
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={() => setOpen(false)}>
                    Cancel
                </Button>
                <Button onClick={handleQuit}>
                    Confirm
                </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={showPartnerHasLeftDialog}>
                <DialogTitle>Your partner has left the room</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setShowPartnerHasLeftDialog(false)}>OK</Button>
                </DialogActions>
            </Dialog> 
            </>
        }   
        </div>
    );
}
