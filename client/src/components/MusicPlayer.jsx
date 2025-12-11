import React from 'react';
import { Music } from 'lucide-react';

export default function MusicPlayer() {
	return (
		<div className="h-full flex flex-col gap-6 p-2">
			{/* Header */}
			<div className="flex items-center gap-2 text-white/50 mb-2">
				<Music size={18} />
				<h2 className="text-xs font-semibold tracking-widest uppercase">Work Music Station</h2>
			</div>

			<div className="glass-panel p-4 rounded-3xl flex-1 flex flex-col min-h-0">
				<div className="flex-1 rounded-2xl overflow-hidden bg-black/40 relative">
					<iframe
						className="absolute inset-0 w-full h-full"
						src="https://www.youtube.com/embed/jfKfPfyJRdk"
						title="Lofi Girl"
						frameBorder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowFullScreen
					></iframe>
				</div>
			</div>
		</div>
	);
}
