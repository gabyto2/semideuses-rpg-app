# Sprint de Produto — Clareza e Usabilidade

## Objetivo do produto

Fazer o app Semideuses RPG 3e funcionar como uma ficha realmente utilizável durante a sessão: rápido no celular, claro para quem nunca viu o sistema e completo sem parecer um amontoado de informações.

Este documento é o ponto de continuidade do projeto. Ele deve ser atualizado a cada pacote publicado no `develop`.

## Regras permanentes de trabalho

1. Desenvolvimento acontece no branch `develop` e no Deploy Preview da Netlify.
2. `main` e produção não são alterados sem autorização explícita.
3. Toda mudança de comportamento precisa de teste automatizado e validação no preview.
4. Problemas de uso têm prioridade sobre novas funções que aumentem a complexidade.
5. Controles sem função devem ser removidos, ocultados ou claramente bloqueados.
6. Uma ação comum deve estar visível ou acessível em até dois toques no celular.
7. Não remover informação de regra apenas para “limpar” a tela; primeiro organizar, agrupar e criar caminhos rápidos.
8. Toda decisão relevante e toda discrepância descoberta entram neste arquivo.

## Comandos de continuidade

Use uma destas frases na conversa. Elas definem exatamente o tipo de trabalho esperado.

### `CONTINUAR SPRINT`

Executa o próximo item pronto da prioridade atual. Inclui diagnóstico, implementação, testes, publicação no `develop` e validação do preview. Não publica em produção.

### `STATUS DO SPRINT`

Retorna: item atual, último commit, o que está pronto, o que falta, riscos e link do preview.

### `REGISTRAR IDEIA: ...`

Inclui a ideia no backlog sem interromper automaticamente o item em andamento. Também informa impacto, dependências e prioridade sugerida.

### `PRIORIZAR: ...`

Reordena o backlog. A nova ordem deve vir acompanhada da justificativa e do custo de adiar os itens afetados.

### `AUDITAR FLUXO: ...`

Testa um fluxo como usuário novo, procura travamentos, ações ocultas, textos confusos, controles mortos e divergências de regra. Não altera o código até apresentar o diagnóstico.

### `CORRIGIR: ...`

Diagnostica e corrige um problema específico no `develop`, com teste de regressão e Deploy Preview.

### `TESTE DE LEIGO: ...`

Analisa se alguém sem conhecimento prévio encontra e entende a função. O critério é clareza real, não apenas funcionamento técnico.

### `REVISAR REGRA: ...`

Compara a implementação com a fonte oficial disponível antes de alterar mecânicas. Lacunas não são preenchidas silenciosamente com regras inventadas.

### `PREPARAR PRODUÇÃO`

Executa a lista de verificação de lançamento, mas não publica. Deve informar migração de dados, riscos, resultados de testes e diferenças entre `develop` e `main`.

### `PUBLICAR PRODUÇÃO`

Só pode ser usado depois de `PREPARAR PRODUÇÃO` aprovado. Autoriza a atualização de `main` e do site oficial conforme o pacote revisado.

### `GERAR BACKUP DO PROJETO`

Produz um resumo autossuficiente do estado do app: arquitetura, decisões, branches, commits, deploys, funcionalidades, riscos, pendências e próxima ação.

## Sprint atual — S2: Heróis Além do Sangue completos

### Meta

Concluir Sátiro/Fauno, Ciclope, Mortal Vidente e Legado em todo o lado do jogador antes de iniciar a área do Mestre. Uma Natureza só está pronta quando criação, ficha, uso em sessão, descanso, evolução, consulta e persistência obedecem ao Livro do Jogador 3e.

### Matriz de conclusão

- [x] Fonte oficial das páginas 24–29 conferida e catalogada.
- [x] Sátiro/Fauno: Especialização substituível sem bônus preso, deslocamento de 12 m, MP Natural, consulta diária da Trilha, Caminho fixo e progressão completa.
- [x] Ciclope: CA natural, Resistência a Concussivo, carga dobrada, ataques de origem, Mãos de Forja, poderes por Descanso e progressão completa.
- [x] Mortal Vidente: perícias extras, Sorte utilizável, Ofício escolhido no nível 2 e trocável após Descanso Longo, Talentos extras obrigatórios e poderes por Descanso.
- [x] Legado: Filiação e Caminho herdados, Dado de Vida reduzido, MP diluído, Assinatura pela metade, progressão atrasada e despertares temporários.
- [x] Compêndio lista as quatro Naturezas com visão geral, progressão, poderes e Caminho apenas quando existe.
- [x] Fichas antigas normalizam sem preservar bônus de origem que já não deveriam existir.
- [x] Testes específicos e testes centrais passam.
- [x] Build e Deploy Preview passam.
- [x] Fluxos principais são conferidos no preview.
- [x] Ficha recém-criada inicializa a economia de ações sem erros repetidos no navegador.

