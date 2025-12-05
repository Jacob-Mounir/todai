import React, { useState } from 'react';
import { Sparkles, Plus, CheckCircle2, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TaskItem = ({ task }) => (
	<motion.div
		layout
		initial={{ opacity: 0, y: 10, scale: 0.98 }}
		animate={{ opacity: 1, y: 0, scale: 1 }}
		exit={{ opacity: 0, scale: 0.95 }}
		whileHover={{ scale: 1.02 }}
		className="group relative flex items-start justify-between bg-white/5 backdrop-blur-md border border-white/5 rounded-xl p-5 hover:bg-white/10 transition-all cursor-pointer shadow-lg hover:shadow-primary/5"
	>
		<div className="flex-1 flex items-start gap-4">
			<button className="mt-1 text-white/30 hover:text-primary transition-colors">
				<Circle size={20} />
			</button>
			<div>
				<h3 className="text-lg font-medium text-white/90 group-hover:text-white transition-colors">{task.title}</h3>
				{task.contextTags && task.contextTags.length > 0 && (
					<div className="flex flex-wrap gap-2 mt-2">
						{task.contextTags.map(tag => (
							<span key={tag} className="text-[10px] uppercase tracking-wider font-bold bg-white/5 text-white/60 px-2 py-1 rounded-md border border-white/5">
								{tag}
							</span>
						))}
					</div>
				)}
			</div>
		</div>

		{task.importanceScore !== undefined && (
			<div className="flex flex-col items-end">
				<div className="relative">
					<div className={`absolute inset-0 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${task.importanceScore >= 80 ? 'bg-red-500/40' :
							task.importanceScore >= 50 ? 'bg-yellow-500/40' :
								'bg-slate-500/40'
						}`} />
					<span className={`relative text-xs font-bold px-3 py-1.5 rounded-lg border backdrop-blur-md ${task.importanceScore >= 80 ? 'bg-red-500/10 border-red-500/20 text-red-200' :
							task.importanceScore >= 50 ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-200' :
								'bg-slate-500/10 border-slate-500/20 text-slate-400'
						}`}>
						{task.importanceScore}
					</span>
				</div>
			</div>
		)}
	</motion.div>
);

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
