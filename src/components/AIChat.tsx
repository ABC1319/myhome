import React, { useState, useEffect, useRef } from "react";
import { Send, Sparkles, Bot, User, Trash2 } from "lucide-react";
import { ChatMessage } from "../types";
import { getAssetUrl } from "../utils";
import { SITE_LOGO } from "../data";

export default function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Attempt load initial cache
    try {
      const cached = sessionStorage.getItem("homepage_chat_log");
      if (cached) {
        return JSON.parse(cached).map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
      }
    } catch (e) {}

    // Default welcoming introductory messages
    return [
      {
        id: "intro_1",
        sender: "bot",
        text: "你好呀，陌生的小伙伴！👋 我是 Sky 编写的虚拟多维智能分身。",
        timestamp: new Date()
      },
      {
        id: "intro_2",
        sender: "bot",
        text: "关于这个主页、我的开发技术栈、平时喜好的 Lofi 音轨，或者对全栈、AI 技术的见解，你都可以直接问我哦 🚀",
        timestamp: new Date()
      }
    ];
  });

  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll on dynamic logs change without page shift
  const scrollToBottom = (behavior: "smooth" | "auto" = "smooth") => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: behavior,
      });
    }
  };

  useEffect(() => {
    scrollToBottom(messages.length <= 2 ? "auto" : "smooth");
    // Cache chat logs
    sessionStorage.setItem("homepage_chat_log", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    scrollToBottom("smooth");
  }, [isTyping]);

  // Submit messages
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isTyping) return;

    const userInp = inputVal.trim();
    setInputVal("");

    const userMsg: ChatMessage = {
      id: `chat_user_${Date.now()}`,
      sender: "user",
      text: userInp,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userInp,
          history: messages // Sends whole current session window for seamless memory
        })
      });
      const data = await res.json();
      
      const botMsg: ChatMessage = {
        id: `chat_bot_${Date.now()}`,
        sender: "bot",
        text: data.text || "思绪有点乱，让我静一会儿再回复你...",
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.warn("Chat error", err);
      const botErr: ChatMessage = {
        id: `chat_bot_err_${Date.now()}`,
        sender: "bot",
        text: "哎呀，跟分身主脑服务器的连接中断了。请检查你的后台配置以及云密钥绑定情况（Secrets里面添加 GEMINI_API_KEY）！",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botErr]);
    } finally {
      setIsTyping(false);
    }
  };

  // Clear Chat History
  const handleClear = () => {
    if (confirm("确定要擦除当前所有的聊天记忆吗？")) {
      const reset = [
        {
          id: `intro_reset_${Date.now()}`,
          sender: "bot",
          text: "记忆格式化完毕。新的聊天频道已为您开启，有什么问题随时问我！🤖",
          timestamp: new Date()
        }
      ];
      setMessages(reset as ChatMessage[]);
      sessionStorage.removeItem("homepage_chat_log");
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 relative select-text">
      {/* Small Chat Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/20 select-none shrink-0">
        <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-mono font-semibold">
          <Sparkles size={12} className="animate-pulse" />
          <span>与 AI 主理分身实时会话</span>
        </div>
        <button 
          onClick={handleClear}
          className="p-1 hover:bg-black/5 rounded text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
          title="清空聊天记录"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Messages layout bubble area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto py-3 space-y-3.5 custom-scrollbar bg-transparent min-h-0 pr-1"
      >
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div 
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"} animate-fadeIn`}
            >
              {/* Profile icon */}
              <div 
                className={`w-6.5 h-6.5 rounded-full flex items-center justify-center border select-none shrink-0 ${isUser ? "bg-indigo-100 border-indigo-200" : "bg-white border-slate-200 overflow-hidden"}`}
              >
                {isUser ? (
                  <User size={10} className="text-indigo-600" />
                ) : (
                  <img src={getAssetUrl(SITE_LOGO)} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                )}
              </div>

              {/* Speech bubble */}
              <div className={`flex flex-col max-w-[78%] ${isUser ? "items-end" : "items-start"}`}>
                <div 
                  className={`px-3 py-2.5 text-xs font-sans leading-relaxed rounded-2xl ${isUser ? "bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/5 text-left" : "bg-white text-slate-800 border border-slate-200/50 rounded-tl-none shadow-xs text-left"}`}
                >
                  {msg.text}
                </div>
                
                {/* Time log */}
                <span className="text-[9px] text-slate-500 font-mono mt-1 scale-90 px-1 select-none">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start gap-2.5 flex-row">
            <div className="w-6.5 h-6.5 rounded-full flex items-center justify-center bg-white border border-slate-200 select-none shrink-0 overflow-hidden">
              <img src={getAssetUrl(SITE_LOGO)} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            
            <div className="bg-white border border-slate-200/50 p-3 rounded-2xl rounded-tl-none flex items-center space-x-1.5 animate-pulse">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
            </div>
          </div>
        )}
      </div>

      {/* Message input submitting drawer */}
      <form onSubmit={handleSend} className="pt-2 bg-transparent border-t border-slate-200/20 flex gap-1.5 items-center shrink-0">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={isTyping ? "正在思考解答中..." : "输入消息, 向 Sky 分身提问..."}
          disabled={isTyping}
          className="flex-1 text-xs px-3.5 py-2 rounded-xl glass-input bg-white/70 text-slate-800 placeholder-slate-400 font-sans focus:border-indigo-500/50 disabled:opacity-40"
        />
        <button
          type="submit"
          disabled={!inputVal.trim() || isTyping}
          className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-xl active:scale-90 transition-all shadow shadow-indigo-600/10 cursor-pointer disabled:cursor-not-allowed"
          title="发送消息"
        >
          <Send size={13} />
        </button>
      </form>
    </div>
  );
}
