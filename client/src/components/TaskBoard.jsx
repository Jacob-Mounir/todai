import React, { useState } from 'react';
import { Plus, Sparkles, Clock, Edit2, ArrowRight, Play, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import confetti from 'canvas-confetti';
import ZenMode from './ZenMode';

// TaskItem Component
function TaskItem({ task, onUpdate }) {
	const { styles } = useTheme();
	const [isEditing, setIsEditing] = useState(false);
	const [editTitle, setEditTitle] = useState(task.title);

	const handleSave = () => {
		onUpdate(task.id, { title: editTitle });
		setIsEditing(false);
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') handleSave();
		if (e.key === 'Escape') {
			setEditTitle(task.title);
			setIsEditing(false);
		}
	};

	const getScoreColor = (score) => {
		if (score >= 80) return 'bg-red-500/20 text-red-300 border-red-500/20';
		if (score >= 50) return 'bg-orange-500/20 text-orange-300 border-orange-500/20';
		return 'bg-blue-500/20 text-blue-300 border-blue-500/20';
	};

	const moveTo = (bucket) => {
		onUpdate(task.id, { bucket });
	};

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, scale: 0.95 }}
			whileHover={{ scale: 1.02 }}
			drag="x"
			dragConstraints={{ left: 0, right: 0 }}
			dragElastic={0.2}
			onDragEnd={(e, { offset, velocity }) => {
				if (offset.x > 100) { // Right Swipe -> Move/Complete
					confetti({
						particleCount: 100,
						spread: 70,
						origin: { y: 0.6 }
					});
					// Mock completion for now
					// In reality we might move to 'Done' bucket or delete
				}
			}}
			className={`group flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden touch-pan-y ${styles.panel} ${styles.theme === 'soft' ? 'hover:shadow-lg' : 'hover:bg-white/10 hover:border-white/10'}`}
		>
			{/* Swipe Indicators (Behind) */}
			<div className="absolute inset-y-0 left-0 w-20 bg-emerald-500/20 z-0 flex items-center justify-start pl-4 opacity-0 group-hover:opacity-100 transition-opacity">
				<Sparkles size={16} className="text-emerald-400" />
			</div>

			{/* Hover Highlight (Dark Mode Only) */}
			{styles.theme === 'dark' && (
				<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
			)}

			{/* Checkbox */}
			<button
				onClick={(e) => { e.stopPropagation(); onUpdate(task.id, { completed: !task.completed }); }}
				aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
				className={`mt-1 w-5 h-5 rounded-full border-2 transition-colors z-10 flex items-center justify-center ${styles.theme === 'soft' ? 'border-slate-300 group-hover:border-indigo-500' : 'border-white/20 group-hover:border-indigo-500'}`}
			>
				{task.completed && <div className="w-3 h-3 bg-indigo-500 rounded-full" />}
			</button>

			<div className="flex-1 min-w-0 z-10">
				<div className={`flex items-center gap-2 mb-1 ${styles.text}`}>
					{isEditing ? (
						<input
							autoFocus
							value={editTitle}
							onChange={e => setEditTitle(e.target.value)}
							onBlur={handleSave}
							onKeyDown={handleKeyDown}
							className="bg-transparent border-b border-indigo-500 outline-none w-full font-medium"
						/>
					) : (
						<h3 className={`font-medium truncate opacity-90`} onClick={() => setIsEditing(true)}>
							{task.title}
						</h3>
					)}

					{task.macroCategory && (
						<span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/20">
							{task.macroCategory}
						</span>
					)}
				</div>

				<div className="flex gap-2 flex-wrap items-center">
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
						<span key={i} className={`text-[10px] px-2 py-0.5 rounded-full ${styles.theme === 'soft' ? 'bg-slate-200 text-slate-500' : 'text-white/40 bg-white/5'}`}>
							#{tag}
						</span>
					))}
				</div>
			</div>

			{/* Action Menu (Move & Focus) */}
			<div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
				<button onClick={(e) => { e.stopPropagation(); onUpdate(task.id, { focus: true }); }} aria-label="Enter Zen Focus Mode" className="p-2 hover:bg-white/10 rounded-full text-indigo-400" title="Zen Focus">
					<Play size={14} fill="currentColor" />
				</button>
				<button onClick={() => onUpdate(task.id, { title: task.title })} aria-label="Edit Task" className="p-2 hover:bg-white/10 rounded-full" title="Edit">
					<Edit2 size={14} className={styles.text} onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} />
				</button>
				<div className="relative group/menu">
					<button aria-label="Move Task" className="p-2 hover:bg-white/10 rounded-full">
						<ArrowRight size={14} className={styles.text} />
					</button>
					<div className="absolute right-0 top-full mt-2 w-32 bg-black/90 border border-white/10 rounded-xl overflow-hidden shadow-xl z-50 hidden group-hover/menu:block backdrop-blur-md">
						{['Today', 'Tomorrow', 'Future'].filter(b => b !== task.bucket).map(b => (
							<button
								key={b}
								onClick={(e) => { e.stopPropagation(); moveTo(b); }}
								className="w-full text-left px-4 py-2 text-xs font-medium text-white/70 hover:bg-white/10 hover:text-white"
							>
								Move to {b}
							</button>
						))}
					</div>
				</div>
			</div>
		</motion.div>
	);
}

