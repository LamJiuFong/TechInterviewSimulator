import io from 'socket.io-client';

let socket;

const MATCHING_SERVICE_URL = 
    process.env.ENV === "PROD"
        ? process.env.REACT_APP_MATCHING_SERVICE_URL
        : process.env.REACT_APP_MATCHING_SERVICE_LOCAL_URL;

export const initializeSocket = (userId) => {
  if (!userId) {
    throw new Error('User ID is required to initialize the socket connection');
  }

  socket = io(MATCHING_SERVICE_URL, {
    query: { id: userId },
    transports: ['websocket', 'polling'],
    withCredentials: true,
  });
  
  socket.on('connect', () => {
    console.log(`Connected to matching service for user ${userId}`);
  });

  socket.on('connect_error', (error) => {
    console.error('Connection error:', error.message);
  });

  socket.on('disconnect', () => {
    console.log(`Disconnected from matching service for user ${userId}`);
  });

  return new Promise((resolve, reject) => {
    socket.on('connect', () => resolve(socket));
    socket.on('connect_error', (error) => reject(error));
  });
};

export const enterMatch = (category, difficulty, setMatchFound, setTimeout, setRejected, setRequeue) => {
  return new Promise((resolve, reject) => {
    if (!socket || !socket.connected) {
      reject(new Error('Socket not connected. Please initialize first.'));
      return;
    }
    setMatchFound(false);
    setTimeout(false);
    setRejected(false);
    setRequeue(false);
    
    const criteria = { category, difficulty };
    socket.emit('enter-match', criteria);
    
    const handleMatchFound = (match) => {
      socket.off('match-found', handleMatchFound);
      setMatchFound(true);
      setRejected(false);
      setRequeue(false);
      resolve(match);
    };

    const handleTimeout = () => {
        setTimeout(true);
        console.log("Timeout!!!!!!!");
    }

    const handleReject = () => {
      setRejected(true);
      setMatchFound(false);
      setTimeout(false);
      console.log("Collaboration has been rejected ");
    };
  
    const handleRequeue = () => {
      setRequeue(true);
      setMatchFound(false);
      setTimeout(false);
      console.log("Requeueing user back to matchmaking");
    };

    socket.on('match-found', handleMatchFound);
    socket.on('timeout', handleTimeout);
  
    socket.on('collaboration-rejected', handleReject);

    socket.on('collaboration-rejected-requeue', handleRequeue);
    socket.on('collaboration-timeout-requeue', handleRequeue);

  });
};

export const cancelMatch = () => {
  if (socket && socket.connected) {
    socket.emit('cancel-match');    
  }
};

// accept match only handles collaboration accepted message given to met condition, both party have to accept first.
export const acceptMatch = (acceptanceId, setHasToWait, setIsCreatingRoom, setCreatedRoom) => {
  if (!socket || !socket.connected) {
    return;
  }
  socket.emit('accept-match', acceptanceId);
  setHasToWait(true);

  const handleAccept = () => {
    setHasToWait(false);
    setIsCreatingRoom(true);
  };
  
  const handleDoneCreatingRoom = (roomId) => {
    setCreatedRoom(roomId);
  };

  socket.on('collaboration-accepted', handleAccept);
  
  socket.on('created-room', handleDoneCreatingRoom);

};

export const rejectMatch = (acceptanceId) => {
  if (socket && socket.connected) {
    socket.emit('reject-match', acceptanceId);    
  }
};

export const closeSocket = () => {
  if (socket) socket.disconnect();
};