### Portão para a área do Mestre

A área do Mestre não começa enquanto houver opção de Natureza que apenas exiba texto sem aplicar a escolha, ação limitada sem rastreamento, evolução que pule ganho obrigatório, botão de regra sem destino ou regressão de persistência.

### Criação em nível de campanha

Impedir a criação acima do nível 1 corrigia o salto indevido de Skills e Talentos, mas tornava campanhas já iniciadas e one-shots desnecessariamente cansativas. A solução adotada separa duas coisas:

- a ficha-base sempre nasce mecanicamente no nível 1, preservando a ordem correta das regras;
- o jogador escolhe na criação o nível da campanha, de 1 a 20;
- níveis sem decisão são aplicados automaticamente;
- o assistente interrompe somente quando há uma escolha real, como Skill, Talento, atributo ou Ofício;
- Caminho e Marca aparecem na criação apenas quando o nível e a Natureza realmente os exigem;
- se a criação acelerada for pausada, a ficha mantém a meta e permite continuar depois.

Não serão escolhidos automaticamente Talentos, Skills ou atributos, porque isso definiria a construção da personagem sem decisão do jogador.

## Sprint atual — S3: Ferramentas do Mestre

### Meta

Transformar o módulo Mestre em uma ferramenta de uso durante a sessão, começando pelo fluxo mais frequente e sensível ao tempo: conduzir um encontro sem alternar entre várias fichas.

### Fase 1 — Mesa de Sessão

- [x] Preparação separada do encontro em andamento.
- [x] Inclusão de personagens já salvos no aparelho, sem duplicar a ficha.
- [x] Cadastro manual de inimigos e NPCs com nome, PV, CA, iniciativa e nota curta.
- [x] Ordem automática por iniciativa e ajuste manual apenas para empates.
- [x] Rodada, turno atual e comando grande de próximo turno.
- [x] Dano, cura e condições sincronizados com a ficha do jogador.
- [x] PV e condições locais para inimigos.
- [x] Persistência automática do encontro no navegador.
- [x] Estado final preservado ao encerrar o encontro.
- [x] Teste automatizado de regras e integração com a interface.
- [x] Build, Deploy Preview e teste real no navegador.

### Decisão de escopo da Fase 1

O primeiro fluxo não inclui um bestiário improvisado. A Mesa aceita os valores informados pelo Mestre e reutiliza somente regras já implementadas, como PV, CA, iniciativa e condições. Criaturas prontas entram numa fase própria, depois de catalogar e validar a fonte oficial; isso evita publicar estatísticas inventadas como se fossem regra do livro.

### Complemento do jogador — Diário da ficha

- [x] Atalho `Anotações` incluído na navegação rápida da ficha.
- [x] Entradas vinculadas individualmente ao personagem, sem misturar jogadores.
- [x] Tipos `Sessão`, `Profecia`, `Ideia` e `Geral` com filtros próprios.
- [x] Título opcional, data, texto, edição e exclusão.
- [x] Campo antigo de notas preservado e migrável sem perda.
- [x] Anotações incluídas no mesmo armazenamento e exportação da ficha.
- [ ] Validação real no celular pelo usuário.

### Fontes oficiais aprovadas

O cânone mecânico do aplicativo é formado exclusivamente pelo **Livro do Jogador 3e** e pelo **Livro do Mestre 3e**. Bestiário, criaturas, regras, dificuldades, recompensas e quaisquer números devem ser transcritos e referenciados a partir desses livros. O app não completa lacunas por analogia, memória ou regra de outro sistema.

Quando os dois livros tratarem do mesmo assunto de forma diferente, a discrepância deve ser registrada e apresentada antes de escolher qual comportamento implementar. Conteúdo criado para uma campanha pode existir, mas precisa aparecer claramente como `Personalizado`, nunca como regra oficial.

## S3 — Bestiário e preparação de encontros

### Fase 2 — ND 1/2 a 4

