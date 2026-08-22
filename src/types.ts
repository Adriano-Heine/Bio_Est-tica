export interface TreatmentItem {
  id: string;
  name: string;
  description: string;
  image: string;
  iconName: 'Sparkles' | 'Activity' | 'Zap' | 'Heart' | 'Smile' | 'Layers';
  link: string;
  duration?: string;
  indicativePrice?: string;
  benefits?: string[];
  fullDetails?: string;
}

export interface DifferentialItem {
  id: string;
  titleLine1: string;
  titleLine2: string;
  iconName: 'Sparkles' | 'Award' | 'Zap' | 'ShieldCheck' | 'CheckCircle2' | 'Heart';
}

export interface FooterMenuItem {
  id: 'localizacao' | 'horarios' | 'promocoes' | 'duvidas';
  label: string;
  iconName: 'MapPin' | 'Clock' | 'Tag' | 'HelpCircle';
  link: string;
  modalTitle: string;
}

export interface BioConfig {
  // Configuração Geral do Perfil
  nome: string;
  profissao: string;
  frase: string;
  fotoPerfil: string;
  fotoCapa: string;

  // Contatos e Redes Sociais
  whatsappNumber: string;
  whatsappMessage: string;
  whatsappLink: string;
  whatsappButtonSubtitle: string;

  instagramHandle: string;
  instagramLink: string;

  // Links do Menu Inferior
  localizacaoLink: string;
  horariosLink: string;
  promocoesLink: string;
  duvidasLink: string;

  // Dados Adicionais para Modais Informativos (Localização, Horários, etc)
  enderecoCompleto: string;
  googleMapsEmbedUrl?: string;
  horariosAtendimento: { dia: string; horario: string }[];
  promocoesAtivas: { titulo: string; descricao: string; dePor?: string }[];
  duvidasFrequentes: { pergunta: string; resposta: string }[];

  // Configuração de Sincronização com Google Sheets
  googleSheetUrl?: string;
  sheetSyncEnabled?: boolean;
  lastSyncTime?: string;

  // Lista de Diferenciais
  diferenciais: DifferentialItem[];

  // Lista de Tratamentos
  tratamentos: TreatmentItem[];
}
