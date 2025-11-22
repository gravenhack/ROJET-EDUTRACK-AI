import { GoogleGenAI } from "@google/genai";

export const getGeminiExplanation = async (apiKey: string, questionContent: string, userAnswer: string, correctAnswer: string) => {
  if (!apiKey) {
    return "Mode démo : L'explication n'est pas disponible sans clé API valide. En mode réel, Gemini analyserait votre erreur spécifiquement.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      Tu es un tuteur expert pour des lycéens au Bénin.
      L'élève a répondu à cette question : "${questionContent}".
      Sa réponse : "${userAnswer}".
      La bonne réponse : "${correctAnswer}".
      
      Explique brièvement (max 3 phrases) pourquoi sa réponse est incorrecte (si c'est le cas) ou renforce le concept clé si c'est juste.
      Sois encourageant.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Erreur de génération d'explication.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Désolé, je ne peux pas générer d'explication pour le moment.";
  }
};

export const chatWithTutor = async (apiKey: string, history: { role: string, parts: { text: string }[] }[], message: string) => {
    if (!apiKey) {
        // Fallback demo response
        await new Promise(r => setTimeout(r, 1000));
        return "Je suis EduTrack AI. En mode démo, je ne peux pas répondre dynamiquement, mais je suis conçu pour vous aider en Maths et Physique !";
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: history,
            config: {
                systemInstruction: "Tu es EduTrack, un assistant pédagogique virtuel pour les élèves de Terminale au Bénin. Tu aides en Maths, Physique, SVT. Tu es patient, pédagogue, et tu donnes des exemples concrets. Tu connais le programme scolaire béninois."
            }
        });

        const result = await chat.sendMessage({ message });
        return result.text;
    } catch (error) {
        console.error("Chat Error:", error);
        throw error;
    }
}
