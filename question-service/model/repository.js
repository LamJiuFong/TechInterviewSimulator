import "dotenv/config";
import { connect } from "mongoose";
import {Question, QuestionCategory} from "./question-model.js"

export async function connectToDB() {
    let mongoDBUri =
      process.env.ENV === "PROD"
        ? process.env.DB_CLOUD_URI
        : process.env.DB_LOCAL_URI;
  
    await connect(mongoDBUri);
  }

export async function createQuestionCategory(name, sortCode) {
  const category = await QuestionCategory.find({name:name})

  if (category.length != 0) {
    console.log("Question category exists.")
    return; 
  }

  const newCategory = new QuestionCategory({name, sortCode})
  
  return newCategory.save()
}

export async function deleteQuestionCategory(id) {
  return QuestionCategory.findByIdAndDelete(id)
}

export async function getAllQuestionCategories() {
  return QuestionCategory.find();
}

export async function createQuestion(title, description, difficulty, categories, examples, hint=null) {

  const question = await Question.find({title:title});

  console.log(question);

  if (question.length != 0) {
    console.log("Question Title exists.");
    return ;
  }

  const newQuestion = new Question({title, description, hint, difficulty, categories, examples})
  
  return newQuestion.save()
}

export async function deleteQuestionByID(id) {
  return Question.findByIdAndDelete(id);
}

export async function editQuestion(id, title=null, description=null, categories=null, examples=null, hint=null) {

  const question = await Question.findById(id);

  if (!question) {
    console.log("Question does not exist");
    return;
  }

  const fields = { title, description, categories, examples, hint };
  
  Object.keys(fields).forEach(key => {
    if (fields[key]) {
      question[key] = fields[key];
    }
  });

  return question.save()
}

export async function findQuestionById(id) {
  return Question.findById(id);
}

export async function getAllQuestion() {
  return Question.find();
}