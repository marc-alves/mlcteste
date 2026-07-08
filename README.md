# MLC Controle

Protótipo de aplicativo mobile-first para **registro e fiscalização de serviços de terceiros em obra** (gesso, pintura, etc). Construído em React + TypeScript + Vite, com estado 100% em memória (sem backend) — pensado como prova de conceito navegável para validar o fluxo com o cliente antes de evoluir para uma versão com persistência real.

> ⚠️ Versão de teste: todos os dados, nomes e fotos são fictícios (ver banner exibido na tela inicial do app).

## Visão geral

O app simula uma obra com dois perfis de uso, escolhidos na tela inicial:

- **Terceiro** (pedreiro, gesseiro, pintor...): registra um serviço executado em um apartamento, anexando fotos de "pontos de verificação" pré-definidos para o tipo de serviço.
- **Fiscal** (arquiteto/engenheiro): navega pelas empresas prestadoras, revisa os lançamentos feitos pelos terceiros, e marca cada um como **conferido** ou com **pendência**, deixando uma nota.

Cada lançamento guarda um histórico de eventos (quem criou, quem subiu novas fotos, quem conferiu, etc.), exibido como uma timeline na tela de detalhe do fiscal.

## Stack técnica

- **React 18** + **TypeScript** (strict mode)
- **Vite 5** como bundler/dev server (`@vitejs/plugin-react`)
- Sem roteador de URL: a navegação é controlada por uma máquina de estados simples (`Screen`) dentro de `App.tsx`
- Sem backend/API: todo o estado (lançamentos, limpezas, formulário em andamento, tema) vive em `useState` no componente raiz
- CSS puro (`src/index.css`), com suporte a modo claro/escuro via classe `dark` no `<body>`
- Fontes carregadas via Google Fonts no `index.html` (IBM Plex Sans/Mono, Inter)
- Layout em formato de "moldura de celular" (`#phone` / `#content`), simulando um app mobile dentro do navegador desktop

## Como rodar

```bash
npm install
npm run dev       # inicia o servidor de desenvolvimento (Vite)
```

Outros scripts disponíveis (`package.json`):

```bash
npm run build      # type-check (tsc -b) + build de produção via Vite
npm run preview    # serve o build de produção localmente
```

## Estrutura do projeto

```
index.html                 Shell HTML, fontes, ponto de montagem #root
src/
  main.tsx                 Bootstrap do React (StrictMode + CSS global)
  App.tsx                  Componente raiz: estado global e roteamento por telas
  Topbar.tsx                Barra superior (voltar, título da tela, toggle de tema)
  icons.tsx                 Ícones SVG inline usados pela UI
  images.ts                 URLs de imagens de referência (mock) + mapa de imagens por bloco
  types.ts                  Tipos de navegação (Screen), fluxo de "voltar", labels de tela
  data.ts                   Modelo de dados de domínio + dados semente (empresas, serviços, lançamentos, feed mock)
  index.css                 Todo o CSS da aplicação (tema claro/escuro, componentes)
  screens/
    Home.tsx                Tela inicial de seleção de perfil (Terceiro vs Fiscal)
    Terceiro.tsx             Todas as telas do fluxo do terceiro, ver abaixo
    Fiscal.tsx               Telas do fluxo do fiscal (área do arquiteto, lista e detalhe de lançamentos), ver abaixo
    Limpeza.tsx              Painel do módulo de gestão de limpeza, acessado a partir da área do arquiteto
```

## Modelo de dados (`src/data.ts`)

