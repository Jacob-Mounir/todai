import React, { useState, useRef, useEffect } from 'react';
import { X, GripHorizontal, MoreVertical, LayoutTemplate } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const TEMPLATES = [
	{ label: 'Small', w: 3, h: 2 },
	{ label: 'Medium', w: 6, h: 4 },
	{ label: 'Wide', w: 12, h: 4 },
	{ label: 'Tall', w: 3, h: 6 },
	{ label: 'Big', w: 6, h: 6 },
];

const ROW_HEIGHT = 100; // As defined in DashboardLayout
const MARGIN = 16;

export default React.forwardRef(function WidgetWrapper(
	{ children, style, className, onRemove, onMouseDown, onMouseUp, onTouchEnd, isDraggable = true, onTemplateSelect, onMinHeightChange, ...props },
	ref
) {
	const { styles, cardTransparency } = useTheme();
	const [showMenu, setShowMenu] = useState(false);
	const contentRef = useRef(null);

	// Content Awareness: Min Height Enforcement Removed for Stable Grid



	return (
		<div
			ref={ref}
			style={style}
			className={`${className || ''} flex flex-col rounded-[2rem] overflow-hidden border border-white/5 active:border-indigo-500/50 transition-all shadow-2xl ${cardTransparency ? 'bg-transparent' : 'backdrop-blur-3xl bg-black/20'
				}`}
			onMouseDown={onMouseDown}
			onMouseUp={onMouseUp}
			onTouchEnd={onTouchEnd}
			{...props}
		>
			{/* Header / Drag Handle */}
			<div className="flex items-center justify-between p-2 pb-0 group z-10 relative">
				{/* Drag Handle */}
				<div
					className={`drag-handle cursor-move p-2 rounded-xl text-white/20 hover:text-white/80 hover:bg-white/5 transition-all ${!isDraggable && 'opacity-0 pointer-events-none'}`}
				>
					<GripHorizontal size={20} />
				</div>

				{/* Controls */}
				<div className="flex items-center gap-1 opacity-100 transition-opacity">
					{/* Template Menu */}
					{onTemplateSelect && (
						<div className="relative">
							<button
								onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
								className="p-1.5 rounded-full hover:bg-white/10 text-white/30 hover:text-white transition-colors"
								onMouseDown={(e) => e.stopPropagation()}
							>
								<LayoutTemplate size={14} />
							</button>

							{showMenu && (
								<>
									<div
										className="fixed inset-0 z-40"
										onClick={() => setShowMenu(false)}
										onMouseDown={(e) => e.stopPropagation()}
									/>
									<div
										className="absolute right-0 top-full mt-2 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl p-2 z-50 min-w-[120px] shadow-2xl flex flex-col gap-1"
										onMouseDown={(e) => e.stopPropagation()}
									>
										<div className="text-[10px] uppercase font-bold text-white/30 px-2 py-1">Resize</div>
										{TEMPLATES.map(t => (
											<button
												key={t.label}
												onClick={() => {
													onTemplateSelect(t.w, t.h);
													setShowMenu(false);
												}}
												className="text-left text-xs px-2 py-1.5 rounded-lg hover:bg-white/20 text-white/80 transition-colors"
											>
												{t.label} <span className="opacity-30 ml-1">({t.w}x{t.h})</span>
											</button>
										))}
									</div>
								</>
							)}
						</div>
					)}

					{onRemove && (
						<button
							onClick={(e) => {
								e.stopPropagation();
								onRemove();
							}}
							className="p-1.5 rounded-full hover:bg-red-500/20 hover:text-red-400 text-white/20 hover:opacity-100 transition-colors"
							title="Hide Widget"
							onMouseDown={(e) => e.stopPropagation()}
						>
							<X size={14} />
						</button>
					)}
				</div>
			</div>

			{/* Content */}
			<div className="flex-1 min-h-0 overflow-y-auto relative scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20" ref={contentRef}>
				{children}
			</div>
		</div>
	);
});
