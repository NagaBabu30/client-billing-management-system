import React, { useState } from "react";
import { askAI } from "../../api/aiApi";

function Chat() {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {

    if (!message.trim()) return;

    const userMessage = { role: "user", text: message };

    setMessages(prev => [...prev, userMessage]);

    const aiReply = await askAI(message);

    const aiMessage = { role: "ai", text: aiReply };

    setMessages(prev => [...prev, aiMessage]);

    setMessage("");
  };

  return (
    <div style={{ padding: "20px" }}>

      <h2>AI Billing Assistant</h2>

      <div style={{
        border: "1px solid #ccc",
        height: "400px",
        overflowY: "auto",
        padding: "10px",
        marginBottom: "10px"
      }}>

        {messages.map((msg, index) => (
          <div key={index} style={{
            textAlign: msg.role === "user" ? "right" : "left",
            marginBottom: "10px"
          }}>
            <b>{msg.role === "user" ? "You" : "AI"}:</b> {msg.text}
          </div>
        ))}

      </div>

      <input
        type="text"
        placeholder="Ask about invoices, clients..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "70%", padding: "8px" }}
      />

      <button
        onClick={sendMessage}
        style={{ padding: "8px 15px", marginLeft: "10px" }}
      >
        Send
      </button>

    </div>
  );
}

export default Chat;