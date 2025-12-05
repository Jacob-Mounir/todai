import React from 'react';
import { LayoutList, Brain, Zap, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function MobileNav({ activeView, onViewChange }) {
	const { styles } = useTheme();

	const navItems = [
		{ id: 'tasks', icon: LayoutList, label: 'Tasks' },
		{ id: 'context', icon: Brain, label: 'Context' },
		{ id: 'focus', icon: Zap, label: 'Focus' },
		{ id: 'settings', icon: Settings, label: 'Settings' }
	];

	return (
		<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 lg:hidden w-[90%] max-w-sm">
			<div className={`backdrop-blur-xl border shadow-2xl rounded-2xl p-2 flex justify-between items-center ${styles.theme === 'soft' ? 'bg-white/80 border-white/40' : 'bg-black/60 border-white/10'}`}>
				{navItems.map((item) => (
					<button
						key={item.id}
						onClick={() => onViewChange(item.id)}
						aria-label={item.label}
						className="relative p-3 rounded-xl flex-1 flex flex-col items-center gap-1 group"
					>
						{activeView === item.id && (
							<motion.div
								layoutId="activeNav"
								className="absolute inset-0 bg-current opacity-10 rounded-xl"
								transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
							/>
						)}
						<item.icon size={20} className={`${activeView === item.id ? 'opacity-100 scale-110' : 'opacity-50'} transition-all`} />
						{/* Dot indicator */}
						{activeView === item.id && (
							<motion.div
								layoutId="activeDot"
								className="w-1 h-1 rounded-full bg-current mt-1"
							/>
						)}
					</button>
				))}
			</div>
		</div>
	);
}
