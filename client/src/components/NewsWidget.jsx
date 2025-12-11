import React, { useState, useEffect } from 'react';
import { RefreshCw, ExternalLink } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const MOCK_NEWS = [
	{ id: 1, title: 'AI Breakthrough in Productivity Tools', source: 'TechWeekly', time: '2h ago', category: 'Tech' },
	{ id: 2, title: 'Global Markets Rally on Innovation News', source: 'FinanceDaily', time: '4h ago', category: 'Business' },
	{ id: 3, title: 'Top 10 Focus Techniques for 2026', source: 'MindfulWork', time: '6h ago', category: 'Productivity' },
	{ id: 4, title: 'New Remote Work Policies Announced', source: 'WorkLife', time: '8h ago', category: 'Work' },
];

export default function NewsWidget() {
	const { styles } = useTheme();
	const [news, setNews] = useState(MOCK_NEWS);
	const [loading, setLoading] = useState(false);

	const handleRefresh = () => {
		setLoading(true);
		// Simulate network request
		setTimeout(() => {
			// Shuffle news for effect
			setNews([...MOCK_NEWS].sort(() => Math.random() - 0.5));
			setLoading(false);
		}, 800);
	};

	return (
		<div className={`h-full flex flex-col p-6 rounded-[2rem] ${styles.card} backdrop-blur-xl relative overflow-hidden group`}>
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-xl font-bold flex items-center gap-2">
					<span className="bg-gradient-to-r from-pink-500 to-rose-500 text-transparent bg-clip-text">Trending News</span>
				</h3>
				<button
					onClick={handleRefresh}
					className={`p-2 rounded-full hover:bg-current/10 transition-colors ${loading ? 'animate-spin' : ''}`}
					title="Refresh Feed"
				>
					<RefreshCw size={18} opacity={0.7} />
				</button>
			</div>

			<div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
				{news.map((item, index) => (
					<motion.div
						key={item.id}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}
						className="p-4 rounded-xl bg-current/5 hover:bg-current/10 transition-colors cursor-pointer group/item border border-transparent hover:border-white/10"
					>
						<div className="flex justify-between items-start gap-4">
							<div className="flex-1">
								<span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 mb-2 inline-block">
									{item.category}
								</span>
								<h4 className="font-medium leading-tight mb-2 group-hover/item:text-indigo-300 transition-colors">
									{item.title}
								</h4>
								<div className="flex items-center gap-3 text-xs opacity-60">
									<span>{item.source}</span>
									<span>•</span>
									<span>{item.time}</span>
								</div>
							</div>
							<ExternalLink size={14} className="opacity-0 group-hover/item:opacity-50 transition-opacity mt-1" />
						</div>
					</motion.div>
				))}
			</div>
		</div>
	);
}
