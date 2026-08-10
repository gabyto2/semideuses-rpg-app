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
- [ ] Deploy Preview e validação real em tela móvel.
- [ ] Fase seguinte do catálogo: criaturas de ND 9 em diante.

### Discrepância oficial registrada

`Mortal com Conhecimento` apresenta no livro apenas as faixas ND 1–4, PV 32–72 e CA 12–16. Como não há distribuição oficial de valores por ND, a entrada é consultável como modelo, mas não pode ser enviada automaticamente à calculadora. O Mestre deve escolher valores concretos no cadastro manual. O aplicativo não interpola nem inventa números.

`Basilisco` começa na página 95 já na tabela de atributos. O PDF oficial não apresenta seu cabeçalho com ND, PV, CA e deslocamento. A criatura permanece pesquisável no grupo ND 5 por sua posição no catálogo, mas o app mostra os quatro campos como não informados e bloqueia sua inclusão automática. Estatísticas de outros sistemas não serão usadas como substituição silenciosa.

`Semideus Veterano` apresenta apenas as faixas ND 8–12, PV 160–220 e CA 17–19. O livro não relaciona valores específicos a cada ND e ainda exige que o Mestre escolha Filiação, 4–6 habilidades e 3–4 Talentos. A entrada é um modelo manual; o app não interpola números nem escolhe a construção do adversário.

### Próximas fases propostas

1. Continuar o Bestiário em blocos fechados e validados a partir do ND 9.
2. Modelos de encontro salvos e reutilizáveis.
3. Painel de campanha: sessões, NPCs, locais, pistas e notas privadas.
4. Recompensas e entrega controlada de itens aos personagens.

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

- [ ] Explicar na própria ficha a diferença entre Habilidades, Skills, Talentos e Perícias.
- [ ] Revisar nomes dos botões para usar verbos e resultados claros.
- [ ] Reduzir listas longas da criação com busca, agrupamento ou resumo progressivo.
- [ ] Revisar estados vazios: sempre informar o que falta e qual é a próxima ação.
- [ ] Garantir que todo item adicionado mostre claramente onde foi parar e como equipar/usar.
- [ ] Criar um teste guiado de primeira ficha, primeiro item e primeiro combate.

### P2 — Segurança e manutenção

- [ ] Tornar o aviso de backup mais contextual depois de criar ou importar fichas.
- [ ] Definir uma estratégia de versão e migração dos dados salvos no navegador.
- [ ] Reduzir scripts que alteram a mesma tela por `MutationObserver`.
- [ ] Criar teste automatizado real em viewport móvel, além dos testes de DOM.
- [ ] Preparar estratégia para dividir ou encerrar a PR extensa de `develop` antes do lançamento.

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

### 2. Termos próximos podem confundir

`Habilidades`, `Skills`, `Talentos` e `Perícias` têm funções diferentes, mas essa diferença depende de o usuário já conhecer o sistema. A interface precisa explicar isso em uma frase curta e consistente.

### 3. Muitas camadas alteram o mesmo HTML

O app cresceu por extensões sucessivas. Existem vários scripts observando e corrigindo a mesma ficha depois que ela é renderizada. Isso acelerou o desenvolvimento, mas já causou conflitos como a revisão final escondida e os bloqueios de rolagem. Deve haver uma consolidação gradual, sem reescrever tudo de uma vez.

### 4. As fichas dependem do navegador

Hoje os dados ficam principalmente no armazenamento local. Exportação e backup existem, mas o usuário ainda pode perder fichas ao limpar dados do navegador ou trocar de aparelho sem exportar.

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

Publicar Bestiário, calculadora e ficha recolhível no `develop`, validar o Deploy Preview em tela móvel e então iniciar a catalogação de ND 5 em diante.
