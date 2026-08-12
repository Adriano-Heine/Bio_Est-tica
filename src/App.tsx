import { useState } from 'react';
import { BIO_CONFIG } from './config';
import { BioConfig, TreatmentItem } from './types';
import { HeaderHero } from './components/HeaderHero';
import { Differentials } from './components/Differentials';
import { TreatmentsList } from './components/TreatmentsList';
import { MainCTAButtons } from './components/MainCTAButtons';
import { FooterMenu } from './components/FooterMenu';
import { Footer } from './components/Footer';
import { InfoModal } from './components/InfoModal';
import { QuickEditorDrawer } from './components/QuickEditorDrawer';

export default function App() {
  const [config, setConfig] = useState<BioConfig>(BIO_CONFIG);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'localizacao' | 'horarios' | 'promocoes' | 'duvidas' | 'tratamento' | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<TreatmentItem | null>(null);

  const handleOpenModal = (type: 'localizacao' | 'horarios' | 'promocoes' | 'duvidas') => {
    setModalType(type);
    setSelectedTreatment(null);
    setIsModalOpen(true);
  };

  const handleSelectTreatment = (treatment: TreatmentItem) => {
    setSelectedTreatment(treatment);
    setModalType('tratamento');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSelectedTreatment(null);
  };

  const handleResetConfig = () => {
    setConfig(BIO_CONFIG);
  };

  return (
    <div className="min-h-screen bg-[#F4EDE8] sm:py-6 flex flex-col justify-start items-center">
      {/* Outer wrapper limiting width to ~480px on desktop to preserve mobile Link na Bio aesthetics */}
      <main className="w-full max-w-[480px] bg-[#F8F1EC] min-h-screen sm:min-h-0 sm:rounded-3xl sm:shadow-2xl sm:border sm:border-[#EADBD2] flex flex-col relative overflow-hidden transition-all">
        
        {/* 1. CABEÇALHO / HERO */}
        <HeaderHero config={config} />

        {/* 2. DIFERENCIAIS */}
        <Differentials items={config.diferenciais} />

        {/* 3. NOSSOS TRATAMENTOS */}
        <TreatmentsList
          treatments={config.tratamentos}
          onSelectTreatment={handleSelectTreatment}
        />

        {/* 4 & 5. WHATSAPP & INSTAGRAM CTA BUTTONS */}
        <MainCTAButtons config={config} />

        {/* 6. MENU DE LINKS INFERIOR (LOCALIZAÇÃO, HORÁRIOS, PROMOÇÕES, DÚVIDAS) */}
        <FooterMenu
          onOpenModal={handleOpenModal}
          localizacaoLink={config.localizacaoLink}
        />

        {/* 7. RODAPÉ */}
        <Footer />
      </main>

      {/* Popups & Modais de Informações */}
      <InfoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        modalType={modalType}
        selectedTreatment={selectedTreatment}
        config={config}
      />

      {/* Editor Rápido Interativo para Personalização Instantânea */}
      <QuickEditorDrawer
        config={config}
        onUpdateConfig={setConfig}
        onResetConfig={handleResetConfig}
      />
    </div>
  );
}
