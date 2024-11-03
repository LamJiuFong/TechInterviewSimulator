import './component-styles/VideoChat.css';
import React, { useEffect, useRef, useState } from 'react';
import { initializeSocket, sendOffer, sendAnswer, sendIceCandidate, listenForOffer, listenForAnswer, listenForIceCandidate } from '../api/collaborationApi';

export default function VideoChat({ roomId, userId }) {
    const [peerConnection, setPeerConnection] = useState(null);
    const [isCalling, setIsCalling] = useState(false);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    useEffect(() => {
        initializeSocket(userId, roomId).then(() => {
            setupWebRTC();
            setupSignalingListeners();
        });

        return () => {
            if (peerConnection) peerConnection.close();
        };
    }, [roomId, userId]);

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
                sendIceCandidate(roomId, event.candidate);
            }
        };
    };

    const setupSignalingListeners = () => {
        listenForOffer(async (data) => {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            sendAnswer(roomId, answer);
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
        sendOffer(roomId, offer);
    };

    return (
        <div className='video-chat-container'>
            <div className='video-chat'>
                <video ref={localVideoRef} autoPlay muted />
                <video ref={remoteVideoRef} autoPlay />
            </div>
            <button onClick={handleStartCall} disabled={isCalling}>
                {isCalling ? 'Calling...' : 'Start Call'}
            </button>
        </div>
    );
}
