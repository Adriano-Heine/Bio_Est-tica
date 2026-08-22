import { BioConfig, TreatmentItem, DifferentialItem } from '../types';

/**
 * Utilitário de tratamento de imagens (Cloudinary, Google Drive, Dropbox, etc.)
 */
export function normalizeImageUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Google Drive conversion (garante que links do drive funcionem como imagem direta)
  const gDriveMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/id=([a-zA-Z0-9_-]+)/);
  if (gDriveMatch && gDriveMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${gDriveMatch[1]}`;
  }

  // Dropbox conversion
  if (trimmed.includes('dropbox.com')) {
    return trimmed.replace('dl=0', 'raw=1');
  }

  // Cloudinary: URLs já são diretas e perfeitas
  return trimmed;
}

/**
 * Normaliza links de WhatsApp para wa.me com DDD
 */
export function normalizeWhatsAppLink(phone: string, defaultMsg: string = ''): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  // Se não tiver DDI (menos de 12 dígitos para o Brasil), adiciona 55
  const fullPhone = digits.length <= 11 ? `55${digits}` : digits;
  const msgParam = defaultMsg ? `?text=${encodeURIComponent(defaultMsg)}` : '';
  return `https://wa.me/${fullPhone}${msgParam}`;
}

/**
 * Converte qualquer link de planilha do Google Sheets em link direto CSV
 */
