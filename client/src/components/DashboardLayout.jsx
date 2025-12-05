import React from 'react';
import UserContext from './UserContext';
import FocusPlayer from './FocusPlayer';

export default function DashboardLayout({ children, userContext, setUserContext }) {
	return (
		<div className="min-h-screen bg-black text-white p-4 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-hidden flex gap-4">
			{/* Left Sidebar: Context */}
			<aside className="hidden lg:block w-80 glass-panel rounded-[2rem] p-6 flex-shrink-0">
				<UserContext value={userContext} onChange={setUserContext} />
			</aside>

			{/* Main Content: Tasks */}
			<main className="flex-1 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent border border-white/5 relative overflow-hidden flex flex-col">
				{children}
			</main>

			{/* Right Sidebar: Focus Deck (Replaces Chat) */}
			<aside className="hidden lg:block w-96 flex-shrink-0">
				<FocusPlayer />
			</aside>
		</div>
	);
}
