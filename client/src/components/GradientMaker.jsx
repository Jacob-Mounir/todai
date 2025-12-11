import React, { useState, useEffect } from 'react';
import { Copy, Check, Palette, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const DIRECTIONS = [
	{ label: '→ To Right', value: 'to right' },
	{ label: '← To Left', value: 'to left' },
	{ label: '↓ To Bottom', value: 'to bottom' },
	{ label: '↑ To Top', value: 'to top' },
	{ label: '↘ To Bottom Right', value: 'to bottom right' },
	{ label: '↗ To Top Right', value: 'to top right' },
	{ label: '↙ To Bottom Left', value: 'to bottom left' },
	{ label: '↖ To Top Left', value: 'to top left' },
];

export default function GradientMaker() {
	const { setCustomGradient, toggleCardTransparency, cardTransparency } = useTheme();

	const previewRef = React.useRef(null);
	const [angle, setAngle] = useState(46); // Start with default 46deg
	const [color1, setColor1] = useState('#4e3232');
	const [color2, setColor2] = useState('#1a1a1a');
	const [copied, setCopied] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	const gradientCSS = `linear-gradient(${angle}deg, ${color1}, ${color2})`;

	// Calculate angle based on mouse/touch position
	const handleMove = (clientX, clientY) => {
		if (!previewRef.current) return;
		const rect = previewRef.current.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;

		const deltaX = clientX - centerX;
		const deltaY = clientY - centerY;

		// Calculate angle in degrees
		// Math.atan2(y, x) gives angle in radians.
		// CSS gradients: 0deg is Top, 90deg is Right, 180deg is Bottom.
		// Math.atan2: 0 is Right, positive Y is Down.

		// We want standard compass-like feel where dragging to right is 90deg
		let deg = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

		// Adjust to match CSS Linear Gradient convention (0deg = Up, 90deg = Right)
		// Actually, standard linear-gradient: 90deg is Right.
		// atan2(0, 1) = 0 (Right).
		// So we just need to shift it by 90 degrees so 0 becomes Top?
		// No, let's keep it simple: 90deg logic in CSS matches standard circle.
		// CSS linear-gradient(90deg) goes Left -> Right.
		// atan2 returns 0 for (1,0) [Right]. So CSS 90deg = atan2 0deg + 90 offset.

		deg = deg + 90;

		if (deg < 0) deg += 360;
		setAngle(Math.round(deg));
	};

	const onMouseDown = (e) => {
		setIsDragging(true);
		handleMove(e.clientX, e.clientY);
	};

	const onMouseMove = (e) => {
		if (isDragging) {
			handleMove(e.clientX, e.clientY);
		}
	};

	const onMouseUp = () => {
		setIsDragging(false);
	};

	useEffect(() => {
		if (isDragging) {
			window.addEventListener('mousemove', onMouseMove);
			window.addEventListener('mouseup', onMouseUp);
		} else {
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('mouseup', onMouseUp);
		}
		return () => {
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('mouseup', onMouseUp);
		};
	}, [isDragging]);


	const handleCopy = () => {
		navigator.clipboard.writeText(`background: ${gradientCSS};`);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleApply = () => {
		setCustomGradient(gradientCSS);
	};

	// Calculate dot position for visual feedback (on outline circle)
	const radius = 40; // px distance from center
	// Convert angle back to radians for positioning
	// CSS 90deg = Right. atan 0. So angle - 90 = atan angle.
	const rad = (angle - 90) * (Math.PI / 180);
	const dotX = Math.cos(rad) * radius;
	const dotY = Math.sin(rad) * radius;


	return (
		<div className="h-full flex flex-col p-4 text-white">
			{/* Header (Aligned styling) */}
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2 text-white/50">
					<Palette size={18} />
					<h2 className="text-xs font-semibold tracking-widest uppercase">Gradient Maker</h2>
				</div>

				<div className="flex items-center gap-2">
					{/* Transparency Toggle */}
					<button
						onClick={toggleCardTransparency}
						className={`relative w-12 h-7 rounded-full transition-colors flex items-center px-1 ${!cardTransparency ? 'bg-white/20' : 'bg-indigo-500'}`}
						title="Toggle Transparent Cards"
					>
						<div
							className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${!cardTransparency ? 'translate-x-0' : 'translate-x-5'}`}
						>
							{!cardTransparency ? <Moon size={12} className="text-black/50 m-1" /> : null}
						</div>
					</button>
				</div>
			</div>

			{/* Preview Box with Interactive Dot */}
			<div
				ref={previewRef}
				className="w-full h-40 rounded-3xl mb-4 shadow-2xl transition-all duration-300 border border-white/10 relative overflow-hidden cursor-crosshair group"
				style={{ background: gradientCSS }}
				onMouseDown={onMouseDown}
			>
				{/* Grid Pattern Overlay for pro feel */}
				<div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

				{/* Direction Indicator */}
				<div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
					{/* Central Circle */}
					<div className="w-24 h-24 rounded-full border border-white/20 relative backdrop-blur-sm bg-black/10">
						{/* The Dot */}
						<div
							className="absolute w-4 h-4 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
							style={{
								left: `calc(50% + ${dotX}px)`,
								top: `calc(50% + ${dotY}px)`
							}}
						/>
						{/* Center Point */}
						<div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white/50 rounded-full -translate-x-1/2 -translate-y-1/2" />
					</div>
					<div className="absolute top-2 right-2 text-[10px] font-mono opacity-50 bg-black/50 px-2 py-1 rounded-full backdrop-blur-md">
						{angle}°
					</div>
				</div>
			</div>

			{/* Controls Container */}
			<div className="flex-1 flex flex-col gap-4">

				{/* Colors */}
				<div className="grid grid-cols-2 gap-3">
					<div className="flex flex-col gap-2">
						<div className="flex gap-2 items-center bg-white/5 p-2 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
							<input
								type="color"
								value={color1}
								onChange={(e) => setColor1(e.target.value)}
								className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
							/>
							<span className="text-xs font-mono opacity-50 uppercase">{color1}</span>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<div className="flex gap-2 items-center bg-white/5 p-2 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
							<input
								type="color"
								value={color2}
								onChange={(e) => setColor2(e.target.value)}
								className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
							/>
							<span className="text-xs font-mono opacity-50 uppercase">{color2}</span>
						</div>
					</div>
				</div>

				<div className="mt-auto pt-2">
					<div className="grid grid-cols-2 gap-3">
						<button
							onClick={handleCopy}
							className="flex items-center justify-center gap-2 bg-white text-black font-bold py-3 px-4 rounded-xl hover:bg-white/90 transition-all active:scale-95 text-xs uppercase tracking-wide"
						>
							{copied ? <Check size={16} /> : <Copy size={16} />}
							{copied ? 'Copied' : 'Copy CSS'}
						</button>

						<button
							onClick={handleApply}
							className="flex items-center justify-center gap-2 bg-white/10 text-white font-bold py-3 px-4 rounded-xl hover:bg-white/20 transition-all active:scale-95 border border-white/5 text-xs uppercase tracking-wide"
						>
							Apply Global
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
