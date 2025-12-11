import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout as LayoutIcon, Eye, Save, RotateCcw, Monitor, Smartphone } from 'lucide-react';

import UserWidget from './UserWidget';
import FocusPlayer from './FocusPlayer';
import MusicPlayer from './MusicPlayer';
import MobileNav from './MobileNav';
import NewsWidget from './NewsWidget';
import SocialFeed from './SocialFeed';
import WidgetWrapper from './WidgetWrapper';
import GradientMaker from './GradientMaker';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Default Layouts
const DEFAULT_LAYOUTS = {
	lg: [
		{ i: 'user', x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
		{ i: 'music', x: 3, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
		{ i: 'focus', x: 6, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
		{ i: 'gradient', x: 9, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
		{ i: 'social', x: 0, y: 2, w: 3, h: 4, minW: 2, minH: 3 },
		{ i: 'tasks', x: 3, y: 2, w: 6, h: 4, minW: 4, minH: 3 },
		{ i: 'news', x: 9, y: 2, w: 3, h: 4, minW: 2, minH: 2 }
	],
	md: [ // Tablet
		{ i: 'tasks', x: 0, y: 0, w: 10, h: 4 },
		{ i: 'social', x: 0, y: 4, w: 5, h: 3 },
		{ i: 'news', x: 5, y: 4, w: 5, h: 2 },
		{ i: 'focus', x: 5, y: 6, w: 5, h: 2 },
		{ i: 'music', x: 5, y: 8, w: 5, h: 2 }
	],
	sm: [ // Mobile (Not used by RGL mostly due to separation, but good for fallback)
		{ i: 'tasks', x: 0, y: 0, w: 1, h: 4 },
		{ i: 'social', x: 0, y: 4, w: 1, h: 3 },
		{ i: 'news', x: 0, y: 7, w: 1, h: 2 },
		{ i: 'focus', x: 0, y: 9, w: 1, h: 2 },
		{ i: 'music', x: 0, y: 11, w: 1, h: 2 }
	]
};

export default function DashboardLayout({ children, userContext, setUserContext }) {
	const { theme, toggleTheme, styles, customGradient } = useTheme();

	// State
	const [activeView, setActiveView] = useState('tasks'); // For Mobile Only logic
	const [layouts, setLayouts] = useState(() => {
		const saved = localStorage.getItem('dashboard_layout');
		return saved ? JSON.parse(saved) : DEFAULT_LAYOUTS;
	});
	const [visibleWidgets, setVisibleWidgets] = useState(() => {
		const saved = localStorage.getItem('dashboard_visible');
		return saved ? JSON.parse(saved) : ['tasks', 'user', 'social', 'news', 'focus', 'music', 'gradient'];
	});
	const [isEditMode, setIsEditMode] = useState(false);
	const [showManageMenu, setShowManageMenu] = useState(false);

	// Persistence
	useEffect(() => {
		localStorage.setItem('dashboard_layout', JSON.stringify(layouts));
		localStorage.setItem('dashboard_visible', JSON.stringify(visibleWidgets));
	}, [layouts, visibleWidgets]);

	const onLayoutChange = (currentLayout, allLayouts) => {
		setLayouts(prevLayouts => {
			const newLayouts = { ...allLayouts };

			// Preserve layouts for hidden widgets
			Object.keys(newLayouts).forEach(bp => {
				const currentIds = new Set(newLayouts[bp].map(item => item.i));
				const prevItems = prevLayouts[bp] || [];

				// Find items that were in previous layout but are missing now (hidden)
				const hiddenItems = prevItems.filter(item => !currentIds.has(item.i));

				// Append them to the new layout to persist their config
				if (hiddenItems.length > 0) {
					newLayouts[bp] = [...newLayouts[bp], ...hiddenItems];
				}
			});

			return newLayouts;
		});
	};

	const handleRemoveWidget = (id) => {
		setVisibleWidgets(prev => prev.filter(w => w !== id));
	};

	const handleAddWidget = (id) => {
		if (!visibleWidgets.includes(id)) {
			setVisibleWidgets([...visibleWidgets, id]);
		}
	};

	const resetLayout = () => {
		setLayouts(DEFAULT_LAYOUTS);
		setVisibleWidgets(['tasks', 'user', 'social', 'news', 'focus', 'music', 'gradient']);
	};

	// Widget Sizing Handlers
	const handleUpdateWidgetSize = (id, w, h) => {
		setLayouts(prevLayouts => {
			const newLayouts = { ...prevLayouts };
			// Update for 'lg' and 'md' breakpoints primarily
			// Note: RGL might sync these, but we target 'lg' as default
			const breakpoint = 'lg';
			const updated = newLayouts[breakpoint].map(item => {
				if (item.i === id) {
					return { ...item, w, h };
				}
				return item;
			});
			newLayouts[breakpoint] = updated;
			return newLayouts;
		});
	};

	// Auto-growth logic removed for stable grid behavior checks


	// Mobile Check
	const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

	// Dynamic Row Height Logic
	const [rowHeight, setRowHeight] = useState(100);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 1024) return; // Mobile handled by stack

			// Calculate height to fit roughly 6.5 grid units vertically in the viewport
			// Available height = window - padding (32) - top bar space/margin approx (40)
			const availableH = window.innerHeight - 80;
			// Target: 6 rows (since standard widget is h=2 or h=4, layout usually tall ~6)
			// Using 6.2 to leave a tiny breathing room or overlap
			const targetRows = 6.2;

			const newRowHeight = Math.floor(availableH / targetRows);
			// Clamp min height to avoid it getting too tiny
			setRowHeight(Math.max(newRowHeight, 60));
		};

		handleResize(); // Init
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return (
		<div
			className={`h-screen overflow-hidden ${styles.bg} ${styles.text} font-sans selection:bg-indigo-500/30 selection:text-indigo-200 flex flex-col transition-all duration-500`}
			style={customGradient ? { background: customGradient } : {}}
		>
			{/* Top Bar (Edit Controls) - Only Desktop */}
			{!isMobile && (
				<div className="fixed top-4 right-4 z-50 flex gap-2">
					<AnimatePresence>
						{showManageMenu && (
							<motion.div
								initial={{ opacity: 0, scale: 0.9, y: -10 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.9, y: -10 }}
								className="bg-black/80 backdrop-blur-xl border border-white/10 p-3 rounded-2xl flex flex-col gap-2 min-w-[200px]"
							>
								<h4 className="text-xs font-bold uppercase opacity-50 px-2 mb-1">Hidden Widgets</h4>
								{['tasks', 'user', 'social', 'news', 'focus', 'music', 'gradient'].filter(w => !visibleWidgets.includes(w)).map(w => (
									<button
										key={w}
										onClick={() => handleAddWidget(w)}
										className="text-left px-3 py-2 rounded-lg hover:bg-white/10 text-sm flex items-center gap-2"
									>
										<Eye size={14} /> Show {w.charAt(0).toUpperCase() + w.slice(1)}
									</button>
								))}
								{visibleWidgets.length === 7 && <div className="px-3 text-xs opacity-30 italic">All widgets visible</div>}

								<div className="h-px bg-white/10 my-1" />

								<button onClick={resetLayout} className="text-left px-3 py-2 rounded-lg hover:bg-red-500/20 hover:text-red-400 text-sm flex items-center gap-2">
									<RotateCcw size={14} /> Reset Layout
								</button>
							</motion.div>
						)}
					</AnimatePresence>

					<button
						onClick={() => setShowManageMenu(!showManageMenu)}
						className={`p-3 rounded-full backdrop-blur-md border transition-all shadow-xl ${showManageMenu ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
						title="Manage Widgets"
					>
						<LayoutIcon size={20} />
					</button>
					<button
						onClick={toggleTheme}
						className="p-3 rounded-full backdrop-blur-md border border-white/10 bg-white/5 hover:bg-white/10 transition-all shadow-xl"
						title="Toggle Theme"
					>
						{theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
					</button>
				</div>
			)}

			{/* Main Grid Area (Desktop) or Mobile Stack */}
			{!isMobile ? (
				<div className="p-4 h-full">
					<ResponsiveGridLayout
						className="layout"
						layouts={layouts}
						breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
						cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
						rowHeight={rowHeight}
						onLayoutChange={onLayoutChange}
						draggableHandle=".drag-handle"
						isDraggable={true}
						isResizable={true}
						margin={[16, 16]}
					>
						{/* User Widget */}
						{visibleWidgets.includes('user') && (
							<div key="user">
								<WidgetWrapper
									onRemove={() => handleRemoveWidget('user')}
									onTemplateSelect={(w, h) => handleUpdateWidgetSize('user', w, h)}

									className="h-full"

								>
									<UserWidget userContext={userContext} setUserContext={setUserContext} />
								</WidgetWrapper>
							</div>
						)}

						{/* Social Widget */}
						{visibleWidgets.includes('social') && (
							<div key="social">
								<WidgetWrapper
									onRemove={() => handleRemoveWidget('social')}
									onTemplateSelect={(w, h) => handleUpdateWidgetSize('social', w, h)}

									className="h-full"

								>
									<SocialFeed />
								</WidgetWrapper>
							</div>
						)}

						{/* Tasks / Main Content */}
						{visibleWidgets.includes('tasks') && (
							<div key="tasks">
								<WidgetWrapper
									/* Tasks board might handle minHeight internally differently or need scrolling.
									   Usually simple 'h-full' with overflow-y-auto is better for Tasks than auto-growing infinitely.
									   Let's enable template sizing but maybe skip auto-min-height for now, or allow it carefully. */
									onRemove={() => handleRemoveWidget('tasks')}
									onTemplateSelect={(w, h) => handleUpdateWidgetSize('tasks', w, h)}
									className="h-full"
								>
									{children}
								</WidgetWrapper>
							</div>
						)}

						{/* News Widget */}
						{visibleWidgets.includes('news') && (
							<div key="news">
								<WidgetWrapper
									onRemove={() => handleRemoveWidget('news')}
									onTemplateSelect={(w, h) => handleUpdateWidgetSize('news', w, h)}

									className="h-full"

								>
									<NewsWidget />
								</WidgetWrapper>
							</div>
						)}

						{/* Focus Player */}
						{visibleWidgets.includes('focus') && (
							<div key="focus">
								<WidgetWrapper
									onRemove={() => handleRemoveWidget('focus')}
									onTemplateSelect={(w, h) => handleUpdateWidgetSize('focus', w, h)}

									className="h-full"

								>
									<FocusPlayer />
								</WidgetWrapper>
							</div>
						)}

						{/* Music Player */}
						{visibleWidgets.includes('music') && (
							<div key="music">
								<WidgetWrapper
									onRemove={() => handleRemoveWidget('music')}
									onTemplateSelect={(w, h) => handleUpdateWidgetSize('music', w, h)}

									className="h-full"

								>
									<MusicPlayer />
								</WidgetWrapper>
							</div>
						)}

						{/* Gradient Maker */}
						{visibleWidgets.includes('gradient') && (
							<div key="gradient">
								<WidgetWrapper
									onRemove={() => handleRemoveWidget('gradient')}
									onTemplateSelect={(w, h) => handleUpdateWidgetSize('gradient', w, h)}
									/* Gradient Maker is fixed UI, probably doesn't need auto-growth but templates are fine */
									className="h-full"

								>
									<GradientMaker />
								</WidgetWrapper>
							</div>
						)}
					</ResponsiveGridLayout>
				</div>
			) : (
				// Mobile Layout (Fallback to existing mobile logic)
				<div className="flex-1 flex flex-col h-screen overflow-hidden relative">
					<main className="flex-1 overflow-hidden flex flex-col relative z-0">
						<AnimatePresence mode="wait">
							{(activeView === 'tasks') && (
								<motion.div
									key="tasks"
									initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
									className="h-full flex flex-col p-4 pt-12"
								>
									{children}
								</motion.div>
							)}
							{activeView === 'context' && (
								<motion.div
									key="context"
									initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
									className="absolute inset-0 p-6 bg-black/95 backdrop-blur-xl z-20 overflow-y-auto pb-24"
								>
									<h2 className="text-2xl font-bold mb-6 pt-8">Social Hub</h2>
									<SocialFeed />
								</motion.div>
							)}
							{activeView === 'focus' && (
								<motion.div
									key="focus"
									initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
									className="absolute inset-0 z-30 bg-black/95 flex flex-col justify-end"
								>
									<div className="p-6 pb-32">
										<FocusPlayer />
										<div className="mt-4">
											<MusicPlayer />
										</div>
										<div className="mt-8">
											<NewsWidget />
										</div>
									</div>
								</motion.div>
							)}
							{activeView === 'settings' && (
								<motion.div
									key="settings"
									initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
									className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-40"
								>
									<button
										onClick={() => { toggleTheme(); setActiveView('tasks'); }}
										className="flex flex-col items-center gap-4 text-xl font-bold p-8 bg-white/10 rounded-3xl"
									>
										{theme === 'dark' ? <Moon size={48} /> : <Sun size={48} />}
										<span>Switch to {theme === 'dark' ? 'Soft' : 'Dark'} Mode</span>
									</button>
								</motion.div>
							)}
						</AnimatePresence>
					</main>
					<MobileNav activeView={activeView} onViewChange={setActiveView} />
				</div>
			)}
		</div>
	);
}