- [x] 27 entradas das páginas 83–94 do Livro do Mestre catalogadas com PV, CA, deslocamento, atributos declarados, características, ações e orientações disponíveis.
- [x] Busca por nome, tipo, ação e característica, com filtro por ND.
- [x] Orçamentos oficiais de encontro das páginas 27–29 por nível médio e quantidade de jogadores.
- [x] VA de cada ND e multiplicador oficial pela quantidade total de criaturas.
- [x] Classificação automática em Fácil, Médio, Difícil, Épico ou Acima do Épico.
- [x] Envio das criaturas selecionadas direto para a Mesa, preservando ND e página da fonte.
- [x] Ficha oficial da criatura consultável durante o combate.
- [x] Testes automatizados do catálogo, dos cálculos e da integração com a Mesa.
- [x] Deploy Preview e validação real em tela móvel.

### Fase 3 — ND 5 a 8

- [x] 25 novas entradas das páginas 95–112 catalogadas; o total oficial passa a 52 criaturas e modelos.
- [x] Filtros ampliados até ND 8 e busca incluindo ações, reações, notas de chefe e Ações Lendárias.
- [x] Criaturas com valores completos entram na calculadora e na Mesa preservando ND, PV, CA e página.
- [x] Fichas detalhadas exibem Reações, Ações Lendárias e regras de chefe sem misturá-las às ações comuns.
- [x] Basilisco e Semideus Veterano ficam consultáveis, mas são bloqueados na calculadora por lacunas da fonte.
- [x] Testes do catálogo, filtros, VA e integração atualizados para as 52 entradas.
- [x] Deploy Preview e validação real no navegador: 52 entradas, filtro ND 8, Talos na calculadora/Mesa e bloqueio do Basilisco conferidos.
- [x] Fase seguinte do catálogo iniciada com as criaturas de ND 9 a 12.

### Fase 4 — ND 9 a 12 e escala do catálogo

- [x] 12 novas entradas das páginas 112–119 catalogadas; o total passa a 64 criaturas e modelos.
- [x] Filtros ampliados até ND 12, preservando busca por regras, ações, notas de chefe e orientações ambientais.
- [x] Catálogo recolhido não renderiza fichas ocultas; aberto, mostra no máximo 12 resultados por página.
- [x] Busca, filtro e paginação atualizam somente a lista, sem recriar a tela inteira ou interromper a digitação.
- [x] Cila, Caríbdis e Cila das Profundezas aparecem como `CENÁRIO` e explicam como controlar cabeças, sucção e objetivos na Mesa.
- [x] A calculadora continua usando o VA oficial dos encontros ambientais, mas a nota enviada à Mesa evita tratá-los como inimigos convencionais.
- [x] Apêndice A conferido e usado para recuperar oficialmente o ND 5 do Basilisco sem inventar os outros valores ausentes.
- [x] Testes do catálogo, paginação, filtros, VA e integração com a Mesa atualizados para 64 entradas.
- [x] Deploy Preview validado: zero fichas quando recolhido, 12 por página, filtros ND 9–12, busca com foco preservado, Drakon na calculadora/Mesa e Cila identificada como cenário.
- [x] Fase final do catálogo oficial: ND 13, 14, 15 e 17.

### Fase 5 — catálogo completo e gestão reutilizável

- [x] Sete entradas finais das páginas 119–123 catalogadas; o Bestiário chega a 71 criaturas e modelos oficiais.
- [x] Filtros concluídos para ND 13, 14, 15 e 17, com VA oficial até o Aspecto de Tífon.
- [x] Caríbdis Desperta marcada como encontro de cenário e CA 10 explicitamente limitada ao intervalo vulnerável.
- [x] Cabeças de Cila e Cila das Profundezas recebem PV individuais na Mesa.
- [x] PV internos, usos de sucção, poderes de domínio, Ações Lendárias e Resistências Lendárias recebem contadores persistentes.
- [x] Ações Lendárias configuradas renovam automaticamente no início de cada rodada; Resistências Lendárias não renovam.
- [x] Preparações da calculadora podem ser nomeadas, salvas, carregadas e excluídas no aparelho.
- [x] Encontros encerrados entram automaticamente no histórico da campanha, preservando rodada e estado final.
- [x] Controles densos, encontros salvos e histórico iniciam recolhidos para não alongar a tela no celular.
- [x] Deploy Preview força o Netlify Drawer oculto em novas abas sem afetar produção.

### Fase 6 — arquivo narrativo e backup do Mestre

