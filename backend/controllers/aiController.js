const { GoogleGenerativeAI } = require("@google/generative-ai");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Generate quiz questions using AI
// @route   POST /api/ai/generate
// @access  Private
exports.generateQuizQuestions = async (req, res, next) => {
    try {
        const { topic, count = 5, difficulty = 'medium' } = req.body;

        if (!topic) {
            return next(new ErrorResponse("Please provide a topic for the quiz", 400));
        }

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
            return next(new ErrorResponse("AI Service not configured. Please add GEMINI_API_KEY to your .env file.", 500));
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            Generate a quiz about "${topic}" with ${count} multiple-choice questions.
            The difficulty should be ${difficulty}.
            Each question must have exactly 4 options and one correct answer.
            Return the response in strictly valid JSON format, as an array of objects.
            Each object must have exactly these keys:
            - questionText: (string)
            - options: (array of 4 strings)
            - correctAnswer: (string, must exactly match one of the values in the options array)
            - type: (always "multiple-choice")
            - points: (always 10)

            DO NOT include any markdown formatting like \`\`\`json or explanations. Return ONLY the raw JSON array.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().trim();

        // Clean up text if AI included markdown blocks despite instructions
        if (text.startsWith("```")) {
            text = text.replace(/^```json/, "").replace(/^```/, "").replace(/```$/, "").trim();
        }

        let questions;
        try {
            questions = JSON.parse(text);
        } catch (e) {
            console.error("AI Response parsing error:", text);
            return next(new ErrorResponse("AI generated an invalid format. Please try again.", 500));
        }

        res.status(200).json({
            success: true,
            data: questions
        });
    } catch (error) {
        console.error("AI Generation Error:", error);
        next(new ErrorResponse("AI generation failed. Check your API key and network connection.", 500));
    }
};
