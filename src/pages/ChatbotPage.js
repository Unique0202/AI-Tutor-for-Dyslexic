import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, RefreshCw } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import TextToSpeech from '../components/TextToSpeech';
import '../styles/ChatbotPage.css';
import UserIcon from '../assets/user-icon.png'; // Import your user icon image
import BotIcon from '../assets/bot-icon.png'; // Import your bot icon image

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: "Hi there! I'm your AI learning assistant. I can help answer questions about dyslexia, using this website, or general learning tips. What would you like to know?",
      time: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const { speak, settings } = useAccessibility();

  // Scroll to top on initial render
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 1 && !isThinking) {
      scrollToBottom();
    }
  }, [messages, isThinking]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest' // Changed from 'end' to 'nearest' for less aggressive scrolling
      });
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      role: 'user',
      content: input,
      time: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    // Simulate bot thinking
    setTimeout(() => {
      const botResponse = generateBotResponse(input.trim());
      setMessages(prev => [...prev, {
        role: 'bot',
        content: botResponse,
        time: new Date()
      }]);
      setIsThinking(false);

      // Read bot's response if text-to-speech is enabled
      if (settings.textToSpeechEnabled) {
        speak(botResponse);
      }

      // Only scroll after bot responds, not after user submits
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }, 1500);
  };

  const generateBotResponse = (userInput) => {
    // Simple keyword-based responses
    const userText = userInput.toLowerCase();

    if (userText.includes('hello') || userText.includes('hi') || userText.includes('hey')) {
      return "Hello! How can I help you today with your learning?";
    }
    else if (userText.includes('games') || userText.includes('play')) {
      return "We have four main games: Reading Adventure helps with reading fluency, Letter Master helps with letter recognition, Word Builder helps with spelling and word formation, and Spell Quest helps with spelling skills. You can access them all from the Games page!";
    }
    else if (userText.includes('what is dyslexia') || userText.includes('explain dyslexia')) {
      return "Dyslexia is a learning difference that affects how the brain processes written and sometimes spoken language. It can make reading, writing, and spelling challenging, but it has nothing to do with intelligence. People with dyslexia often have strengths in creativity, problem-solving, and big-picture thinking!";
    }
    else if (userText.includes('help with reading') || userText.includes('reading tips')) {
      return "Here are some reading tips: 1) Use a ruler or bookmark to keep your place, 2) Try breaking words into smaller parts, 3) Practice reading aloud, 4) Use our Reading Adventure game to practice with support, and 5) Take breaks when you need them - short, focused reading sessions work better than long ones.";
    }
    else if (userText.includes('spelling') || userText.includes('spell better')) {
      return "To improve spelling: 1) Break words into syllables, 2) Look for patterns in words, 3) Use mnemonics to remember tricky words, 4) Practice with our Spell Quest game, and 5) Say the word out loud as you spell it to connect the sounds and letters.";
    }
    else if (userText.includes('how to use') || userText.includes('website help')) {
      return "Our website has four main sections: Games, AI Helper (that's me!), Profile, and Settings. You can use the games to practice different skills, adjust accessibility settings like font size and spacing, and track your progress in your profile. Is there a specific part you need help with?";
    }
    else if (userText.includes('settings') || userText.includes('accessibility')) {
      return "To change settings, click on the gear icon in the top right corner of any page. You can enable dyslexia-friendly font, high contrast mode, larger text, extra spacing between letters, and adjust text-to-speech settings. These features can make reading easier!";
    }
    else if (userText.includes('thank') || userText.includes('thanks')) {
      return "You're welcome! I'm always here to help. Is there anything else you'd like to know?";
    }
    else if (userText.includes('frustrated') || userText.includes('difficult') || userText.includes('hard')) {
      return "It's completely normal to feel frustrated sometimes. Learning with dyslexia can be challenging, but you're doing great by using tools that work for you. Remember that everyone learns differently, and it's okay to take breaks when you need them. What specific challenge are you facing right now?";
    }
    else {
      return "That's a great question! While I'm a simple assistant, I'd recommend trying our Reading Adventure or Word Builder games to practice reading and spelling skills. These games are designed specifically for students with dyslexia. Is there something specific about the website you'd like to know?";
    }
  };

  const startSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser. Try using Chrome or Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const resetChat = () => {
    setMessages([
      {
        role: 'bot',
        content: "Hi there! I'm your AI learning assistant. I can help answer questions about dyslexia, using this website, or general learning tips. What would you like to know?",
        time: new Date()
      }
    ]);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chatbot-page">
      <div className="chatbot-header">
        <div className="chatbot-title-container">
          <h1 className="chatbot-title">
            AI Learning Assistant
            <TextToSpeech text="AI Learning Assistant. Ask me anything about dyslexia, learning, or using this website." />
          </h1>
          <p className="chatbot-subtitle">
            Ask me anything about dyslexia, learning, or using this website
          </p>
        </div>
        <button className="reset-chat-button" onClick={resetChat}>
          <RefreshCw size={16} />
          <span>Reset Chat</span>
        </button>
      </div>

      <div className="chat-container">
        <div className="messages-container" style={{
          justifyContent: messages.length <= 1 ? 'flex-end' : 'flex-start' ,
          overflowAnchor: 'none' // Add this to prevent auto-scrolling
        }}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}
            >
              <div className="message-avatar">
                {message.role === 'user' ? (
                  <img src={UserIcon} alt="User Icon" className="profile-icon" />
                ) : (
                  <img src={BotIcon} alt="Bot Icon" className="profile-icon" />
                )}
              </div>
              <div className="message-content">
                <div className="message-text">{message.content}</div>
                <div className="message-time">{formatTime(message.time)}</div>
                {message.role === 'bot' && (
                  <div className="message-actions">
                    <TextToSpeech text={message.content} />
                  </div>
                )}
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="message bot-message">
              <div className="message-avatar">
                <img src={BotIcon} alt="Bot Icon" className="profile-icon" />
              </div>
              <div className="message-content">
                <div className="thinking-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input" onSubmit={handleSubmit}>
          <button
            type="button"
            className={`voice-input-button ${isListening ? 'listening' : ''}`}
            onClick={startSpeechRecognition}
          >
            <Mic size={20} />
          </button>

          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your question here..."
            disabled={isThinking}
          />

          <button type="submit" className="send-button" disabled={!input.trim() || isThinking}>
            <Send size={20} />
          </button>
        </form>
      </div>

      <div className="chatbot-suggestions">
        <h3>Suggested Questions</h3>
        <div className="suggestion-buttons">
          <button
            className="suggestion-button"
            onClick={() => setInput("What is dyslexia?")}
          >
            What is dyslexia?
          </button>
          <button
            className="suggestion-button"
            onClick={() => setInput("Give me some reading tips")}
          >
            Give me some reading tips
          </button>
          <button
            className="suggestion-button"
            onClick={() => setInput("How can I improve my spelling?")}
          >
            How can I improve my spelling?
          </button>
          <button
            className="suggestion-button"
            onClick={() => setInput("Tell me about the games")}
          >
            Tell me about the games
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;