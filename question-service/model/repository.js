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
export async function createQuestion(title, description, difficulty, categories, examples, link, hints=null) {

  const question = await Question.find({title:title});

  if (question.length != 0) {
    console.log("Question Title exists.");
    throw new Error("Question Title exists");
  }

  const newQuestion = new Question({title, description, hints, difficulty, categories, link, examples})
  
  return newQuestion.save()
}

export async function getAllQuestions() {
  return Question.find();
}

export async function getQuestionById(id) {
  return Question.findById(id);
}

// update, added parameter: difficulty
export async function updateQuestionById(id, title=null, description=null, difficulty=null, categories=null, examples=null, hints=null, link=null) {

  try {
    const question = await Question.findById(id);
    if (!question) {
      console.log("Question does not exist");
      throw new Error("Question does not exists");
    }

    const fields = { title, description, difficulty, categories, examples, hints, link };

    // if title exists to be edited, check if it is unique
    if (title) {
      const titleCheck = await Question.findOne({ title: title, _id: { $ne: id } });

      if (titleCheck) {
        console.log("The title exists.")
        throw new Error("The title exists for another question");
        
      }
    }

    Object.keys(fields).forEach(key => {
      if (fields[key]) {
        question[key] = fields[key];
      }
    });

    return question.save();
    
  } catch (error) {
    console.error("Error updating the question at repository.js.");
    throw error;
  }
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

export async function getFilteredQuestions(query) {
  return Question.find(query);
}
/** To be added later
  export async function findByTitle(title) {
    return questionModel.findOne({ questionTitle: title });
*/