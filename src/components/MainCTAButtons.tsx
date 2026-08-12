import React from 'react';
import { BioConfig } from '../types';
import { Icon } from './Icon';

interface MainCTAButtonsProps {
  config: BioConfig;
}

export const MainCTAButtons: React.FC<MainCTAButtonsProps> = ({ config }) => {
  return (
    <section className="w-full px-4 my-6 space-y-3" aria-label="Ações Principais">
      {/* Botão Principal de WhatsApp */}
      <a
        href={config.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="relative group flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-[#C98F83] to-[#B67B6F] text-white shadow-md hover:shadow-lg hover:from-[#B67B6F] hover:to-[#A36B5F] active:scale-[0.99] transition-all duration-200 cursor-pointer overflow-hidden"
      >
        {/* Glow / Shine effect */}
        <div className="absolute inset-0 w-1/2 bg-white/15 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />

        <div className="flex items-center gap-3.5 z-10">
          <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/30">
            <Icon name="MessageCircle" className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <span className="block text-sm sm:text-base font-bold tracking-tight leading-tight">
              FALE COMIGO NO WHATSAPP
            </span>
            <span className="block text-xs text-white/90 font-light mt-0.5">
              {config.whatsappButtonSubtitle || "Agende seu horário"}
            </span>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 z-10 group-hover:bg-white group-hover:text-[#C98F83] transition-all">
          <Icon name="ChevronRight" className="w-4 h-4 text-white group-hover:text-[#C98F83]" />
        </div>
      </a>

      {/* Botão Secundário de Instagram */}
      <a
        href={config.instagramLink}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between p-4 rounded-2xl bg-white text-[#5A4038] border border-[#F2E7E0] custom-shadow custom-shadow-hover active:scale-[0.99] transition-all duration-200 cursor-pointer"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-full bg-[#F5EAE4] flex items-center justify-center shrink-0 border border-[#EADBD2] group-hover:bg-[#C98F83] group-hover:text-white transition-colors">
            <Icon name="Instagram" className="w-5 h-5 text-[#C98F83] group-hover:text-white transition-colors" />
          </div>
          <div className="text-left">
            <span className="block text-sm sm:text-base font-bold tracking-tight text-[#5A4038]">
              ME SIGA NO INSTAGRAM
            </span>
            <span className="block text-xs text-[#8C6E65] font-light mt-0.5">
              {config.instagramHandle}
            </span>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-[#F5EAE4] flex items-center justify-center shrink-0 group-hover:bg-[#C98F83] transition-all">
          <Icon name="ChevronRight" className="w-4 h-4 text-[#C98F83] group-hover:text-white" />
        </div>
      </a>
    </section>
  );
};
