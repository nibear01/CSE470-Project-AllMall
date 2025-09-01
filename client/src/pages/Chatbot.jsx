import { useState, useRef, useEffect } from "react";
import { AiOutlineClose, AiOutlineRobot, AiOutlineSend } from "react-icons/ai";
import { useAuth } from "../Store/Auth";

const Chatbot = () => {
  const { url } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hi there! 👋 I'm your AllMall assistant. How can I help with your shopping today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const chatEndRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Add user message to chat
    const userMessage = input.trim();
    setMessages((prev) => [...prev, { type: "user", text: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${url}/api/chatbot/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ input: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();

      // Add bot response
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: data.reply || "I'm not sure how to respond to that.",
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "Sorry, I'm having trouble connecting. In the meantime, feel free to browse our products or check our FAQ section!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to bottom when a new message is added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Chatbot Floating Button */}
      <button
        className="fixed !bottom-6 !right-6 !bg-gradient-to-r !from-emerald-500 !to-teal-600 !text-white !p-4 !rounded-full !shadow-2xl !z-[1000] !hover:scale-110 !transition-transform !duration-300 !border-2 !border-white !important"
        onClick={toggleChat}
        aria-label="Open chat"
      >
        <div className="relative">
          <AiOutlineRobot className="!w-7 !h-7 !important" />
          {!isOpen && (
            <span className="!absolute !-top-2 !-right-2 !w-5 !h-5 !bg-rose-500 !rounded-full !flex !items-center !justify-center !text-xs !font-bold !important">
              !
            </span>
          )}
        </div>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed !h-[550px] !bottom-24 !right-5 !w-[350px] !bg-white 
          !rounded-2xl !shadow-2xl !z-[999] !flex !flex-col !overflow-hidden !transition-all !duration-500 !ease-in-out !border !border-emerald-200 !important
          ${
            isOpen
              ? "!translate-y-0 !opacity-100 !visible !important"
              : "!translate-y-40 !opacity-0 !invisible !important"
          }`}
      >
        {/* Header with Gradient */}
        <div className="!flex !justify-between !items-center !py-4 !px-5 !bg-gradient-to-r !from-emerald-600 !to-teal-700 !text-white !shadow-md !important">
          <div className="!flex !items-center !gap-3">
            <div className="!relative">
              <AiOutlineRobot className="!w-7 !h-7 !important" />
              <span className="!absolute !-bottom-1 !-right-1 !w-3 !h-3 !bg-green-400 !rounded-full !border-2 !border-white !important"></span>
            </div>
            <div>
              <h3 className="!font-bold !text-lg !important">
                AllMall Assistant
              </h3>
              <p className="!text-xs !text-emerald-100 !important">
                Online • Ready to help
              </p>
            </div>
          </div>
          <button
            onClick={toggleChat}
            className="!text-white !hover:bg-white/20 !p-1 !rounded-full !transition-colors !duration-200 !important"
            aria-label="Close chat"
          >
            <AiOutlineClose className="!w-5 !h-5 !important" />
          </button>
        </div>

        {/* Chat Body */}
        <div className="!flex-1 !p-4 !overflow-y-auto !space-y-3 !bg-gradient-to-b !from-emerald-50 !to-gray-100 !important">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`!p-4 !rounded-2xl !max-w-[85%] !shadow-sm !transition-all !duration-300 !hover:shadow-md !important
                ${
                  msg.type === "bot"
                    ? "!bg-white !text-gray-800 !self-start !rounded-bl-none !border !border-emerald-100 !important"
                    : "!bg-gradient-to-r !from-emerald-600 !to-teal-600 !text-white !self-end !rounded-br-none !shadow-md !important"
                }`}
            >
              <p className="!text-sm !leading-relaxed !important">{msg.text}</p>
              <p
                className={`!text-xs !mt-2 !opacity-70 !important ${
                  msg.type === "bot" ? "!text-emerald-600" : "!text-emerald-100"
                }`}
              >
                {msg.type === "bot" ? "AllMall Assistant" : "You"} • Just now
              </p>
            </div>
          ))}

          {isLoading && (
            <div className="!p-4 !rounded-2xl !bg-white !text-gray-800 !self-start !rounded-bl-none !max-w-[85%] !border !border-emerald-100 !shadow-sm !important">
              <div className="!flex !items-center !space-x-2 !important">
                <div className="!w-2 !h-2 !bg-emerald-500 !rounded-full !animate-bounce !important"></div>
                <div
                  className="!w-2 !h-2 !bg-emerald-500 !rounded-full !animate-bounce !important"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="!w-2 !h-2 !bg-emerald-500 !rounded-full !animate-bounce !important"
                  style={{ animationDelay: "0.4s" }}
                ></div>
                <span className="!text-sm !text-emerald-700 !ml-2 !important">
                  Thinking...
                </span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} className="!h-4 !important"></div>
        </div>

        {/* Input Area */}
        <div className="!flex !items-center !p-4 !bg-white !border-t !border-emerald-200 !shadow-inner !important">
          <input
            type="text"
            placeholder="Type your message here..."
            className="!flex-1 !p-3 !border !border-emerald-300 
            !rounded-l-xl !focus:outline-none !focus:ring-2 !focus:ring-emerald-400 !focus:border-transparent
            !transition-all !duration-200 !text-sm !important"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isLoading}
          />
          <button
            className="!bg-gradient-to-r !from-emerald-500 !to-teal-600 !text-white !p-3 !rounded-r-xl !hover:from-emerald-600 !hover:to-teal-700 
            !transition-all !duration-200 !disabled:from-gray-400 !disabled:to-gray-500 !disabled:cursor-not-allowed !shadow-md !important"
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
          >
            <AiOutlineSend className="!w-5 !h-5 !important" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
