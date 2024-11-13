import "./component-styles/CreateSessionForm.css";
import React, { useState, useEffect } from "react";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import LoadingDots from "./LoadingDots";

export default function CreateSessionForm({
    categories,
    handleCreateSession,
    handleCancelMatch,
    isTimeout,
    isMatchFound,
    isReject,
    isRejected,
    isCollabTimeout
}) {
    const difficulties = ["Easy", "Medium", "Hard"];
    const [difficulty, setDifficulty] = useState("");
    const [category, setCategory] = useState("");
    const [timer, setTimer] = useState(0); // Track elapsed time
    const [loading, setLoading] = useState(false); // Loading state
    const [errorMessage, setErrorMessage] = useState(""); // Error or success message

    // useEffect to handle the timer and match status
    useEffect(() => {
        let interval;

        if (loading) {
            // Increment the timer every second
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer + 1);
            }, 1000);

            // If timer reaches timeout, show failure message
            if (isTimeout) {
                clearInterval(interval);
                setLoading(false);
                setErrorMessage("Failed to find a match. 😞");
            }

            if (isMatchFound) {
                clearInterval(interval);
                setLoading(false);
                setErrorMessage("");
            }
            // Need to handle case where match is found, then show sucess message
        }

        // Clean up the interval when the component unmounts or the timer stops
        return () => clearInterval(interval);
    }, [loading, timer, isMatchFound, isTimeout]);

    useEffect(() => {

        if(isReject) {
            console.log("isReject: ", isReject);
            setErrorMessage("You did not accept the match.");
        }

        if(isRejected) {
            console.log("isRejected: ", isRejected);
            setErrorMessage("The other player did not accept the match.");
        }

        if (isCollabTimeout) {
            console.log("isCollabTimeout: ", isCollabTimeout);
            setErrorMessage("Match not accepted in time.");
        }
     

    }, [isReject, isRejected, isCollabTimeout]);

    // Handle Create Session
    const handleSubmit = () => {
        if (difficulty && category.length > 0) {
            setLoading(true); // Start loading
            setTimer(0); // Reset the timer
            setErrorMessage(""); // Clear previous messages
            handleCreateSession(category, difficulty);
        } else {
            alert("Please select a difficulty and at least one category.");
        }
    };

    // Handle Cancel
    const handleCancel = () => {
        if (difficulty && category.length > 0) {
            handleCancelMatch();
            setLoading(false); // Start loading
            setTimer(0); // Reset the timer
            setErrorMessage(""); // Clear previous messages
        } else {
            alert("Please select a difficulty and at least one category.");
        }
    };

    return (
        <div component="form" className="create-session-form">
            <label
                style={{
                    fontWeight: "bold",
                    padding: "5px 5px 5px 5px",
                    fontSize: "20px",
                }}
            >
                Choose your session settings
            </label>

            <div className="session-form-input">
                <FormControl>
                    <InputLabel id="difficulty">Difficulty</InputLabel>
                    <Select
                        labelId="difficulty-label"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        label="Difficulty"
                        disabled={loading}
                    >
                        {difficulties.map((difficulty, index) => (
                            <MenuItem key={index} value={difficulty}>
                                {difficulty}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl>
                    <InputLabel id="questionCategory">
                        Question Category
                    </InputLabel>
                    <Select
                        id="questionCategory"
                        label="Question Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        disabled={loading}
                    >
                        {categories.map((category) => (
                            <MenuItem key={category._id} value={category.name}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            {/* Submit Button */}
            {!loading && (
                <button
                    type="submit"
                    className="create-session-button"
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    fullwidth="true"
                >
                    Create Session
                </button>
            )}

            {loading && (
                <button
                    type="submit"
                    className="cancel-matching-button"
                    onClick={handleCancel}
                    variant="contained"
                    color="primary"
                    fullwidth="true"
                >
                    Cancel
                </button>
            )}

            {/* Loading Animation and Timer */}
            {loading && (
                <div className="loading-section">
                    <LoadingDots />
                    <span>Time elapsed: {timer}s</span>
                </div>
            )}

            {/* Error/Success Message */}
            {errorMessage && (
                <span className="error-message">{errorMessage}</span>
            )}

            {isMatchFound && (
                <span className="error-message">Match Found!</span>
            )}
        </div>
    );
}
