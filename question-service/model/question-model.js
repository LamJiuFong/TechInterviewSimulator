import mongoose from 'mongoose';

// Define the question schema
const questionSchema = new mongoose.Schema({
    questionTitle: { 
        type: String, 
        required: true,
        unique: true 
    },
    questionDescription: {
        type: String,
        required: true
    },
    questionCategory: {
        type: String,
        required: true
    },
    questionComplexity: {
        type: String,
        required: true
    }
});

// Export the model as default
export default mongoose.model('questionModel', questionSchema);
