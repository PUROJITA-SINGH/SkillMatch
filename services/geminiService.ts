
import { GoogleGenAI, Type } from "@google/genai";
import { JobMatchResult, LearningResource, MarketAnalysisResult, GroundingSource, ResumeTailorResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        matchScore: { 
            type: Type.INTEGER,
            description: "A score from 0 to 100 representing how well the resume matches the job description."
        },
        matchSummary: { 
            type: Type.STRING,
            description: "A concise, one-paragraph summary of the match, highlighting key strengths and weaknesses."
        },
        strengths: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of key skills and experiences from the resume that directly align with the job requirements."
        },
        skillGaps: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of important skills required by the job that are missing or not emphasized in the resume."
        },
        transferableSkills: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of skills from the resume that are not a direct match but are highly relevant and can be applied to the new role. For each skill, add a brief, parenthetical explanation of its relevance."
        },
        atsKeywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of crucial keywords from the job description that should be included in the resume to pass Applicant Tracking Systems (ATS)."
        },
        improvementSuggestions: {
            type: Type.STRING,
            description: "Actionable advice on how to tailor the resume for this specific job application, focusing on wording and structure."
        }
    },
    required: ["matchScore", "matchSummary", "strengths", "skillGaps", "transferableSkills", "atsKeywords", "improvementSuggestions"]
};

const learningResourcesSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            title: {
                type: Type.STRING,
                description: "The title of the learning resource."
            },
            url: {
                type: Type.STRING,
                description: "The full URL to the learning resource."
            }
        },
        required: ["title", "url"]
    }
};

const tailorSchema = {
    type: Type.OBJECT,
    properties: {
        tailoredResumeText: {
            type: Type.STRING,
            description: "The full text of the professionally rewritten and tailored resume, formatted for clarity and ATS compatibility."
        },
        changeSummary: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A bulleted list of the most significant changes made to the resume, explaining the reasoning (e.g., 'Rephrased X to Y to better incorporate keyword Z')."
        }
    },
    required: ["tailoredResumeText", "changeSummary"]
};


export const analyzeResumeAndJob = async (resumeText: string, jobDescription: string): Promise<JobMatchResult> => {
    try {
        const prompt = `
            You are an expert career coach and resume analyst specializing in tech roles. Your task is to provide a detailed analysis comparing the provided resume against the given job description.

            Analyze the resume text and the job description thoroughly. Then, generate a JSON object that strictly adheres to the provided schema. The analysis should be professional, insightful, and constructive.

            Specifically for 'transferableSkills', identify skills from the resume that aren't direct keywords in the job description but are highly relevant. For example, 'Project Management in construction' could be transferable to 'Tech Project Coordination'. For each transferable skill, add a brief, parenthetical explanation of its relevance.

            --- RESUME TEXT ---
            ${resumeText}
            --- END RESUME TEXT ---

            --- JOB DESCRIPTION ---
            ${jobDescription}
            --- END JOB DESCRIPTION ---

            Now, provide the analysis in the specified JSON format.
        `;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
                temperature: 0.2,
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        
        return result as JobMatchResult;

    } catch (error) {
        console.error("Error analyzing with Gemini API:", error);
        throw new Error("Failed to get analysis from AI. Please check the console for more details.");
    }
};

export const findLearningResources = async (skill: string): Promise<LearningResource[]> => {
    try {
        const prompt = `
            You are a helpful assistant that finds high-quality, free learning resources.
            Find 2-3 excellent and free online resources (like tutorials, official documentation, or comprehensive guides) for learning the following skill: "${skill}".
            Provide the output in the specified JSON format.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: learningResourcesSchema,
                temperature: 0.1,
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        
        return result as LearningResource[];

    } catch (error) {
        console.error("Error finding learning resources with Gemini API:", error);
        throw new Error(`Failed to find resources for "${skill}".`);
    }
};

export const analyzeJobMarket = async (jobTitle: string, industry: string): Promise<MarketAnalysisResult> => {
    try {
        const prompt = `
            Analyze the current job market for a "${jobTitle}" role, focusing on the "${industry || 'general'}" industry.
            Use your knowledge and the latest information from Google Search to provide a detailed report.

            Your response must include:
            1.  A brief summary of the current demand and outlook for this role.
            2.  A list of the top 5-7 most in-demand technical skills.
            3.  A list of 3-5 emerging skills or technologies that are gaining importance.
            4.  A list of common tools and software associated with this role.

            Please structure your entire response as a single, valid JSON object enclosed in a markdown code block (\`\`\`json ... \`\`\`). Do not include any text outside of this JSON block.

            The JSON object must have the following structure:
            {
              "summary": "string",
              "topSkills": ["string"],
              "emergingSkills": ["string"],
              "commonTools": ["string"]
            }
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                temperature: 0.1,
            },
        });

        const text = response.text;
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
        if (!jsonMatch || !jsonMatch[1]) {
            console.error("Raw AI Response:", text);
            throw new Error("AI response did not contain a valid JSON block.");
        }
        const parsedResult = JSON.parse(jsonMatch[1]);

        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources: GroundingSource[] = groundingChunks
            .map((chunk: any) => ({
                title: chunk.web?.title || 'Unknown Source',
                uri: chunk.web?.uri || '#',
            }))
            .filter((source: GroundingSource) => source.uri !== '#');

        const uniqueSources = Array.from(new Map(sources.map(item => [item['uri'], item])).values());

        const result: MarketAnalysisResult = {
            summary: parsedResult.summary,
            topSkills: parsedResult.topSkills,
            emergingSkills: parsedResult.emergingSkills,
            commonTools: parsedResult.commonTools,
            sources: uniqueSources,
        };

        return result;

    } catch (error) {
        console.error("Error analyzing job market with Gemini API:", error);
        throw new Error("Failed to get market analysis from AI. Please check the console for more details.");
    }
};

export const tailorResume = async (resumeText: string, jobDescription: string): Promise<ResumeTailorResult> => {
    try {
        const prompt = `
            You are an expert resume writer and career coach. Your task is to rewrite the provided 'base resume' to be perfectly tailored for the given 'job description'.

            Follow these instructions carefully:
            1.  **Analyze Both Documents**: Thoroughly analyze the resume and the job description to understand the candidate's experience and the employer's needs.
            2.  **Integrate Keywords**: Naturally weave relevant keywords from the job description into the resume's experience and skills sections.
            3.  **Rephrase Bullet Points**: Rewrite bullet points to be action-oriented and results-driven. Use the STAR (Situation, Task, Action, Result) method where applicable and quantify achievements with metrics (e.g., "Increased efficiency by 15%").
            4.  **Align with Role**: Reframe existing experiences to highlight the aspects most relevant to the target job.
            5.  **Maintain Honesty**: Do not invent new experiences or skills. Only rephrase and reframe the existing content from the base resume.
            6.  **Format for ATS**: Ensure the final text maintains a clean, professional, and ATS-friendly format. Use standard section headers (e.g., "Professional Experience", "Skills", "Education").
            7.  **Summarize Changes**: Provide a concise summary of the most impactful changes you made.

            --- BASE RESUME ---
            ${resumeText}
            --- END BASE RESUME ---

            --- JOB DESCRIPTION ---
            ${jobDescription}
            --- END JOB DESCRIPTION ---

            Now, generate a JSON object that strictly adheres to the provided schema.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: tailorSchema,
                temperature: 0.3,
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        
        return result as ResumeTailorResult;

    } catch (error) {
        console.error("Error tailoring resume with Gemini API:", error);
        throw new Error("Failed to get tailored resume from AI. Please check the console for more details.");
    }
};
