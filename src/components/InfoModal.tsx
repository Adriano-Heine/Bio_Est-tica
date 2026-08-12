import React from 'react';
import { BioConfig, TreatmentItem } from '../types';
import { Icon } from './Icon';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalType: 'localizacao' | 'horarios' | 'promocoes' | 'duvidas' | 'tratamento' | null;
  selectedTreatment?: TreatmentItem | null;
  config: BioConfig;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  modalType,
  selectedTreatment,
  config
}) => {
  if (!isOpen || !modalType) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#5A4038]/40 backdrop-blur-xs transition-opacity duration-300">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 custom-shadow z-10 max-h-[85vh] overflow-y-auto transform transition-all duration-300 animate-in slide-in-from-bottom-5">
        {/* Top Handle / Close Button */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F2E7E0]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C98F83]" />
            <h3 className="text-base font-bold text-[#5A4038]">
              {modalType === 'localizacao' && 'Nossa Localização'}
              {modalType === 'horarios' && 'Horários de Atendimento'}
              {modalType === 'promocoes' && 'Promoções Especiais'}
              {modalType === 'duvidas' && 'Dúvidas Frequentes'}
              {modalType === 'tratamento' && selectedTreatment?.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F5EAE4] text-[#5A4038] hover:bg-[#C98F83] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <Icon name="X" className="w-4 h-4" />
          </button>
        </div>

        {/* Content according to modalType */}

        {/* 1. LOCALIZAÇÃO */}
        {modalType === 'localizacao' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#FDFBF9] border border-[#F5EAE4]">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F5EAE4] text-[#C98F83] flex items-center justify-center shrink-0">
                  <Icon name="MapPin" className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#5A4038]">Endereço da Clínica</h4>
                  <p className="mt-1 text-xs text-[#8C6E65] leading-relaxed">
                    {config.enderecoCompleto}
                  </p>
                </div>
              </div>
            </div>

            <a
              href={config.localizacaoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#C98F83] text-white text-sm font-bold shadow-sm hover:bg-[#B67B6F] transition-colors cursor-pointer"
            >
              <Icon name="Navigation" className="w-4 h-4" />
              <span>ABRIR NO GOOGLE MAPS</span>
            </a>
          </div>
        )}

        {/* 2. HORÁRIOS */}
        {modalType === 'horarios' && (
          <div className="space-y-3">
            <div className="divide-y divide-[#F5EAE4] bg-[#FDFBF9] rounded-2xl border border-[#F5EAE4] overflow-hidden">
              {config.horariosAtendimento.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3.5 text-xs">
                  <span className="font-semibold text-[#5A4038] flex items-center gap-2">
                    <Icon name="Clock" className="w-3.5 h-3.5 text-[#C98F83]" />
                    {item.dia}
                  </span>
                  <span className="text-[#8C6E65] font-medium">{item.horario}</span>
                </div>
              ))}
            </div>
            <a
              href={config.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#C98F83] text-white text-sm font-bold shadow-sm hover:bg-[#B67B6F] transition-colors cursor-pointer mt-2"
            >
              <Icon name="MessageCircle" className="w-4 h-4" />
              <span>CONSULTAR DISPONIBILIDADE</span>
            </a>
          </div>
        )}

        {/* 3. PROMOÇÕES */}
        {modalType === 'promocoes' && (
          <div className="space-y-3">
            {config.promocoesAtivas.map((promo, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#FDFBF9] border border-[#F5EAE4] relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#C98F83] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-bl-lg">
                  OFERTA
                </div>
                <h4 className="text-sm font-bold text-[#5A4038] pr-12">{promo.titulo}</h4>
                <p className="mt-1 text-xs text-[#8C6E65] leading-relaxed">{promo.descricao}</p>
                {promo.dePor && (
                  <p className="mt-2 text-xs font-bold text-[#C98F83]">{promo.dePor}</p>
                )}
                <a
                  href={`https://wa.me/${config.whatsappNumber}?text=Ol%C3%A1!%20Gostaria%20de%20aproveitar%20a%20promo%C3%A7%C3%A3o:%20${encodeURIComponent(promo.titulo)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#F5EAE4] text-[#C98F83] hover:bg-[#C98F83] hover:text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <Icon name="Tag" className="w-3.5 h-3.5" />
                  <span>GARANTIR ESSA PROMOÇÃO</span>
                </a>
              </div>
            ))}
          </div>
        )}

        {/* 4. DÚVIDAS */}
        {modalType === 'duvidas' && (
          <div className="space-y-3">
            {config.duvidasFrequentes.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-[#FDFBF9] border border-[#F5EAE4]">
                <h4 className="text-xs font-bold text-[#5A4038] flex items-center gap-1.5">
                  <Icon name="HelpCircle" className="w-3.5 h-3.5 text-[#C98F83] shrink-0" />
                  {item.pergunta}
                </h4>
                <p className="mt-1.5 text-xs text-[#8C6E65] leading-relaxed pl-5">
                  {item.resposta}
                </p>
              </div>
            ))}
            <a
              href={config.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#C98F83] text-white text-sm font-bold shadow-sm hover:bg-[#B67B6F] transition-colors cursor-pointer mt-2"
            >
              <Icon name="MessageCircle" className="w-4 h-4" />
              <span>TIRAR OUTRAS DÚVIDAS NO WHATSAPP</span>
            </a>
          </div>
        )}

        {/* 5. DETALHES DO TRATAMENTO */}
        {modalType === 'tratamento' && selectedTreatment && (
          <div className="space-y-4">
            <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-[#F5EAE4]">
              <img
                src={selectedTreatment.image}
                alt={selectedTreatment.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#5A4038]/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-[#C98F83] px-2 py-0.5 rounded-md">
                  {selectedTreatment.duration || '60 min'}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#8C6E65] leading-relaxed">
              {selectedTreatment.fullDetails || selectedTreatment.description}
            </p>

            {selectedTreatment.benefits && selectedTreatment.benefits.length > 0 && (
              <div className="p-3 rounded-xl bg-[#FDFBF9] border border-[#F5EAE4]">
                <h5 className="text-xs font-bold text-[#5A4038] mb-2">Principais Benefícios:</h5>
                <ul className="space-y-1.5 text-xs text-[#8C6E65]">
                  {selectedTreatment.benefits.map((b, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Icon name="Check" className="w-3.5 h-3.5 text-[#C98F83] shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <a
              href={selectedTreatment.link || config.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#C98F83] text-white text-sm font-bold shadow-md hover:bg-[#B67B6F] transition-colors cursor-pointer"
            >
              <Icon name="MessageCircle" className="w-4.5 h-4.5" />
              <span>AGENDAR {selectedTreatment.name}</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