export function getDirectCsvUrl(url: string, sheetGid?: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Se já for link direto de CSV publicado
  if (trimmed.includes('output=csv')) {
    return trimmed;
  }

  // Se for link publicado no formato /pubhtml
  if (trimmed.includes('/pubhtml')) {
    return trimmed.replace('/pubhtml', '/pub?output=csv');
  }

  // Se for link de edição normal (ex: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit#gid=0)
  const sheetIdMatch = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (sheetIdMatch && sheetIdMatch[1]) {
    const sheetId = sheetIdMatch[1];
    const gidMatch = trimmed.match(/gid=([0-9]+)/);
    const gid = sheetGid || (gidMatch ? gidMatch[1] : '0');
    return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}`;
  }

  return trimmed;
}

/**
 * Parser de CSV robusto (suporta aspas, vírgulas, ponto-e-vírgula e quebras de linha)
 */
export function parseCsv(csvText: string): string[][] {
  const cleanText = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const rows: string[][] = [];
  
  // Detecta se o separador principal é ';' ou ','
  const firstLine = cleanText.split('\n')[0] || '';
  const semicolonCount = (firstLine.match(/;/g) || []).length;
  const commaCount = (firstLine.match(/,/g) || []).length;
  const delimiter = semicolonCount > commaCount ? ';' : ',';

  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuotes = false;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // pula aspa escapada
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === delimiter && !insideQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if (char === '\n' && !insideQuotes) {
      currentRow.push(currentCell.trim());
      if (currentRow.some(c => c.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  // Última linha
  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some(c => c.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Normaliza nomes de colunas (remove acentos, espaços e deixa minúsculo)
 */
function normalizeHeader(header: string): string {
  return header
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Converte dados do CSV em configuração do BioConfig
 */
export function convertCsvToBioConfig(rows: string[][], currentConfig: BioConfig): Partial<BioConfig> {
  if (!rows || rows.length < 2) return {};

  const headers = rows[0].map(normalizeHeader);
  const dataRows = rows.slice(1);

  // Modo 1: Planilha Chave / Valor (ex: Coluna A = Campo, Coluna B = Valor)
  const isKeyValue = headers.some(h => h.includes('chave') || h.includes('campo') || h.includes('propriedade')) &&
                     headers.some(h => h.includes('valor') || h.includes('conteudo'));

  if (isKeyValue) {
    const keyCol = headers.findIndex(h => h.includes('chave') || h.includes('campo') || h.includes('propriedade'));
    const valCol = headers.findIndex(h => h.includes('valor') || h.includes('conteudo'));

    const kvUpdates: Partial<BioConfig> = {};
    dataRows.forEach(row => {
      const key = normalizeHeader(row[keyCol] || '');
      const val = (row[valCol] || '').trim();
      if (!key || !val) return;

      if (key.includes('nome')) kvUpdates.nome = val;
      else if (key.includes('profissao') || key.includes('cargo') || key.includes('titulo')) kvUpdates.profissao = val;
      else if (key.includes('frase') || key.includes('slogan')) kvUpdates.frase = val;
      else if (key.includes('fotoperfil') || key.includes('avatar') || key.includes('foto')) kvUpdates.fotoPerfil = normalizeImageUrl(val);
      else if (key.includes('fotocapa') || key.includes('capa') || key.includes('banner')) kvUpdates.fotoCapa = normalizeImageUrl(val);
      else if (key.includes('whatsapp') || key.includes('telefone') || key.includes('celular')) {
        kvUpdates.whatsappNumber = val.replace(/\D/g, '');
        kvUpdates.whatsappLink = normalizeWhatsAppLink(val, currentConfig.whatsappMessage);
      }
      else if (key.includes('instagram')) {
        kvUpdates.instagramHandle = val.startsWith('@') ? val : `@${val}`;
        kvUpdates.instagramLink = `https://instagram.com/${val.replace('@', '')}`;
      }
      else if (key.includes('endereco') || key.includes('localizacao')) kvUpdates.enderecoCompleto = val;
    });

    return kvUpdates;
  }

  // Modo 2: Planilha de Tratamentos / Serviços / Imóveis em Linhas
  // Colunas esperadas: ordem, titulo/nome, descricao, foto/imagem, link/whatsapp, ativo, duracao
  const titleCol = headers.findIndex(h => h.includes('titulo') || h.includes('nome') || h.includes('servico') || h.includes('tratamento') || h.includes('imovel'));
  const descCol = headers.findIndex(h => h.includes('descricao') || h.includes('detalhes') || h.includes('subtitulo') || h.includes('texto'));
  const imageCol = headers.findIndex(h => h.includes('foto') || h.includes('imagem') || h.includes('url') || h.includes('cloudinary') || h.includes('img'));
  const linkCol = headers.findIndex(h => h.includes('link') || h.includes('whatsapp') || h.includes('urlanuncio') || h.includes('destino'));
  const activeCol = headers.findIndex(h => h.includes('ativo') || h.includes('status') || h.includes('visivel') || h.includes('publicar'));
  const durationCol = headers.findIndex(h => h.includes('duracao') || h.includes('tempo') || h.includes('preco') || h.includes('valor'));

  if (titleCol !== -1) {
    const tratamentos: TreatmentItem[] = [];
    const iconNames: TreatmentItem['iconName'][] = ['Sparkles', 'Activity', 'Zap', 'Smile', 'Heart', 'Layers'];

    dataRows.forEach((row, index) => {
      const name = row[titleCol]?.trim();
      if (!name) return;

      // Verifica status ativo (Sim / Não)
      if (activeCol !== -1) {
        const activeVal = normalizeHeader(row[activeCol] || '');
        if (activeVal === 'nao' || activeVal === 'no' || activeVal === 'false' || activeVal === '0' || activeVal === 'desativado') {
          return; // ignora item inativo
        }
      }

      const description = descCol !== -1 ? row[descCol]?.trim() || '' : '';
      const rawImage = imageCol !== -1 ? row[imageCol]?.trim() : '';
      const image = normalizeImageUrl(rawImage) || currentConfig.tratamentos[index % currentConfig.tratamentos.length]?.image || '';
      
      let link = linkCol !== -1 ? row[linkCol]?.trim() : '';
      if (!link) {
        // Gera link padrão de WhatsApp para o tratamento
        link = `https://wa.me/${currentConfig.whatsappNumber}?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20${encodeURIComponent(name)}.`;
      } else if (link.startsWith('55') || /^\d+$/.test(link.replace(/\D/g, ''))) {
        link = normalizeWhatsAppLink(link, `Olá! Gostaria de agendar: ${name}`);
      }

      const duration = durationCol !== -1 ? row[durationCol]?.trim() : '60 min';

      tratamentos.push({
        id: `sheet-item-${index + 1}`,
        name,
        description,
        image,
        iconName: iconNames[index % iconNames.length],
        link,
        duration: duration || '60 min',
        fullDetails: description
      });
    });

    if (tratamentos.length > 0) {
      return { tratamentos };
    }
  }

  // Modo 3: Planilha com 1 linha de Perfil (Colunas: Nome, Profissao, Frase, WhatsApp, Instagram, etc)
  const profileUpdates: Partial<BioConfig> = {};
  const firstData = dataRows[0];

  headers.forEach((h, colIdx) => {
    const val = (firstData[colIdx] || '').trim();
    if (!val) return;

    if (h.includes('nome') && !h.includes('tratamento')) profileUpdates.nome = val;
    else if (h.includes('profissao') || h.includes('cargo')) profileUpdates.profissao = val;
    else if (h.includes('frase') || h.includes('slogan')) profileUpdates.frase = val;
    else if (h.includes('fotoperfil') || h.includes('avatar')) profileUpdates.fotoPerfil = normalizeImageUrl(val);
    else if (h.includes('fotocapa') || h.includes('capa')) profileUpdates.fotoCapa = normalizeImageUrl(val);
    else if (h.includes('whatsapp') || h.includes('celular')) {
      profileUpdates.whatsappNumber = val.replace(/\D/g, '');
      profileUpdates.whatsappLink = normalizeWhatsAppLink(val, currentConfig.whatsappMessage);
    }
    else if (h.includes('instagram')) {
      profileUpdates.instagramHandle = val.startsWith('@') ? val : `@${val}`;
      profileUpdates.instagramLink = `https://instagram.com/${val.replace('@', '')}`;
    }
    else if (h.includes('endereco') || h.includes('localizacao')) profileUpdates.enderecoCompleto = val;
  });

  return profileUpdates;
}

