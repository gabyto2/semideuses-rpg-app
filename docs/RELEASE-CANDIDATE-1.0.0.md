# Semideuses RPG 1.0.0-rc.1

## Objetivo

Esta é a versão candidata ao primeiro lançamento público. O pacote congela novas funções e concentra o trabalho restante em segurança dos dados, regressões e validação em Android e iPhone.

O desenvolvimento continua em `develop` e no Deploy Preview. `main` e o site de produção não devem ser alterados antes da aprovação explícita do teste final.

## Escopo da versão

- criação guiada de personagens do nível 1 ao 20;
- Semideus Grego, Sátiro/Fauno, Ciclope, Mortal Vidente e Legado;
- ficha móvel com recursos, combate, habilidades, itens, estados, progressão e anotações;
- compêndios de regras e itens;
- módulo Mestre com grupo local, Mesa, calculadora, Bestiário oficial, arquivo narrativo e backups;
- instalação como aplicativo, funcionamento offline e aviso não bloqueante de atualização.

## Proteção e migração dos dados

1. Antes da primeira migração desta versão, o app cria uma cópia de recuperação dos dados `semideuses.*` existentes no navegador.
2. Fichas antigas são normalizadas para o schema atual sem apagar silenciosamente o estado anterior.
3. Se a lista atual de personagens estiver corrompida e houver uma cópia válida, o app restaura essa cópia e preserva o conteúdo corrompido para diagnóstico.
4. Importações sempre criam uma recuperação antes de gravar.
5. `Importar sem apagar` preserva as fichas atuais; IDs repetidos recebem um novo ID.
6. `Substituir por backup` é uma ação separada, explícita e confirmada. Cancelar não altera nada.
7. Depois de criar ou importar dados importantes, o app recomenda baixar um arquivo externo.
8. A cópia local continua dependendo do navegador; limpar os dados do site também a remove.

## Estratégia de atualização

- versão do aplicativo: `1.0.0-rc.1`;
- versão do schema de personagens: definida por `SemideusesCharacter.schemaVersion`;
- versão do cache offline: `semideuses-rpg-v14`;
- o service worker baixa a versão nova sem recarregar a tela durante uma edição;
- quando a atualização assume o controle, o usuário escolhe `Atualizar agora` ou `Depois`.

## Plano de recuperação

Se uma regressão de dados aparecer no preview:

1. não promover `develop` para `main`;
2. baixar um backup externo antes de novos testes;
3. usar a cópia de recuperação automática somente para voltar ao estado anterior à migração/importação;
4. corrigir em novo commit de `develop` e repetir todos os testes;
5. se a regressão já tiver chegado à produção, reverter o commit de release no GitHub sem apagar o histórico e publicar a correção pela integração Git da Netlify.

## Checklist automatizado

- [x] `npm run test:core`
- [x] `npm run test:heroes`
- [x] `npm run build`
- [x] `git diff --check`
- [ ] Deploy Preview da Netlify concluído no commit exato da versão candidata
- [ ] página, manifesto, service worker e novos arquivos respondem no preview

## Checklist manual — Android

- [ ] abrir o preview em aba limpa e confirmar que a barra da Netlify não aparece;
- [ ] instalar o app pelo lembrete e abrir pelo ícone `S3 com louros`;
- [ ] criar uma ficha no nível 1 e outra no nível 5 ou superior;
- [ ] pesquisar Filiação e Antecedente, salvar, fechar e reabrir a ficha;
- [ ] adicionar um item, abrir Inventário, equipar e voltar sem salto de rolagem;
- [ ] abrir e recolher Habilidades, Itens, Estados, Anotações e Progressão;
- [ ] registrar uma anotação e confirmar persistência após reabrir;
- [ ] usar dano, cura, condição, descanso e próximo turno;
- [ ] baixar backup, importar sem apagar e cancelar uma substituição;
- [ ] navegar offline depois de uma abertura online;
- [ ] receber uma atualização sem recarga automática no meio da ficha.

## Checklist manual — iPhone

- [ ] abrir o preview em Safari e confirmar que a barra da Netlify não aparece;
- [ ] seguir `Compartilhar → Adicionar à Tela de Início → Abrir como App`;
- [ ] confirmar nome `Semideuses RPG`, ícone e área segura superior/inferior;
- [ ] repetir criação, item, seções recolhíveis, anotação e combate;
- [ ] confirmar que o teclado não prende a rolagem;
- [ ] usar os fluxos internos de voltar sem fechar o app;
- [ ] baixar/compartilhar backup e cancelar uma substituição;
- [ ] reabrir o app e confirmar persistência.

## Checklist manual — Mestre

- [ ] cadastrar três heróis no Grupo da campanha, incluindo um somente com nome;
- [ ] adicionar o grupo inteiro à Mesa e completar inimigos pelo Bestiário;
- [ ] iniciar o encontro e confirmar ordem, turno compacto, PV, condições e Exaustão;
- [ ] encerrar e confirmar histórico e rascunhos narrativos;
- [ ] salvar, exportar e restaurar os dados do Mestre;
- [ ] confirmar que fichas de jogadores em outros aparelhos não são apresentadas como conectadas.

## Portão de produção

A versão só pode ir para `main` quando todos os testes automatizados, o Deploy Preview e os fluxos manuais de Android e iPhone estiverem aprovados. Qualquer falha de persistência, rolagem, histórico, importação ou navegação interna bloqueia a publicação.
