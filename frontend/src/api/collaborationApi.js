import io from 'socket.io-client';

let socket;

const COLLABORATION_SERVICE_URL = 'http://localhost:3004';

export const initializeSocket = (userId, roomId, setPartnerHasLeft, setCode, setMessages) => {
    if (!userId) {
        throw new Error('User ID is required to initialize the socket connection');
    }

    socket = io(COLLABORATION_SERVICE_URL, {
        query: { id: userId },
        transports: ['websocket', 'polling'],
        withCredentials: true,
    })

    socket.on('connect', () => {
        console.log(`Connected to collaboration service for user ${userId} in room ${roomId}`);
        socket.emit('join-room', roomId, userId);
    })

    socket.on('connect_error', (error) => {
        console.error('Connection error:', error.message);
    });
    
    socket.on('disconnect', () => {
        console.log(`Disconnected from matching service for user ${userId}`);
    });

    socket.on("user-left", (leftId) => {
        if (leftId != userId) {
            setPartnerHasLeft(true);
        }
    })

    socket.on("read-code", (code) => {
        setCode(code);
    })

    socket.on('receive-message', (message) => {
        setMessages(prev => [...prev, message]);
    });

    return new Promise((resolve, reject) => {
        socket.on('connect', () => resolve(socket));
        socket.on('connect_error', (error) => reject(error));
    })
}

export const writeCode = (roomId, code) => {
    socket.emit("write-code", roomId, code);
}

export const sendMessage = (roomId, userId, message) => {
    if (!socket || !socket.connected) {
        throw new Error('Socket not connected. Please initialize first.');
    }

    socket.emit('message', userId, roomId, message);
}

// Video chat-related functions

export const sendOffer = (roomId, offer) => {
    if (!socket || !socket.connected) {
        throw new Error('Socket not connected. Please initialize first.');
    }

    socket.emit('offer', { roomId, offer });
};

export const sendAnswer = (roomId, answer) => {
    if (!socket || !socket.connected) {
        throw new Error('Socket not connected. Please initialize first.');
    }

    socket.emit('answer', { roomId, answer });
};

export const sendIceCandidate = (roomId, candidate) => {
    if (!socket || !socket.connected) {
        throw new Error('Socket not connected. Please initialize first.');
    }

    socket.emit('ice-candidate', { roomId, candidate });
};

// Listeners for WebRTC signaling
export const listenForOffer = (onOfferReceived) => {
    if (!socket || !socket.connected) {
        throw new Error('Socket not connected. Please initialize first.');
    }

    socket.on('offer', onOfferReceived);
};

export const listenForAnswer = (onAnswerReceived) => {
    if (!socket || !socket.connected) {
        throw new Error('Socket not connected. Please initialize first.');
    }

    socket.on('answer', onAnswerReceived);
};

export const listenForIceCandidate = (onCandidateReceived) => {
    if (!socket || !socket.connected) {
        throw new Error('Socket not connected. Please initialize first.');
    }

    socket.on('ice-candidate', onCandidateReceived);
};

export const leaveCollaborationRoom = (roomId, userId) => {
    if (socket && socket.connected) {
        socket.emit('leave-room', roomId, userId); // Notify the server that the user is leaving the room
        socket.disconnect();
    }
};

export const closeSocket = () => {
    if (socket) socket.disconnect();
  };