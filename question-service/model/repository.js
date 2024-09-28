import "dotenv/config";
import { connect } from "mongoose";
import { Question, QuestionCategory } from "./question-model.js"

export async function connectToDB() {
    let mongoDBUri =
      process.env.ENV === "PROD"
        ? process.env.DB_CLOUD_URI
        : process.env.DB_LOCAL_URI;
  
    await connect(mongoDBUri);
}

// maybe throw error
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

export async function getAllQuestions() {
  return Question.find();
}

export async function getQuestionById(id) {
  return Question.findById(id);
}

// update, added parameter: difficulty, added: check if updated title is still unique
export async function updateQuestionById(id, title=null, description=null, difficulty=null, categories=null, examples=null, hint=null) {

  const question = await Question.findById(id);

  if (!question) {
    console.log("Question does not exist");
    return;
  }

  const questionWithSameTitle = await Question.find({title:title});

  if (questionWithSameTitle.length != 0) {
    console.log("Question Title exists.");  // throw error maybe
    return ;
  }

  const fields = { title, description, difficulty, categories, examples, hint };
  
  Object.keys(fields).forEach(key => {
    if (fields[key]) {
      question[key] = fields[key];
    }
  });

  return question.save()
}

// delete
export async function deleteQuestionById(id) {
  return Question.findByIdAndDelete(id); // will throw error if question id is not found?
}


/** To be added later
  export async function findByTitle(title) {
    return questionModel.findOne({ questionTitle: title });
*/

// --------------------------------  Below is for question categories ---------------------------------------
export async function createQuestionCategory(name, sortCode) {
  const category = await QuestionCategory.find({name:name})

  if (category.length != 0) {
    console.log("Question category exists.")
    return; 
  }

  const newCategory = new QuestionCategory({name, sortCode})
  
  return newCategory.save()
}

export async function getAllQuestionCategories() {
  return QuestionCategory.find();
}

export async function deleteQuestionCategory(id) {
  return QuestionCategory.findByIdAndDelete(id)
}