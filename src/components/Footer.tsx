import React from 'react';
import { Icon } from './Icon';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full pt-4 pb-12 text-center text-xs text-[#8C6E65] font-light border-t border-[#F2E7E0]/60 mt-8">
      <div className="flex items-center justify-center gap-1.5 text-sm font-serif-title italic text-[#5A4038]">
        <span>“Cuidar de você é o que me move!”</span>
        <Icon name="Heart" className="w-4 h-4 text-[#C98F83] fill-[#C98F83]/30 inline-block animate-pulse" />
      </div>
      <p className="mt-2 text-[10px] text-[#A08177]">
        © {new Date().getFullYear()} • Todos os direitos reservados
      </p>
    </footer>
  );
};
