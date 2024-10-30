import { useState } from 'react';
import { createSubmission, getSubmissionResult } from '../api/codeExecutionApi';

const useCodeExecution = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submissionToken, setSubmissionToken] = useState(null);
  const [status, setStatus] = useState(null);
  const [stdout, setStdout] = useState(null);
  const [stderr, setStderr] = useState(null);

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
      setSubmissionToken(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    submissionToken,
    status,
    stdout,
    stderr,
    handleCreateSubmission,
    handleGetSubmissionResult,
  };
};

export default useCodeExecution;