import questionModel from "./question-model.js";
import "dotenv/config";
import { connect } from "mongoose";

export async function connectToDB() {
    let mongoDBUri =
      process.env.ENV === "PROD"
        ? process.env.DB_CLOUD_URI
        : process.env.DB_LOCAL_URI;
  
    await connect(mongoDBUri);
  }

  export async function createQuestion(questionTitle, questionDescription, questionCategory, questionComplexity) {
    return new questionModel({ questionTitle, questionDescription, questionCategory, questionComplexity }).save();
  }

  export async function findQuestionById(questionId) {
    return questionModel.findById(questionId);
  }

  export async function findByTitle(title) {
    return questionModel.findOne({ questionTitle: title });
  }

  export async function findAllQuestions() {
    return questionModel.find();
  }

  export async function updateQuestionById(questionId, questionTitle, questionDescription, questionCategory, questionComplexity) {
    return questionModel.findByIdAndUpdate(
      questionId,
      {
        $set: {
          questionTitle,
          questionDescription,
          questionCategory,
          questionComplexity,
        },
      },
      { new: true },  // return the updated question
    );
  }

  export async function deleteQuestionById(questionId) {
    return questionModel.findByIdAndDelete(questionId);
  }