- **`Empresa`**: empresa prestadora de serviço (ex.: "Melhor Gesso", "Pintura Total"), cada uma com uma cor/imagem e um dicionário de `Servico`.
- **`Servico`**: tipo de serviço (ex.: "Gesso — Teto") com uma lista de nomes de "pontos de verificação" que precisam de foto.
- **`Lancamento`**: um registro de serviço executado — empresa, serviço, bloco/apto, terceiro responsável, lista de `Ponto` (nome + foto opcional), observação, `status` (`pendente` | `conferido` | `pendencia`), nota da fiscalização e histórico de `Evento`.
- **`Evento`**: entrada de auditoria (`autor`, `acao`, `data`) criada via `criarEvento()` sempre que algo relevante acontece com um lançamento.
- **`LANCAMENTOS_INICIAIS`**: 5 lançamentos de exemplo (gesso e pintura, diferentes status) usados como estado inicial do app.
- **`FEED_MOCK`**: lançamentos fictícios de "colegas de equipe" mostrados ao terceiro no bloco "Equipe" da tela `terceiro-home` — não afeta o estado real, é só contexto visual.
- **`RESUMO_MENSAL`**: painel consolidado do mês exibido no topo da tela `fiscal-empresas`, com um seletor de mês — cada chave (ex.: `"2026-07"`) tem seus próprios KPIs (`ResumoMes`: total de lançamentos, conferidos, aguardando, com pendência, pendências antigas) e progresso por etapa construtiva (`ProgressoEtapa[]`: tetos, sancas, rebaixamentos, pinturas), todos mockados.
- **`EMPRESAS_VALIDADAS`**: empresas cujo registro do mês já foi validado manualmente fora do app (ex.: esquadrias, metais, marcenaria) — aparecem bloqueadas (ícone de cadeado) na tela `fiscal-empresas`, com um modal para solicitar alteração ao engenheiro responsável em vez do fluxo normal de conferência.

Duas empresas estão modeladas hoje: **Melhor Gesso** (teto, sanca, rebaixamento) e **Pintura Total** (geral, cozinha, sala, quarto).

### Módulo de limpeza (`src/data.ts` + `src/screens/Limpeza.tsx`)

Módulo à parte para o arquiteto/engenheiro acompanhar e atualizar a limpeza dos apartamentos (não existe perfil de "Gestão" no app — quem escala funcionárias, marca presença ou redistribui está fora do escopo atual):

- **`Limpeza`**: um registro de limpeza — bloco/apto, tipo (`grossa` | `fina`), funcionária responsável, data, dia da semana e período (`manha` | `tarde`) calculados/atribuídos automaticamente, `status` (`StatusLimpeza`) e, opcionalmente, quando a colaboradora confirmou a retirada do material (`retiradoEm`) e se está `pendenteRedistribuicao` (funcionária escalada ausente, sem responsável confirmado).
- **`StatusLimpeza`**: `a_solicitar` (falta o arquiteto solicitar ao almoxarifado — estado neutro, não é alerta, ainda dá tempo no dia) → `solicitado` (aguardando a colaboradora retirar por conta própria — sem confirmação, não dá pra saber se ela já foi) → `em_andamento` (ela já retirou e está executando a limpeza) → `retirado` (limpeza retirada/concluída). A retirada é um autorrelato dela: não existe um "retiradoPor" separado.
- **`TIPOS_LIMPEZA`** / **`TEMPLATES_MATERIAIS`**: nome de exibição e lista fixa de materiais por tipo de limpeza (grossa: vassoura, sacos de entulho, espátula, pano e balde, desincrustante; fina: detergente neutro, água sanitária, álcool 70%, limpa-vidros, multiuso, pano de microfibra, esponja, luvas).
- **`FUNCIONARIAS_LIMPEZA`**: lista de nomes usada nos filtros e no vínculo de cada limpeza.
- **`LIMPEZAS_INICIAIS`**: registros de exemplo cobrindo os quatro status (incluindo um marcado como pendente de redistribuição), usados como estado inicial em `App.tsx`.

Na tela `fiscal-limpeza` (acessada pelo card "Gerenciar limpeza" na área do arquiteto), o arquiteto filtra por tipo/funcionária/apartamento e abre `fiscal-limpeza-detalhe` para ver o checklist de retirada (timeline), os materiais do template daquele tipo de limpeza, e um seletor de status ("Atualizar status") pra corrigir o andamento manualmente — útil justamente porque a retirada é autorrelatada e pode não ter sido confirmada a tempo. Mudar o status ajusta `retiradoEm` automaticamente (`updateStatusLimpeza` em `App.tsx`). Um tour rápido opcional (3 passos, modal) explica o fluxo na primeira visita.

## Fluxos de tela

O roteamento é controlado por um único estado `Screen` em `App.tsx`, com um mapa `BACK_FLOW` (`src/types.ts`) definindo para onde o botão "voltar" da `Topbar` deve levar em cada tela.

