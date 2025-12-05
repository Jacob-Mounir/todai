import React, { useState } from 'react';
import UserContext from './UserContext';
import FocusPlayer from './FocusPlayer';
import MobileNav from './MobileNav';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({ children, userContext, setUserContext }) {
	const { theme, toggleTheme, styles } = useTheme();
	const [activeView, setActiveView] = useState('tasks'); // tasks, context, focus, settings

	const SidebarContent = () => (
		<>
			<UserContext value={userContext} onChange={setUserContext} />
			<div className="mt-auto pt-6 border-t border-current/10">
				<button
					onClick={toggleTheme}
					className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-current/5 transition-colors text-sm font-medium opacity-70 hover:opacity-100"
				>
					{theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
					<span>{theme === 'dark' ? 'Dark Mode' : 'Soft Mode'}</span>
				</button>
			</div>
		</>
	);

	return (
		<div className={`min-h-screen ${styles.bg} ${styles.text} p-4 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-hidden flex flex-col lg:flex-row gap-4 transition-colors duration-500`}>

			{/* Desktop Left Sidebar: Context */}
			<aside className={`hidden lg:flex flex-col w-80 rounded-[2rem] p-6 flex-shrink-0 ${styles.sidebar} transition-all duration-500`}>
				<SidebarContent />
			</aside>

			{/* Main Content Area (Handles Mobile Swapping) */}
			<main className={`flex-1 rounded-[2rem] border relative overflow-hidden flex flex-col ${theme === 'soft' ? 'bg-white/30 border-white/20 shadow-2xl backdrop-blur-3xl' : 'bg-gradient-to-br from-white/5 to-transparent border-white/5'} transition-all duration-500`}>
				<AnimatePresence mode="wait">
					{/* Desktop: Always show tasks here. Mobile: Show based on view */}
					{(activeView === 'tasks' || window.innerWidth >= 1024) && (
						<motion.div
							key="tasks"
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 1.05 }}
							className="h-full flex flex-col"
						>
							{children}
						</motion.div>
					)}

					{/* Mobile Only Views */}
					{activeView === 'context' && (
						<motion.div
							key="context"
							initial={{ x: '100%' }}
							animate={{ x: 0 }}
							exit={{ x: '-100%' }}
							className="lg:hidden absolute inset-0 p-6 bg-black/80 backdrop-blur-xl z-20"
						>
							<h2 className="text-2xl font-bold mb-6">User Context</h2>
							<UserContext value={userContext} onChange={setUserContext} />
						</motion.div>
					)}

					{activeView === 'focus' && (
						<motion.div
							key="focus"
							initial={{ y: '100%' }}
							animate={{ y: 0 }}
							exit={{ y: '100%' }}
							className="lg:hidden absolute inset-0 z-30 bg-black/90"
						>
							<FocusPlayer />
						</motion.div>
					)}

					{activeView === 'settings' && (
						<motion.div
							key="settings"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="lg:hidden absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-40"
						>
							<div className="p-8 bg-white/10 rounded-3xl border border-white/10 backdrop-blur-xl">
								<button
									onClick={() => { toggleTheme(); setActiveView('tasks'); }}
									className="flex flex-col items-center gap-4 text-xl font-bold"
								>
									{theme === 'dark' ? <Moon size={48} /> : <Sun size={48} />}
									<span>Switch to {theme === 'dark' ? 'Soft' : 'Dark'} Mode</span>
								</button>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</main>

			{/* Desktop Right Sidebar: Focus Deck */}
			<aside className="hidden lg:block w-96 flex-shrink-0 h-full">
				<FocusPlayer />
			</aside>

			{/* Mobile Nav */}
			<MobileNav activeView={activeView} onViewChange={setActiveView} />
		</div>
	);
}
