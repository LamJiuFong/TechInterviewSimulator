import mongoose from 'mongoose';

// Define the question schema
const questionSchema = new mongoose.Schema({
    questionTitle: { type: String, required: true },
    questionDescription: String,
    questionCategory: String,
    questionComplexity: String
});

// Export the model as default
export default mongoose.model('Question', questionSchema);
