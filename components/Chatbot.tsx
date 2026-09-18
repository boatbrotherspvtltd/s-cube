"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles, AlertCircle } from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
}

const INITIAL_SUGGESTIONS = [
  "Where are you located?",
  "Which solar brands do you sell?",
  "Do you have inverters & batteries?",
  "How can I purchase solar products?",
];

const INITIAL_GREETING =
  "Hello! 👋 Welcome to S-Cube Mercantile. How can I help you today? You can ask me about our solar products, authorized brands, services, or company information.";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [messageCount, setMessageCount] = useState(0);
  const [limitReached, setLimitReached] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize session and greeting
  useEffect(() => {
    let sid = "";
    try {
      sid = localStorage.getItem("scube_chat_session_id") || "";
      if (!sid) {
        sid = "scube_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now().toString(36);
        localStorage.setItem("scube_chat_session_id", sid);
      }
    } catch {
      sid = "scube_" + Math.random().toString(36).substring(2, 11);
    }
    setSessionId(sid);

    // Initial greeting if no messages yet
    setMessages([
      {
        id: "msg_init",
        sender: "bot",
        text: INITIAL_GREETING,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, []);

  // Auto-scroll to bottom on message update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && !limitReached) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, limitReached]);

  const handleSendMessage = async (queryText?: string) => {
    const text = (queryText || inputMessage).trim();
    if (!text || isLoading || limitReached) return;

    const userMessage: Message = {
      id: "usr_" + Date.now(),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          message: text,
        }),
      });

      const data = await res.json();
      const botReply = data.answer || "I'm sorry, I could not process your request right now.";

      if (typeof data.message_count === "number") {
        setMessageCount(data.message_count);
      }
      if (data.limit_reached) {
        setLimitReached(true);
      }

      const botMessage: Message = {
        id: "bot_" + Date.now(),
        sender: "bot",
        text: botReply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: "bot_err_" + Date.now(),
          sender: "bot",
          text: "I'm sorry, an error occurred while connecting. Please try again or contact us directly at Info.scubemercantile@gmail.com.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans print:hidden">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 bg-[#0b1f36] hover:bg-[#153454] text-white px-4 py-3.5 rounded-full shadow-2xl hover:shadow-[0_12px_28px_rgba(11,31,54,0.35)] transition-all duration-300 transform hover:-translate-y-0.5 border border-amber-500/20"
          aria-label="Open Solar Assistant Chatbot"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-amber-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-[#0b1f36]" />
          </div>
          <span className="text-sm font-semibold tracking-wide">Solar Assistant</span>
          <span className="inline-flex items-center justify-center bg-amber-400/20 text-amber-300 text-[10px] px-1.5 py-0.5 rounded font-mono">
            FAQ
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[380px] h-[540px] max-h-[85vh] bg-[#fbf9f5] rounded-2xl shadow-2xl border border-[#ddd6c8] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-250">
          {/* Header */}
          <div className="bg-[#0b1f36] text-white px-4 py-3.5 flex items-center justify-between border-b border-[#153454]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#153454] border border-amber-400/30 flex items-center justify-center text-amber-400">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm leading-tight text-white">S-Cube Assistant</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[11px] text-slate-300">Official Solar Product & FAQ Guide</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {messageCount > 0 && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#153454] text-amber-300 border border-amber-500/20">
                  {messageCount}/12
                </span>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#153454] transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-[#f7f4ee] to-[#fbf9f5]">
            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <div className="w-6 h-6 rounded-full bg-[#0b1f36] text-amber-400 flex-shrink-0 flex items-center justify-center mt-1">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? "bg-[#0b1f36] text-white rounded-br-xs shadow-sm"
                        : "bg-white text-[#142033] border border-[#ddd6c8] rounded-bl-xs shadow-sm"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span
                      className={`block text-[9px] mt-1 text-right ${
                        isUser ? "text-slate-300" : "text-slate-400"
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>

                  {isUser && (
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex-shrink-0 flex items-center justify-center mt-1">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading / Typing Indicator */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start items-center">
                <div className="w-6 h-6 rounded-full bg-[#0b1f36] text-amber-400 flex-shrink-0 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-[#ddd6c8] rounded-2xl rounded-bl-xs px-3.5 py-2 flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" />
                </div>
              </div>
            )}

            {/* Suggestions Chips (shown when few messages) */}
            {messages.length <= 2 && !isLoading && !limitReached && (
              <div className="pt-2 space-y-1.5">
                <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Suggested questions:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {INITIAL_SUGGESTIONS.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(sug)}
                      className="text-[11px] bg-white hover:bg-amber-50 text-[#0b1f36] border border-[#ddd6c8] hover:border-amber-400 rounded-full px-2.5 py-1 transition-colors text-left"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Limit Reached Warning banner */}
            {limitReached && (
              <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Session query limit reached (12/12)</p>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    For direct quotes or custom orders, contact{" "}
                    <a
                      href="mailto:Info.scubemercantile@gmail.com"
                      className="underline font-semibold"
                    >
                      Info.scubemercantile@gmail.com
                    </a>
                    .
                  </p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer / Input Area */}
          <div className="p-3 bg-white border-t border-[#ddd6c8]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading || limitReached}
                placeholder={
                  limitReached
                    ? "Session limit reached. Contact dealer."
                    : "Ask about panels, inverters, location..."
                }
                className="flex-1 bg-[#f7f4ee] text-xs sm:text-sm text-[#142033] placeholder:text-slate-400 border border-[#ddd6c8] focus:border-[#0b1f36] focus:outline-none rounded-xl px-3 py-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                maxLength={200}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim() || limitReached}
                className="bg-[#0b1f36] hover:bg-[#153454] disabled:bg-slate-300 text-white p-2 rounded-xl transition-colors disabled:cursor-not-allowed flex-shrink-0 shadow-sm"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between mt-1.5 px-1 text-[10px] text-slate-400">
              <span>S-Cube Mercantile Solar</span>
              <span>Answers from verified FAQ</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
