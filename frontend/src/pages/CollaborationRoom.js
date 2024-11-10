import './page-styles/CollaborationRoom.css';
import RoomChat from "../components/RoomChat";
import QuestionPanel from '../components/QuestionPanel';
import CodeEditor from '../components/CodeEditor';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from "react";
import { initializeSocket, leaveCollaborationRoom, sendOffer, sendAnswer, sendIceCandidate, listenForOffer, listenForAnswer, listenForIceCandidate } from '../api/collaborationApi';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';

export default function CollaborationRoom() {
    const location = useLocation();
    const { roomInfo } = location.state || {};
    const { user } = useAuth();
    const [isSocketConnected, setIsSocketConnected] = useState(false);
    const [open, setOpen] = useState(false);
    const [partnerHasLeft, setPartnerHasLeft] = useState(false);
    const [showPartnerHasLeftDialog, setShowPartnerHasLeftDialog] = useState(false);
    const [peerConnection, setPeerConnection] = useState(null);
    const [isCalling, setIsCalling] = useState(false);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [code, setCode] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    function handleQuit() {
        setOpen(false);
        leaveCollaborationRoom(roomInfo._id, user.id);
        navigate("/home");
    }

    useEffect(() => {
        if (roomInfo && user) {
            initializeSocket(user.id, roomInfo._id, setPartnerHasLeft, setCode, setMessages, setLoading)
            .then(() => 
                {
                    setIsSocketConnected(true);
                    setupWebRTC();
                    setupSignalingListeners();
                })
            .catch((error) => {
                console.error('Error initializing socket:', error.message);
            });
        }
        
        return () =>  { 
            if (peerConnection) peerConnection.close();
            if (roomInfo && user) leaveCollaborationRoom(roomInfo._id, user.id);
        };
    }, [roomInfo, user]);

    useEffect(() => {
        if (partnerHasLeft) {
            setShowPartnerHasLeftDialog(true);
        }
    }, [partnerHasLeft]);

    const setupWebRTC = async () => {
        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'turn:numb.viagenie.ca', credential: 'muazkh', username: 'webrtc@live.com' }
            ]
        });
        setPeerConnection(pc);

        const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideoRef.current.srcObject = localStream;
        localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

        pc.ontrack = (event) => {
            remoteVideoRef.current.srcObject = event.streams[0];
        };

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                sendIceCandidate(roomInfo._id, event.candidate);
            }
        };
    };

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

    const handleStartCall = async () => {
        setIsCalling(true);
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        sendOffer(roomInfo._id, offer);
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
                <CodeEditor roomId={roomInfo._id} code={code} setCode={setCode} />
            </div>
            <div className='room-chat'>
                <div className='video-chat-container'>
                    <div className='videos-container'>
                        <video ref={localVideoRef} autoPlay muted className='video'/>
                        <video ref={remoteVideoRef} autoPlay className='video' />
                    </div>
                    <button onClick={handleStartCall} disabled={isCalling}>
                        {isCalling ? 'Calling...' : 'Start Call'}
                    </button>
                </div>
                <div className='text-chat-container'>
                    <RoomChat userId={user.id} roomId={roomInfo._id} messages={messages} peerConnection={peerConnection} /> 
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
