import './page-styles/CollaborationRoom.css';
import RoomChat from "../components/RoomChat";
import QuestionPanel from '../components/QuestionPanel';
import CodeEditor from '../components/CodeEditor';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from "react";
import { initializeSocket, leaveCollaborationRoom, sendAnswer, sendIceCandidate, listenForOffer, listenForAnswer, listenForIceCandidate } from '../api/collaborationApi';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';

export default function CollaborationRoom() {
    const location = useLocation();
    const { roomInfo } = location.state || {};
    const { user, loading: userLoading } = useAuth();
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [open, setOpen] = useState(false);
    const [partnerHasLeft, setPartnerHasLeft] = useState(false);
    const [showPartnerHasLeftDialog, setShowPartnerHasLeftDialog] = useState(false);
    const [peerConnection, setPeerConnection] = useState(null);
    const [code, setCode] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState(71); // Default to Python
    const [codeRunning, setCodeRunning] = useState(false);
    const [status, setStatus] = useState(null);
    const [stdout, setStdout] = useState(null);
    const [stderr, setStderr] = useState(null);

    const navigate = useNavigate();

    function handleQuit() {
        setOpen(false);
        leaveCollaborationRoom(roomInfo._id, user.id);
        navigate("/home");
    }

    useEffect(() => {
        if (roomInfo && !userLoading && user) {
            initializeSocket(
              user.id,
              roomInfo._id,
              setPartnerHasLeft,
              setCode,
              setMessages,
              setLoading,
              setLanguage,
              setCodeRunning,
              setStatus,
              setStdout,
              setStderr
            )
              .then(() => {
                setIsSocketConnected(true);
                setupSignalingListeners();
              })
              .catch((error) => {
                console.error("Error initializing socket:", error.message);
              });
        }

        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = 'Are you sure you want to leave?';

          };
      
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
        
    }, [roomInfo, user, userLoading]);

    useEffect(() => {
        if (partnerHasLeft) {
            setShowPartnerHasLeftDialog(true);
        }
    }, [partnerHasLeft]);


    const setupSignalingListeners = () => {
        listenForOffer(async (data) => {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            sendAnswer(roomInfo._id, answer);
        });

        listenForAnswer(async (data) => {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
        });

        listenForIceCandidate(async (data) => {
            try {
                await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
            } catch (error) {
                console.error("Error adding ICE candidate", error);
            }
        });
    };

    return (
        <div className='collaboration-room'>
        {loading && 
        <Dialog open={true}>
            <DialogTitle>Loading....</DialogTitle>
        </Dialog>
        }
        {roomInfo && user && isSocketConnected && !loading &&
            <>
            <div className='question-panel'>
                <QuestionPanel category={roomInfo.question.category} difficulty={roomInfo.question.difficulty} />
            </div>
            <div className='code-editor'>
                <CodeEditor 
                    roomId={roomInfo._id} 
                    code={code} 
                    setCode={setCode} 
                    language={language} 
                    setLanguage={setLanguage} 
                    codeRunning={codeRunning} 
                    status={status}
                    setStatus={setStatus}
                    stdout={stdout}
                    setStdout={setStdout}
                    stderr={stderr}
                    setStderr={setStderr}
                />
            </div>
            <div className='room-chat'>
                <div className='text-chat-container'>
                    <RoomChat userId={user.id} roomId={roomInfo._id} messages={messages} peerConnection={peerConnection}/> 
                </div>
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
