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

### Portão para a área do Mestre

A área do Mestre não começa enquanto houver opção de Natureza que apenas exiba texto sem aplicar a escolha, ação limitada sem rastreamento, evolução que pule ganho obrigatório, botão de regra sem destino ou regressão de persistência.

### Discrepância resolvida

Uma criação acima do nível 1 pulava escolhas intermediárias de Skills e Talentos do fluxo `Evoluir ficha`. A decisão de produto da S2 é iniciar novas fichas no nível 1 e concentrar toda progressão no assistente de evolução. Um assistente de criação avançada só deve voltar ao backlog se houver necessidade real de cadastrar campanhas já iniciadas.

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
- [x] Navegação rápida entre Resumo, Combate, Habilidades, Itens, Estados e Progressão.
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

O problema principal não é quantidade de regra, e sim falta de orientação entre blocos. A decisão atual é preservar o conteúdo e criar navegação rápida antes de considerar esconder ou remover seções.

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
- Informações secundárias podem iniciar recolhidas, mas funções de sessão devem permanecer fáceis de encontrar.
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

Desenhar o primeiro fluxo da área do Mestre a partir das necessidades reais de sessão, mantendo o lado do Jogador estável no `develop`.
