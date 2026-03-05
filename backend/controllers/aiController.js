const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const { ErrorResponse } = require("../utils/errorHandler");

// @desc    Generate quiz questions using AI
// @route   POST /api/ai/generate
// @access  Private
exports.generateQuizQuestions = async (req, res, next) => {
    try {
        const { topic, count = 5, difficulty = 'medium' } = req.body;

        if (!topic || topic.trim().length < 2) {
            return next(new ErrorResponse("Please provide a valid topic for the quiz (min 2 characters)", 400));
        }

        // Simple topic-level moderation (pre-AI)
        const blockedKeywords = ['porn', 'explicit', 'violence', 'blood', 'sex', 'hate'];
        if (blockedKeywords.some(keyword => topic.toLowerCase().includes(keyword))) {
            return next(new ErrorResponse("Inappropriate topic. Please choose a different subject.", 400));
        }

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
            return next(new ErrorResponse("AI Service not configured. Please add GEMINI_API_KEY to your .env file.", 500));
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        // Define safety settings
        const safetySettings = [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
        ];

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            safetySettings
        });

        const prompt = `
            You are a professional quiz creator. Generate a high-quality educational quiz.
            
            Topic: "${topic}"
            Difficulty: ${difficulty}
            Question Count: ${count}
            
            Strict Requirements:
            1. Generate exactly ${count} questions.
            2. Each question must be multiple-choice with exactly 4 distinct options.
            3. Accuracy: Ensure all facts are correct.
            4. Formatting: Return ONLY a raw JSON array. No markdown, no "json" tags, no leading/trailing text.
            
            JSON Schema for each object in the array:
            {
                "questionText": "The question string",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correctAnswer": "The exact string from the options array that is correct",
                "type": "multiple-choice",
                "points": 10
            }

            Example Output:
            [
                {
                    "questionText": "What is the capital of France?",
                    "options": ["London", "Berlin", "Paris", "Madrid"],
                    "correctAnswer": "Paris",
                    "type": "multiple-choice",
                    "points": 10
                }
            ]
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;

        // Check if content was blocked by safety filters
        if (response.promptFeedback?.blockReason) {
            return next(new ErrorResponse("Content generation blocked due to safety concerns. Please choose a different topic.", 400));
        }

        let text = response.text().trim();

        // Clean up text if AI included markdown blocks despite instructions
        if (text.startsWith("```")) {
            text = text.replace(/^```json/, "").replace(/^```/, "").replace(/```$/, "").trim();
        }

        let questions;
        try {
            questions = JSON.parse(text);

            // Validate basic structure
            if (!Array.isArray(questions)) {
                throw new Error("Response is not an array");
            }

            // Ensure we don't have empty questions or missing fields
            questions = questions.filter(q => q.questionText && q.options?.length === 4 && q.correctAnswer);

            if (questions.length === 0) {
                throw new Error("No valid questions parsed");
            }

        } catch (e) {
            console.error("AI Response parsing error:", text);
            return next(new ErrorResponse("AI generated an invalid format. Please try again with a clearer topic.", 500));
        }

        res.status(200).json({
            success: true,
            data: questions
        });
    } catch (error) {
        console.error("AI Generation Error:", error);

        if (error.status === 429) {
            return next(new ErrorResponse("AI rate limit exceeded. Please wait a minute before trying again.", 429));
        }

        next(new ErrorResponse("AI generation failed. Check your API key and network connection.", 500));
    }
};
