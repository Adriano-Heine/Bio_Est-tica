import React, { useState, useRef } from 'react';
import { BioConfig } from '../types';
import { Icon } from './Icon';

interface QuickEditorDrawerProps {
  config: BioConfig;
  onUpdateConfig: (newConfig: BioConfig) => void;
  onResetConfig: () => void;
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
              {showUrlInput ? 'Ocultar Link' : 'Ou colar URL'}
            </button>
          </div>
        </div>
      </div>

      {showUrlInput && (
        <input
          type="text"
          value={currentValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Cole a URL da imagem..."
          className="w-full p-2 rounded-xl border border-[#EADBD2] bg-white text-xs text-[#5A4038] focus:outline-none focus:border-[#C98F83]"
        />
      )}
    </div>
  );
};

export const QuickEditorDrawer: React.FC<QuickEditorDrawerProps> = ({
  config,
  onUpdateConfig,
  onResetConfig
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

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

  const exportConfigCode = () => {
    const code = `export const BIO_CONFIG = ${JSON.stringify(config, null, 2)};`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#5A4038] text-white text-xs font-semibold shadow-lg hover:bg-[#3E2B25] active:scale-95 transition-all cursor-pointer border border-white/20"
        title="Painel de Edição Rápida"
      >
        <Icon name="Edit3" className="w-4 h-4 text-[#C98F83]" />
        <span className="hidden sm:inline">Personalizar Página</span>
      </button>

      {/* Editor Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs">
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />

          <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-5 custom-shadow z-10 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F2E7E0]">
              <div className="flex items-center gap-2">
                <Icon name="Settings" className="w-5 h-5 text-[#C98F83]" />
                <h3 className="text-base font-bold text-[#5A4038]">
                  Editor Rápido de Cliente
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F5EAE4] text-[#5A4038] hover:bg-[#C98F83] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Icon name="X" className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#8C6E65] mb-4">
              Faça upload de fotos diretamente do seu dispositivo ou edite as informações abaixo. As alterações são aplicadas instantaneamente!
            </p>

            <div className="space-y-4 text-xs">
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
          </div>
        </div>
      )}
    </>
  );
};
