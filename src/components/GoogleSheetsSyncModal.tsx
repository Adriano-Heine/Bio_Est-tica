import React, { useState } from 'react';
import { BioConfig } from '../types';
import { Icon } from './Icon';
import { syncWithGoogleSheet, getExampleSheetCsvTemplate } from '../services/sheetSync';

interface GoogleSheetsSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BioConfig;
  onUpdateConfig: (newConfig: BioConfig) => void;
}

export const GoogleSheetsSyncModal: React.FC<GoogleSheetsSyncModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig
}) => {
  const [sheetUrl, setSheetUrl] = useState(config.googleSheetUrl || '');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  if (!isOpen) return null;

  const handleSync = async () => {
    if (!sheetUrl.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Por favor, insira o link da planilha do Google Sheets publicada em formato CSV.'
      });
      return;
    }

    setIsLoading(true);
    setStatusMessage({ type: 'info', text: 'Buscando e processando dados da planilha...' });

    try {
      const updatedConfig = await syncWithGoogleSheet(sheetUrl.trim(), config);
      onUpdateConfig(updatedConfig);
      setStatusMessage({
        type: 'success',
        text: `Sincronização concluída com sucesso! ${updatedConfig.tratamentos.length} tratamentos carregados.`
      });
    } catch (err: any) {
      console.error(err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Falha ao sincronizar com a planilha. Verifique as instruções abaixo.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCsvTemplate = () => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 custom-shadow z-10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F2E7E0]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#EBF7EE] text-[#1E7E34] flex items-center justify-center">
              <Icon name="FileSpreadsheet" className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#5A4038]">
                Sincronização Google Sheets
              </h3>
              <p className="text-[11px] text-[#8C6E65]">Sem banco de dados, sem login e sem custos</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F5EAE4] text-[#5A4038] hover:bg-[#C98F83] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <Icon name="X" className="w-4 h-4" />
          </button>
        </div>

        {/* Status Atual */}
        <div className="p-3 rounded-2xl bg-[#FDFBF9] border border-[#F2E7E0] mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className={`w-2.5 h-2.5 rounded-full ${config.sheetSyncEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-stone-300'}`} />
            <span className="font-semibold text-[#5A4038]">
              {config.sheetSyncEnabled ? 'Planilha Conectada e Ativa' : 'Modo Manual / Desconectado'}
            </span>
          </div>
          {config.lastSyncTime && (
            <span className="text-[10px] text-[#8C6E65] bg-[#F5EAE4] px-2 py-0.5 rounded-md font-medium">
              Atualizado: {config.lastSyncTime}
            </span>
          )}
        </div>

        {/* Campo de URL da Planilha */}
        <div className="space-y-2 mb-4">
          <label className="block text-xs font-bold text-[#5A4038]">
            Link da Planilha (Publicada na Web em CSV ou Link do Sheets)
          </label>
          <div className="relative">
            <input
              type="text"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/e/.../pub?output=csv"
              className="w-full p-3 rounded-xl border border-[#EADBD2] bg-[#FDFBF9] text-xs text-[#5A4038] focus:outline-none focus:border-[#C98F83] font-mono pr-10"
            />
            {sheetUrl && (
              <button
                type="button"
                onClick={() => setSheetUrl('')}
                className="absolute right-3 top-3 text-[#A08177] hover:text-[#5A4038]"
              >
                <Icon name="X" className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Mensagem de Feedback */}
        {statusMessage && (
          <div className={`p-3 rounded-xl text-xs mb-4 flex items-start gap-2 ${
            statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
            statusMessage.type === 'error' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
            'bg-amber-50 text-amber-800 border border-amber-200'
          }`}>
            <Icon
              name={statusMessage.type === 'success' ? 'Check' : 'AlertCircle'}
              className="w-4 h-4 shrink-0 mt-0.5"
            />
            <span className="flex-1">{statusMessage.text}</span>
          </div>
        )}

        {/* Botão de Ação de Sincronizar */}
        <button
          onClick={handleSync}
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl bg-[#C98F83] text-white hover:bg-[#B67B6F] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50 mb-5"
        >
          <Icon name="RefreshCw" className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Sincronizando...' : 'Sincronizar com a Planilha Agora'}</span>
        </button>

        {/* Modelos e Recursos Prontos */}
        <div className="pt-3 border-t border-[#F2E7E0] space-y-3">
          <h4 className="text-xs font-bold text-[#5A4038] flex items-center gap-1.5">
            <Icon name="Download" className="w-3.5 h-3.5 text-[#C98F83]" />
            <span>Modelo Pronto para Você / Seu Cliente</span>
          </h4>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDownloadCsvTemplate}
              className="p-2.5 rounded-xl bg-[#F5EAE4] hover:bg-[#EADBD2] text-[#5A4038] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Icon name="Download" className="w-3.5 h-3.5 text-[#C98F83]" />
              <span>Baixar Modelo .CSV</span>
            </button>

            <button
              type="button"
              onClick={handleCopyTemplate}
              className="p-2.5 rounded-xl bg-[#F5EAE4] hover:bg-[#EADBD2] text-[#5A4038] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Icon name={copiedTemplate ? 'Check' : 'Copy'} className="w-3.5 h-3.5 text-[#C98F83]" />
              <span>{copiedTemplate ? 'Copiado!' : 'Copiar Cabeçalhos'}</span>
            </button>
          </div>

          {/* Passo a Passo Didático */}
          <div className="bg-[#FDFBF9] p-3.5 rounded-2xl border border-[#F5EAE4] text-xs text-[#8C6E65] space-y-2">
            <h5 className="font-bold text-[#5A4038] text-[11px] uppercase tracking-wider">
              Como Publicar sua Planilha em 3 Passos:
            </h5>
            <ol className="list-decimal pl-4 space-y-1.5 text-[11px] leading-relaxed">
              <li>
                No Google Sheets, monte a tabela com as colunas: <br/>
                <code className="text-[#C98F83] font-mono font-semibold">Ordem, Título, Descrição, URL da Foto, Link do WhatsApp, Ativo, Duração</code>
              </li>
              <li>
                Clique em <strong>Arquivo</strong> &gt; <strong>Compartilhar</strong> &gt; <strong>Publicar na Web</strong>.
              </li>
              <li>
                Escolha o formato <strong>Valores separados por vírgula (.csv)</strong>, clique em <strong>Publicar</strong>, copie o link e cole aqui!
              </li>
            </ol>
            <div className="pt-2 border-t border-[#F2E7E0] text-[11px]">
              <span className="font-bold text-[#5A4038]">📸 Imagens com Cloudinary:</span> Basta subir a foto no Cloudinary, copiar o link direto (<code className="text-[#C98F83]">https://res.cloudinary.com/...</code>) e colar na coluna <em>URL da Foto</em> da planilha.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
