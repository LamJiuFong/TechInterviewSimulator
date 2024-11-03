import axios from 'axios';
import "dotenv/config";

const COLLABORATION_SERVICE_URL = process.env.COLLABORATION_SERVICE_URL || 'http://localhost:3004/';

// Base configuration for the API
const API = axios.create({
    baseURL: COLLABORATION_SERVICE_URL, // Change to backend API URL if deployed
  });
  


export const createRoom = async (category, difficulty) => {

    try {
        const res = await API.post(`rooms`, {category: category, difficulty: difficulty});
        const roomInfo = res.data.room;
        return roomInfo;
    } catch (e) {
        console.log("Error creating room:", e);
        throw error;
    }
}