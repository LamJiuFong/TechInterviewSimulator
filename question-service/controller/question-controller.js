import { 
    createQuestion as importedCreateQuestion, 
    getQuestionById as importedGetQuestionById,
    getAllQuestions as importedGetAllQuestions,
    updateQuestionById as importedUpdateQuestionById,
    deleteQuestionById as importedDeleteQuestionById,
    getFilteredQuestions as getFilteredQuestionsDB
} from "../model/repository.js";

export async function createQuestion(req, res) {
    try {

        const data = req.body

        const question = await importedCreateQuestion(data.title, data.description, data.difficulty, data.categories, data.examples, data.hint);

        if (question) {
            res.status(200).json(question);
        } else {
            res.status(404).json({message:"Question creation failed"});
        }

    } catch(err) {
        console.error("Error creating question", err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

// Get all questions
export async function getAllQuestions(req, res) {
    try {
        const questions = await importedGetAllQuestions();  // Fetch all questions from DB
        return res.status(200).json(questions);  // Send response as JSON
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get filtered questions based on query parameters
// Example route: /filter?difficulty=0&category=DP,Array
export const getFilteredQuestions = async (req, res) => {
    try {
        const { difficulty, category } = req.query;  // Extract query parameters
        
        let query = {};

        if (difficulty) {
            query.difficulty = difficulty;  // Filter by difficulty
        }

        if (category) {
            query.categories = { $elemMatch: { $in: category.split(',') }};  // Filter by category
        }
        
        const questions = await getFilteredQuestionsDB(query);


        res.status(200).json(questions);  // Send response as JSON
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Get question by id
export async function getQuestionById(req, res) {
    try {

        const question = await importedGetQuestionById(req.params.id);

        if (question) {
            res.status(200).json(question);
        } else {
            res.status(404).json({message:"Question not found"});
        }

    } catch(err) {
        console.error("Error fetching question", err);
        res.status(500).json({message: "Internal Server Error"});
    }
}

// Update
export async function updateQuestionById(req, res) {
    try {
        const id = req.params.id;
        const data = req.body;
        
        const updatedQuestion = await importedUpdateQuestionById(id, data.title, data.description, data.difficulty, data.categories, data.examples, data.hint);
        
        if (updatedQuestion) {
            return res.status(200).json(updatedQuestion);
        } else {
            return res.status(404).json({ message: "Question not found" });
        }
        
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// delete
export async function deleteQuestionById(req, res) {
    try {
        const id = req.params.id;

        const deletedQuestion = await importedDeleteQuestionById(id);

        if (deletedQuestion) {
            return res.status(200).json(deletedQuestion);
        } else {
            return res.status(404).json({ message: "Question not found" });
        } 
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

/* Not supporting this yet
export const getQuestionByTitle = async (req, res) => {
    try {
        const { questionTitle } = req.body;
        const question = await findByTitle(questionTitle);
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        } else {
            return res.status(200).json(question);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
*/