import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Maximize2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../context/ThemeContext';

export default function ZenMode({ task, onComplete, onExit }) {
	const { styles } = useTheme();
	const [elapsed, setElapsed] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => setElapsed(e => e + 1), 1000);
		return () => clearInterval(timer);
	}, []);

	const formatTime = (s) => {
		const min = Math.floor(s / 60).toString().padStart(2, '0');
		const sec = (s % 60).toString().padStart(2, '0');
		return `${min}:${sec}`;
	};

	const handleComplete = () => {
		confetti({
			particleCount: 150,
			spread: 100,
			origin: { y: 0.6 }
		});
		setTimeout(onComplete, 1000); // Wait for confetti
	};

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 1.1 }}
			className="fixed inset-0 z-[100] bg-black text-white flex flex-col items-center justify-center p-8"
		>
			{/* Background Animation */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<motion.div
					animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
					transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
					className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-tr from-indigo-900/30 to-purple-900/30 rounded-full blur-3xl"
				/>
			</div>

			<button onClick={onExit} aria-label="Exit Focus Mode" className="absolute top-8 right-8 p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
				<X size={24} />
			</button>

			<motion.div
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.2 }}
				className="text-center max-w-2xl relative z-10"
			>
				<div className="text-white/40 font-mono text-xl mb-8 tracking-widest uppercase">Focus Mode</div>

				<h1 className="text-5xl md:text-7xl font-bold mb-12 leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60">
					{task.title}
				</h1>

				<div className="text-4xl font-mono font-light text-indigo-300 mb-16 tabular-nums">
					{formatTime(elapsed)}
				</div>

				<button
					onClick={handleComplete}
					className="group relative px-12 py-5 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white text-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-indigo-500/40"
				>
					<div className="flex items-center gap-3">
						<Check size={28} />
						<span>Complete Task</span>
					</div>
				</button>
			</motion.div>
		</motion.div>
	);
}
