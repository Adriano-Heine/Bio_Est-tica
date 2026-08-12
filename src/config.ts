import { BioConfig } from './types';

/* ==========================================================================
   CONFIGURAÇÃO DA PÁGINA "LINK NA BIO"
   Edite as variáveis abaixo para personalizar a página do seu cliente.
   ========================================================================== */

export const BIO_CONFIG: BioConfig = {
  // 1. INFORMAÇÕES DO PERFIL
  nome: "Juliana Mendes",
  profissao: "ESTETICISTA",
  frase: "Realçando sua melhor versão",
  
  // Imagens (substitua por URLs das fotos do seu cliente)
  fotoPerfil: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
  fotoCapa: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",

  // 2. WHATSAPP & CONTATO
  whatsappNumber: "5511999999999",
  whatsappMessage: "Olá Juliana! Gostaria de agendar um horário na clínica.",
  whatsappLink: "https://wa.me/5511999999999?text=Ol%C3%A1%20Juliana!%20Gostaria%20de%20agendar%20um%20hor%C3%A1rio.",
  whatsappButtonSubtitle: "Agende seu horário",

  // 3. INSTAGRAM
  instagramHandle: "@julianamendes.estetica",
  instagramLink: "https://instagram.com/julianamendes.estetica",

  // 4. LINKS DO MENU INFERIOR
  localizacaoLink: "https://maps.google.com/?q=Av.+Paulista,+1000+-+Bela+Vista,+S%C3%A3o+Paulo+-+SP",
  horariosLink: "#horarios",
  promocoesLink: "#promocoes",
  duvidasLink: "#duvidas",

  // 5. CONTEÚDO ADICIONAL DOS MODAIS (LOCALIZAÇÃO, HORÁRIOS, PROMOÇÕES, DÚVIDAS)
  enderecoCompleto: "Av. Paulista, 1000 - Cj. 42 (Bela Vista) - São Paulo, SP",
  horariosAtendimento: [
    { dia: "Segunda a Sexta", horario: "08:00 às 20:00" },
    { dia: "Sábado", horario: "08:00 às 16:00" },
    { dia: "Domingo e Feriados", horario: "Fechado" }
  ],
  promocoesAtivas: [
    {
      titulo: "Combo Limpeza de Pele Ouro",
      descricao: "Limpeza profunda com hidratação de alta tecnologia + peeling de diamante.",
      dePor: "De R$ 280,00 por R$ 199,00"
    },
    {
      titulo: "Pacote Drenagem Linfática (4 Sessões)",
      descricao: "Protocolo exclusivo para redução de inchaço e retenção de líquidos.",
      dePor: "De R$ 480,00 por R$ 380,00"
    }
  ],
  duvidasFrequentes: [
    {
      pergunta: "Como funciona o agendamento?",
      resposta: "Você clica no botão do WhatsApp, nos diz qual procedimento deseja e verificamos a melhor data para você."
    },
    {
      pergunta: "Quais são as formas de pagamento?",
      resposta: "Aceitamos Pix, cartões de crédito em até 6x sem juros e débito."
    },
    {
      pergunta: "É necessário avaliação prévia?",
      resposta: "Para a maioria dos procedimentos sim, a primeira avaliação é personalizada para entender as necessidades da sua pele."
    }
  ],

  // 6. DIFERENCIAIS (4 ITENS HORIZONTAIS)
  diferenciais: [
    {
      id: "dif-1",
      titleLine1: "ATENDIMENTO",
      titleLine2: "PERSONALIZADO",
      iconName: "Heart"
    },
    {
      id: "dif-2",
      titleLine1: "PRODUTOS",
      titleLine2: "PREMIUM",
      iconName: "Award"
    },
    {
      id: "dif-3",
      titleLine1: "TECNOLOGIA",
      titleLine2: "AVANÇADA",
      iconName: "Zap"
    },
    {
      id: "dif-4",
      titleLine1: "RESULTADOS",
      titleLine2: "REAIS",
      iconName: "CheckCircle2"
    }
  ],

  // 7. LISTA DE TRATAMENTOS (CARTÕES)
  tratamentos: [
    {
      id: "tratamento-faciais",
      name: "TRATAMENTOS FACIAIS",
      description: "Limpeza de pele, rejuvenescimento, peelings e muito mais.",
      image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80",
      iconName: "Sparkles",
      link: "https://wa.me/5511999999999?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20Tratamentos%20Faciais.",
      duration: "60 a 90 min",
      benefits: ["Limpeza profunda de poros", "Estímulo natural de colágeno", "Suavização de linhas finas"],
      fullDetails: "Cuidados personalizados para a sua pele, unindo tecnologia de ponta, cosmetologia avançada e massagem lifting revitalizante."
    },
    {
      id: "tratamento-corporais",
      name: "TRATAMENTOS CORPORAIS",
      description: "Drenagem, modelagem, redução de medidas e celulite.",
      image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=600&q=80",
      iconName: "Activity",
      link: "https://wa.me/5511999999999?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20Tratamentos%20Corporais.",
      duration: "50 min por sessão",
      benefits: ["Redução de retenção e inchaço", "Melhora do contorno corporal", "Estímulo da circulação"],
      fullDetails: "Protocolos integrados com massagem drenante e tecnologias firmadoras para contornos definidos e pele uniforme."
    },
    {
      id: "tratamento-laser",
      name: "DEPILAÇÃO A LASER",
      description: "Mais conforto, segurança e resultados duradouros.",
      image: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=600&q=80",
      iconName: "Zap",
      link: "https://wa.me/5511999999999?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20Depila%C3%A7%C3%A3o%20a%20Laser.",
      duration: "15 a 45 min",
      benefits: ["Ponteira ultra resfriada e indolor", "Eficaz em diversos fototipos", "Eliminação definitiva de pelos"],
      fullDetails: "Tecnologia a laser de diodo de última geração, garantindo aplicação segura, rápida e extremamente confortável."
    },
    {
      id: "tratamento-massagens",
      name: "MASSAGENS",
      description: "Relaxamento, terapêuticas e revigorantes.",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80",
      iconName: "Smile",
      link: "https://wa.me/5511999999999?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20Massagens.",
      duration: "60 min",
      benefits: ["Alívio imediato do estresse", "Relaxamento muscular profundo", "Aromaterapia relaxante"],
      fullDetails: "Técnicas manuais exclusivas com óleos essenciais puros, proporcionando equilíbrio corporal e mental."
    }
  ]
};
