import mongoose from 'mongoose';

const { Schema } = mongoose;

// Schema to represent example present in a question
const questionExampleSchema = new Schema({
    input: {type:String, required:true},
    output: {type:String, required:true}
});

// Schema to represent question category (e.g. DP, Array, Divide&Conquer etc.)
const questionCategorySchema = new Schema({
    sortCode : {type:Number, required:true},
    name: {type:String, required:true, unique:true}
});

export const QuestionCategory = mongoose.model('QuestionCategory', questionCategorySchema, "questioncategories");

// Schema to represent Question, Question can be queried w/ categories or/and difficulty.
const questionSchema = new Schema({
    title:{type: String, required: true, unique:true},
    description:{type: String, required:true},
    hints:[{type:String}],
    difficulty:{type: String, required:true}, // Easy, Medium, Difficult
    categories:[{type: String, required:true}],
    link:{type: String, required:true}, 
    examples: [questionExampleSchema]
});

export const Question = mongoose.model('Question', questionSchema, "questions");