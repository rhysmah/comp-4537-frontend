// HomePage.js
import React, { useState, useEffect } from "react";
import "./HomePage.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const generateImage = async () => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === "assistant") {
      const response = await fetch("http://localhost:3000/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: lastMessage.content }),
      });
      if (response.ok) {
        const data = await response.json();
        setImageUrl(data.imageUrl);
      } else {
        console.error("Error generating image");
      }
    }
  };

  useEffect(() => {
    const initialUserMessage = {
      role: "user",
      content: "I am ready to start the Choose Your Own Adventure Game!",
    };
    fetchAssistantReply([initialUserMessage]);
  }, []);

  const fetchAssistantReply = async (messageHistory) => {
    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: messageHistory }),
    });
    const data = await response.json();
    setMessages([
      ...messages,
      messageHistory[messageHistory.length - 1],
      { role: "assistant", content: data.message },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userMessage = { role: "user", content: input };
    setInput("");
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    fetchAssistantReply(updatedMessages);
  };

  return (
    <div className="app">
      <h1>Choose Your Own Adventure Game!</h1>
      <div className="game-container">
        <div className="chat-window">
          {messages.map((message, index) => (
            <div key={index} className={`chat-bubble ${message.role}`}>
              {message.content}
            </div>
          ))}
        </div>
        {imageUrl && (
          <div className="image-container">
            <img src={imageUrl} alt="Generated Scene" />
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
      <button onClick={generateImage}>Generate Image</button>
    </div>
  );
}

export default App;
