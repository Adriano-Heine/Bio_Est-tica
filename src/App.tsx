import { useState, useEffect } from 'react';
import { BIO_CONFIG } from './config';
import { BioConfig, TreatmentItem } from './types';
import { HeaderHero } from './components/HeaderHero';
import { Differentials } from './components/Differentials';
import { TreatmentsList } from './components/TreatmentsList';
import { MainCTAButtons } from './components/MainCTAButtons';
import { FooterMenu } from './components/FooterMenu';
import { Footer } from './components/Footer';
import { InfoModal } from './components/InfoModal';
import { GoogleSheetsSyncModal } from './components/GoogleSheetsSyncModal';
import { Icon } from './components/Icon';
import { syncWithGoogleSheet } from './services/sheetSync';

export default function App() {
  const [config, setConfig] = useState<BioConfig>(() => {
    try {
      const saved = localStorage.getItem('bio_sheet_config');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Erro ao carregar cache de configuração', e);
    }
    return BIO_CONFIG;
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'localizacao' | 'horarios' | 'promocoes' | 'duvidas' | 'tratamento' | null>(null);
  const [selectedTreatment, setSelectedTreatment] = useState<TreatmentItem | null>(null);
  const [isAutoSyncing, setIsAutoSyncing] = useState(false);

  // Auto-sync com Google Sheets no carregamento se houver URL salva
  useEffect(() => {
    const savedUrl = localStorage.getItem('bio_sheet_url') || config.googleSheetUrl;
    if (savedUrl) {
      setIsAutoSyncing(true);
      syncWithGoogleSheet(savedUrl, config)
        .then((updated) => {
          setConfig(updated);
        })
        .catch((err) => {
          console.warn('Auto-sync background check:', err);
        })
        .finally(() => {
          setIsAutoSyncing(false);
        });
    }
  }, []);

  const handleManualRefreshSheet = async () => {
    const savedUrl = localStorage.getItem('bio_sheet_url') || config.googleSheetUrl;
    if (!savedUrl) {
      setIsSheetModalOpen(true);
      return;
    }
    setIsAutoSyncing(true);
    try {
      const updated = await syncWithGoogleSheet(savedUrl, config);
      setConfig(updated);
    } catch (e) {
      console.error(e);
      setIsSheetModalOpen(true);
    } finally {
      setIsAutoSyncing(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-[#F4EDE8] sm:py-6 flex flex-col justify-start items-center">
      {/* Barra de Status da Planilha se Conectada */}
      {config.sheetSyncEnabled && (
        <div className="w-full max-w-[480px] mb-2 px-3 py-1.5 rounded-2xl bg-white/80 backdrop-blur-xs border border-emerald-200 text-emerald-800 text-[11px] font-medium flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Google Sheets conectado {config.lastSyncTime ? `(${config.lastSyncTime})` : ''}</span>
          </div>
          <button
            onClick={handleManualRefreshSheet}
            disabled={isAutoSyncing}
            className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer disabled:opacity-50"
            title="Atualizar dados da planilha agora"
          >
            <Icon name="RefreshCw" className={`w-3 h-3 ${isAutoSyncing ? 'animate-spin' : ''}`} />
            <span>{isAutoSyncing ? 'Atualizando...' : 'Atualizar'}</span>
          </button>
        </div>
      )}

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

      {/* Modal Dedicado de Sincronização Google Sheets */}
      <GoogleSheetsSyncModal
        isOpen={isSheetModalOpen}
        onClose={() => setIsSheetModalOpen(false)}
        config={config}
        onUpdateConfig={setConfig}
      />

      {/* Botão ÚNICO flutuante de Conectar Planilha Google */}
      <button
        onClick={() => setIsSheetModalOpen(true)}
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1E7E34] text-white text-xs font-semibold shadow-lg hover:bg-[#166528] active:scale-95 transition-all cursor-pointer border border-white/20"
        title="Conectar ou Atualizar Planilha Google Sheets"
      >
        <Icon name="FileSpreadsheet" className="w-4 h-4 text-emerald-200" />
        <span>Conectar Planilha Google</span>
      </button>
    </div>
  );
}
