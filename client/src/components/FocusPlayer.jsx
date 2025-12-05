import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Music, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

const FOCUS_TIME = 25 * 60; // 25 minutes
const BREAK_TIME = 5 * 60;  // 5 minutes

export default function FocusPlayer() {
	const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
	const [isActive, setIsActive] = useState(false);
	const [mode, setMode] = useState('FOCUS'); // FOCUS or BREAK

	useEffect(() => {
		let interval = null;
		if (isActive && timeLeft > 0) {
			interval = setInterval(() => {
				setTimeLeft((timeLeft) => timeLeft - 1);
			}, 1000);
		} else if (timeLeft === 0) {
			setIsActive(false);
			// Auto-switch mode (optional, maybe just stop)
		}
		return () => clearInterval(interval);
	}, [isActive, timeLeft]);

	const toggleTimer = () => setIsActive(!isActive);

	const resetTimer = () => {
		setIsActive(false);
		setTimeLeft(mode === 'FOCUS' ? FOCUS_TIME : BREAK_TIME);
	};

	const switchMode = (newMode) => {
		setMode(newMode);
		setIsActive(false);
		setTimeLeft(newMode === 'FOCUS' ? FOCUS_TIME : BREAK_TIME);
	};

	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	};

	const progress = ((mode === 'FOCUS' ? FOCUS_TIME : BREAK_TIME) - timeLeft) / (mode === 'FOCUS' ? FOCUS_TIME : BREAK_TIME);

	return (
		<div className="h-full flex flex-col gap-6 p-2">
			{/* Header */}
			<div className="flex items-center gap-2 text-white/50 mb-2">
				<Headphones size={18} />
				<h2 className="text-xs font-semibold tracking-widest uppercase">Focus Deck</h2>
			</div>

			{/* Timer Card */}
			<div className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden">
				{/* Progress Halo */}
				<div className="absolute inset-0 bg-indigo-500/10 pointer-events-none" style={{ height: `${progress * 100}%`, bottom: 0, top: 'auto', transition: 'height 1s linear' }} />

				<div className="flex gap-2 mb-6 p-1 bg-black/20 rounded-full">
					<button
						onClick={() => switchMode('FOCUS')}
						className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${mode === 'FOCUS' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'}`}
					>
						Deep Work
					</button>
					<button
						onClick={() => switchMode('BREAK')}
						className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${mode === 'BREAK' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70'}`}
					>
						Chill
					</button>
				</div>

				<div className="text-7xl font-bold font-heading text-white tracking-tight mb-8 tabular-nums">
					{formatTime(timeLeft)}
				</div>

				<div className="flex items-center gap-4">
					<button
						onClick={toggleTimer}
						className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
					>
						{isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
					</button>
					<button
						onClick={resetTimer}
						className="w-10 h-10 rounded-full bg-white/5 text-white/60 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all"
					>
						<RotateCcw size={16} />
					</button>
				</div>
			</div>

			{/* Music Player Embed */}
			<div className="glass-panel p-4 rounded-3xl flex-1 flex flex-col min-h-0">
				<div className="flex items-center gap-2 mb-4 text-white/70">
					<Music size={16} />
					<span className="text-sm font-medium">Lofi Girl Radio</span>
				</div>
				<div className="flex-1 rounded-2xl overflow-hidden bg-black/40 relative">
					<iframe
						className="absolute inset-0 w-full h-full"
						src="https://www.youtube.com/embed/jfKfPfyJRdk?si=vX0X0X0X0X0X0X0X&controls=0&autoplay=0"
						title="Lofi Girl"
						frameBorder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowFullScreen
					></iframe>
				</div>
			</div>
		</div>
	);
}
