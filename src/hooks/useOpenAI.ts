import { useState } from 'react';
import {
  processTextContent,
  generateQuestions,
  generateVideoScript,
  generateResearchInsights,
  extractTextFromImage,
  ProcessedContent,
  GeneratedQuestion,
  VideoScript
} from '../services/openai';

export function useOpenAI() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processContent = async (
    file: File,
    targetLevel: string = 'auto',
    country: string = 'auto'
  ): Promise<{
    content: ProcessedContent;
    questions: GeneratedQuestion[];
  } | null> => {
    setIsProcessing(true);
    setError(null);

    try {
      // Extract text from image/file
      const extractedText = await extractTextFromImage(file);
      
      // Process the content
      const processedContent = await processTextContent(extractedText, targetLevel, country);
      
      // Generate questions
      const questions = await generateQuestions(
        processedContent.content,
        processedContent.level,
        3,
        country
      );

      return {
        content: processedContent,
        questions
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const createVideoScript = async (
    title: string,
    description: string,
    style: string,
    duration: string,
    level: string
  ): Promise<VideoScript | null> => {
    setIsProcessing(true);
    setError(null);

    try {
      const script = await generateVideoScript(title, description, style, duration, level);
      return script;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create video script';
      setError(errorMessage);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const getResearchInsights = async (
    content: string,
    level: string,
    country: string = 'auto'
  ) => {
    setIsProcessing(true);
    setError(null);

    try {
      const insights = await generateResearchInsights(content, level, country);
      return insights;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate research insights';
      setError(errorMessage);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    processContent,
    createVideoScript,
    getResearchInsights,
    isProcessing,
    error,
    clearError: () => setError(null)
  };
}