/**
 * Busca dados da planilha do Google Sheets via fetch
 */
export async function syncWithGoogleSheet(url: string, currentConfig: BioConfig): Promise<BioConfig> {
  const directCsvUrl = getDirectCsvUrl(url);
  if (!directCsvUrl) {
    throw new Error('URL da planilha inválida ou vazia.');
  }

  // Adiciona timestamp para evitar cache do navegador na busca
  const cacheBuster = directCsvUrl.includes('?') ? `&_t=${Date.now()}` : `?_t=${Date.now()}`;
  const fetchUrl = `${directCsvUrl}${cacheBuster}`;

  const response = await fetch(fetchUrl);
  if (!response.ok) {
    throw new Error(`Não foi possível carregar a planilha (Status: ${response.status}). Verifique se ela foi publicada na web em formato CSV.`);
  }

  const csvText = await response.text();
  const rows = parseCsv(csvText);

  if (rows.length < 2) {
    throw new Error('A planilha está vazia ou sem linhas de dados.');
  }

  const updates = convertCsvToBioConfig(rows, currentConfig);
  
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const mergedConfig: BioConfig = {
    ...currentConfig,
    ...updates,
    googleSheetUrl: url,
    sheetSyncEnabled: true,
    lastSyncTime: timeStr
  };

  // Salva no localStorage para persistência imediata
  try {
    localStorage.setItem('bio_sheet_config', JSON.stringify(mergedConfig));
    localStorage.setItem('bio_sheet_url', url);
  } catch (e) {
    console.warn('LocalStorage indisponível', e);
  }

  return mergedConfig;
}

/**
 * Retorna modelo de exemplo de CSV para download/cópia
 */
export function getExampleSheetCsvTemplate(): string {
  return `Ordem,Título,Descrição,URL da Foto (Cloudinary/Drive),Link do WhatsApp/Anúncio,Ativo,Duração
1,TRATAMENTOS FACIAIS,"Limpeza de pele, rejuvenescimento e peelings.",https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80,https://wa.me/5511999999999?text=Agendar+Facial,Sim,60 min
2,TRATAMENTOS CORPORAIS,"Drenagem linfática, modelagem e redução de medidas.",https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=600&q=80,https://wa.me/5511999999999?text=Agendar+Corporal,Sim,50 min
3,DEPILAÇÃO A LASER,"Tecnologia indolor, conforto e resultados duradouros.",https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=600&q=80,https://wa.me/5511999999999?text=Agendar+Laser,Sim,30 min
4,MASSAGENS RELAXANTES,"Relaxamento muscular profundo e aromaterapia.",https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80,https://wa.me/5511999999999?text=Agendar+Massagem,Sim,60 min`;
}
