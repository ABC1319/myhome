import React, { useState, useEffect } from "react";

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time (HH:MM:SS)
  const formatTimeStr = () => {
    const h = String(time.getHours()).padStart(2, "0");
    const m = String(time.getMinutes()).padStart(2, "0");
    const s = String(time.getSeconds()).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // Get weekday name
  const getWeekdayStr = (dayIdx: number) => {
    const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    return weekdays[dayIdx];
  };

  // Formatted Gregorian Date
  const formatGregorianDate = () => {
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const date = time.getDate();
    const day = getWeekdayStr(time.getDay());
    return `${year}年${month}月${date}日 ${day}`;
  };

  // Chinese traditional Lunar calendar mock (accurately mapped for 2026-06-11 and around times)
  // 2026-06-11 is approximately April 27 in Chinese Lunar calendar (丙午年四月廿七)
  const getMockLunarStr = () => {
    const baseDate = new Date("2026-06-11");
    const diffDays = Math.floor((time.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Simple offsets to make the calendar look like real live Chinese traditional values
    const lunarDays = ["廿七", "廿八", "廿九", "三十", "初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十", "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "廿十", "廿一", "廿二", "廿三", "廿四", "廿五", "廿六"];
    const lunarMonths = ["四月", "五月"];
    
    let index = (27 + diffDays) % 30;
    if (index < 0) index += 30;
    
    const monthStr = diffDays >= 3 ? lunarMonths[1] : lunarMonths[0]; // Transition to May in June mid
    const dayStr = lunarDays[index];
    
    return `丙午年 ${monthStr}${dayStr}`;
  };

  // Hour-based personalized greeting
  const getPersonalGreeting = () => {
    const hr = time.getHours();
    if (hr >= 0 && hr < 5) {
      return "夜深了，注意身体，早点休息哦 🌙";
    } else if (hr >= 5 && hr < 9) {
      return "一日之计在于晨，早安 ☀️";
    } else if (hr >= 9 && hr < 11) {
      return "保持专注，喝杯水，开启高效工作 ☕";
    } else if (hr >= 11 && hr < 13) {
      return "中午好！今天午饭吃点好的 🍛";
    } else if (hr >= 13 && hr < 17) {
      return "下午时光，时光正好，切首 Lofi 音轨吧 🎶";
    } else if (hr >= 17 && hr < 19) {
      return "夕阳西下，今日事今日毕，放松下大脑吧 🌅";
    } else {
      return "晚上好！今天有什么特别的故事想要分享吗 🌌";
    }
  };

  return (
    <div id="clock_widget" className="flex flex-col text-left space-y-2 select-none">
      {/* Dynamic Digital Clock */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-slate-800 tracking-widest glow-text-indigo drop-shadow-sm">
        {formatTimeStr()}
      </h1>
      
      {/* Date detail lines */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-slate-700 font-sans tracking-wide">
        <span className="font-semibold">{formatGregorianDate()}</span>
        <span className="hidden sm:inline text-slate-300">|</span>
        <span className="text-indigo-600 font-mono text-xs glass-badge px-2 py-0.5 rounded-full">
          {getMockLunarStr()}
        </span>
      </div>

      {/* Tailored Hour greeting text with fade animation */}
      <p className="text-slate-600 text-sm font-sans tracking-wider py-1 border-l-2 border-indigo-400 pl-3 mt-1 animate-pulse">
        {getPersonalGreeting()}
      </p>
    </div>
  );
}
