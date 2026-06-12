import React, { useState } from "react";
import { Github, BookOpen, Activity, Wrench, FolderOpen, ShieldCheck, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SiteLink {
  name: string;
  desc: string;
  url: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

export default function NavigatorGrid() {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const sites: SiteLink[] = [
    {
      name: "oiio-nav",
      desc: "oiio-nav",
      url: "https://oiio-nav.pages.dev/",
      icon: <Github size={18} className="text-gray-300 group-hover:text-white transition-colors" />,
      badge: "oiio-nav",
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    },
    {
      name: "aigc",
      desc: "aigc",
      url: "https://aigc.13145219.xyz/",
      icon: <BookOpen size={18} className="text-emerald-400 group-hover:text-emerald-300 transition-colors" />,
      badge: "aigc",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    },
    {
      name: "webdesk-pro",
      desc: "webdesk-pro",
      url: "https://webdesk-pro.13145219.xyz/",
      icon: <Activity size={18} className="text-cyan-400 group-hover:text-cyan-300 transition-colors" />,
      badge: "webdesk-pro",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    },
    {
      name: "wangpandh",
      desc: "wangpandh",
      url: "https://wangpandh.vercel.de5.net/",
      icon: <Wrench size={18} className="text-amber-400 group-hover:text-amber-300 transition-colors" />,
    },
    {
      name: "X主页",
      desc: "X主页",
      url: "https://so.13145219.xyz/",
      icon: <FolderOpen size={18} className="text-purple-400 group-hover:text-purple-300 transition-colors" />,
    },
    {
      name: "navdh",
      desc: "navdh",
      url: "https://navdh.13145219.xyz/",
      icon: <ShieldCheck size={18} className="text-rose-400 group-hover:text-rose-300 transition-colors" />,
      badge: "navdh",
      badgeColor: "bg-rose-500/10 text-rose-300 border-rose-500/20",
    },
    {
      name: "navita-new",
      desc: "navita-new",
      url: "https://navita-new.13145219.xyz/",
      icon: <Github size={18} className="text-gray-300 group-hover:text-white transition-colors" />,
      badge: "navita-new",
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    },
    {
      name: "agnes-ai",
      desc: "agnes-ai",
      url: "https://agnes-ai.13145219.xyz/",
      icon: <BookOpen size={18} className="text-emerald-400 group-hover:text-emerald-300 transition-colors" />,
      badge: "agnes-ai",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    },
    {
      name: "noisedh-nav",
      desc: "noisedh-nav",
      url: "https://noisedh-nav.jbt.de5.net/",
      icon: <Activity size={18} className="text-cyan-400 group-hover:text-cyan-300 transition-colors" />,
      badge: "noisedh-nav",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    },
    {
      name: "pro-pintree",
      desc: "pro-pintree",
      url: "https://pro-pintree.vercel.de5.net/",
      icon: <Wrench size={18} className="text-amber-400 group-hover:text-amber-300 transition-colors" />,
    },
    {
      name: "cwj",
      desc: "cwj",
      url: "https://cwj.pages.dev/",
      icon: <FolderOpen size={18} className="text-purple-400 group-hover:text-purple-300 transition-colors" />,
    },
    {
      name: "navhubi",
      desc: "navhubi",
      url: "https://navhubi.vercel.de5.net/",
      icon: <ShieldCheck size={18} className="text-rose-400 group-hover:text-rose-300 transition-colors" />,
      badge: "navhubi",
      badgeColor: "bg-rose-500/10 text-rose-300 border-rose-500/20",
    },
  ];

  const itemsPerPage = 6;
  const totalPages = Math.ceil(sites.length / itemsPerPage);

  const paginate = (newPage: number) => {
    setDirection(newPage > currentPage ? 1 : -1);
    setCurrentPage(newPage);
  };

  const currentSites = sites.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 120 : -120,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 28 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
      },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 120 : -120,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 28 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      },
    }),
  };

  return (
    <div className="relative w-full overflow-hidden flex flex-col justify-between select-none min-h-[295px]">
      
      {/* Sliding Content Track with drag features */}
      <div className="flex-1 w-full min-h-[235px] relative">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentPage}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.35}
            onDragEnd={(e, { offset, velocity }) => {
              const swipeThreshold = 60;
              if (offset.x < -swipeThreshold && currentPage < totalPages - 1) {
                paginate(currentPage + 1);
              } else if (offset.x > swipeThreshold && currentPage > 0) {
                paginate(currentPage - 1);
              }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1 w-full h-full cursor-grab active:cursor-grabbing"
          >
            {currentSites.map((site, index) => (
              <a
                key={`${site.name}-${index}`}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-start gap-3 p-3.5 bg-white/45 hover:bg-white border border-slate-200/50 hover:border-indigo-500/20 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 cursor-pointer shadow-sm select-none"
              >
                {/* Left Icon Panel */}
                <div className="p-2 bg-slate-100/80 group-hover:bg-indigo-50 rounded-lg group-hover:scale-105 transition-all">
                  {site.icon}
                </div>

                {/* Text Info */}
                <div className="flex-1 min-w-0 text-left space-y-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[13px] font-sans font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {site.name}
                    </span>
                    {site.badge && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono border ${site.badgeColor}`}>
                        {site.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal truncate group-hover:text-slate-700 transition-colors">
                    {site.desc}
                  </p>
                </div>

                {/* Hover indicator link out icon */}
                <div className="absolute right-2.5 top-2.5 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600 transition-opacity duration-300">
                  <ExternalLink size={10} />
                </div>
              </a>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Paginated Dots Area */}
      <div className="flex justify-center items-center gap-2 mt-4 py-2 border-t border-slate-200/15 z-10">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => paginate(i)}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              currentPage === i 
                ? "w-6 bg-indigo-600 shadow-md shadow-indigo-500/20" 
                : "w-2 bg-slate-300/60 hover:bg-slate-400 dark:bg-white/20 dark:hover:bg-white/40"
            }`}
            title={`转到第 ${i + 1} 页`}
            aria-label={`Go to page ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
