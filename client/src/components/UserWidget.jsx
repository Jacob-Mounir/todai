import React, { useState, useEffect } from 'react';
import { User, Plus, LogOut, Settings, Check } from 'lucide-react';

const AVATARS = [
	'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
	'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
	'https://api.dicebear.com/7.x/avataaars/svg?seed=Mark',
	'https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha',
	'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
];

export default function UserWidget({ userContext, setUserContext }) {
	// Persistence State
	const [profiles, setProfiles] = useState(() => {
		const saved = localStorage.getItem('user_profiles');
		return saved ? JSON.parse(saved) : [];
	});

	const [currentUserId, setCurrentUserId] = useState(() => {
		return localStorage.getItem('current_user_id') || null;
	});

	// UI State
	const [isCreating, setIsCreating] = useState(false);
	const [newProfileName, setNewProfileName] = useState('');
	const [newProfileAvatar, setNewProfileAvatar] = useState(AVATARS[0]);

	// Sync Persistence
	useEffect(() => {
		localStorage.setItem('user_profiles', JSON.stringify(profiles));
	}, [profiles]);

	useEffect(() => {
		if (currentUserId) localStorage.setItem('current_user_id', currentUserId);
		else localStorage.removeItem('current_user_id');
	}, [currentUserId]);

	// Sync Context on Mount/Change
	useEffect(() => {
		const user = profiles.find(p => p.id === currentUserId);
		if (user && user.context !== userContext) {
			// Only update if different to avoid loops if careful,
			// but strictly we want the Profile to drive the Context.
			setUserContext(user.context);
		}
	}, [currentUserId, profiles]);


	// Handlers
	const handleLogin = (id) => {
		setCurrentUserId(id);
		const user = profiles.find(p => p.id === id);
		if (user) setUserContext(user.context);
	};

	const handleLogout = () => {
		setCurrentUserId(null);
		setUserContext(''); // Clear context on logout
	};

	const handleCreateProfile = () => {
		if (!newProfileName.trim()) return;

		const newProfile = {
			id: Date.now().toString(),
			name: newProfileName,
			avatar: newProfileAvatar,
			context: '' // Empty start
		};

		setProfiles([...profiles, newProfile]);
		setCurrentUserId(newProfile.id);
		setIsCreating(false);
		setNewProfileName('');
	};

	const handleUpdateContext = (newContext) => {
		setUserContext(newContext);
		setProfiles(prev => prev.map(p =>
			p.id === currentUserId ? { ...p, context: newContext } : p
		));
	};


	// --- Render ---

	// 1. Logged In View
	if (currentUserId) {
		const user = profiles.find(p => p.id === currentUserId);
		if (!user) { // Should not happen, but safe fallback
			setCurrentUserId(null);
			return null;
		}

		return (
			<div className="h-full flex flex-col p-5 text-white">
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-3">
						<div className="relative">
							<img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full bg-white/10 border-2 border-indigo-500/50" />
							<div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border border-black" />
						</div>
						<div>
							<h3 className="font-bold text-sm leading-tight">{user.name}</h3>
							<span className="text-[10px] opacity-50 uppercase tracking-widest font-bold">Online</span>
						</div>
					</div>
					<button
						onClick={handleLogout}
						className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/50 hover:text-white"
						title="Switch Profile"
					>
						<LogOut size={16} />
					</button>
				</div>

				<div className="flex-1 flex flex-col gap-2">
					<label className="text-[10px] font-bold text-indigo-200/50 tracking-widest uppercase flex items-center gap-2">
						<Settings size={10} /> AI Context
					</label>
					<textarea
						className="flex-1 w-full bg-black/20 rounded-xl p-3 text-xs leading-relaxed resize-none border border-white/5 focus:outline-none focus:border-indigo-500/30 transition-all placeholder:text-white/20"
						placeholder="Tell the AI who you are (e.g., 'I am a senior developer...')..."
						value={userContext}
						onChange={(e) => handleUpdateContext(e.target.value)}
					/>
				</div>
			</div>
		);
	}

	// 2. Create Profile View
	if (isCreating) {
		return (
			<div className="h-full flex flex-col p-5 text-white">
				<h3 className="font-bold text-lg mb-4">New Profile</h3>

				<div className="flex items-center gap-2 overflow-x-auto pb-4 custom-scrollbar mb-2">
					{AVATARS.map(url => (
						<button
							key={url}
							onClick={() => setNewProfileAvatar(url)}
							className={`relative flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${newProfileAvatar === url ? 'border-indigo-500 scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
						>
							<img src={url} alt="Avatar option" />
						</button>
					))}
				</div>

				<input
					autoFocus
					type="text"
					placeholder="Profile Name"
					className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:bg-black/40 mb-3"
					value={newProfileName}
					onChange={(e) => setNewProfileName(e.target.value)}
					onKeyDown={(e) => e.key === 'Enter' && handleCreateProfile()}
				/>

				<div className="flex gap-2 mt-auto">
					<button
						onClick={() => setIsCreating(false)}
						className="flex-1 py-2 bg-white/5 rounded-lg text-xs font-semibold hover:bg-white/10"
					>
						Cancel
					</button>
					<button
						onClick={handleCreateProfile}
						className="flex-1 py-2 bg-indigo-600 rounded-lg text-xs font-semibold hover:bg-indigo-500"
					>
						Create
					</button>
				</div>
			</div>
		);
	}

	// 3. Login / Selection View
	return (
		<div className="h-full flex flex-col p-5 text-white">
			<div className="flex items-center gap-2 mb-4 text-white/50">
				<User size={18} />
				<span className="font-bold text-xs tracking-widest uppercase">Select Profile</span>
			</div>

			<div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2">
				{profiles.map(profile => (
					<button
						key={profile.id}
						onClick={() => handleLogin(profile.id)}
						className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors text-left group"
					>
						<img src={profile.avatar} alt={profile.name} className="w-8 h-8 rounded-full bg-white/5" />
						<span className="font-medium text-sm flex-1">{profile.name}</span>
						<div className="opacity-0 group-hover:opacity-100 transition-opacity">
							<Check size={14} className="text-indigo-400" />
						</div>
					</button>
				))}

				{profiles.length === 0 && (
					<div className="text-center py-8 opacity-30 text-xs italic">
						No profiles found.
					</div>
				)}
			</div>

			<button
				onClick={() => setIsCreating(true)}
				className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-white/5 border border-dashed border-white/20 rounded-xl hover:bg-white/10 hover:border-white/40 transition-all text-sm font-medium text-white/70"
			>
				<Plus size={16} /> Add Profile
			</button>
		</div>
	);
}
