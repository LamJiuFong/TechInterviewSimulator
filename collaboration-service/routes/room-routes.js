// routes/RoomRoutes.js
import { Router } from 'express';
import { RoomController } from '../controllers/room-controller.js';

const router = Router();

// Route to create a new room
router.post('/rooms', RoomController.createRoom);

// Route to get a room by ID
router.get('/rooms/:id', RoomController.getRoomById);

// Route to get all active rooms
router.get('/rooms', RoomController.getActiveRooms);

export default router;
