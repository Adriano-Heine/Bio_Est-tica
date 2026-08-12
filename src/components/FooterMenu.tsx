import React from 'react';
import { FooterMenuItem } from '../types';
import { Icon } from './Icon';

interface FooterMenuProps {
  onOpenModal: (type: 'localizacao' | 'horarios' | 'promocoes' | 'duvidas') => void;
  localizacaoLink: string;
}

export const FooterMenu: React.FC<FooterMenuProps> = ({
  onOpenModal,
}) => {
  const menuItems: FooterMenuItem[] = [
    {
      id: 'localizacao',
      label: 'LOCALIZAÇÃO',
      iconName: 'MapPin',
      link: '#localizacao',
      modalTitle: 'Nossa Localização'
    },
    {
      id: 'horarios',
      label: 'HORÁRIOS',
      iconName: 'Clock',
      link: '#horarios',
      modalTitle: 'Horários de Atendimento'
    },
    {
      id: 'promocoes',
      label: 'PROMOÇÕES',
      iconName: 'Tag',
      link: '#promocoes',
      modalTitle: 'Promoções Especiais'
    },
    {
      id: 'duvidas',
      label: 'DÚVIDAS',
      iconName: 'HelpCircle',
      link: '#duvidas',
      modalTitle: 'Dúvidas Frequentes'
    }
  ];

  return (
    <nav className="w-full px-4 my-6" aria-label="Menu de Links Úteis">
      <div className="bg-white rounded-2xl p-3 custom-shadow border border-[#F2E7E0]">
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-center">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onOpenModal(item.id)}
              className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-[#F5EAE4]/50 active:scale-95 transition-all group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-[#F5EAE4] text-[#C98F83] group-hover:bg-[#C98F83] group-hover:text-white flex items-center justify-center mb-1 transition-colors">
                <Icon name={item.iconName} className="w-4 h-4" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-[#5A4038] tracking-tight truncate max-w-full">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
