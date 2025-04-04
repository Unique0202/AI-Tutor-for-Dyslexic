import * as tf from '@tensorflow/tfjs';
import { load as loadQnAModel } from '@tensorflow-models/qna';

let model;

// Load model only once
export async function loadChatbotModel() {
  try {
    model = await loadQnAModel();
    console.log('Chatbot model loaded successfully');
    return true;
  } catch (error) {
    console.error('Error loading chatbot model:', error);
    return false;
  }
}

// Process user input
export async function getBotResponse(userInput) {
  if (!model) {
    const loaded = await loadChatbotModel();
    if (!loaded) return getLocalResponse(userInput);
  }

  try {
    // Use our predefined context about dyslexia learning
    const context = `
      NeuroLearn is a dyslexia-friendly learning platform with these modules:
      1. Reading Adventure - Interactive reading support
      2. Letter Master - Letter recognition challenges
      3. Word Builder - Word construction with visual aids
      4. Spell Quest - Spelling practice games
      
      Our teaching methods are based on:
      - Multisensory learning techniques
      - Orton-Gillingham principles
      - Phonemic awareness development
      - Visual tracking exercises
    `;

    const answers = await model.findAnswers(userInput, context);
    
    if (answers && answers.length > 0) {
      // Return the most confident answer
      return answers[0].text;
    }
    
    return getLocalResponse(userInput);
    
  } catch (error) {
    console.error('Error processing question:', error);
    return getLocalResponse(userInput);
  }
}

// Local fallback responses (similar to your existing function)
function getLocalResponse(userInput) {
  const input = userInput.toLowerCase();
  
  if (input.match(/\b(read|reading|book|story)\b/)) {
    return "Try our 📖 Reading Adventure module! It helps with story comprehension through interactive exercises.";
  }
  if (input.match(/\b(letter|alphabet)\b/)) {
    return "The 🔠 Letter Master game is perfect for learning letters! It's in the learning games section.";
  }
  if (input.match(/\b(word|spell|spelling|vocab)\b/)) {
    return "Our 🧩 Word Builder and ✨ Spell Quest modules are great for word practice!";
  }
  
  const learningResponses = [
    "Would you like to try one of our interactive learning modules today?",
    "I specialize in reading and spelling support. Could you ask about those?",
    "Our learning games make reading practice fun! Want to try one?"
  ];
  
  return learningResponses[Math.floor(Math.random() * learningResponses.length)];
}