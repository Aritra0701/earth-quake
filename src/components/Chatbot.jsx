import { useState, useRef, useEffect } from "react";

const Chatbot = () => {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  //   console.log(apiKey);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: "bot" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const newMessages = [...messages, { text: inputValue, sender: "user" }];
    setMessages(newMessages);
    setInputValue("");

    // Wait for the async bot response
    const botResponse = await generateBotResponse(inputValue);
    setMessages([...newMessages, { text: botResponse, sender: "bot" }]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const generateBotResponse = async (userInput) => {
    const input = userInput.toLowerCase().trim();

    if (/weather|forecast|temperature|rain|sunny/.test(input)) {
      const cityMatch = input.match(/in\s+([a-zA-Z\s]+)/);
      const city = cityMatch ? cityMatch[1].trim() : "Kolkata";

      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = await res.json();

        if (data.cod === 200) {
          return `The weather in ${data.name} is ${data.weather[0].description} with a temperature of ${data.main.temp}°C.`;
        } else {
          return `Sorry, I couldn't find the weather for "${city}". Please try another city.`;
        }
      } catch (error) {
        return "Oops! I had trouble fetching the weather data. Try again later.";
      }
    }

    if (/hello|hi|hey|greetings|what's up|howdy/.test(input)) {
      return "Hi there! How can I assist you today?";
    } else if (/help|support|assistance|problem|issue/.test(input)) {
      return "I can help with various topics. Are you looking for technical support, general information, or something else?";
    } else if (/thanks|thank you|appreciate|grateful|cheers|thx/.test(input)) {
      return "You're very welcome! Let me know if there's anything else I can do for you.";
    } else if (/bye|goodbye|see you|later|farewell|adios/.test(input)) {
      return "Goodbye! Have a wonderful day! Come back if you have more questions.";
    } else if (/name|who are you|what are you|identify|yourself/.test(input)) {
      return "I'm an AI chatbot designed to answer questions and provide assistance. You can call me HelperBot!";
    } else if (
      /who made you|who created you|who is your creator|who are you made by|who built you/.test(
        input
      )
    ) {
      return "I was created by Aritra halder. You can find me on GitHub at https://github.com/Aritra0701";
    } else if (/time|date|day|today|current|now/.test(input)) {
      const now = new Date();
      return `Today is ${now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}. The current time is ${now.toLocaleTimeString()}.`;
    } else if (/weather|forecast|temperature|rain|sunny/.test(input)) {
      return "I can't check live weather, but you might want to try a weather service or app for accurate forecasts.";
    } else if (/joke|funny|make me laugh|humor/.test(input)) {
      const jokes = [
        "Why don't scientists trust atoms? Because they make up everything!",
        "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them!",
        "Why don't skeletons fight each other? They don't have the guts!",
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    } else if (/what can you do|abilities|features|capabilities/.test(input)) {
      return "I can answer questions, tell jokes, provide the current time and date, and have simple conversations. I'm always learning new skills!";
    } else if (/how are you|how's it going|how do you feel/.test(input)) {
      return "I'm just a program, so I don't have feelings, but I'm functioning perfectly! How about you?";
    } else {
      const suggestions = [
        "Could you rephrase that?",
        "I'm not sure I understand. Try asking about time, date, or requesting a joke!",
        "I'm still learning. Maybe try a different question?",
      ];
      return suggestions[Math.floor(Math.random() * suggestions.length)];
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chatbot-container">
      {isOpen ? (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Chatbot</h3>
            <button className="minimize-btn" onClick={toggleChat}>
              −
            </button>
          </div>
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      ) : (
        <button className="chatbot-button" onClick={toggleChat}>
          Chat
        </button>
      )}

      <style jsx>{`
        .chatbot-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          font-family: Arial, sans-serif;
        }

        .chatbot-button {
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          transition: all 0.3s;
        }

        .chatbot-button:hover {
          background-color: #45a049;
          transform: scale(1.05);
        }

        .chatbot-window {
          width: 350px;
          height: 500px;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .chatbot-header {
          background-color: #4caf50;
          color: white;
          padding: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chatbot-header h3 {
          margin: 0;
          font-size: 18px;
        }

        .minimize-btn {
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          padding: 0 5px;
        }

        .chatbot-messages {
          flex: 1;
          padding: 15px;
          overflow-y: auto;
          background-color: #f9f9f9;
        }

        .message {
          margin-bottom: 10px;
          padding: 8px 12px;
          border-radius: 18px;
          max-width: 80%;
          word-wrap: break-word;
        }

        .user {
          background-color: #4caf50;
          color: white;
          margin-left: auto;
          border-bottom-right-radius: 5px;
        }

        .bot {
          background-color: #e5e5ea;
          color: black;
          margin-right: auto;
          border-bottom-left-radius: 5px;
        }

        .chatbot-input {
          display: flex;
          padding: 10px;
          border-top: 1px solid #ddd;
          background-color: white;
        }

        .chatbot-input input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 20px;
          outline: none;
        }

        .chatbot-input button {
          margin-left: 10px;
          padding: 10px 15px;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
        }

        .chatbot-input button:hover {
          background-color: #45a049;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
