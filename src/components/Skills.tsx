import React from "react";
import { Terminal, Laptop, Code, Award, Coffee, Music, Cpu } from "lucide-react";

interface SkillItem {
  name: string;
  level: number;
  color: string;
}

export default function Skills() {
  const skills: SkillItem[] = [
    { name: "React / TypeScript / Vite", level: 92, color: "from-sky-500 to-indigo-500" },
    { name: "Node.js / Express / CJS / ESM", level: 88, color: "from-green-500 to-emerald-500" },
    { name: "Python / Data Analytics / AI Agenting", level: 82, color: "from-amber-400 to-orange-500" },
    { name: "Cloud SQL / Firebase Firestore / Redis", level: 75, color: "from-rose-500 to-pink-500" },
    { name: "Tailwind CSS v4 / Motion React / Glasmorphism Style", level: 95, color: "from-purple-500 to-sky-400" },
  ];

  const statCards = [
    { name: "编辑器", val: "VS Code / Cursor", icon: <Laptop size={14} className="text-indigo-400" /> },
    { name: "咖啡摄入", val: "≈ 450 杯 / 年", icon: <Coffee size={14} className="text-amber-400" /> },
    { name: "主音轨", val: "Chill Lofi / Future Bass", icon: <Music size={14} className="text-pink-400" /> },
    { name: "微机系统", val: "macOS / Arch Linux", icon: <Cpu size={14} className="text-emerald-400" /> },
  ];

  return (
    <div className="space-y-4 p-1">
      {/* Visual skills percentage sliders */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-mono select-none">
          <Terminal size={12} />
          <span>开发技能架构 (SKILL MATRIX)</span>
        </div>
        
        <div className="space-y-2.5">
          {skills.map((skill, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-sans font-medium">
                <span className="text-slate-800">{skill.name}</span>
                <span className="text-indigo-600 font-mono">{skill.level}%</span>
              </div>
              
              {/* Progress track */}
              <div className="h-1.5 w-full bg-slate-100/90 rounded-full overflow-hidden border border-slate-200/50">
                <div 
                   className={`h-full rounded-full bg-gradient-to-r ${skill.color} transition-all duration-1000 ease-out`}
                   style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid lifestyle statistics card details */}
      <div className="border-t border-slate-200/50 pt-3.5 space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-mono select-none">
          <Award size={12} />
          <span>极客日常指标 (VITAL STATS)</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {statCards.map((stat, idx) => (
            <div 
              key={idx}
              className="flex items-center gap-2 p-2 bg-white/45 border border-slate-200/50 rounded-lg text-left hover:bg-white shadow-xs transition-colors"
            >
              <div className="p-1.5 bg-slate-100 rounded-md">
                {stat.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-slate-500 font-sans tracking-wide uppercase">{stat.name}</p>
                <p className="text-[11px] text-slate-700 mt-0.5 truncate font-medium font-sans">{stat.val}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
