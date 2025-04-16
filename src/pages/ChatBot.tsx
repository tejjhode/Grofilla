import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { BotIcon, X } from "lucide-react";


const ai = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

const quickOptions = [
  "Where is my order?",
  "Cancel order",
  "Show trending products",
  "Suggest something for me",
  "Help with returns",
];

const ChatBot = () => {
  const name = localStorage.getItem("name") || "there";
  const products = useSelector((state: any) => state.product?.products || []);
  const navigate = useNavigate();

  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMessages([
      {
        sender: "bot",
        text: `Hi ${name}! I’m Grofila AI Assistant. How can I help you today?`,
      },
    ]);
  }, [name]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");

    try {
      const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent([text]);
      const response = await result.response;
      const responseText = response.text();

      setMessages((prev) => [...prev, { sender: "bot", text: responseText }]);

      const productMatch = products.find((product: any) =>
        responseText.toLowerCase().includes(product.name.toLowerCase())
      );
      if (productMatch) {
        setTimeout(() => {
          navigate(`/product/${productMatch._id}`);
        }, 1500);
      }
    } catch (err) {
      console.error("Gemini Error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Oops! Something went wrong." },
      ]);
    }
  };

  return (
    <>
      {/* Floating Assistant Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-16 right-4 bg-green-600 text-white p-4 rounded-full shadow-lg hover:scale-105 transition"
      >
        <BotIcon />
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-6 w-80 sm:w-96 md:w-[400px] bg-white border shadow-2xl rounded-xl flex flex-col max-h-[80vh] z-50">
          <div className="bg-green-600 text-white font-bold p-3 text-sm rounded-t-xl flex justify-between items-center">
            <span>Grofila AI Assistant</span>
            <button
              onClick={() => setOpen(false)}
              className="text-white hover:bg-green-700 rounded-full p-1"
            >
              <X />
            </button>
          </div>

          <div className="p-3 flex-1 overflow-y-auto space-y-2 text-sm">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg ${
                  msg.sender === "user" ? "bg-green-100 text-right" : "bg-gray-100"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {messages.length === 1 && (
              <div className="space-y-1 pt-2">
                {quickOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(opt)}
                    className="w-full bg-gray-200 hover:bg-gray-300 rounded px-3 py-1 text-left text-sm"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex border-t p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 text-sm px-3 py-1 border rounded-l-lg focus:outline-none"
            />
            <button
              onClick={() => handleSend()}
              className="bg-green-600 text-white px-4 rounded-r-lg hover:bg-green-700"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;