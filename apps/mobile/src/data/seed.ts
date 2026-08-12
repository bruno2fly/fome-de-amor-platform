import { AppEvent, Highlight, Project } from '../types/domain';

export const highlights: Highlight[] = [
  {
    id: 'restaurante',
    title: 'Restaurante Comunitário',
    description: 'Quatro refeições gratuitas por dia para quem mais precisa.'
  },
  {
    id: 'kids',
    title: '25 crianças no AmorKids',
    description: 'Contraturno escolar com cuidado, alimento e valores.'
  },
  {
    id: 'run-day',
    title: 'RUN DAY',
    description: 'Corrida solidária anual com mais de 700 atletas.'
  }
];

export const publicEvents: AppEvent[] = [
  {
    id: 'culto-domingo',
    title: 'Culto de Domingo',
    description: 'Celebração semanal com transmissão ao vivo pelo YouTube. Todo domingo às 19h.',
    location: 'Guaramirim, SC',
    startsAt: '2026-07-13T19:00:00-03:00',
    visibility: 'public',
    registrationEnabled: false
  },
  {
    id: 'feijoada-solidaria',
    title: 'Feijoada Solidária',
    description: 'Um momento de comunhão e solidariedade em torno de uma boa feijoada.',
    location: 'Guaramirim, SC',
    startsAt: '2026-08-08T11:30:00-03:00',
    visibility: 'public',
    registrationEnabled: false
  },
  {
    id: 'retiro-casais',
    title: 'Retiro de Casais — Desfrute',
    description: '"Desfrute a vida com a mulher a quem você ama." Ec 9:9\n\nDois dias de renovação, comunhão e descanso para casais. Ambiente à beira-mar em Barra do Sul, Santa Catarina.\n\nValor: R$ 650,00 por casal (hospedagem + alimentação).',
    location: 'Hotel Bandeirantes, Barra do Sul/SC',
    startsAt: '2026-08-15T00:00:00-03:00',
    endsAt: '2026-08-16T23:59:00-03:00',
    visibility: 'public',
    registrationEnabled: true,
    price: 'R$ 650,00 por casal',
    contactPhone: '(47) 99653-1451',
    registrationWhatsApp: '5547996531451',
    registrationWhatsAppMessage: 'Olá! Gostaria de me inscrever no Retiro de Casais Desfrute 2026 — 15 e 16 de Agosto, Hotel Bandeirantes, Barra do Sul/SC. Valor: R$ 650,00 por casal. Podem confirmar minha inscrição?'
  }
];

