import { 
    createQuestion as importedCreateQuestion, 
    getQuestionById as importedGetQuestionById,
    getAllQuestions as importedGetAllQuestions,
    getAllQuestionCategories as importedGetAllQuestionCategories,
    updateQuestionById as importedUpdateQuestionById,
    deleteQuestionById as importedDeleteQuestionById,
    getFilteredQuestions as getFilteredQuestionsDB
} from "../model/repository.js";

export async function createQuestion(req, res) {
    try {

        const { title, description, categories, difficulty, link, hints, examples } = req.body;

        // Trim input strings
        const trimmedTitle = title.trim();
        const trimmedDescription = description.trim();
        const trimmedLink = link.trim();
        const trimmedHints = hints.map((hint) => hint.trim());
        const trimmedExamples = examples.map((example) => ({
            input: example.input.trim(),
            output: example.output.trim(),
        }));
        const question = await importedCreateQuestion(trimmedTitle, trimmedDescription, difficulty, categories, trimmedExamples, trimmedLink, trimmedHints);

        if (question) {
            res.status(200).json(question);
        } else {
            res.status(404).json({message:"Question creation failed"});
        }

    } catch(err) {
        console.error("Error creating question", err);
        if (err.message === "Question Title exists") {
            res.status(409).json({ message: err.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
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
}

// Get all categories
export async function getAllCategories(req, res) {
    try {
        const categories = await importedGetAllQuestionCategories();  // Fetch all questions from DB
        return res.status(200).json(categories);  // Send response as JSON
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


// Get filtered questions based on query parameters
// Example route: /filter?difficulty=0&category=DP,Array&title=TwoSum
export const getFilteredQuestions = async (req, res) => {
    try {
        const { difficulty, category, title } = req.query;  // Extract query parameters
        let query = {};

        if (difficulty) {
            query.difficulty = difficulty;  // Filter by difficulty
        }

        if (category && category.length > 0) {
            query.categories = { $elemMatch: { $in: category }};  // Filter by category
        }

        if (title) {
            query.title = { $regex: title, $options: 'i' };  // Filter by title
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
        // Destructure and trim input strings
        const { title, description, categories, difficulty, link, hints, examples } = req.body;

        const trimmedTitle = title.trim();
        const trimmedDescription = description.trim();
        const trimmedLink = link.trim();
        const trimmedHints = hints.map((hint) => hint.trim());
        const trimmedExamples = examples.map((example) => ({
            input: example.input.trim(),
            output: example.output.trim(),
        }));

        // Update the question using the trimmed inputs
        const updatedQuestion = await importedUpdateQuestionById(
            id,
            trimmedTitle,
            trimmedDescription,
            difficulty, // Assuming difficulty doesn't need trimming
            categories, // Assuming categories are already in the desired format
            trimmedExamples,
            trimmedHints,
            trimmedLink
        );

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