- [x] Painel narrativo separado da calculadora e disponível na preparação, durante o combate e após encerrá-lo.
- [x] Painel e categorias iniciam recolhidos, preservando no aparelho somente o que o Mestre decidiu deixar aberto.
- [x] Visão geral da campanha com nome, resumo e notas privadas.
- [x] Registro editável de sessões, NPCs, locais, pistas, profecias, mistérios e missões.
- [x] Estados próprios para NPCs, locais e fios narrativos, sem confundir conteúdo criado pelo Mestre com regra oficial.
- [x] Exportação e importação conjunta do painel, encontro atual, histórico e preparações salvas da calculadora.
- [x] Cópia local manual para recuperação rápida no mesmo navegador.
- [x] Restauração substitui o conjunto completo do Mestre, evitando misturar duas campanhas silenciosamente.
- [x] Fichas dos jogadores permanecem fora desse arquivo e continuam com seu backup próprio.
- [x] Testes automatizados de validação, persistência, interface, backup e restauração.
- [x] Deploy Preview validado: quatro categorias cadastradas, preferências de abertura preservadas, cópia local confirmada e painel recolhido conferido visualmente.

### Fase 7 — identidade e instalação

- [x] Nome instalado simplificado para `Semideuses RPG` no manifesto, no iPhone e no título da página.
- [x] Novo ícone `S3 com louros`, preservando azul, dourado e leitura em tamanho pequeno.
- [x] Ícones próprios de 180, 192 e 512 px, além do favicon e da fonte em alta resolução.
- [x] Lembrete não bloqueante de instalação exibido somente fora do modo instalado.
- [x] Android e navegadores Chromium usam o diálogo nativo de instalação quando disponível.
- [x] iPhone recebe instruções para `Compartilhar → Adicionar à Tela de Início → Abrir como App`.
- [x] O lembrete pode ser fechado e não reaparece indefinidamente no mesmo navegador.
- [x] Testes automatizados cobrem nome, dimensões dos ícones, instalação nativa, instrução do iPhone e modo já instalado.
- [x] Deploy Preview validado em produção de preview: página, manifesto, script, estilos e todos os ícones respondem `200`; os fluxos Android, iPhone e modo instalado permanecem cobertos pelos testes automatizados.

### Fase 8 — Mesa independente das fichas dos jogadores

- [x] `Grupo da campanha` torna-se o caminho principal para incluir heróis na Mesa.
- [x] O Mestre cadastra o grupo uma vez e o adiciona inteiro a novos encontros com uma ação.
- [x] Somente o nome é obrigatório; PV e CA são opcionais e nunca recebem valores aparentes inventados.
- [x] Heróis sem PV e CA entram apenas na ordem de turnos, com essa limitação comunicada na preparação, no combate e no estado final.
- [x] Fichas salvas no aparelho continuam disponíveis em uma área secundária e explicitamente opcional.
- [x] Herói do grupo, ficha local, inimigo, NPC e cenário recebem identificação própria.
- [x] Combatentes fora do turno iniciam compactos; o turno atual abre automaticamente.
- [x] Condições exibem o efeito oficial antes de aplicar e Exaustão usa níveis cumulativos de 0 a 6.
- [x] Controles especiais e referências preservam o estado aberto após uma ação.
- [x] Rascunhos narrativos sobrevivem a outras ações da Mesa e a visão geral salva durante a digitação.
- [x] Alvos de toque essenciais têm ao menos 44 px e a barra fixa respeita a área segura do celular.
- [ ] Testes automatizados, build, Deploy Preview e conferência real concluídos.

### Discrepância oficial registrada

`Mortal com Conhecimento` apresenta no livro apenas as faixas ND 1–4, PV 32–72 e CA 12–16. Como não há distribuição oficial de valores por ND, a entrada é consultável como modelo, mas não pode ser enviada automaticamente à calculadora. O Mestre deve escolher valores concretos no cadastro manual. O aplicativo não interpola nem inventa números.

`Basilisco` começa na página 95 já na tabela de atributos. O cabeçalho não apresenta PV, CA nem deslocamento, mas o Apêndice A da página 123 confirma que seu ND é 5. O app usa o ND e o VA oficiais, mantém os três campos ausentes como não informados e bloqueia sua inclusão automática. Estatísticas de outros sistemas não serão usadas como substituição silenciosa.

`Semideus Veterano` apresenta apenas as faixas ND 8–12, PV 160–220 e CA 17–19. O livro não relaciona valores específicos a cada ND e ainda exige que o Mestre escolha Filiação, 4–6 habilidades e 3–4 Talentos. A entrada é um modelo manual; o app não interpola números nem escolhe a construção do adversário.

