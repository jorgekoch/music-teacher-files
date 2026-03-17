export type SeoPageEntry = {
  slug: string;
  title: string;
  description: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  sectionTitle: string;
  sectionParagraphs: string[];
  benefitsTitle: string;
  benefits: Array<{
    title: string;
    description: string;
  }>;
  ctaTitle: string;
  ctaDescription: string;
};

export const seoPages: SeoPageEntry[] = [
  {
    slug: "armazenar-pdf-online",
    title: "Armazenar PDF online | Arquivapp",
    description:
      "Armazene arquivos PDF online com mais organização e praticidade. Use o Arquivapp para guardar documentos e acessar conteúdos importantes na nuvem.",
    heroEyebrow: "PDFs online",
    heroTitle: "Como armazenar PDF online com mais organização",
    heroDescription:
      "Guardar arquivos PDF online ajuda a manter documentos acessíveis, organizados e mais fáceis de consultar no dia a dia.",
    sectionTitle: "Por que armazenar PDFs online",
    sectionParagraphs: [
      "Arquivos PDF costumam reunir contratos, apostilas, comprovantes e documentos importantes. Quando esses arquivos ficam espalhados em diferentes dispositivos, a organização se torna mais difícil.",
      "Ao armazenar PDFs online, você centraliza o acesso e reduz a bagunça. Isso facilita consultas, compartilhamento e organização por pastas."
    ],
    benefitsTitle: "Como o Arquivapp ajuda com arquivos PDF",
    benefits: [
      {
        title: "Pastas organizadas",
        description:
          "Separe PDFs por tema, cliente, estudo ou categoria."
      },
      {
        title: "Upload simples",
        description:
          "Envie seus arquivos PDF de forma prática para a nuvem."
      },
      {
        title: "Acesso rápido",
        description:
          "Encontre documentos importantes com mais facilidade."
      }
    ],
    ctaTitle: "Comece a organizar seus PDFs",
    ctaDescription:
      "Crie sua conta no Arquivapp e mantenha seus arquivos PDF organizados online."
  },
  {
    slug: "guardar-documentos-importantes-online",
    title: "Guardar documentos importantes online | Arquivapp",
    description:
      "Guarde documentos importantes online com mais segurança e organização. Centralize contratos, comprovantes e arquivos essenciais com o Arquivapp.",
    heroEyebrow: "Documentos importantes",
    heroTitle: "Como guardar documentos importantes online",
    heroDescription:
      "Manter documentos importantes em um só lugar ajuda a reduzir perdas, melhora a organização e facilita o acesso sempre que necessário.",
    sectionTitle: "Por que centralizar documentos importantes",
    sectionParagraphs: [
      "Contratos, comprovantes, registros e outros arquivos importantes precisam estar fáceis de localizar. Quando ficam espalhados, o risco de confusão aumenta.",
      "Guardar documentos online ajuda a manter uma estrutura mais clara e melhora a rotina de quem precisa acessar materiais com frequência."
    ],
    benefitsTitle: "Como o Arquivapp ajuda",
    benefits: [
      {
        title: "Centralização",
        description:
          "Tenha documentos importantes reunidos em um único espaço."
      },
      {
        title: "Organização por pastas",
        description:
          "Separe arquivos por tipo, período ou assunto."
      },
      {
        title: "Mais praticidade",
        description:
          "Consulte seus documentos sempre que precisar."
      }
    ],
    ctaTitle: "Guarde seus documentos com mais clareza",
    ctaDescription:
      "Use o Arquivapp para manter arquivos importantes organizados na nuvem."
  },
  {
    slug: "organizar-arquivos-de-trabalho",
    title: "Organizar arquivos de trabalho | Arquivapp",
    description:
      "Aprenda a organizar arquivos de trabalho de forma simples. Use o Arquivapp para centralizar documentos, contratos e materiais profissionais.",
    heroEyebrow: "Arquivos de trabalho",
    heroTitle: "Como organizar arquivos de trabalho com mais praticidade",
    heroDescription:
      "Uma estrutura clara de arquivos facilita a rotina profissional e reduz o tempo perdido procurando documentos.",
    sectionTitle: "Por que organizar arquivos de trabalho",
    sectionParagraphs: [
      "No dia a dia profissional, arquivos desorganizados geram retrabalho e dificultam a localização de documentos importantes.",
      "Criar uma estrutura de pastas e centralizar arquivos online ajuda a manter clareza e mais agilidade na rotina."
    ],
    benefitsTitle: "O que o Arquivapp oferece",
    benefits: [
      {
        title: "Pastas por cliente ou projeto",
        description:
          "Organize materiais de forma mais lógica e profissional."
      },
      {
        title: "Documentos centralizados",
        description:
          "Reduza a dispersão de arquivos em várias plataformas."
      },
      {
        title: "Consulta rápida",
        description:
          "Tenha acesso facilitado aos materiais do trabalho."
      }
    ],
    ctaTitle: "Organize seus arquivos profissionais",
    ctaDescription:
      "Crie sua conta e mantenha documentos de trabalho mais organizados com o Arquivapp."
  },
  {
    slug: "armazenar-contratos-online",
    title: "Armazenar contratos online | Arquivapp",
    description:
      "Armazene contratos online com mais organização e praticidade. Use o Arquivapp para manter documentos acessíveis e bem estruturados.",
    heroEyebrow: "Contratos online",
    heroTitle: "Como armazenar contratos online de forma organizada",
    heroDescription:
      "Guardar contratos em uma estrutura clara ajuda a manter documentos mais acessíveis e fáceis de consultar.",
    sectionTitle: "Por que armazenar contratos online",
    sectionParagraphs: [
      "Contratos precisam estar disponíveis quando você precisa consultar cláusulas, prazos ou versões de documentos.",
      "Ao armazenar contratos online em pastas organizadas, você melhora o controle e reduz a confusão com arquivos dispersos."
    ],
    benefitsTitle: "Como o Arquivapp ajuda com contratos",
    benefits: [
      {
        title: "Organização por categoria",
        description:
          "Separe contratos por cliente, tema ou período."
      },
      {
        title: "Acesso centralizado",
        description:
          "Consulte contratos em um único ambiente."
      },
      {
        title: "Mais praticidade",
        description:
          "Reduza o tempo gasto procurando documentos."
      }
    ],
    ctaTitle: "Guarde seus contratos na nuvem",
    ctaDescription:
      "Crie sua conta e organize contratos com mais facilidade no Arquivapp."
  },
  {
    slug: "compartilhar-documentos-online",
    title: "Compartilhar documentos online | Arquivapp",
    description:
      "Compartilhe documentos online com mais organização. Use o Arquivapp para centralizar arquivos e facilitar o acesso a conteúdos importantes.",
    heroEyebrow: "Compartilhamento online",
    heroTitle: "Como compartilhar documentos online de forma mais organizada",
    heroDescription:
      "Centralizar documentos e estruturar arquivos em pastas facilita o compartilhamento e melhora a clareza das informações.",
    sectionTitle: "Por que compartilhar documentos online",
    sectionParagraphs: [
      "Compartilhar arquivos de forma organizada ajuda a evitar confusão e melhora a experiência de quem recebe os materiais.",
      "Quando os documentos estão centralizados, fica mais fácil consultar, reutilizar e manter uma rotina mais clara."
    ],
    benefitsTitle: "Como o Arquivapp ajuda no compartilhamento",
    benefits: [
      {
        title: "Estrutura mais clara",
        description:
          "Compartilhe documentos a partir de uma organização por pastas."
      },
      {
        title: "Acesso mais fácil",
        description:
          "Facilite a consulta a materiais importantes."
      },
      {
        title: "Menos bagunça",
        description:
          "Reduza o envio de vários arquivos soltos."
      }
    ],
    ctaTitle: "Compartilhe documentos com mais clareza",
    ctaDescription:
      "Use o Arquivapp para manter seus documentos mais organizados e acessíveis."
  }
];