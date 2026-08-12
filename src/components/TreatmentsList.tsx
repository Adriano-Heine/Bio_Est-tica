import React from 'react';
import { TreatmentItem } from '../types';
import { Icon } from './Icon';

interface TreatmentsListProps {
  treatments: TreatmentItem[];
  onSelectTreatment?: (treatment: TreatmentItem) => void;
}

export const TreatmentsList: React.FC<TreatmentsListProps> = ({
  treatments,
  onSelectTreatment
}) => {
  return (
    <section className="w-full px-4 my-6" aria-label="Nossos Tratamentos">
      {/* Title */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C98F83]" />
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#8C6E65]">
            Nossos Tratamentos
          </h2>
        </div>
        <span className="text-[11px] text-[#A08177] font-medium">Procedimentos Exclusivos</span>
      </div>

      {/* Cards List */}
      <div className="space-y-3">
        {treatments.map((treatment) => (
          <div
            key={treatment.id}
            onClick={() => {
              if (onSelectTreatment) {
                onSelectTreatment(treatment);
              } else {
                window.open(treatment.link, '_blank', 'noopener,noreferrer');
              }
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                if (onSelectTreatment) {
                  onSelectTreatment(treatment);
                } else {
                  window.open(treatment.link, '_blank', 'noopener,noreferrer');
                }
              }
            }}
            className="group flex items-center gap-3 p-3 bg-white rounded-2xl custom-shadow custom-shadow-hover border border-[#F2E7E0] cursor-pointer active:scale-[0.99] transition-all"
          >
            {/* Service Thumbnail Image */}
            <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden shrink-0 bg-[#F5EAE4]">
              <img
                src={treatment.image}
                alt={treatment.name}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#C98F83] shadow-xs">
                <Icon name={treatment.iconName} className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Service Info */}
            <div className="flex-1 min-w-0 pr-1">
              <h3 className="text-sm sm:text-base font-bold text-[#5A4038] tracking-tight group-hover:text-[#C98F83] transition-colors line-clamp-1">
                {treatment.name}
              </h3>
              <p className="mt-1 text-xs text-[#8C6E65] font-normal leading-relaxed line-clamp-2">
                {treatment.description}
              </p>
            </div>

            {/* Circular Arrow Button */}
            <div className="shrink-0">
              <div className="w-9 h-9 rounded-full bg-[#F5EAE4] text-[#C98F83] group-hover:bg-[#C98F83] group-hover:text-white flex items-center justify-center transition-all shadow-xs">
                <Icon name="ArrowRight" className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