`Cila`, `Caríbdis`, `Cila das Profundezas` e `Caríbdis Desperta` são encontros ambientais com partes ou objetivos que a linha comum de PV da Mesa não representa sozinha. Elas entram no orçamento pelo ND oficial e recebem identificação de cenário, orientação visível e controles próprios. Cabeças e PV internos são rastreados separadamente; sucção e intervalo vulnerável recebem contadores. Distância individual de cada personagem até o centro e manobras de navio continuam sendo decisões do Mestre, porque não existe um mapa tático no aplicativo.

### Próximas fases propostas

1. Validação final da Fase 8 em Android e iPhone com um Mestre que não conhece a organização interna.
2. Vinculação local entre sessões narrativas e encontros encerrados do próprio Mestre.
3. Preparação de lançamento: migração, recuperação e redução do risco acumulado entre `develop` e `main`.

## S1 — ficha clara e estável no celular

### Meta

Um jogador novo deve conseguir abrir uma ficha, entender onde estão as funções principais e executar ações de sessão sem travar, se perder ou saltar involuntariamente pela página.

### P0 — Bloqueadores de uso

- [x] Compêndio de itens volta para a ficha sem fechar o app.
- [x] Inventário é a entrada principal e `Em uso` mostra equipamentos aplicados.
- [x] Itens personalizados entram no Inventário.
- [x] Rolagem de Inventário e seleção de itens não prende a tela.
- [x] Revisão final da criação permanece visível antes de salvar.
- [x] Descrições dos Caminhos não aparecem duplicadas.
- [x] Habilidades, Skills e Perícias não repetem bloqueio de rolagem.
- [x] Navegação rápida entre Resumo, Combate, Habilidades, Itens, Estados, Anotações e Progressão.
- [x] Seções densas recolhíveis, com preferência salva por personagem e abertura automática pelo atalho.
- [ ] Teste manual do fluxo principal em Android e iPhone.

### P1 — Clareza para usuário novo

- [x] Não explicar Habilidades, Skills, Talentos e Perícias: o público já conhece os termos e a explicação aumentaria a densidade da ficha.
- [x] Revisar nomes dos botões para usar verbos e resultados claros.
- [x] Reduzir listas longas da criação com busca, agrupamento ou resumo progressivo.
- [x] Revisar estados vazios: sempre informar o que falta e qual é a próxima ação.
- [x] Garantir que todo item adicionado mostre claramente onde foi parar e como equipar/usar.
- [x] Criar um teste guiado de primeira ficha, primeiro item e primeiro combate.

### P2 — Segurança e manutenção

- [x] Tornar o aviso de backup mais contextual depois de criar ou importar fichas.
- [x] Definir uma estratégia de versão e migração dos dados salvos no navegador.
- [ ] Reduzir scripts que alteram a mesma tela por `MutationObserver`.
- [ ] Criar teste automatizado real em viewport móvel, além dos testes de DOM.
- [x] Preparar estratégia para encerrar a PR extensa com versão candidata, portão de produção e plano de recuperação.

## Critérios de aceite do S1

- Rolagem natural e contínua em tela móvel.
- Nenhuma ação comum provoca salto para o topo ou final da ficha.
- Navegação principal da ficha acessível com uma mão.
- Usuário identifica onde ficam vida, habilidades, itens e estados sem instrução externa.
- Mudança de aba mostra visualmente qual conteúdo está ativo.
- Botão físico Voltar não fecha o app em fluxos internos.
- Nenhum botão visível sem ação real.
- Nenhuma regressão nos testes centrais e no build da Netlify.

## Discrepâncias e riscos ativos

### 1. A ficha é completa, mas longa

O conteúdo oficial foi preservado, mas os blocos densos agora iniciam recolhidos: Habilidades, Itens, Estados, Anotações e Progressão. Resumo, PV e controles de sessão continuam abertos. A preferência é salva por personagem e os atalhos abrem a seção de destino automaticamente.

### 2. Termos próximos são conhecimento esperado do público

`Habilidades`, `Skills`, `Talentos` e `Perícias` continuam nomeados conforme o sistema. Por decisão de produto, a ficha não recebe um bloco explicativo: quem vai jogar já conhece a diferença e repetir isso aumentaria a densidade sem melhorar a ação durante a sessão.

### 3. Muitas camadas alteram o mesmo HTML

