const pdfParse = require("pdf-parse");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

exports.generateCoverLetter = async (req, res) => {

    try {

        let {
            name,
            role,
            company,
            skills,
            jobDescription = ""
        } = req.body;

        // -----------------------------
        // Extract Resume Text
        // -----------------------------

        let resumeText = "";

        if (req.file) {

            try {

                const pdfData = await pdfParse(req.file.buffer);

                resumeText = pdfData.text;

            } catch (err) {

                console.log("Resume Parsing Error:", err.message);

            }

        }

        // -----------------------------
        // AI Prompt
        // -----------------------------

        const prompt = `
You are an experienced HR Recruiter and ATS Resume Expert.

Generate a highly professional, ATS-friendly cover letter.

Candidate Information

Name:
${name}

Applying For:
${role}

Target Company:
${company}

Technical Skills:
${skills}

Job Description:
${jobDescription}

Resume Content:
${resumeText}

Instructions:

• Write professionally.

• Make it ATS Friendly.

• Mention the company naturally.

• Highlight the candidate's strongest technical skills.

• Use information from the uploaded resume whenever available.

• Keep the tone confident and professional.

• Length: 300–400 words.

• Include:
  - Professional greeting
  - Strong introduction
  - Skills paragraph
  - Why this company
  - Closing paragraph

Return ONLY the cover letter.
`;

        // -----------------------------
        // Generate AI Response
        // -----------------------------

        const response = await ai.models.generateContent({

            model: "gemini-2.5-flash",

            contents: prompt

        });

        res.json({

            success: true,

            coverLetter: response.text

        });

    } catch (error) {

        console.error("Gemini Error:", error);

        res.status(500).json({

            success: false,

            error: error.message

        });

    }

};