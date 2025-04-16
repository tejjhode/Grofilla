import React, { useEffect, useState, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { BotIcon, X, Circle } from "lucide-react";

const ai = new GoogleGenerativeAI("AIzaSyBAKnPo6A-bvAsuQbeMbBFgDl3bF9V-3TM");

type Message = { sender: "user" | "bot"; text: string };

const ChatBot: React.FC = () => {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const name = localStorage.getItem("name") || "there";

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessages([
      {
        sender: "bot",
        text: `Hi ${name}! 👋 I’m Grofilla’s AI Assistant. How can I help you today?`,
      },
    ]);
  }, [name]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const append = (msg: Message) => setMessages((m) => [...m, msg]);

  const handleSend = async (rawText?: string) => {
    const text = (rawText ?? input).trim();
    if (!text || loading) return;

    append({ sender: "user", text });
    setInput("");
    setLoading(true);

    try {
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Dynamic prompt for Gemini to handle various queries
      const prompt = `
You are a helpful AI assistant for an Indian e-commerce grocery delivery platform called "Grofilla".
You are capable of answering a variety of user queries related to:
1. Tracking orders
2. Canceling orders
3. Suggesting grocery items or popular products (like rice, spices, vegetables)
4. Recommending products in categories like smartphones, laptops, and electronics
5. Providing general assistance with the website

Always answer in a friendly, polite, and easy-to-understand tone, suitable for Indian users. Keep your answers short, clear, and to the point.

User query: "${text}"
Answer with helpful suggestions or solutions.Do not ask futher question in detailed.
if user ask to suggest the product ask only budgest and purpose only.
`;

      // Get the response from Gemini
      const result = await model.generateContent([prompt]);
      const reply = result.response.text().trim();
      
      // Append bot's response to the chat
      append({ sender: "bot", text: reply });
    } catch (e) {
      console.error(e);
      append({
        sender: "bot",
        text: "😞 Sorry, something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Chat Icon */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-16 right-6 bg-green-600 text-white p-3 rounded-full shadow-lg hover:scale-105 transition"
      >
        <BotIcon size={20} />
      </button>

      {open && (
        <div className="fixed bottom-28 right-6 w-80 sm:w-96 bg-white border shadow-xl rounded-xl flex flex-col max-h-[80vh] z-50">
          {/* Header */}
          <div className="bg-green-600 text-white px-4 py-2 rounded-t-xl flex justify-between items-center">
            <span className="font-semibold">Grofilla AI Assistant</span>
            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-green-700 rounded-full"
            >
              <X size={16} />
            </button>
          </div>

          {/* Chat Body */}
          <div
            ref={chatEndRef}
            className="p-3 flex-1 overflow-y-auto space-y-2 flex flex-col"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[80%] px-3 py-2 rounded-xl text-sm whitespace-pre-wrap ${
                  m.sender === "user"
                    ? "self-end bg-green-100 text-right"
                    : "self-start bg-gray-100 text-left"
                }`}
              >
                {m.text}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-1 self-start">
                <Circle className="animate-pulse text-green-600" size={8} />
                <Circle className="animate-pulse text-green-600 delay-75" size={8} />
                <Circle className="animate-pulse text-green-600 delay-150" size={8} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex border-t px-2 py-1">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message…"
              className="flex-1 px-3 py-1 text-sm border rounded-l-lg focus:outline-none"
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