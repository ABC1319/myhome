import React, { useState, useEffect } from "react";
import { Send, MessageSquare, Clock, Sparkles, User, UserCheck } from "lucide-react";
import { GuestbookMessage } from "../types";

export default function AIGuestbook() {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("开发人员");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/guestbook");
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (e) {
      console.warn("Failed to load guestbook", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    setIsSubmitting(true);
    
    // Create optimistic local UI entry with typing animation
    const tempId = `optimistic_${Date.now()}`;
    const optimisticMsg: GuestbookMessage = {
      id: tempId,
      name: name.trim(),
      role: role,
      content: content.trim(),
      timestamp: "刚刚",
      reply: "",
      isAiReplying: true // Shows active thinking bubble
    };

    setMessages((prev) => [optimisticMsg, ...prev]);

    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          role: role,
          content: content.trim()
        })
      });

      const data = await res.json();
      if (data.success) {
        // Swap optimistic trace with actual response
        setMessages((prev) => 
          prev.map((m) => m.id === tempId ? { ...data.message, isAiReplying: false } : m)
        );
        setContent("");
      } else {
        // Remove optimistic state on error
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        alert("提交失败：" + data.message);
      }
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      console.warn("Submission failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const identityRoles = ["开发人员", "UI设计师", "学生/科研者", "内容创作者", "路人常客"];

  return (
    <div className="space-y-4 p-1">
      {/* Messages creation form block */}
      <form onSubmit={handleSubmit} className="bg-white/45 border border-slate-200/50 p-3.5 rounded-xl space-y-3 shadow-sm">
        <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-mono select-none">
          <MessageSquare size={13} />
          <span>书写留言卡 (LEAVE A GUEST CARD)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Nickname input */}
          <div className="space-y-1 text-left">
            <label className="text-[10px] text-slate-500 font-mono uppercase">你如何称呼 (Name)</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="张三 / Guest"
              className="w-full text-xs px-3 py-2 rounded-lg glass-input text-slate-800 bg-white placeholder-slate-400 font-sans"
            />
          </div>

          {/* Identity role selector */}
          <div className="space-y-1 text-left">
            <label className="text-[10px] text-slate-500 font-mono uppercase">我的身份 (Identity)</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg glass-input text-slate-700 bg-white font-sans cursor-pointer focus:text-slate-900"
            >
              {identityRoles.map((r) => (
                <option key={r} value={r} className="bg-white text-slate-800">
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Text message details field */}
        <div className="space-y-1 text-left">
          <label className="text-[10px] text-slate-500 font-mono uppercase">我的留言内容 (Comment)</label>
          <textarea
            required
            rows={2}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="好久不见，你的主页设计的非常有特色！支持一波~"
            className="w-full text-xs px-3 py-2 rounded-lg glass-input text-slate-800 bg-white placeholder-slate-400 font-sans resize-none"
          ></textarea>
        </div>

        {/* Submit button */}
        <div className="flex justify-end pt-0.5">
          <button
            type="submit"
            disabled={isSubmitting || !name.trim() || !content.trim()}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-300/40 text-xs text-white font-semibold rounded-lg shadow-md hover:shadow-indigo-500/10 active:scale-95 transition-all select-none cursor-pointer disabled:cursor-not-allowed"
          >
            <Send size={11} />
            <span>{isSubmitting ? "正在递交..." : "提交留言并呼唤 AI 应答"}</span>
          </button>
        </div>
      </form>

      {/* Dynamic comments feed directory */}
      <div className="space-y-3.5 pt-1.5">
        <div className="flex items-center justify-between text-xs text-slate-500 font-mono select-none">
          <span>留言流 (COMMENT FEED)</span>
          <span>共 {messages.length} 条</span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10 space-x-2">
            <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce"></div>
            <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-550 font-sans">
            还没有留言呢，快写第一条给作者留下脚印吧 👣
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className="bg-white/45 border border-slate-200/50 rounded-xl p-3.5 space-y-2.5 text-left transition-all hover:bg-white shadow-xs"
              >
                {/* Message banner */}
                <div className="flex items-center justify-between">
                  {/* User profile tags */}
                  <div className="flex items-center gap-2">
                    <div className="w-6.5 h-6.5 rounded-full bg-indigo-50 border border-indigo-200/60 flex items-center justify-center">
                      <User size={11} className="text-indigo-600" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-800 font-sans">{msg.name}</span>
                      <span className="text-[10px] ml-1.5 px-1.5 py-0.2 bg-slate-100 rounded border border-slate-200 text-slate-600 font-sans text-scale">
                        {msg.role}
                      </span>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                    <Clock size={10} />
                    <span>{msg.timestamp}</span>
                  </div>
                </div>

                {/* Main body content */}
                <p className="text-xs text-slate-700 font-sans pl-1.5 border-l-2 border-indigo-400 py-0.5 leading-relaxed">
                  {msg.content}
                </p>

                {/* Linked smart response bubble from owners virtual persona */}
                {msg.isAiReplying ? (
                  <div className="bg-indigo-50/50 border border-indigo-200 rounded-lg p-2.5 space-y-1 animate-pulse">
                    <div className="flex items-center gap-1 text-[10px] text-indigo-600 font-mono">
                      <Sparkles size={11} className="animate-spin" />
                      <span>AI 主理分身正在仔细审阅并拟定回复...</span>
                    </div>
                  </div>
                ) : msg.reply ? (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 space-y-1 text-left relative overflow-hidden group">
                    {/* Decorative backdrop ambient light */}
                    <div className="absolute top-0 right-0 w-12 h-12 bg-indigo-500/5 filter blur-md rounded-full pointer-events-none"></div>
                    
                    <div className="flex items-center gap-1.5 text-[10px] text-indigo-700 font-mono font-semibold">
                      <UserCheck size={11} className="text-indigo-600" />
                      <span>Sky 的主理分身 (AI Assistant)</span>
                      <span className="text-[9px] scale-90 px-1 py-0.1 bg-indigo-600 text-white border border-indigo-500/20 rounded font-bold font-sans">
                        REPLY
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 pl-1 leading-relaxed mt-1 font-sans">
                      「 {msg.reply} 」
                    </p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
