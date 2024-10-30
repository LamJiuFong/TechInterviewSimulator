import io from 'socket.io-client';

let socket;

export const initializeSocket = (userId) => {
  if (!userId) {
    throw new Error('User ID is required to initialize the socket connection');
  }

  socket = io('http://localhost:3006', {
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

export const enterMatch = (category, difficulty, setMatchFound, setTimeout) => {
  return new Promise((resolve, reject) => {
    if (!socket || !socket.connected) {
      reject(new Error('Socket not connected. Please initialize first.'));
      return;
    }
    setMatchFound(false);
    setTimeout(false);
    
    const criteria = { category, difficulty };
    socket.emit('enter-match', criteria);
    
    const handleMatchFound = (match) => {
      socket.off('match-found', handleMatchFound);
      setMatchFound(true);
      resolve(match);
    };

    const handleAccept = (acceptanceId) => {
      console.log("accepted!!!")
    }

    const handleReject = (acceptanceId) => {
      console.log("rejected!!! :(")
    }

    const handleTimeout = () => {
        setTimeout(true);
        console.log("Timeout!!!!!!!");
    }

    socket.on('match-found', handleMatchFound);
    socket.on('timeout', handleTimeout);
    socket.on('collaboration-accepted', handleAccept);
    socket.on('collaboration-rejected', handleReject);
  });
};

export const cancelMatch = () => {
  if (socket && socket.connected) {
    socket.emit('cancel-match');    
  }
};

export const acceptMatch = (acceptanceId) => {
  if (socket && socket.connected) {
    socket.emit('accept-match', acceptanceId);    
  }
};

export const rejectMatch = (acceptanceId) => {
  if (socket && socket.connected) {
    socket.emit('reject-match', acceptanceId);    
  }
};

export const closeSocket = () => {
  if (socket) socket.disconnect();
};