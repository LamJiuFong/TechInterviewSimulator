import mongoose from 'mongoose';

const { Schema } = mongoose;

const roomSchema = new Schema({
    created_at: { 
        type: Date, 
        default: Date.now  // Automatically set when the room is created
    },
    is_active: { 
        type: Boolean, 
        default: true  // Room is active by default
    },
    participants: [String],
    created_at: { 
        type: Date, 
        default: Date.now  // Automatically set when the room is created
    },
    is_active: { 
        type: Boolean, 
        default: true  // Room is active by default
    },
    participants: [String],
    question: {
        category: {
            type: String,
            required: true
        },
        difficulty: {
            type: String,
            required: true
        }
    }
});

export const Room = mongoose.model('Room', roomSchema);
