import React, { useState, useRef } from 'react';
import { BioConfig } from '../types';
import { Icon } from './Icon';
import { syncWithGoogleSheet, getExampleSheetCsvTemplate } from '../services/sheetSync';

interface QuickEditorDrawerProps {
  config: BioConfig;
  onUpdateConfig: (newConfig: BioConfig) => void;
  onResetConfig: () => void;
  onOpenSheetModal?: () => void;
}

interface ImageUploaderProps {
  label: string;
  currentValue: string;
  onChange: (newValue: string) => void;
  aspectRatio?: 'square' | 'banner';
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  currentValue,
  onChange,
  aspectRatio = 'square'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-1">
      <label className="block font-bold text-[#5A4038] text-xs">{label}</label>
      <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#FDFBF9] border border-[#EADBD2]">
        {/* Preview Thumbnail */}
        <div className={`relative shrink-0 overflow-hidden bg-[#F5EAE4] border border-[#EADBD2] ${
          aspectRatio === 'banner' ? 'w-16 h-9 rounded-md' : 'w-10 h-10 rounded-full'
        }`}>
          {currentValue ? (
            <img src={currentValue} alt={label} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#C98F83]">
              <Icon name="Image" className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Upload Action */}
        <div className="flex-1 min-w-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="flex flex-wrap gap-2 items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 rounded-lg bg-[#C98F83] text-white font-semibold text-[11px] flex items-center gap-1.5 hover:bg-[#B67B6F] transition-colors cursor-pointer shadow-xs"
            >
              <Icon name="Upload" className="w-3.5 h-3.5" />
              <span>Fazer Upload</span>
            </button>
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-[10px] text-[#8C6E65] underline hover:text-[#5A4038] cursor-pointer px-1"
            >
              {showUrlInput ? 'Ocultar Link' : 'Ou colar URL (Cloudinary)'}
            </button>
          </div>
        </div>
      </div>

      {showUrlInput && (
        <input
          type="text"
          value={currentValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://res.cloudinary.com/..."
          className="w-full p-2 rounded-xl border border-[#EADBD2] bg-white text-xs text-[#5A4038] focus:outline-none focus:border-[#C98F83]"
        />
      )}
    </div>
  );
};

export const QuickEditorDrawer: React.FC<QuickEditorDrawerProps> = ({
  config,
  onUpdateConfig,
  onResetConfig,
  onOpenSheetModal
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'sheets'>('editor');
  const [sheetUrl, setSheetUrl] = useState(config.googleSheetUrl || '');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  const handleChange = (field: keyof BioConfig, value: string) => {
    onUpdateConfig({
      ...config,
      [field]: value,
      ...(field === 'whatsappNumber'
        ? { whatsappLink: `https://wa.me/${value.replace(/\D/g, '')}?text=${encodeURIComponent(config.whatsappMessage)}` }
        : {}),
      ...(field === 'instagramHandle'
        ? { instagramLink: `https://instagram.com/${value.replace('@', '')}` }
        : {})
    });
  };

  const handleTreatmentChange = (index: number, field: string, value: string) => {
    const newTratamentos = [...config.tratamentos];
    newTratamentos[index] = {
      ...newTratamentos[index],
      [field]: value
    };
    onUpdateConfig({
      ...config,
      tratamentos: newTratamentos
    });
  };

  const handleSyncSheet = async () => {
    if (!sheetUrl.trim()) {
      setSyncStatus({ type: 'error', text: 'Insira o link da planilha publicada em CSV.' });
      return;
    }
    setIsSyncing(true);
    setSyncStatus(null);
    try {
      const updated = await syncWithGoogleSheet(sheetUrl.trim(), config);
      onUpdateConfig(updated);
      setSyncStatus({
        type: 'success',
        text: `Sincronizado com sucesso! ${updated.tratamentos.length} tratamentos carregados.`
      });
    } catch (err: any) {
      setSyncStatus({
        type: 'error',
        text: err.message || 'Erro ao sincronizar. Verifique se publicou em CSV.'
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDownloadCsv = () => {
    const csvContent = getExampleSheetCsvTemplate();
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'modelo_planilha_bio_tratamentos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(getExampleSheetCsvTemplate());
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 3000);
  };

  const exportConfigCode = () => {
    const code = `export const BIO_CONFIG = ${JSON.stringify(config, null, 2)};`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
        {/* Google Sheets Direct Button */}
        <button
          onClick={() => {
            setActiveTab('sheets');
            setIsOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#1E7E34] text-white text-xs font-semibold shadow-lg hover:bg-[#166528] active:scale-95 transition-all cursor-pointer border border-white/20"
          title="Sincronizar com Google Sheets"
        >
          <Icon name="FileSpreadsheet" className="w-4 h-4 text-emerald-200" />
          <span className="hidden sm:inline">Google Sheets</span>
        </button>

        {/* Painel Geral Button */}
        <button
          onClick={() => {
            setActiveTab('editor');
            setIsOpen(true);
          }}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#5A4038] text-white text-xs font-semibold shadow-lg hover:bg-[#3E2B25] active:scale-95 transition-all cursor-pointer border border-white/20"
          title="Painel de Edição Rápida"
        >
          <Icon name="Edit3" className="w-4 h-4 text-[#C98F83]" />
          <span className="hidden sm:inline">Personalizar Página</span>
        </button>
      </div>

      {/* Editor Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs">
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />

          <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-5 custom-shadow z-10 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F2E7E0]">
              <div className="flex items-center gap-2">
                <Icon name="Settings" className="w-5 h-5 text-[#C98F83]" />
                <h3 className="text-base font-bold text-[#5A4038]">
                  Painel de Controle
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F5EAE4] text-[#5A4038] hover:bg-[#C98F83] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Icon name="X" className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex p-1 bg-[#F5EAE4] rounded-xl mb-4 text-xs font-bold">
              <button
                onClick={() => setActiveTab('editor')}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'editor' ? 'bg-white text-[#5A4038] shadow-xs' : 'text-[#8C6E65] hover:text-[#5A4038]'
                }`}
              >
                <Icon name="Edit3" className="w-3.5 h-3.5" />
                <span>Edição Manual & Fotos</span>
              </button>
              <button
                onClick={() => setActiveTab('sheets')}
                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'sheets' ? 'bg-white text-[#1E7E34] shadow-xs' : 'text-[#8C6E65] hover:text-[#1E7E34]'
                }`}
              >
                <Icon name="FileSpreadsheet" className="w-3.5 h-3.5" />
                <span>Google Sheets (Planilha)</span>
              </button>
            </div>

            {/* TAB 1: GOOGLE SHEETS SYNC */}
            {activeTab === 'sheets' && (
              <div className="space-y-4 text-xs animate-in fade-in-50">
                <div className="p-3.5 rounded-2xl bg-[#EBF7EE] border border-[#C3E6CB] text-[#1E7E34]">
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#28A745] animate-pulse" />
                    <span>Sincronização em Tempo Real via Planilha</span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#2F6F3E] leading-relaxed">
                    Você ou seu cliente alteram, adicionam e desativam itens direto na planilha do Google Sheets, sem precisar de banco de dados ou login!
                  </p>
                </div>

                {/* Input URL */}
                <div>
                  <label className="block font-bold text-[#5A4038] mb-1">
                    Link da Planilha (Publicada na Web em CSV)
                  </label>
                  <input
                    type="text"
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/e/.../pub?output=csv"
                    className="w-full p-2.5 rounded-xl border border-[#EADBD2] bg-[#FDFBF9] focus:outline-none focus:border-[#C98F83] font-mono text-xs"
                  />
                </div>

                {syncStatus && (
                  <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                    syncStatus.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    <Icon name={syncStatus.type === 'success' ? 'Check' : 'AlertCircle'} className="w-4 h-4 shrink-0" />
                    <span>{syncStatus.text}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSyncSheet}
                  disabled={isSyncing}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1E7E34] text-white hover:bg-[#166528] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Icon name="RefreshCw" className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar com a Planilha Agora'}</span>
                </button>

                {/* Ações de Download / Cópia do Modelo */}
                <div className="pt-3 border-t border-[#F2E7E0] space-y-2">
                  <h4 className="font-bold text-[#5A4038] text-[11px] uppercase tracking-wider">
                    Modelo Pronto para Você / Seu Cliente:
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleDownloadCsv}
                      className="p-2 rounded-xl bg-[#F5EAE4] hover:bg-[#EADBD2] text-[#5A4038] font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Icon name="Download" className="w-3.5 h-3.5 text-[#C98F83]" />
                      <span>Baixar CSV Pronto</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyTemplate}
                      className="p-2 rounded-xl bg-[#F5EAE4] hover:bg-[#EADBD2] text-[#5A4038] font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Icon name={copiedTemplate ? 'Check' : 'Copy'} className="w-3.5 h-3.5 text-[#C98F83]" />
                      <span>{copiedTemplate ? 'Copiado!' : 'Copiar Cabeçalhos'}</span>
                    </button>
                  </div>
                </div>

                {/* Guia Cloudinary */}
                <div className="p-3 rounded-xl bg-[#FDFBF9] border border-[#F5EAE4] space-y-1.5 text-[11px] text-[#8C6E65]">
                  <p className="font-bold text-[#5A4038] flex items-center gap-1">
                    <Icon name="Camera" className="w-3.5 h-3.5 text-[#C98F83]" />
                    <span>Como colocar fotos via Cloudinary:</span>
                  </p>
                  <p>1. Faça upload da foto no Cloudinary (<a href="https://cloudinary.com" target="_blank" rel="noreferrer" className="text-[#C98F83] underline">cloudinary.com</a>).</p>
                  <p>2. Copie a URL gerada (ex: <code className="text-[#C98F83]">https://res.cloudinary.com/...</code>).</p>
                  <p>3. Cole o link na coluna <strong>URL da Foto</strong> da sua planilha.</p>
                </div>
              </div>
            )}

            {/* TAB 2: MANUAL EDITOR & UPLOADS */}
            {activeTab === 'editor' && (
              <div className="space-y-4 text-xs animate-in fade-in-50">
                <p className="text-xs text-[#8C6E65]">
                  Faça upload de fotos diretamente do seu dispositivo ou edite as informações abaixo. As alterações são aplicadas instantaneamente!
                </p>

                {/* Nome */}
                <div>
                  <label className="block font-bold text-[#5A4038] mb-1">Nome da Profissional</label>
                  <input
                    type="text"
                    value={config.nome}
                    onChange={(e) => handleChange('nome', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#EADBD2] bg-[#FDFBF9] focus:outline-none focus:border-[#C98F83]"
                  />
                </div>

                {/* Profissão */}
                <div>
                  <label className="block font-bold text-[#5A4038] mb-1">Profissão / Título</label>
                  <input
                    type="text"
                    value={config.profissao}
                    onChange={(e) => handleChange('profissao', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#EADBD2] bg-[#FDFBF9] focus:outline-none focus:border-[#C98F83]"
                  />
                </div>

                {/* Frase */}
                <div>
                  <label className="block font-bold text-[#5A4038] mb-1">Frase / Slogan</label>
                  <input
                    type="text"
                    value={config.frase}
                    onChange={(e) => handleChange('frase', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#EADBD2] bg-[#FDFBF9] focus:outline-none focus:border-[#C98F83]"
                  />
                </div>

                {/* Contatos */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-[#5A4038] mb-1">WhatsApp (com DDD)</label>
                    <input
                      type="text"
                      value={config.whatsappNumber}
                      onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#EADBD2] bg-[#FDFBF9] focus:outline-none focus:border-[#C98F83]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#5A4038] mb-1">Instagram (@handle)</label>
                    <input
                      type="text"
                      value={config.instagramHandle}
                      onChange={(e) => handleChange('instagramHandle', e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#EADBD2] bg-[#FDFBF9] focus:outline-none focus:border-[#C98F83]"
                    />
                  </div>
                </div>

                {/* Imagens do Perfil com Uploader */}
                <div className="p-3 bg-[#FDFBF9] rounded-2xl border border-[#F5EAE4] space-y-3">
                  <h4 className="font-bold text-[#5A4038] flex items-center gap-1.5 text-xs">
                    <Icon name="Camera" className="w-4 h-4 text-[#C98F83]" />
                    <span>Fotos de Perfil e Capa</span>
                  </h4>

                  <ImageUploader
                    label="Foto de Perfil Circular"
                    currentValue={config.fotoPerfil}
                    onChange={(val) => handleChange('fotoPerfil', val)}
                    aspectRatio="square"
                  />

                  <ImageUploader
                    label="Foto de Capa do Cabeçalho"
                    currentValue={config.fotoCapa}
                    onChange={(val) => handleChange('fotoCapa', val)}
                    aspectRatio="banner"
                  />
                </div>

                {/* Tratamentos */}
                <div className="pt-2 border-t border-[#F2E7E0]">
                  <h4 className="font-bold text-[#5A4038] mb-2 flex items-center gap-1.5">
                    <Icon name="Sparkles" className="w-4 h-4 text-[#C98F83]" />
                    <span>Tratamentos & Fotos</span>
                  </h4>
                  <div className="space-y-3">
                    {config.tratamentos.map((t, idx) => (
                      <div key={t.id} className="p-3 rounded-2xl bg-[#FDFBF9] border border-[#F5EAE4] space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={t.name}
                            onChange={(e) => handleTreatmentChange(idx, 'name', e.target.value)}
                            placeholder="Nome do tratamento"
                            className="w-1/2 p-2 rounded-xl border border-[#EADBD2] text-xs font-bold bg-white"
                          />
                          <input
                            type="text"
                            value={t.description}
                            onChange={(e) => handleTreatmentChange(idx, 'description', e.target.value)}
                            placeholder="Descrição curta"
                            className="w-1/2 p-2 rounded-xl border border-[#EADBD2] text-xs bg-white"
                          />
                        </div>

                        <ImageUploader
                          label={`Foto do Tratamento (${t.name})`}
                          currentValue={t.image}
                          onChange={(val) => handleTreatmentChange(idx, 'image', val)}
                          aspectRatio="banner"
                        />

                        <div>
                          <label className="block text-[11px] font-medium text-[#8C6E65] mb-0.5">Link de Destino / WhatsApp</label>
                          <input
                            type="text"
                            value={t.link}
                            onChange={(e) => handleTreatmentChange(idx, 'link', e.target.value)}
                            placeholder="Link do tratamento / WhatsApp"
                            className="w-full p-2 rounded-xl border border-[#EADBD2] text-xs font-mono bg-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 flex items-center justify-between gap-2 border-t border-[#F2E7E0]">
                  <button
                    onClick={onResetConfig}
                    className="px-3 py-2 rounded-xl bg-[#F5EAE4] text-[#5A4038] hover:bg-[#EADBD2] font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Restaurar Padrão
                  </button>
                  <button
                    onClick={exportConfigCode}
                    className="px-4 py-2 rounded-xl bg-[#C98F83] text-white hover:bg-[#B67B6F] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Icon name={copiedCode ? 'Check' : 'Copy'} className="w-3.5 h-3.5" />
                    <span>{copiedCode ? 'Código Copiado!' : 'Copiar Config em TS'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