O app cresceu por extensões sucessivas. Existem vários scripts observando e corrigindo a mesma ficha depois que ela é renderizada. Isso acelerou o desenvolvimento, mas já causou conflitos como a revisão final escondida e os bloqueios de rolagem. Deve haver uma consolidação gradual, sem reescrever tudo de uma vez.

### 4. As fichas dependem do navegador

Hoje os dados ficam principalmente no armazenamento local. A ficha e o módulo Mestre possuem exportação própria, mas o usuário ainda pode perder dados ao limpar o navegador ou trocar de aparelho sem exportar. A cópia local do Mestre ajuda contra alterações acidentais, porém também desaparece se os dados do navegador forem apagados; ela não é sincronização em nuvem.

### 5. O `develop` está muito distante de `main`

A PR de desenvolvimento acumula muitas mudanças. Isso é aceitável durante a construção, mas aumenta o risco do primeiro lançamento. Antes da produção será necessária uma revisão de release, migração e recuperação.

### 6. Teste automatizado ainda não substitui aparelho real

Os testes atuais cobrem regras, DOM, navegação e build, mas não reproduzem perfeitamente gesto, teclado, área segura e histórico de Android/iOS. O aceite final do S1 exige teste em aparelhos reais.

## Registro de decisões

- Inventário é a tela principal de itens.
- `Em uso` existe porque mostra efeito mecânico real; não é apenas uma segunda lista.
- Compêndio de Itens é um destino separado e deve parecer uma abertura de tela, não uma aba comum.
- PV saudável usa verde; vermelho fica reservado a estado crítico.
- PV temporários e Dados de Vida ficam junto dos PV.
- Recursos de Filiação ficam junto das Habilidades.
- Heróis Além do Sangue disponíveis: Sátiro/Fauno, Ciclope, Mortal Vidente e Legado.
- Livro do Jogador 3e e Livro do Mestre 3e são as únicas fontes oficiais de regras e Bestiário.
- Informações secundárias podem iniciar recolhidas, mas funções de sessão devem permanecer fáceis de encontrar.
- Habilidades, Itens, Estados, Anotações e Progressão iniciam recolhidos; Resumo, PV e sessão permanecem abertos.
- O cálculo de encontros segue literalmente orçamento, VA e multiplicadores do Livro do Mestre; não mede sozinho composição tática ou sinergia entre criaturas.
- Modelos com valores variáveis no livro exigem preenchimento manual e não recebem números deduzidos pelo app.
- Produção não acompanha automaticamente cada commit do `develop`.
- O backup do Mestre substitui todo o conjunto narrativo e de encontros ao restaurar; mesclar campanhas automaticamente criaria duplicações e relações ambíguas.
- O backup do Mestre não inclui fichas de jogadores, porque cada ficha já possui ciclo próprio de exportação e importação.
- Usando somente Netlify e GitHub, dados de campanha continuam locais ao navegador; backup em arquivo protege a troca de aparelho, mas não cria sincronização automática.
- O Mestre não consegue entregar itens diretamente a fichas abertas em outros aparelhos. Essa função exigiria contas, campanhas compartilhadas e armazenamento online; um botão local daria uma falsa impressão de conexão.
- Uma futura transferência sem contas só poderia ser manual, por arquivo ou QR aceito pelo jogador, e não deve ser descrita como entrega direta.
- O fluxo principal da Mesa usa um `Grupo da campanha` local e reutilizável, porque exigir que o Mestre importe ou recrie todas as fichas dos jogadores seria cansativo e sugeriria uma conexão que não existe.
- No Grupo da campanha, somente o nome é obrigatório. PV e CA são um par opcional: se ficarem vazios, a Mesa controla a ordem de turnos sem fingir que acompanha vida ou defesa.
- Vincular uma ficha salva no mesmo aparelho continua útil para sincronizar PV e condições, mas permanece como alternativa secundária, nunca como requisito do combate.

## Definição de pronto para cada item

Um item só recebe `[x]` quando:

1. a causa foi identificada;
2. a mudança foi implementada;
3. existe teste de regressão adequado;
4. `npm run test:core` passou;
5. `npm run build` passou;
6. o commit foi publicado no `develop`;
7. o Deploy Preview da Netlify concluiu com sucesso;
8. o comportamento foi conferido no preview quando depender de interface.

## Próxima ação

Validar a versão `1.0.0-rc.1` em Android e iPhone usando o checklist de release. Produção permanece bloqueada até essa aprovação.
