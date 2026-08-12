import React from 'react';
import { DifferentialItem } from '../types';
import { Icon } from './Icon';

interface DifferentialsProps {
  items: DifferentialItem[];
}

export const Differentials: React.FC<DifferentialsProps> = ({ items }) => {
  return (
    <section className="w-full px-4 my-5" aria-label="Diferenciais">
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 custom-shadow border border-[#F2E7E0]">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#FDFBF9] border border-[#F5EAE4]/60 hover:bg-[#F5EAE4]/40 transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-[#F5EAE4] text-[#C98F83] flex items-center justify-center mb-1.5 transition-transform group-hover:scale-110">
                <Icon name={item.iconName} className="w-4 h-4 text-[#C98F83]" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-[#5A4038] tracking-wider leading-tight uppercase">
                {item.titleLine1}
                <br />
                <span className="text-[#8C6E65] font-semibold">{item.titleLine2}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
