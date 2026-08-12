(function(global){
  'use strict';

  var db=global.SemideusesRulesDatabase;
  if(!db)return;

  var backgrounds={
    'Atleta':{
      id:'atleta',name:'Atleta',
      overview:'Você cresceu treinando, competindo e aprendendo que disciplina e trabalho em equipe valem mais do que talento bruto.',
      skillProficiencies:['Atletismo','Acrobacia','Intimidação'],
      toolProficiency:'Equipamento esportivo à sua escolha',
      trait:{name:'Segundo Fôlego',action:'Ação Bônus',recharge:'short-rest',uses:1,description:'Uma vez por Descanso Curto, recupere PV iguais ao seu nível + modificador de CON, mínimo 1.'},
      bond:'Você conhece alguém do mundo mortal — um técnico, rival ou companheiro de equipe — que ainda espera que você volte.'
    },
    'Órfão de Rua':{
      id:'orfao-de-rua',name:'Órfão de Rua',
      overview:'Você aprendeu a sobreviver sem família, rede de segurança ou segunda chance.',
      skillProficiencies:['Furtividade','Enganação','Sobrevivência'],
      toolProficiency:'Kit de ladrão',
      trait:{name:'Instinto de Sobrevivência',action:'Reação',recharge:'long-rest',uses:1,description:'Quando for reduzido a 0 PV, faça um TR de CON, CD 10 + dano recebido. No sucesso, permaneça com 1 PV. Uma vez por Descanso Longo.'},
      bond:'Você guarda um pequeno objeto do tempo nas ruas; é o único registro de quem era antes.'
    },
    'Estudante Prodígio':{
      id:'estudante-prodigio',name:'Estudante Prodígio',
      overview:'Você sempre foi a mente mais rápida da sala e aprendeu a contornar as dificuldades de leitura do mundo mortal.',
      skillProficiencies:['Saber Mítico','História','Investigação'],
      toolProficiency:'Kit de caligrafia e pergaminho',
      trait:{name:'Memória Eidética',action:'Especial',recharge:'long-rest',uses:1,description:'Lembre com precisão textos, mapas ou diagramas examinados por ao menos 1 minuto. Uma vez por Descanso Longo, ao falhar em História, Religião / Panteão ou Saber Mítico, relance e use o novo resultado.'},
      bond:'Um professor mortal reconheceu seu potencial e nunca recebeu uma explicação para o seu desaparecimento.'
    },
    'Filho de Família Rica':{
      id:'familia-rica',name:'Filho de Família Rica',
      overview:'Você cresceu com acesso, educação e contatos que resolvem problemas mundanos — mas não os problemas do mundo mítico.',
      skillProficiencies:['Persuasão','História','Intuição'],
      toolProficiency:'Kit de jogos de sociedade',
      trait:{name:'Rede de Contatos',action:'Especial',recharge:'session',uses:1,description:'Uma vez por sessão, obtenha por sua rede um favor mundano: informação, acesso, transporte ou equipamento não mítico. O Mestre define a extensão.'},
      bond:'Sua família acredita que você estuda no exterior e mantém um cartão que deixa um rastro fácil de seguir.'
    },
    'Imigrante':{
      id:'imigrante',name:'Imigrante',
      overview:'Você cresceu entre culturas e aprendeu a se adaptar, observar e encontrar aliados em lugares inesperados.',
      skillProficiencies:['Intuição','Persuasão','Sobrevivência'],
      toolProficiency:'Um idioma adicional à sua escolha',
      trait:{name:'Adaptabilidade',action:'Passiva',recharge:'passive',uses:null,description:'Tenha Vantagem em Persuasão e Enganação com quem compartilha sua cultura de origem ou idioma nativo. Você não sofre penalidades por ser forasteiro em comunidades mortais.'},
      bond:'Sua avó sempre soube que havia algo diferente em você e deixou pistas que ainda não foram compreendidas.'
    },
    'Artista':{
      id:'artista',name:'Artista',
      overview:'Você se expressa por música, pintura, escrita ou atuação e aprendeu que criação também pode ser arma ou escudo.',
      skillProficiencies:['Atuação','Persuasão','Intuição'],
      toolProficiency:'Instrumento musical ou kit de artista à sua escolha',
      trait:{name:'Presença de Palco',action:'Ação',recharge:'short-rest',uses:1,description:'Ao se apresentar para um grupo que possa ver ou ouvir, faça Atuação CD 12. No sucesso, criaturas não hostis ficam distraídas por até 1 minuto, com Desvantagem na Percepção Passiva para notar outras coisas. Uma vez por Descanso Curto.'},
      bond:'Você tem uma obra inacabada que só poderá concluir quando resolver algo deixado para trás.'
    },
    'Criminoso':{
      id:'criminoso',name:'Criminoso',
      overview:'Você conhece as regras oficiais e as regras reais, além das pessoas que vivem entre elas.',
      skillProficiencies:['Furtividade','Enganação','Prestidigitação'],
      toolProficiency:'Kit de ladrão e veículos terrestres',
      trait:{name:'Contatos no Submundo',action:'Especial',recharge:'session',uses:1,description:'Uma vez por sessão, contate um informante para obter identidade falsa, local seguro, informação regional ou equipamento ilegal de baixo custo. Não envolve diretamente o sobrenatural.'},
      bond:'Alguém do seu passado sabe onde você está e ainda tem motivos para procurá-lo.'
    },
    'Criança Soldado':{
      id:'crianca-soldado',name:'Criança Soldado',
      overview:'Você foi treinado para combater antes de aprender a viver e sabe que hesitação pode matar.',
      skillProficiencies:['Atletismo','Sobrevivência','Intimidação'],
      toolProficiency:'Veículos terrestres e kit de primeiros socorros',
      trait:{name:'Disciplina de Combate',action:'Passiva',recharge:'passive',uses:null,description:'Você não pode ser Surpreendido enquanto estiver consciente.'},
      bond:'Você perdeu alguém no conflito que o formou e ainda não decidiu se aceita que não foi sua culpa.'
    },
    'Culto Familiar':{
      id:'culto-familiar',name:'Culto Familiar',
      overview:'Você cresceu entre rituais, oferendas e histórias que sua família chamava de fé.',
      skillProficiencies:['Religião / Panteão','Saber Mítico','Intuição'],
      toolProficiency:'Kit de rituais',
      trait:{name:'Conhecimento Proibido',action:'Especial',recharge:'long-rest',uses:1,description:'Tenha Vantagem em Saber Mítico e Religião / Panteão para identificar criaturas, artefatos e rituais. Uma vez por Descanso Longo, faça uma Oferenda de 10 minutos para ganhar Vantagem no próximo teste de Intuição ou Sabedoria ligado ao mundo divino.'},
      bond:'Sua família ainda pratica os rituais e acredita que sua ida ao Acampamento era destino.'
    },
    'Sobrevivente':{
      id:'sobrevivente',name:'Sobrevivente',
      overview:'Você sobreviveu ao que deveria ter matado e trata cada novo dia como tempo emprestado.',
      skillProficiencies:['Medicina','Sobrevivência','Intuição'],
      toolProficiency:'Kit de primeiros socorros',
      trait:{name:'Vontade Inabalável',action:'Passiva / Especial',recharge:'session',uses:1,description:'Enquanto estiver Morrendo, some o modificador de CON, mínimo +1, às Jogadas de Morte. Uma vez por sessão, ao chegar a 3 Falhas de Morte em combate, faça TR de CON CD 15; no sucesso, estabilize com 1 PV.'},
      bond:'Você carrega o nome de cada pessoa que não sobreviveu quando você sobreviveu.'
    }
  };

  function clone(value){return JSON.parse(JSON.stringify(value));}
  db.backgrounds=backgrounds;
  db.getBackground=function(name){return backgrounds[name]?clone(backgrounds[name]):null;};
  db.listBackgrounds=function(){return Object.keys(backgrounds).map(function(name){return clone(backgrounds[name]);});};
  db.version='3e-rules-db-0.30.0';
})(window);
