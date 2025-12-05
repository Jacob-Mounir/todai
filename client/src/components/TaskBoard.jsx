import React, { useState } from 'react';
import { Plus, Sparkles, Clock, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// TaskItem Component
function TaskItem({ task }) {
	const getScoreColor = (score) => {
		if (score >= 80) return 'text-red-400 bg-red-400/10 border-red-400/20';
		if (score >= 50) return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
		return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
	};

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.95 }}
			whileHover={{ scale: 1.02 }}
			className="group flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer relative overflow-hidden"
		>
			{/* Hover Highlight */}
			<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />

			{/* Checkbox */}
			<div className="mt-1 w-5 h-5 rounded-full border-2 border-white/20 group-hover:border-indigo-500 transition-colors" />

			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2 mb-1">
					<h3 className="font-medium text-white/90 truncate">{task.title}</h3>
					{task.macroCategory && (
						<span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/20">
							{task.macroCategory}
						</span>
					)}
				</div>

				<div className="flex gap-2 flew-wrap">
					{/* Importance Badge */}
					{task.importanceScore !== undefined && (
						<span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getScoreColor(task.importanceScore)}`}>
							Score: {task.importanceScore}
						</span>
					)}

					{/* Time Estimate Badge */}
					{task.estimatedMinutes && (
						<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 flex items-center gap-1">
							<Clock size={10} /> {task.estimatedMinutes}m
						</span>
					)}

					{/* Context Tags */}
					{task.contextTags && task.contextTags.map((tag, i) => (
						<span key={i} className="text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
							#{tag}
						</span>
					))}
				</div>
			</div>
		</motion.div>
	);
}

const TaskBoard = ({ tasks, validBuckets = ['Today', 'Tomorrow', 'Future'], onAddTask, onAutoOrganize, isOrganizing }) => {
	const [inputValue, setInputValue] = useState('');

	const handleKeyDown = (e) => {
		if (e.key === 'Enter' && inputValue.trim()) {
			onAddTask(inputValue);
			setInputValue('');
		}
	};

	const tasksByBucket = validBuckets.reduce((acc, bucket) => {
		acc[bucket] = tasks.filter(t => t.bucket === bucket);
		return acc;
	}, {});

	// Inbox fallback
	const inboxTasks = tasks.filter(t => !t.bucket || !validBuckets.includes(t.bucket));
	if (inboxTasks.length > 0) {
		tasksByBucket['Inbox'] = inboxTasks;
		if (!validBuckets.includes('Inbox')) validBuckets = ['Inbox', ...validBuckets];
	}

	return (
		<div className="space-y-10 pb-20">
			<header className="flex items-end justify-between mb-8 pt-4">
				<div>
					<h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/50 mb-2">My Tasks</h1>
					<p className="text-white/40 font-medium tracking-wide">Smart organized based on your goals.</p>
				</div>
				<button
					onClick={onAutoOrganize}
					disabled={isOrganizing}
					className="group relative px-6 py-3 rounded-xl font-bold text-sm text-white overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
				>
					<div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-80 group-hover:opacity-100 transition-opacity" />
					<div className="absolute inset-0 bg-white/20 blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />
					<div className="relative flex items-center gap-2">
						<Sparkles size={16} className={isOrganizing ? "animate-spin" : "fill-white/20"} />
						{isOrganizing ? 'Organizing...' : 'Auto-Organize'}
					</div>
				</button>
			</header>

			{/* Premium Input */}
			<div className="relative group z-10">
				<div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
				<div className="relative flex items-center glass-input rounded-2xl overflow-hidden p-2">
					<input
						type="text"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="What needs to be done?"
						className="flex-1 bg-transparent px-4 py-3 text-xl font-medium text-white focus:outline-none placeholder:text-white/20"
					/>
					<button
						onClick={() => { if (inputValue.trim()) { onAddTask(inputValue); setInputValue(''); } }}
						className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
					>
						<Plus size={24} />
					</button>
				</div>
			</div>

			{/* Buckets */}
			<div className="grid gap-12">
				{validBuckets.map((bucket) => {
					const bucketTasks = tasksByBucket[bucket] || [];
					return (
						<section key={bucket} className="space-y-6">
							<div className="flex items-center gap-4">
								<h2 className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">{bucket}</h2>
								<div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
							</div>
							<div className="min-h-[100px] space-y-4">
								<AnimatePresence mode="popLayout">
									{bucketTasks.map(task => (
										<TaskItem key={task.id} task={task} />
									))}
								</AnimatePresence>
								{bucketTasks.length === 0 && (
									<div className="flex flex-col items-center justify-center h-32 text-white/10 border border-white/5 border-dashed rounded-xl">
										<p className="text-sm font-medium">No tasks for {bucket.toLowerCase()}</p>
									</div>
								)}
							</div>
						</section>
					);
				})}
			</div>
		</div>
	);
};

export default TaskBoard;
