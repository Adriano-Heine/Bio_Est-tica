import React, { useState } from 'react';
import { BioConfig } from '../types';
import { Icon } from './Icon';

interface HeaderHeroProps {
  config: BioConfig;
}

export const HeaderHero: React.FC<HeaderHeroProps> = ({ config }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: `${config.nome} | ${config.profissao}`,
      text: `${config.nome} - ${config.frase}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) {
        // Share cancelled or failed, fallback to copy
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <header className="relative w-full text-center mb-6">
      {/* Imagem de Capa */}
      <div className="relative w-full h-44 sm:h-48 overflow-hidden rounded-b-3xl shadow-sm">
        <img
          src={config.fotoCapa}
          alt={`Capa ${config.nome}`}
          className="w-full h-full object-cover object-center transform transition-transform duration-700 hover:scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Soft overlay gradient in warm nude/terracotta tone */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#5A4038]/40 via-[#5A4038]/10 to-transparent" />

        {/* Botão de Compartilhar na Capa */}
        <button
          onClick={handleShare}
          title="Compartilhar página"
          className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-md text-[#5A4038] text-xs font-medium shadow-sm hover:bg-white active:scale-95 transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Icon name="Check" className="w-3.5 h-3.5 text-[#C98F83]" />
              <span>Copiado!</span>
            </>
          ) : (
            <>
              <Icon name="Share2" className="w-3.5 h-3.5 text-[#C98F83]" />
              <span className="hidden sm:inline">Compartilhar</span>
            </>
          )}
        </button>
      </div>

      {/* Foto de Perfil & Identidade */}
      <div className="relative px-4 -mt-16 sm:-mt-20 flex flex-col items-center">
        {/* Container Foto de Perfil Circular */}
        <div className="relative group">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-white shadow-lg ring-4 ring-[#F4E8E2] overflow-hidden transition-transform duration-300 group-hover:scale-102">
            <img
              src={config.fotoPerfil}
              alt={config.nome}
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Sparkle decorative badge */}
          <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-[#C98F83] text-white flex items-center justify-center shadow-md border-2 border-white">
            <Icon name="Sparkles" className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Nome da Profissional */}
        <h1 className="mt-3 text-2xl sm:text-3xl font-serif-title font-semibold text-[#5A4038] tracking-tight">
          {config.nome}
        </h1>

        {/* Cargo / Profissão */}
        <div className="mt-1">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#F5EAE4] text-[#C98F83] text-[11px] font-semibold tracking-widest uppercase border border-[#EADBD2]">
            {config.profissao}
          </span>
        </div>

        {/* Frase de Destaque */}
        <p className="mt-2 text-sm text-[#8C6E65] font-light italic max-w-xs sm:max-w-sm">
          “{config.frase}”
        </p>
      </div>
    </header>
  );
};
