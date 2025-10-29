import React, { useState, useCallback } from 'react';
import { ImageUploader, ImageObject } from './components/ImageUploader';
import { PromptEditor } from './components/PromptEditor';
import { ResultDisplay } from './components/ResultDisplay';
import { Header } from './components/Header';
import { GenerateButton } from './components/GenerateButton';
import { generateImage, generatePromptFromIdea } from './services/geminiService';
import { SparklesIcon } from './components/icons';

const App: React.FC = () => {
  const [images, setImages] = useState<ImageObject[]>([]);
  const [userIdea, setUserIdea] = useState<string>('');
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');

  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState<boolean>(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImagesChange = useCallback((updatedImages: ImageObject[]) => {
    setImages(updatedImages);
    setGeneratedImageUrl(null);
    setError(null);
  }, []);

  const handleGeneratePrompt = useCallback(async () => {
    if (!userIdea) {
      setError("Por favor, descreva sua ideia primeiro.");
      return;
    }
    setIsGeneratingPrompt(true);
    setError(null);
    try {
      const prompt = await generatePromptFromIdea(userIdea);
      setGeneratedPrompt(prompt);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Ocorreu um erro ao gerar o prompt.");
    } finally {
      setIsGeneratingPrompt(false);
    }
  }, [userIdea]);

  const handleGenerateImage = useCallback(async () => {
    if (images.length === 0 || !generatedPrompt) {
      setError("Por favor, envie uma imagem e gere um prompt.");
      return;
    }

    setIsGeneratingImage(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      const imageUrl = await generateImage(images, generatedPrompt);
      setGeneratedImageUrl(imageUrl);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Ocorreu um erro desconhecido ao gerar a imagem.");
    } finally {
      setIsGeneratingImage(false);
    }
  }, [images, generatedPrompt]);

  const isLoading = isGeneratingPrompt || isGeneratingImage;

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#E6EEF6]">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          <div className="flex flex-col gap-8 bg-[#121821] p-6 rounded-2xl border border-slate-700">
            <ImageUploader 
              images={images}
              onImagesChange={handleImagesChange}
            />
            <PromptEditor
              userIdea={userIdea}
              onUserIdeaChange={setUserIdea}
              generatedPrompt={generatedPrompt}
              onGeneratedPromptChange={setGeneratedPrompt}
              onGeneratePrompt={handleGeneratePrompt}
              isGeneratingPrompt={isGeneratingPrompt}
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-8 sticky top-8">
            <ResultDisplay 
              generatedImageUrl={generatedImageUrl}
              isLoading={isGeneratingImage}
              error={error}
            />
            <GenerateButton
                onClick={handleGenerateImage}
                disabled={images.length === 0 || !generatedPrompt || isLoading}
             >
                <SparklesIcon className="w-6 h-6 mr-2" />
                {isGeneratingImage ? 'Gerando Imagem...' : 'Gerar Imagem no NanoBanana'}
             </GenerateButton>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
