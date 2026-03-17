export type UseCasePageEntry = {
  slug: string;
  title: string;
  description: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  problemTitle: string;
  problemParagraphs: string[];
  solutionTitle: string;
  solutions: Array<{
    title: string;
    description: string;
  }>;
  audienceTitle: string;
  audienceParagraphs: string[];
  ctaTitle: string;
  ctaDescription: string;
};

export const useCasePages: UseCasePageEntry[] = [
  {
    slug: "arquivos-para-estudantes",
    title: "Organização de arquivos para estudantes | Arquivapp",
    description:
      "Organize arquivos de estudo com mais praticidade. Guarde apostilas, PDFs, exercícios e materiais acadêmicos com o Arquivapp.",
    heroEyebrow: "Para estudantes",
    heroTitle: "Como organizar arquivos de estudo com mais praticidade",
    heroDescription:
      "Apostilas, PDFs, exercícios e materiais de aula podem se acumular rapidamente. O Arquivapp ajuda estudantes a manter tudo organizado em um só lugar.",
    problemTitle: "O desafio de organizar materiais de estudo",
    problemParagraphs: [
      "Quando arquivos de estudo ficam espalhados entre computador, celular, downloads e aplicativos diferentes, encontrar um material importante pode se tornar cansativo.",
      "Ter uma estrutura clara para organizar conteúdos ajuda a estudar melhor, economizar tempo e manter materiais sempre acessíveis."
    ],
    solutionTitle: "Como o Arquivapp ajuda estudantes",
    solutions: [
      {
        title: "Pastas por disciplina",
        description:
          "Separe conteúdos por matéria, semestre ou tema de estudo."
      },
      {
        title: "PDFs e apostilas centralizados",
        description:
          "Guarde materiais importantes em um único espaço."
      },
      {
        title: "Mais praticidade no dia a dia",
        description:
          "Acesse arquivos de estudo com mais clareza e organização."
      }
    ],
    audienceTitle: "Ideal para rotina acadêmica",
    audienceParagraphs: [
      "O Arquivapp pode ajudar estudantes que lidam com grande volume de PDFs, apostilas, resumos, anotações e exercícios.",
      "Com uma organização melhor, fica mais fácil revisar conteúdos, manter materiais separados e reduzir a bagunça digital."
    ],
    ctaTitle: "Organize seus materiais de estudo",
    ctaDescription:
      "Crie sua conta e mantenha seus arquivos acadêmicos mais organizados com o Arquivapp."
  },
  {
    slug: "documentos-para-pequenos-negocios",
    title: "Documentos para pequenos negócios | Arquivapp",
    description:
      "Organize documentos de pequenos negócios com mais clareza. Guarde contratos, comprovantes e arquivos de trabalho no Arquivapp.",
    heroEyebrow: "Para pequenos negócios",
    heroTitle: "Como organizar documentos de pequenos negócios",
    heroDescription:
      "Pequenos negócios lidam com contratos, comprovantes, propostas e arquivos importantes. O Arquivapp ajuda a centralizar tudo de forma mais clara.",
    problemTitle: "Desorganização custa tempo",
    problemParagraphs: [
      "Quando documentos ficam espalhados em vários dispositivos ou conversas, a rotina do negócio se torna mais confusa.",
      "Ter um lugar único para guardar arquivos importantes melhora a organização e reduz o retrabalho."
    ],
    solutionTitle: "Como o Arquivapp pode ajudar",
    solutions: [
      {
        title: "Pastas por cliente ou assunto",
        description:
          "Organize arquivos por categoria e mantenha tudo mais estruturado."
      },
      {
        title: "Centralização de documentos",
        description:
          "Guarde contratos, comprovantes e materiais em um único ambiente."
      },
      {
        title: "Mais facilidade para consultar",
        description:
          "Encontre documentos importantes com menos esforço."
      }
    ],
    audienceTitle: "Ideal para negócios em crescimento",
    audienceParagraphs: [
      "Pequenos negócios se beneficiam muito de uma rotina digital mais organizada, especialmente quando o volume de documentos começa a crescer.",
      "Com uma estrutura simples, o Arquivapp ajuda a manter clareza e controle sobre arquivos importantes."
    ],
    ctaTitle: "Organize os arquivos do seu negócio",
    ctaDescription:
      "Use o Arquivapp para centralizar documentos e melhorar a organização da sua rotina."
  },
  {
    slug: "guardar-contratos-de-clientes",
    title: "Guardar contratos de clientes | Arquivapp",
    description:
      "Guarde contratos de clientes com mais organização. Centralize documentos importantes e consulte arquivos com mais facilidade no Arquivapp.",
    heroEyebrow: "Para autônomos e profissionais",
    heroTitle: "Como guardar contratos de clientes de forma organizada",
    heroDescription:
      "Contratos precisam estar acessíveis e bem organizados. O Arquivapp ajuda a guardar arquivos de clientes de maneira mais clara e prática.",
    problemTitle: "Por que organizar contratos de clientes",
    problemParagraphs: [
      "Profissionais autônomos e prestadores de serviço costumam lidar com contratos, propostas e documentos que precisam ser consultados com frequência.",
      "Uma estrutura de organização melhor ajuda a reduzir perda de tempo e melhora o controle sobre documentos importantes."
    ],
    solutionTitle: "Como o Arquivapp ajuda nessa rotina",
    solutions: [
      {
        title: "Pastas por cliente",
        description:
          "Separe contratos e documentos por cliente ou projeto."
      },
      {
        title: "Arquivos centralizados",
        description:
          "Mantenha tudo em um lugar fácil de acessar."
      },
      {
        title: "Consulta mais simples",
        description:
          "Localize contratos com mais clareza quando precisar."
      }
    ],
    audienceTitle: "Ideal para quem atende clientes",
    audienceParagraphs: [
      "Autônomos, freelancers e pequenos prestadores de serviço podem usar o Arquivapp para manter arquivos importantes mais organizados.",
      "Isso ajuda a dar mais clareza à rotina e melhora a organização profissional."
    ],
    ctaTitle: "Organize contratos e documentos de clientes",
    ctaDescription:
      "Crie sua conta no Arquivapp e mantenha contratos mais acessíveis e organizados."
  },
  {
    slug: "organizar-materiais-de-estudo",
    title: "Organizar materiais de estudo | Arquivapp",
    description:
      "Organize materiais de estudo online com mais praticidade. Guarde apostilas, exercícios, PDFs e resumos com o Arquivapp.",
    heroEyebrow: "Materiais de estudo",
    heroTitle: "Como organizar materiais de estudo online",
    heroDescription:
      "Manter materiais de estudo espalhados dificulta a rotina. O Arquivapp ajuda a organizar PDFs, apostilas e conteúdos em um só lugar.",
    problemTitle: "Por que estudantes acumulam bagunça digital",
    problemParagraphs: [
      "Ao longo do tempo, materiais de estudo acabam se acumulando em várias pastas, aplicativos e dispositivos.",
      "Organizar esses arquivos em uma estrutura clara ajuda a estudar com mais foco e menos frustração."
    ],
    solutionTitle: "O que o Arquivapp oferece",
    solutions: [
      {
        title: "Pastas organizadas",
        description:
          "Separe arquivos por disciplina, prova ou tema."
      },
      {
        title: "Centralização de PDFs",
        description:
          "Mantenha materiais importantes em um só ambiente."
      },
      {
        title: "Acesso facilitado",
        description:
          "Reduza o tempo perdido procurando arquivos."
      }
    ],
    audienceTitle: "Ideal para rotina de estudo",
    audienceParagraphs: [
      "Se você lida com muitos PDFs, apostilas, exercícios e materiais digitais, uma estrutura simples pode melhorar muito sua rotina.",
      "O Arquivapp ajuda a manter tudo mais acessível e organizado."
    ],
    ctaTitle: "Organize seus materiais de estudo",
    ctaDescription:
      "Crie sua conta gratuita e mantenha seus arquivos de estudo em ordem."
  }
];