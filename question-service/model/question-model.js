import mongoose from 'mongoose';

const {Schema} = mongoose;

const questionExampleSchema = new Schema({
    input: {type:String, required:true},
    output:{type:String, required:true}
});

// Define the question schema
const questionSchema = new Schema({
    title:{type: String, required: true},
    description:{type: String, required:true},
    hint:{type:String},
    difficulty:{type:String, required:true},
    tags: {type:[String]},
    examples: [questionExampleSchema]
});

export default mongoose.model('Question', questionSchema);


// Export the model as default