export const projects: Project[] = [
  {
    id: 'amorkids',
    name: 'AmorKids',
    tagline: 'Espaço Recreativo para Crianças',
    shortDescription: 'Contraturno escolar para crianças em vulnerabilidade social.',
    fullDescription:
      'O Espaço Recreativo AmorKids é um projeto de contraturno escolar para crianças carentes entre 4 e 13 anos em situação de vulnerabilidade e risco social. O projeto proporciona atividades lúdicas, pedagógicas complementares, esportivas, recreativas, de lazer, arte, ética e cidadania, garantindo os direitos previstos no Estatuto da Criança e do Adolescente.\n\nOficinas de musicalização, informática, atividade física, culinária, horta e reforço escolar promovem inclusão de forma acessível. Rodas de conversa fortalecem vínculos e abordam temas como sexualidade, saúde, direitos e deveres, educação financeira e conduta social.',
    beneficiaries: '25 crianças',
    schedule: 'Terças, quartas e sextas — período da tarde',
    team: ['Coordenadores', 'Educadores', 'Voluntários'],
    icon: 'happy-outline'
  },
  {
    id: 'fome-de-bola',
    name: 'Fome de Bola',
    tagline: 'Escolinha de Futebol Gratuita',
    shortDescription: 'Escolinha de futebol gratuita para crianças em vulnerabilidade social.',
    fullDescription:
      'O Projeto Fome de Bola tem a finalidade de promover o atendimento a crianças e adolescentes em situação de vulnerabilidade social por meio da oferta gratuita de atividades esportivas na modalidade futebol, realizadas aos sábados no período matutino, organizadas em três categorias conforme faixa etária.\n\nOferece acompanhamento técnico e multiprofissional com coordenador, Educador Físico, fisioterapeuta, enfermeiro, assistente social e voluntários, visando ao desenvolvimento integral dos participantes, inclusão social, fortalecimento de vínculos familiares e prevenção de situações de risco social.',
    beneficiaries: '60 crianças',
    schedule: 'Sábados — período da manhã',
    team: ['Coordenador', 'Educador Físico', 'Fisioterapeuta', 'Enfermeiro', 'Assistente Social', 'Voluntários'],
    icon: 'football-outline'
  },
  {
    id: 'talmidim',
    name: 'Talmidim',
    tagline: 'Elite do Reino — Formando Líderes',
    shortDescription: 'Valores, cidadania e desenvolvimento pessoal para crianças e adolescentes.',
    fullDescription:
      'O Projeto Talmidim atende crianças de 4 a 13 anos divididos por faixa etária, e tem como objetivo resgatar a cidadania, disciplina e responsabilidade com o meio ambiente por meio de brincadeiras da antiga infância e dinâmicas que incentivam o desenvolvimento pessoal.\n\nO Talmidim promove a socialização e o crescimento integral dos participantes. Os encontros são aos sábados de forma quinzenal no período da tarde, atendendo aproximadamente 60 crianças.',
    beneficiaries: '60 crianças',
    schedule: 'Sábados quinzenais — período da tarde',
    icon: 'star-outline'
  },
  {
    id: 'restaurante',
    name: 'Restaurante Comunitário',
    tagline: 'Ninguém deve enfrentar o dia com fome',
    shortDescription: 'Quatro refeições gratuitas por dia para toda a comunidade.',
    fullDescription:
      'Nosso Restaurante Comunitário nasceu com uma missão: cuidar de pessoas por meio do alimento e do amor. Acreditamos que ninguém deve enfrentar o dia com fome — por isso, oferecemos gratuitamente refeições todos os dias.\n\nServimos café da manhã, almoço, café da tarde e jantar, preparados com dedicação, respeito e carinho por cada pessoa que passa por nossas portas. Mais do que refeições, oferecemos dignidade, acolhimento e esperança. Este é um lugar onde todos são bem-vindos, sem distinção.',
    schedule: 'Todos os dias — 4 refeições por dia',
    icon: 'restaurant-outline'
  },
  {
    id: 'casa',
    name: 'Casa de Passagem',
    tagline: 'Um ponto de apoio para novos começos',
    shortDescription: 'Abrigo 24h com equipe técnica para pessoas em vulnerabilidade.',
    fullDescription:
      'A Casa de Passagem é um lugar de acolhimento, cuidado e recomeço. Funcionando 24 horas por dia, estamos de portas abertas para receber homens, mulheres e famílias que precisam de apoio em momentos de vulnerabilidade.\n\nOferecemos muito mais do que abrigo: proporcionamos um ambiente seguro, digno e preparado para atender às necessidades básicas e emocionais de cada pessoa. Disponibilizamos alojamento, alimentação, roupas e materiais de higiene. Cada vida é valorizada — trabalhamos para restaurar a dignidade e apoiar cada pessoa em seu processo de reconstrução.',
    schedule: '24 horas por dia, 7 dias por semana',
    team: ['Assistente Social', 'Psicólogo', 'Enfermeira', 'Fisioterapeuta', 'Fonoaudióloga', 'Voluntários'],
    icon: 'home-outline'
  },
  {
    id: 'padaria',
    name: 'Padaria Solidária',
    tagline: 'Transformando ingredientes simples em gestos de amor',
    shortDescription: 'Produção de pães, cucas e bolachas para apoiar todos os projetos.',
    fullDescription:
      'A Padaria Solidária é mais do que um espaço de produção — é um instrumento de cuidado, provisão e transformação social. Aqui preparamos, com dedicação e carinho, pães, cucas, bolachas e outros alimentos que sustentam diariamente nossos projetos sociais.\n\nToda a produção é destinada a apoiar o Restaurante Comunitário, os trabalhos com crianças e o atendimento a famílias em vulnerabilidade. A Padaria Solidária é fruto de mãos que servem e corações dispostos a fazer a diferença.',
    icon: 'nutrition-outline'
  },
  {
    id: 'run-day',
    name: 'Corrida Solidária / RUN DAY',
    tagline: 'Quando nos movemos com propósito, podemos ir muito mais longe',
    shortDescription: 'Corrida solidária anual que une esporte e transformação social.',
    fullDescription:
      'A Corrida Solidária é um movimento que une esporte, saúde e propósito. Realizada anualmente no mês de fevereiro, o evento reúne centenas de pessoas em um só objetivo: correr por uma causa maior.\n\nNa última edição, contamos com a participação de aproximadamente 700 atletas que, juntos, transformaram cada passo em apoio concreto aos nossos projetos sociais. Mais do que uma competição, é uma oportunidade de promover qualidade de vida, incentivar hábitos saudáveis e fortalecer o espírito de solidariedade.',
    beneficiaries: '700+ atletas',
    schedule: 'Anual — mês de fevereiro',
    icon: 'bicycle-outline'
  }
];
