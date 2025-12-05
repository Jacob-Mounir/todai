import React from 'react';
import { User } from 'lucide-react';

const UserContext = ({ value, onChange }) => {
  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center gap-2 text-muted-foreground/70 mb-2">
        <User size={16} />
        <span className="text-xs font-bold tracking-widest uppercase">User Context</span>
      </div>
      <div className="flex-1 flex flex-col">
        <label className="text-[10px] font-bold text-muted-foreground/50 mb-3 tracking-widest">
          WHO ARE YOU?
        </label>
        <textarea
          className="w-full h-full bg-black/20 backdrop-blur-sm border border-white/5 rounded-xl p-4 text-sm font-medium leading-relaxed resize-none focus:outline-none focus:bg-black/30 transition-all placeholder:text-white/20 text-white/90"
          placeholder="I am a freelance designer focused on high-paying clients..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <p className="text-[10px] text-white/30 mt-4 leading-relaxed font-medium">
          The AI uses this to sort your tasks.
        </p>
      </div>
    </div>
  );
};

export default UserContext;
