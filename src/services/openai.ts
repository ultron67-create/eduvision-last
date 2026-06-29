import OpenAI from 'openai';

// Check if API key is available
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const hasApiKey = Boolean(apiKey && apiKey.trim() !== '');

// Initialize OpenAI client only if API key is available
const openai = hasApiKey ? new OpenAI({
  apiKey: apiKey,
  organization: import.meta.env.VITE_OPENAI_ORG_ID,
  dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
}) : null;

// Demo content for when API key is not available
const demoContent = {
  title: "Photosynthesis: The Foundation of Life",
  level: "high",
  subject: "Biology",
  content: "Photosynthesis is a vital biological process that occurs in plants, algae, and some bacteria. This process converts light energy, usually from the sun, into chemical energy stored in glucose molecules. The basic equation for photosynthesis is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂. Key components include chloroplasts, chlorophyll, and stomata.",
  keyPoints: [
    "Photosynthesis converts light energy to chemical energy",
    "Occurs in chloroplasts using chlorophyll",
    "Produces oxygen and glucose",
    "Essential for most life on Earth",
    "Forms the base of food chains"
  ],
  difficulty: 'high' as const
};

const demoQuestions = [
  {
    id: `q_demo_1`,
    question: "What is the primary purpose of photosynthesis?",
    difficulty: 'easy' as const,
    answer: "To convert light energy into chemical energy stored in glucose",
    examples: ["Plants growing in sunlight", "Algae in ponds producing oxygen"],
    explanation: "Photosynthesis is the process by which plants use sunlight to create food in the form of glucose."
  },
  {
    id: `q_demo_2`,
    question: "What role does chlorophyll play in photosynthesis?",
    difficulty: 'medium' as const,
    answer: "Chlorophyll is the green pigment that captures light energy from the sun",
    examples: ["Green leaves absorbing sunlight", "Plants appearing green due to chlorophyll reflection"],
    explanation: "Chlorophyll absorbs light energy, which is then used to power the chemical reactions of photosynthesis."
  },
  {
    id: `q_demo_3`,
    question: "Why is photosynthesis important for life on Earth?",
    difficulty: 'hard' as const,
    answer: "It produces oxygen for most life forms, forms the base of food chains, and removes carbon dioxide from the atmosphere",
    examples: ["Forest producing oxygen", "Ocean phytoplankton as food source", "Carbon dioxide absorption by trees"],
    explanation: "Photosynthesis is essential for maintaining atmospheric balance and providing energy for virtually all ecosystems."
  }
];

export interface ProcessedContent {
  title: string;
  level: string;
  subject: string;
  content: string;
  keyPoints: string[];
  difficulty: 'elementary' | 'middle' | 'high' | 'undergraduate' | 'graduate';
}

export interface GeneratedQuestion {
  id: string;
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  answer: string;
  examples: string[];
  explanation: string;
}

export interface VideoScript {
  title: string;
  scenes: Array<{
    duration: number;
    description: string;
    narration: string;
    visualElements: string[];
  }>;
  totalDuration: string;
}

// Extract and process text content from uploaded material
export async function processTextContent(
  text: string,
  targetLevel: string = 'auto',
  country: string = 'auto'
): Promise<ProcessedContent> {
  // If no API key, return demo content
  if (!hasApiKey || !openai) {
    console.log('No API key configured, using demo content');
    await new Promise(resolve => setTimeout(resolve, 300)); // Brief delay for UX
    return demoContent;
  }

  try {
    const prompt = `
    Analyze the following educational content and extract key information:

    Content: "${text}"

    Please provide a JSON response with:
    1. A clear title for this content
    2. The educational level (elementary, middle, high, undergraduate, graduate)
    3. The main subject area
    4. A comprehensive summary adapted for ${targetLevel === 'auto' ? 'the appropriate level' : targetLevel} level
    5. 5-7 key learning points
    6. Difficulty assessment

    ${country !== 'auto' ? `Please include examples relevant to ${country} when possible.` : ''}

    Format as JSON with keys: title, level, subject, content, keyPoints, difficulty
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert educational content analyzer. Provide clear, accurate, and level-appropriate educational content analysis."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1500
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');

    return {
      title: result.title || 'Educational Content',
      level: result.level || 'undergraduate',
      subject: result.subject || 'General Studies',
      content: result.content || text.substring(0, 500),
      keyPoints: result.keyPoints || [],
      difficulty: result.difficulty || 'undergraduate'
    };
  } catch (error) {
    console.error('Error processing content:', error);
    throw new Error('Failed to process content. Please check your API key and try again.');
  }
}

// Generate educational questions based on content
export async function generateQuestions(
  content: string,
  level: string,
  count: number = 3,
  country: string = 'auto'
): Promise<GeneratedQuestion[]> {
  // If no API key, return demo questions
  if (!hasApiKey || !openai) {
    console.log('No API key configured, using demo questions');
    await new Promise(resolve => setTimeout(resolve, 200));
    return demoQuestions.slice(0, count);
  }

  try {
    const prompt = `
    Based on this educational content, generate ${count} questions appropriate for ${level} level students:

    Content: "${content}"

    For each question, provide:
    1. The question text
    2. Difficulty level (easy, medium, hard)
    3. A comprehensive answer
    4. 2-3 real-world examples
    5. A detailed explanation

    ${country !== 'auto' ? `Include examples relevant to ${country} context when possible.` : ''}

    Format as JSON array with keys: question, difficulty, answer, examples, explanation
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert educator creating engaging, level-appropriate questions that promote deep learning and critical thinking."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.4,
      max_tokens: 2000
    });

    const questions = JSON.parse(response.choices[0].message.content || '[]');

    return questions.map((q: any, index: number) => ({
      id: `q_${Date.now()}_${index}`,
      question: q.question || '',
      difficulty: q.difficulty || 'medium',
      answer: q.answer || '',
      examples: q.examples || [],
      explanation: q.explanation || ''
    }));
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error('Failed to generate questions. Please try again.');
  }
}

