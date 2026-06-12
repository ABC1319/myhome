import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, ListMusic, Repeat } from "lucide-react";

interface Track {
  title: string;
  artist: string;
  url: string;
  cover: string;
}

export default function MusicPlayer() {
  const songs: Track[] = [
    {
      title: "Starry Night Waves",
      artist: "Dreamscape Lofi",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      cover: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150&q=80",
    },
    {
      title: "Late Night Rain Cafe",
      artist: "Ambient Wanderer",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      cover: "https://images.unsplash.com/photo-1483821838886-899463c45224?w=150&q=80",
    },
    {
      title: "Midnight Station",
      artist: "Jazz Code Lab",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&q=80",
    },
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize and bind audio listeners
  useEffect(() => {
    const audio = new Audio(songs[currentIdx].url);
    audioRef.current = audio;
    audio.volume = volume;

    const setAudioData = () => {
      setDuration(audio.duration || 0);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      handleNext();
    };

    // Add listeners
    audio.addEventListener("loadeddata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);
    audio.addEventListener("ended", handleEnded);

    // Auto play if already playing
    if (isPlaying) {
      audio.play().catch((err) => console.log("Auto-play blocked or error:", err));
    }

    return () => {
      audio.pause();
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
      audio.removeEventListener("ended", handleEnded);
      audioRef.current = null;
    };
  }, [currentIdx]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => console.log("Play failed", e));
    }
  };

  const handleNext = () => {
    setCurrentIdx((prevIdx) => (prevIdx + 1) % songs.length);
  };

  const handlePrev = () => {
    setCurrentIdx((prevIdx) => (prevIdx - 1 + songs.length) % songs.length);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const seekVal = parseFloat(e.target.value);
    audioRef.current.currentTime = seekVal;
    setCurrentTime(seekVal);
  };

  // Format second counts to MM:SS
  const formatTime = (timeInSecs: number) => {
    const min = Math.floor(timeInSecs / 60);
    const sec = Math.floor(timeInSecs % 60);
    return `${min}:${String(sec).padStart(2, "0")}`;
  };

  const track = songs[currentIdx];

  return (
    <div className="flex flex-col md:flex-row items-center gap-4.5 p-3.5 bg-white/45 rounded-xl border border-slate-200/50 shadow-inner">
      {/* Circle Rotating Vinyl Disc */}
      <div className="relative flex-shrink-0 w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center select-none">
        {/* Outer glowing groove ring */}
        <div className="absolute inset-x-0 inset-y-0 rounded-full bg-black border-4 border-slate-900 shadow-xl flex items-center justify-center">
          <div className="w-[94%] h-[94%] rounded-full border border-zinc-800/30 bg-repeat bg-[radial-gradient(circle_at_center,_#262626_2px,_transparent_3px)] bg-[size:6px_6px] flex items-center justify-center"></div>
        </div>
        
        {/* Actual Vinyl Disc Cover */}
        <div className={`relative w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden border-2 border-black ${isPlaying ? "vinyl-spin-active" : "vinyl-spin-paused"}`}>
          <img 
            src={track.cover} 
            alt={track.title}
            className="w-full h-full object-cover pointer-events-none"
            referrerPolicy="no-referrer"
          />
          {/* Central vinyl spindle hole */}
          <div className="absolute top-1/2 left-1/2 -ml-2 -mt-2 w-4 h-4 bg-black border-2 border-zinc-600 rounded-full flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-zinc-200 rounded-full shadow"></div>
          </div>
        </div>
      </div>

      {/* Music control console details */}
      <div className="flex-1 w-full flex flex-col justify-between text-left space-y-2">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-indigo-600 font-mono tracking-wider font-semibold uppercase">
              正在播放 (PLAYING)
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowPlaylist(!showPlaylist)}
                className={`text-slate-500 hover:text-slate-800 transition-colors relative ${showPlaylist ? "text-indigo-600" : ""}`}
                title="播单"
              >
                <ListMusic size={14} />
              </button>
            </div>
          </div>
          
          <h2 className="text-sm font-sans font-semibold text-slate-800 truncate mt-0.5" title={track.title}>
            {track.title}
          </h2>
          <p className="text-xs text-slate-500 truncate">{track.artist}</p>
        </div>

        {/* Dynamic seek timeline */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-slate-200/80 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:bg-slate-300 transition-all outline-none"
          />
        </div>

        {/* Buttons drawer */}
        <div className="flex items-center justify-between pt-1">
          {/* Left panel control buttons */}
          <div className="flex items-center gap-4">
            <button 
              onClick={handlePrev}
              className="p-1.5 text-slate-500 hover:text-slate-800 active:scale-95 transition-all"
              title="上一首"
            >
              <SkipBack size={15} />
            </button>
            
            {/* Play Button with halo glow outline */}
            <button 
              onClick={handlePlayPause}
              className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-full text-white active:scale-90 hover:scale-105 shadow-inner shadow-indigo-400/20 shadow-md transition-all cursor-pointer"
              title={isPlaying ? "暂停" : "播放"}
            >
              {isPlaying ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
            </button>

            <button 
              onClick={handleNext}
              className="p-1.5 text-slate-500 hover:text-slate-800 active:scale-95 transition-all"
              title="下一首"
            >
              <SkipForward size={15} />
            </button>
          </div>

          {/* Right panel Volume slider metrics */}
          <div className="flex items-center gap-1 text-slate-500">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="hover:text-slate-800 transition-colors"
              title={isMuted ? "取消静音" : "静音"}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                setIsMuted(false);
              }}
              className="w-14 sm:w-18 h-1 bg-slate-200/80 rounded-lg appearance-none cursor-pointer accent-indigo-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Overlay subplaylist list */}
      {showPlaylist && (
        <div className="w-full border-t border-slate-200/50 pt-3 space-y-1.5 animate-fadeIn">
          <div className="text-[10px] text-slate-500 font-mono tracking-wider">
            主打音轨一览 ({songs.length})
          </div>
          <div className="space-y-1 divide-y divide-slate-200/30">
            {songs.map((song, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIdx(idx);
                  setIsPlaying(true);
                }}
                className={`w-full text-left flex items-center justify-between py-1.5 px-2 rounded-lg text-xs font-sans transition-colors cursor-pointer ${currentIdx === idx ? "bg-indigo-50 text-indigo-700 border border-indigo-200" : "hover:bg-black/5 text-slate-700"}`}
              >
                <span className="font-semibold truncate">{song.title}</span>
                <span className="text-slate-500 opacity-80 text-[10px]">{song.artist}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
