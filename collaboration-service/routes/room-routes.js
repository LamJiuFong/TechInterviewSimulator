// routes/RoomRoutes.js
import { Router } from 'express';
import RoomController from '../controllers/room-controller.js';

const router = Router();

// Route to create a new room
router.post('/rooms', RoomController.createRoom);

// Route to get a room by ID
router.get('/rooms/:id', RoomController.getRoomById);

// Route to get all active rooms
router.get('/rooms', RoomController.getActiveRooms);

// Route to add a user to a room
router.post('/rooms/:id/add-user', RoomController.addUserToRoom);

// Route to remove a user from a room
router.post('/rooms/:id/remove-user', RoomController.removeUserFromRoom);

// Route to archive a room
router.post('/rooms/:id/archive', RoomController.archiveRoom);

export default router;