// TaskBoard Component
const TaskBoard = ({ tasks, validBuckets = ['Today', 'Tomorrow', 'Future'], onAddTask, onAutoOrganize, onUpdateTask, isOrganizing }) => {
	const { styles } = useTheme();
	const [inputValue, setInputValue] = useState('');
	const [inputBucket, setInputBucket] = useState('Today');
	const [focusedTask, setFocusedTask] = useState(null);

	// Handle Focus Request from Item
	const handleTaskUpdate = (id, updates) => {
		if (updates.focus) {
			const task = tasks.find(t => t.id === id);
			setFocusedTask(task);
		} else {
			onUpdateTask(id, updates);
		}
	};

	const handleAddTask = () => {
		if (!inputValue.trim()) return;
		onAddTask({ title: inputValue, bucket: inputBucket });
		setInputValue('');
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') handleAddTask();
	};

	// Smart Insight: Calculate Today's Load
	const todayMinutes = tasks
		.filter(t => t.bucket === 'Today' && t.estimatedMinutes)
		.reduce((acc, t) => acc + t.estimatedMinutes, 0);

	const isOverloaded = todayMinutes > 360; // > 6 hours

	return (
		<>
			<AnimatePresence>
				{focusedTask && (
					<ZenMode
						task={focusedTask}
						onExit={() => setFocusedTask(null)}
						onComplete={() => {
							// In real app: mark complete
							alert("Task Completed from Focus Mode!");
							setFocusedTask(null);
						}}
					/>
				)}
			</AnimatePresence>

			<div className="h-full flex flex-col p-6 overflow-y-auto custom-scrollbar">
				{/* Header */}
				<div className="flex justify-between items-center mb-6 shrink-0">
					<div>
						<h1 className={`text-3xl font-bold tracking-tight mb-2 ${styles.gradientText}`}>My Tasks</h1>
						<p className={`text-sm ${styles.text} opacity-60`}>Focus on what matters most.</p>
					</div>
					<button
						onClick={onAutoOrganize}
						disabled={isOrganizing}
						className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${isOrganizing ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white text-black hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20'}`}
					>
						{isOrganizing ? (
							<>
								<Sparkles className="animate-spin" size={16} />
								<span>Thinking...</span>
							</>
						) : (
							<>
								<Sparkles size={16} className="text-indigo-600" />
								<span>Auto-Organize</span>
							</>
						)}
					</button>
				</div>

				{/* Smart Overload Warning */}
				{isOverloaded && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						className="mb-6 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-start gap-4 shrink-0"
					>
						<div className="p-2 bg-orange-500/20 rounded-full text-orange-400">
							<AlertTriangle size={20} />
						</div>
						<div>
							<h3 className="text-orange-200 font-bold text-sm">Heavy Load Detected ({Math.round(todayMinutes / 60)}h)</h3>
							<p className="text-orange-200/70 text-xs mt-1">You have planned more than 6 hours of work today. Consider moving lower priority tasks to Tomorrow to avoid burnout.</p>
						</div>
					</motion.div>
				)}

				{/* Input */}
				<div className={`mb-8 flex gap-3 p-2 rounded-2xl border transition-all focus-within:ring-2 focus-within:ring-indigo-500/50 ${styles.panel} ${styles.theme === 'soft' ? 'shadow-sm' : ''}`}>
					<select
						value={inputBucket}
						onChange={e => setInputBucket(e.target.value)}
						className={`bg-transparent text-xs font-medium uppercase tracking-wider outline-none p-2 rounded-xl cursor-pointer hover:bg-white/5 transition-colors ${styles.text} opacity-70`}
					>
						{validBuckets.map(b => <option key={b} value={b} className="bg-slate-800 text-white">{b}</option>)}
					</select>
					<div className="w-px bg-white/10 my-2" />
					<input
						type="text"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Add a new task..."
						aria-label="New task title"
						className={`flex-1 bg-transparent outline-none placeholder:text-white/20 ${styles.text}`}
					/>
					<button
						onClick={handleAddTask}
						aria-label="Add Task"
						className="p-3 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
					>
						<Plus size={20} />
					</button>
				</div>

				{/* Buckets */}
				<div className="flex-1 space-y-8 min-h-0">
					{validBuckets.map((bucket) => {
						const bucketTasks = tasks.filter((t) => (t.bucket || 'Today') === bucket);

						return (
							<div key={bucket} className="space-y-4">
								<div className="flex items-center justify-between sticky top-0 z-10 py-2 backdrop-blur-md">
									<h2 className={`text-sm font-bold tracking-widest uppercase ${styles.text} opacity-50 flex items-center gap-2`}>
										{bucket}
										<span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] border border-white/5">{bucketTasks.length}</span>
									</h2>
									<div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-4" />
								</div>

								<AnimatePresence mode="popLayout">
									{bucketTasks.length > 0 ? (
										bucketTasks.map((task) => (
											<TaskItem key={task.id} task={task} onUpdate={handleTaskUpdate} />
										))
									) : (
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											className="py-8 text-center border-2 border-dashed border-white/5 rounded-2xl"
										>
											<p className={`text-sm ${styles.text} opacity-30`}>No tasks for {bucket.toLowerCase()}</p>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						);
					})}
				</div>
			</div>
		</>
	);
};

export default TaskBoard;
