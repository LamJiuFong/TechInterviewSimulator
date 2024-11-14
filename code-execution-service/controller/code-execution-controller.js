import axios from "axios";
import "dotenv/config";

const RAPID_API_URL = process.env.RAPID_API_URL;
const RAPID_API_HOST = process.env.RAPID_API_HOST;
const RAPID_API_KEY = process.env.RAPID_API_KEY;

const axiosInstance = axios.create({
  baseURL: RAPID_API_URL,
  headers: {
    "x-rapidapi-key": RAPID_API_KEY,
    "x-rapidapi-host": RAPID_API_HOST,
    "Content-Type": "application/json",
  },
});

export async function createSubmission(req, res) {
  console.log(`Create submission: ${JSON.stringify(req.body)}`);
  try {
    const { languageId, code } = req.body;
    if (!code || !languageId) {
      return res
        .status(400)
        .json({
          message:
            "Your source code and language ID are required for a submission",
        });
    }

    //Encode the code in base64
    let codeEncoded = Buffer.from(code).toString("base64");

    const response = await axiosInstance.post(
      "/submissions",
      {
        source_code: codeEncoded,
        language_id: languageId,
      },
      {
        params: {
          base64_encoded: true,
        },
      }
    );

    if (response.status !== 201) {
      return res.status(500).json({ message: "Failed to create submission" });
    }

    return res.status(201).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
// print("Hello, World!")
export async function getSubmissionResult(req, res) {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: "Submission token is required" });
    }

    const response = await axiosInstance.get(
      `/submissions/${token}`,
      {
        params: {
          base64_encoded: true,
        },
      }
    );

    // fields = stdout,time,memory,stderr,token,compile_output,message,status
    let { status, stdout, stderr } = response.data;

    if (stdout) {
      stdout = Buffer.from(stdout, "base64").toString("utf-8");
    }

    if (stderr) {
      stderr = Buffer.from(stderr, "base64").toString("utf-8");
    }

    const data = {
      status,
      stdout,
      stderr,
    };

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
