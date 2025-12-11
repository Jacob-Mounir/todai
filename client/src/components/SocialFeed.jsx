import React, { useState } from 'react';
import { MessageCircle, Send, Phone, Video, Search, Music } from 'lucide-react'; // Using Music as Discords icon roughly
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const PLATFORMS = [
	{ id: 'messenger', name: 'Messenger', icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
	{ id: 'whatsapp', name: 'WhatsApp', icon: Phone, color: 'text-green-500', bg: 'bg-green-500/10' },
	{ id: 'discord', name: 'Discord', icon: Music, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
];

const MOCK_CHATS = {
	messenger: [
		{ id: 1, sender: 'Alice', msg: 'Hey! Are we still on for the meeting?', time: '10:30 AM', avatar: 'A', unread: 2 },
		{ id: 2, sender: 'Bob', msg: 'Sent you the files.', time: '9:15 AM', avatar: 'B', unread: 0 },
	],
	whatsapp: [
		{ id: 3, sender: 'Project Team', msg: 'Sarah: Great work everyone!', time: '11:05 AM', avatar: 'P', unread: 5 },
		{ id: 4, sender: 'Mom', msg: 'Call me when you can.', time: 'Yesterday', avatar: 'M', unread: 0 },
	],
	discord: [
		{ id: 5, sender: 'Dev-Channel', msg: 'New build is live 🚀', time: '12:00 PM', avatar: '#', unread: 1 },
		{ id: 6, sender: 'General', msg: 'Anyone up for a game later?', time: '10:00 AM', avatar: '#', unread: 0 },
	]
};

export default function SocialFeed() {
	const { styles } = useTheme();
	const [activeTab, setActiveTab] = useState('messenger');
	const [input, setInput] = useState('');

	const chats = MOCK_CHATS[activeTab] || [];

	return (
		<div className={`h-full flex flex-col rounded-[2rem] ${styles.card} backdrop-blur-xl relative overflow-hidden`}>
			{/* Header / Tabs */}
			<div className="p-4 border-b border-current/10">
				<h3 className="text-xl font-bold mb-4 px-2">Social Hub</h3>
				<div className="flex gap-2 p-1 bg-current/5 rounded-xl">
					{PLATFORMS.map((platform) => {
						const Icon = platform.icon;
						const isActive = activeTab === platform.id;
						return (
							<button
								key={platform.id}
								onClick={() => setActiveTab(platform.id)}
								className={`flex-1 flex items-center justify-center p-2 rounded-lg transition-all relative ${isActive ? 'bg-white shadow text-black' : 'hover:bg-white/10 opacity-70 hover:opacity-100'
									}`}
							>
								<Icon size={20} className={isActive ? platform.color : 'text-current'} />
								{isActive && (
									<motion.div
										layoutId="active-pill"
										className="absolute inset-0 rounded-lg"
										transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
									/>
								)}
							</button>
						);
					})}
				</div>
			</div>

			{/* Chat List */}
			<div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
				<AnimatePresence mode='popLayout'>
					{chats.map((chat, i) => (
						<motion.div
							key={chat.id}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 20 }}
							transition={{ delay: i * 0.05 }}
							className="p-3 rounded-xl hover:bg-current/5 transition-colors cursor-pointer group flex gap-3 items-center"
						>
							<div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-gradient-to-tr from-gray-700 to-gray-600 text-white shrink-0`}>
								{chat.avatar}
							</div>
							<div className="flex-1 min-w-0">
								<div className="flex justify-between items-baseline mb-0.5">
									<h4 className="font-semibold text-sm truncate">{chat.sender}</h4>
									<span className="text-[10px] opacity-50">{chat.time}</span>
								</div>
								<p className="text-sm opacity-70 truncate group-hover:opacity-100 transition-opacity">
									{chat.msg}
								</p>
							</div>
							{chat.unread > 0 && (
								<div className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold shadow-lg shadow-indigo-500/30">
									{chat.unread}
								</div>
							)}
						</motion.div>
					))}
				</AnimatePresence>
			</div>

			{/* Quick Reply (Mock) */}
			<div className="p-4 border-t border-current/10 bg-current/5 backdrop-blur-md">
				<div className="flex items-center gap-2 bg-current/5 p-2 rounded-xl focus-within:ring-2 ring-indigo-500/50 transition-all">
					<input
						type="text"
						placeholder={`Message ${PLATFORMS.find(p => p.id === activeTab).name}...`}
						value={input}
						onChange={(e) => setInput(e.target.value)}
						className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-current/40 px-2"
					/>
					<button className="p-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/20">
						<Send size={16} />
					</button>
				</div>
			</div>
		</div>
	);
}
