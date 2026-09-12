# Pontual — Regras do Projeto

## Arquitetura de features

Componentes de domínio vivem em `src/features/<feature>/components/`, nunca dentro de `src/app/`.

```
src/
  app/<route>/
    page.tsx           ← roteamento e composição apenas
  features/<feature>/
    components/        ← componentes da feature
    hooks/             ← hooks da feature
    services/          ← lógica de negócio
```

## Nomenclatura — sem abreviações

Nomes de variáveis, parâmetros e funções devem ser semânticos e legíveis. Abreviações de uma letra são proibidas.

Exemplos obrigatórios:
- Callbacks de array: `(entry) =>`, `(project) =>`, `(row) =>` — nunca `(e) =>`, `(p) =>`, `(r) =>`
- Handlers de evento: `(event) =>` — nunca `(e) =>`
- Acumuladores de reduce: `(sum, entry) =>` — nunca `(acc, e) =>`
- Queries de busca: `query` ou `searchQuery` — nunca `q`

Regra: ao bater o olho no código daqui a 6 meses, o nome deve deixar óbvio o que é — sem precisar rastrear o contexto.

## Server vs Client Components (Next.js App Router)

**Regra inegociável: nunca marcar uma página inteira como `"use client"`.**

A página (`page.tsx`) deve sempre ser um Server Component. O `"use client"` deve ser empurrado para os componentes filhos menores que realmente precisam de interatividade — o padrão "push client to the leaves".

Quando um componente precisa de `"use client"`:
- Extrai para `src/features/<feature>/components/<nome>.tsx`
- A página importa e compõe — nunca contém lógica de UI interativa

Componentes que precisam de `"use client"`:
- Qualquer componente com `useState`, `useEffect`, `useReducer`
- Qualquer componente com event handlers (`onClick`, `onChange`, etc.)
- Qualquer componente que usa `useSearchParams`, `useRouter`, `usePathname`
- Qualquer componente que usa Context com estado

Componentes que NÃO precisam de `"use client"`:
- Componentes puramente presentacionais (só recebem props e renderizam)
- Componentes que só leem dados e não têm interatividade

## Estado de busca e filtros

Preferir URL Search Params (`?search=...&page=2`) a `useState` local para estados de busca/filtro/paginação.

Motivos:
- Persiste no refresh
- Funciona com o botão voltar do browser
- URL compartilhável com o estado aplicado
- Permite filtrar no servidor (BFF) sem mudar a interface

Padrão:
- `page.tsx` lê `searchParams` como prop (server-side)
- Client Component usa `useSearchParams` + `router.replace` para atualizar a URL

## Git — branches

Toda feature nova nasce de uma branch própria, criada a partir da `dev` (nunca direto da `main`).

Padrão de nome: `feat/nome_da_feature`

```
git checkout dev
git pull origin dev
git checkout -b feat/nome_da_feature
```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