// Generate video script and suggestions
export async function generateVideoScript(
  title: string,
  description: string,
  style: string,
  duration: string,
  level: string
): Promise<VideoScript> {
  // If no API key, return demo video script
  if (!hasApiKey || !openai) {
    console.log('No API key configured, using demo video script');
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      title: title,
      scenes: [
        {
          duration: 30,
          description: "Opening scene introducing the topic",
          narration: `Welcome to this educational video about ${title}. Let's explore this fascinating topic together.`,
          visualElements: ["Animated title", "Topic introduction graphics"]
        },
        {
          duration: 60,
          description: "Main concept explanation",
          narration: description,
          visualElements: ["Concept diagrams", "Animated illustrations"]
        },
        {
          duration: 30,
          description: "Summary and key takeaways",
          narration: "Let's recap what we've learned today...",
          visualElements: ["Summary points", "Key takeaways animation"]
        }
      ],
      totalDuration: duration
    };
  }

  try {
    const prompt = `
    Create a detailed video script for an educational video:

    Title: "${title}"
    Description: "${description}"
    Style: ${style}
    Duration: ${duration} minutes
    Educational Level: ${level}

    Please provide:
    1. A refined title
    2. Scene-by-scene breakdown with:
       - Duration for each scene
       - Visual description
       - Narration text
       - Key visual elements to animate
    3. Total estimated duration

    Format as JSON with keys: title, scenes (array), totalDuration
    Each scene should have: duration, description, narration, visualElements
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert educational video scriptwriter. Create engaging, clear, and pedagogically sound video scripts."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 2500
    });

    const script = JSON.parse(response.choices[0].message.content || '{}');

    return {
      title: script.title || title,
      scenes: script.scenes || [],
      totalDuration: script.totalDuration || duration
    };
  } catch (error) {
    console.error('Error generating video script:', error);
    throw new Error('Failed to generate video script. Please try again.');
  }
}

// Generate research insights and real-world applications
export async function generateResearchInsights(
  content: string,
  level: string,
  country: string = 'auto'
): Promise<{
  currentApplications: string;
  relatedFields: string;
  careerConnections: string;
  realWorldExamples: string[];
}> {
  // If no API key, return demo insights
  if (!hasApiKey || !openai) {
    console.log('No API key configured, using demo research insights');
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      currentApplications: "Photosynthesis research is advancing with artificial leaf technology and renewable energy applications.",
      relatedFields: "Biochemistry, Environmental Science, Agriculture, Climate Science, Biotechnology",
      careerConnections: "Plant biologists, environmental scientists, agricultural researchers, and biotechnology engineers all work with photosynthesis principles.",
      realWorldExamples: [
        "Vertical farming using optimized light for photosynthesis",
        "Carbon capture technologies inspired by plant processes",
        "Biofuel production from algae photosynthesis",
        "Agricultural optimization of crop yields through light management"
      ]
    };
  }

  try {
    const prompt = `
    Provide comprehensive research insights for this educational content:

    Content: "${content}"
    Level: ${level}
    ${country !== 'auto' ? `Country Context: ${country}` : ''}

    Please provide:
    1. Current real-world applications and recent developments
    2. Related academic and professional fields
    3. Career connections and opportunities
    4. 3-5 specific real-world examples

    ${country !== 'auto' ? `Focus on examples and applications relevant to ${country} when possible.` : ''}

    Format as JSON with keys: currentApplications, relatedFields, careerConnections, realWorldExamples
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a research expert providing current, relevant insights that connect academic content to real-world applications."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.4,
      max_tokens: 1500
    });

    const insights = JSON.parse(response.choices[0].message.content || '{}');

    return {
      currentApplications: insights.currentApplications || '',
      relatedFields: insights.relatedFields || '',
      careerConnections: insights.careerConnections || '',
      realWorldExamples: insights.realWorldExamples || []
    };
  } catch (error) {
    console.error('Error generating research insights:', error);
    throw new Error('Failed to generate research insights. Please try again.');
  }
}

// OCR Text extraction (placeholder - would need additional OCR service)
export async function extractTextFromImage(imageFile: File): Promise<string> {
  // This would typically use an OCR service like Google Vision API
  // For demo purposes, return sample content quickly
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`
        Photosynthesis: The Foundation of Life

        Photosynthesis is a vital biological process that occurs in plants, algae, and some bacteria.
        This process converts light energy, usually from the sun, into chemical energy stored in glucose molecules.

        The basic equation for photosynthesis is:
        6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂

        Key Components:
        - Chloroplasts: The cellular structures where photosynthesis occurs
        - Chlorophyll: The green pigment that captures light energy
        - Stomata: Tiny pores that allow gas exchange

        Importance:
        - Produces oxygen for most life forms
        - Forms the base of food chains
        - Removes carbon dioxide from the atmosphere
        - Essential for ecosystem balance
      `);
    }, 300);
  });
}