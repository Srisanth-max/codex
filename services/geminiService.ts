import { GoogleGenAI } from "@google/genai";
import { SupportedLanguage } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelId = "gemini-2.5-flash"; // Using fast model for code tasks

export const runCodeSimulation = async (
  code: string,
  language: SupportedLanguage
): Promise<string> => {
  try {
    const prompt = `
      Act as a code execution engine.
      Language: ${language}
      Code:
      \`\`\`${language}
      ${code}
      \`\`\`
      
      Execute this code conceptually and return ONLY the output that would appear in the console/stdout.
      If there is an error, return the error message as it would appear in a terminal.
      Do not add markdown formatting like \`\`\` to the response. Just the raw output string.
      If the code generates a plot or GUI, describe what happens briefly in brackets, e.g., [Window opens with a blue button].
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text?.trim() || "No output generated.";
  } catch (error: any) {
    console.error("Gemini Execution Error:", error);
    return `Error simulating execution: ${error.message}`;
  }
};

export const explainCode = async (code: string): Promise<string> => {
  try {
    const prompt = `
      Explain the following code snippet concisely for a developer. 
      Break it down by logic flow.
      Code:
      \`\`\`
      ${code}
      \`\`\`
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    return response.text || "Could not analyze code.";
  } catch (error: any) {
    return `Analysis error: ${error.message}`;
  }
};

export const fixCode = async (code: string, errorMsg: string): Promise<string> => {
  try {
    const prompt = `
      The following code has an issue.
      Code:
      \`\`\`
      ${code}
      \`\`\`
      Error/Issue: ${errorMsg}
      
      Please provide the fixed version of the code. Return ONLY the code, wrapped in markdown code blocks.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });

    // Extract code from markdown blocks if present
    const text = response.text || "";
    const match = text.match(/```(?:\w+)?\n([\s\S]*?)```/);
    return match ? match[1] : text;
  } catch (error: any) {
    return `Fix error: ${error.message}`;
  }
};