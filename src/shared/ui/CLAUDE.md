# Primitivos UI — Regras de Criação

## 1. Arquivo único vs Compound

**Arquivo único** → sem estado/contexto compartilhado entre partes do componente.
**Compound** → sub-componentes precisam de contexto compartilhado para funcionar.

Arquivo único (`button/index.tsx`):
- Todo JSX e lógica de apresentação em um único arquivo.

Compound (`form/`):
- Cada sub-componente em sua própria pasta: `form-root/index.tsx`, `form-field/index.tsx`.
- `index.ts` raiz: **apenas exports como namespace**. Nunca JSX ou lógica.
- Hook de contexto compartilhado fica na raiz do compound (ex: `use-form-field.ts`).

Exemplo de export como namespace no `index.ts`:
```ts
import { FormRoot } from "./form-root";
import { FormField } from "./form-field";

export const Form = {
  Root: FormRoot,
  Field: FormField,
};
```

## 2. Variants com tailwind-variants

Sempre usar `tv()` para variantes e merging de `className`. Nunca concatenar classes manualmente com ternários.

```ts
const component = tv({
  base: "classes-base",
  variants: {
    variant: { primary: "...", secondary: "..." },
    size: { sm: "...", md: "..." },
  },
  defaultVariants: { variant: "primary", size: "md" },
});

type Props = React.HTMLAttributes<HTMLElement> & VariantProps<typeof component>;

export function Component({ variant, size, className, ...props }: Props) {
  return <el className={component({ variant, size, className })} {...props} />;
}
```

Regras obrigatórias:
- `className` sempre passado para o `tv()` call — permite override pelo consumidor.
- `VariantProps<typeof fn>` exportado junto com o componente.
- `defaultVariants` obrigatório quando há variantes.
- Para classes condicionais fora de `tv()`, usar `cn()` de `@/shared/lib/cn`.

## 3. Integração com react-hook-form (Form)

Todo campo de formulário usa `Form.Field`. Nunca registrar com `register()` nos componentes UI.

`Form.Root` recebe `form` (retorno de `useForm`) e `onSubmit`.
`Form.Field` recebe `name`, `label?` e o componente filho como único child.

`Form.Field` injeta automaticamente via `cloneElement`:
- `id`, `name`, `value`, `onChange`, `onBlur`, `ref` — wiring com react-hook-form
- `error: boolean` — para o componente aplicar estilo de erro
- `aria-invalid`, `aria-describedby` — acessibilidade

Para um componente ser compatível com `Form.Field`, ele deve:
- Aceitar `error?: boolean` e aplicar estilo diferenciado
- Aceitar `value` como prop controlada (string, boolean, number conforme o caso)
- Ter `onChange` compatível com o tipo do valor do campo

Checkbox segue padrão diferente: aceita `value: boolean` (mapeado para `checked`) e `onChange: (checked: boolean) => void`.

## 4. Refs — React 19

Não usar `forwardRef`. Passar `ref` como prop diretamente (suportado nativamente no React 19).

## 5. "use client"

Apenas componentes que usam hooks internamente recebem `"use client"` (ex: `FormRoot`, `FormField`).
Componentes puramente presentacionais (Button, Input, Label, Badge etc.) **não** recebem `"use client"`.
O limite de client é definido pela feature/página que os consome.

## 6. Acessibilidade (WCAG 2.0 AA — obrigatório)

Todo componente primitivo deve atender aos critérios abaixo antes de ser considerado pronto.

### Contraste de cores
- Texto normal: mínimo **4.5:1** contra o fundo
- Texto grande (≥ 18px regular ou ≥ 14px bold): mínimo **3:1**
- Nunca usar `red-500` (#fb2c36) em texto ou fundo interativo — contraste com branco é 3.8:1, abaixo do mínimo
- Estado de erro: usar `red-600` ou mais escuro
- Estado destrutivo: usar `red-600` como base, `red-700` no hover

### Inputs e controles interativos
- Todo `<input>`, `<textarea>`, `<select>` e `<input type="checkbox">` deve ter label associado
  - Via `<label htmlFor={id}>` (preferencial dentro de `Form.Field`)
  - Via `aria-label` quando o label visual não existe (ex: uso avulso no playground)
  - Via `aria-labelledby` quando o label é um elemento externo
- Nunca renderizar um controle de formulário sem ao menos um dos três acima

### Estados e feedback
- Campos com erro: `aria-invalid="true"` + `aria-describedby` apontando para a mensagem de erro
- Mensagem de erro: `role="alert"` para leitores de tela captarem automaticamente
- Estes atributos são injetados automaticamente pelo `Form.Field` — não duplicar manualmente

### Foco visível
- Todo elemento interativo deve ter `focus-visible:ring-2` ou equivalente
- Nunca remover `outline` sem substituir por indicador de foco visível

### Semântica
- Usar elementos HTML nativos sempre que possível (`<button>`, `<input>`, `<label>`)
- Elementos não-interativos clicáveis (div, span) são proibidos — usar `<button>` com estilo `appearance-none`

## 7. Proibições

- Lógica de negócio em componentes UI
- Concatenação manual de classes com ternários — usar `tv()` ou `cn()`
- `forwardRef` (React 19 — obsoleto)
- Compound component sem contexto compartilhado real
- JSX ou lógica no `index.ts` raiz de compounds
- `"use client"` em componentes puramente presentacionais
- Componente de input/checkbox sem label associado
- Cor de erro/destrutivo com contraste inferior a 4.5:1
