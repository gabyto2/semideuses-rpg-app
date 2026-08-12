# Banco oficial de regras — Semideuses RPG 3e

Este diretório contém regras separadas da interface do aplicativo.

## Estrutura inicial

- `core/system.json`: atributos, modificadores, proficiência, PV, MP, descansos e desbloqueios.
- `skills/ranks.json`: custos de MP, níveis mínimos e limites diários por Rank.
- `affiliations/index.json`: catálogo das 26 Filiações, com símbolo, domínio e perfil de jogo.

## Regra de manutenção

1. Dados extraídos do Livro do Jogador 3e ficam em JSON.
2. A interface não deve repetir regras que já existam neste banco.
3. Cada Filiação receberá um arquivo próprio com informações, progressão, habilidades e Caminhos.
4. Conteúdo ainda não conferido deve ser marcado como incompleto, nunca inventado.
5. Alterações futuras do livro devem mudar os dados, não a lógica da interface.
