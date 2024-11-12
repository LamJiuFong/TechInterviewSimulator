import { useState } from 'react';
import { createSubmission, getSubmissionResult } from '../api/codeExecutionApi';
import { codeRunning, changeCodeOutput } from '../api/collaborationApi';

const useCodeExecution = (roomId, setStatus, setStdout, setStderr) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submissionToken, setSubmissionToken] = useState(null);

  const reset = () => {
    setLoading(false);
    setError(null);
    setSubmissionToken(null);
    setStatus(null);
    setStdout(null);
    setStderr(null);
  }

  const handleCreateSubmission = async (codeData) => {
    try {
      reset();
      setLoading(true);
      codeRunning(roomId, true);
      changeCodeOutput(roomId, null, null, null);

      const { code, languageId } = codeData;
      if (!code || !languageId) {
        setError("Your source code and language ID are required for a submission");
        return;
      }

      const data = await createSubmission(codeData);

      setSubmissionToken(data.token);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGetSubmissionResult = async () => {
    try {
      setError(null);

      if (!submissionToken) {
        setError("Submission token is required");
        return;
      }

      const data = await getSubmissionResult(submissionToken);

      const { status, stdout, stderr } = data;

      setStatus(status);
      setStdout(stdout);
      setStderr(stderr);

      if (status?.id >= 2) {
        changeCodeOutput(roomId, status, stdout, stderr);
        setLoading(false);
        setSubmissionToken(null);
        codeRunning(roomId, false);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
      setSubmissionToken(null);
      codeRunning(roomId, false);
    }
  };

  return {
    loading,
    error,
    submissionToken,
    handleCreateSubmission,
    handleGetSubmissionResult,
  };
};

export default useCodeExecution;