### Fluxo do Terceiro (`src/screens/Terceiro.tsx`)

1. `terceiro-nome` — informa o nome
2. `terceiro-empresa` — escolhe a empresa prestadora
3. `terceiro-home` ("Início") — dividida em **Você** (seus lançamentos anteriores nessa empresa, com status, e um KPI de quantos já foram validados) e **Equipe** (barra de progresso da meta mensal de cômodos da empresa e feed de atividade recente dos colegas); toca num lançamento próprio pra abrir `terceiro-registro`
4. `terceiro-registro` — detalhe somente-leitura de um lançamento já enviado por você (fotos por ponto, sua observação e o status de validação do arquiteto)
5. `terceiro-local` — informa bloco e apartamento (exibe imagem de referência do bloco, se houver)
6. `terceiro-servico` — escolhe o tipo de serviço prestado
7. `terceiro-pontos` — anexa uma foto para cada ponto de verificação do serviço + observação opcional
8. `terceiro-revisao` — tela de revisão final antes de enviar (alerta se algum ponto ficou sem foto)
9. `terceiro-sucesso` — confirmação de envio, com opção de novo lançamento (volta pra `terceiro-home`) ou voltar ao início

Ao enviar (`enviarLancamento` em `App.tsx`), o app verifica se já existe um lançamento igual (mesmo bloco/apto/serviço/empresa) para decidir se o evento registrado é "criou o lançamento" ou "subiu novas fotos", e adiciona o novo `Lancamento` no topo da lista.

### Fluxo do Fiscal (`src/screens/Fiscal.tsx`)

1. `fiscal-nome` — informa o nome (associado às conferências que fizer)
2. `fiscal-empresas` ("Área do arquiteto") — dividida em duas seções visualmente separadas: **Dados** (resumo mensal com seletor de mês de `RESUMO_MENSAL`, KPIs, alerta de pendências antigas e progresso por etapa) e **Serviços** (lista de empresas com contagem de lançamentos/pendentes, mais uma lista de empresas já validadas de `EMPRESAS_VALIDADAS`, bloqueadas para conferência, com modal de "solicitar alteração" ao engenheiro responsável)
3. `fiscal-lista` — lista de lançamentos da empresa escolhida, com filtro por status (todos/verificar/conferido/com impedimento)
4. `fiscal-detalhe` — detalhe completo do lançamento: fotos por ponto, observação do terceiro, alerta contextual (ex.: dica sobre pendências de pintura), timeline de eventos, histórico de lançamentos anteriores do mesmo serviço/local, e ações de conferência (marcar conferido / registrar pendência / reabrir conferência)
5. `fiscal-limpeza` / `fiscal-limpeza-detalhe` (`src/screens/Limpeza.tsx`) — painel do módulo de limpeza, acessado pelo card "Gerenciar limpeza" na área do arquiteto; ver seção do módulo de limpeza acima

Ações do fiscal (`updateLancamento` em `App.tsx`) atualizam o `status`, a `notaFiscal` e anexam um novo `Evento` ao histórico do lançamento.

## Tema claro/escuro

`App.tsx` mantém um estado `darkMode` e aplica a classe `dark` no `<body>`; todo o estilo correspondente está em `src/index.css` usando variáveis CSS. O botão de alternância fica na `Topbar`.

## Imagens (`src/images.ts`)

Todas as imagens usadas hoje são **URLs externas de referência/mock** (fotos de bancos de imagem/redes, não fotos reais de obra), usadas apenas para dar contexto visual ao protótipo. Em uma versão real, essas imagens viriam do upload feito pelo terceiro (hoje simulado via `URL.createObjectURL` no input de arquivo da tela `terceiro-pontos`).

## Limitações conhecidas (protótipo)

- Não há persistência: recarregar a página reseta todo o estado para `LANCAMENTOS_INICIAIS`.
- Não há autenticação real: o "nome" informado em cada fluxo é apenas texto livre, sem validação de identidade.
- Fotos anexadas pelo terceiro usam `URL.createObjectURL`, válidas apenas durante a sessão do navegador.
- Sem testes automatizados configurados no projeto até o momento.
