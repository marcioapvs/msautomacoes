import { GoogleGenAI, Modality } from "@google/genai";
import { ImageObject } from './components/ImageUploader';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const generatePromptFromIdea = async (idea: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: idea,
    config: {
        systemInstruction: `Você é um assistente de IA especialista em engenharia de prompts para modelos de geração de imagem. Sua tarefa é pegar uma ideia simples do usuário em português e transformá-la em um prompt detalhado, rico e eficaz, também em português. O prompt deve descrever vividamente a cena, iluminação, estilo de arte, composição e emoção, pronto para ser usado para gerar uma imagem. Responda APENAS com o prompt gerado, sem nenhum texto introdutório ou explicação.`,
    },
  });

  return response.text.trim();
};


export const generateImage = async (
  images: ImageObject[],
  prompt: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const imageParts = await Promise.all(
    images.map(async (img) => {
      const base64ImageData = await fileToBase64(img.file);
      return {
        inlineData: {
          data: base64ImageData,
          mimeType: img.file.type,
        },
      };
    })
  );

  let roleInstructions = "Você é um especialista em composição de imagens. As imagens a seguir foram fornecidas pelo usuário com papéis específicos. ";
  
  images.forEach((img, index) => {
      roleInstructions += `A imagem ${index + 1} deve ser usada como '${img.role}'. `;
  });
  
  const fullPrompt = `${roleInstructions} Com base nisso, aplique o seguinte prompt criativo: "${prompt}"`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: fullPrompt },
        ...imageParts,
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const base64ImageBytes: string = part.inlineData.data;
      return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
    }
  }

  throw new Error("Nenhuma imagem foi gerada pela API.");
};
