import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Music, Headphones, Settings, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FOCUS_TIME = 25 * 60; // 25 minutes
const BREAK_TIME = 5 * 60;  // 5 minutes

export default function FocusPlayer() {
	const [duration, setDuration] = useState(25 * 60); // Default duration in seconds
	const [timeLeft, setTimeLeft] = useState(25 * 60);
	const [isActive, setIsActive] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [customMinutes, setCustomMinutes] = useState('');

	useEffect(() => {
		let interval = null;
		if (isActive && timeLeft > 0) {
			interval = setInterval(() => {
				setTimeLeft((prev) => prev - 1);
			}, 1000);
		} else if (timeLeft === 0) {
			setIsActive(false);
			// Optional: Play alarm sound here
		}
		return () => clearInterval(interval);
	}, [isActive, timeLeft]);

	const toggleTimer = () => setIsActive(!isActive);

	const resetTimer = () => {
		setIsActive(false);
		setTimeLeft(duration);
	};

	const setPreset = (minutes) => {
		const seconds = minutes * 60;
		setDuration(seconds);
		setTimeLeft(seconds);
		setIsActive(false);
		setIsSettingsOpen(false); // Auto-close on preset select? Maybe better UX.
	};

	const handleCustomSubmit = (e) => {
		e.preventDefault();
		const mins = parseInt(customMinutes);
		if (!isNaN(mins) && mins > 0) {
			setPreset(mins);
			setCustomMinutes('');
		}
	};

	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	};

	const progress = (duration - timeLeft) / duration;

	return (
		<div className="h-full flex flex-col gap-6 p-2 relative group">
			{/* Header */}
			<div className="flex items-center justify-between mb-2 z-10">
				<div className="flex items-center gap-2 text-white/50">
					<Headphones size={18} />
					<h2 className="text-xs font-semibold tracking-widest uppercase">Focus Timer</h2>
				</div>
				<button
					onClick={() => setIsSettingsOpen(!isSettingsOpen)}
					className={`p-2 rounded-full transition-all ${isSettingsOpen ? 'bg-white text-black' : 'text-white/30 hover:text-white hover:bg-white/10'}`}
					title="Timer Settings"
				>
					{isSettingsOpen ? <Check size={14} /> : <Settings size={14} />}
				</button>
			</div>

			{/* Main Card */}
			<div className="glass-panel p-6 rounded-3xl flex-1 relative overflow-hidden">

				{/* Settings View */}
				<AnimatePresence>
					{isSettingsOpen && (
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							className="absolute inset-0 z-20 bg-black/80 backdrop-blur-xl flex flex-col p-6 gap-4"
						>
							<h3 className="text-sm font-bold opacity-50 uppercase tracking-widest text-center mb-2">Set Duration</h3>

							<div className="grid grid-cols-3 gap-3">
								{[10, 30, 60].map(m => (
									<button
										key={m}
										onClick={() => setPreset(m)}
										className="py-3 px-2 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/20 border border-white/5 font-bold text-sm transition-colors"
									>
										{m}m
									</button>
								))}
							</div>

							<div className="my-2 h-px bg-white/10 w-full" />

							<form onSubmit={handleCustomSubmit} className="flex gap-2">
								<input
									type="number"
									placeholder="Custom min"
									value={customMinutes}
									onChange={(e) => setCustomMinutes(e.target.value)}
									className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500/50"
									min="1"
									max="999"
								/>
								<button
									type="submit"
									className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 rounded-xl font-bold text-sm transition-colors"
								>
									Set
								</button>
							</form>
						</motion.div>
					)}
				</AnimatePresence>


				{/* Timer View */}
				<div className={`flex flex-col items-center justify-center h-full relative z-10 transition-all duration-500 ${isSettingsOpen ? 'blur-sm scale-95 opacity-50' : ''}`}>

					{/* Progress Halo */}
					<div className="absolute inset-x-0 bottom-0 bg-indigo-500/10 pointer-events-none rounded-b-3xl" style={{ height: `${progress * 100}%`, transition: 'height 1s linear' }} />

					<div className="text-7xl font-bold font-heading text-white tracking-tight mb-8 tabular-nums relative drop-shadow-2xl">
						{formatTime(timeLeft)}
					</div>

					<div className="flex items-center gap-4">
						<button
							onClick={toggleTimer}
							className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
						>
							{isActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
						</button>
						<button
							onClick={resetTimer}
							className="w-12 h-12 rounded-full bg-white/5 text-white/60 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all border border-white/5"
						>
							<RotateCcw size={18} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
