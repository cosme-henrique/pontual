"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  ColumnConfig,
  DataTable,
  Dialog,
  Form,
  Input,
  Label,
  Section,
  Select,
  Separator,
  Skeleton,
  Table,
  Textarea,
} from "@/shared/ui";

function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>;
}

type ExampleForm = {
  name: string;
  description: string;
  billable: boolean;
};

type TimeEntry = {
  task: string;
  project: string;
  date: string;
  hours: number;
};

const TIME_ENTRIES: TimeEntry[] = [
  { task: "Implementação do dashboard", project: "Pontual", date: "28/08/2026", hours: 3 },
  { task: "Criação dos componentes UI", project: "Pontual", date: "28/08/2026", hours: 2 },
  { task: "Configuração do banco de dados", project: "Pontual", date: "27/08/2026", hours: 1 },
  { task: "Reunião de planejamento", project: "Pontual", date: "27/08/2026", hours: 1 },
  { task: "Code review", project: "Pontual", date: "26/08/2026", hours: 2 },
];

const TIME_COLUMNS: ColumnConfig<TimeEntry>[] = [
  { key: "task", label: "Tarefa", sortable: true },
  { key: "project", label: "Projeto", sortable: true },
  { key: "date", label: "Data" },
  {
    key: "hours",
    label: "Horas",
    align: "right",
    sortable: true,
    render: (value) => `${value}h`,
  },
];

export default function PlaygroundPage() {
  const [search, setSearch] = useState("");
  const form = useForm<ExampleForm>({
    defaultValues: { name: "", description: "", billable: false },
  });

  const filteredEntries = TIME_ENTRIES.filter(
    (entry) =>
      entry.task.toLowerCase().includes(search.toLowerCase()) ||
      entry.project.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-12">
      <div>
        <h1 className="text-3xl font-bold text-zinc-700">Playground</h1>
        <p className="mt-1 text-zinc-500">Referência visual dos componentes primitivos.</p>
      </div>

      <Section title="Button">
        <Row>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </Row>
        <Row>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
        </Row>
      </Section>

      <Section title="Input">
        <Row>
          <Input placeholder="Padrão" className="max-w-xs" />
          <Input placeholder="Com erro" error className="max-w-xs" />
          <Input placeholder="Desabilitado" disabled className="max-w-xs" />
        </Row>
      </Section>

      <Section title="Textarea">
        <Row>
          <Textarea placeholder="Padrão" className="max-w-xs" />
          <Textarea placeholder="Com erro" error className="max-w-xs" />
        </Row>
      </Section>

      <Section title="Select">
        <Row>
          <Select
            aria-label="Padrão"
            className="max-w-xs"
            options={[{ value: "a", label: "Opção A" }, { value: "b", label: "Opção B" }]}
            placeholder="Selecione uma opção"
          />
          <Select
            aria-label="Com erro"
            error
            className="max-w-xs"
            options={[{ value: "a", label: "Opção A" }]}
            placeholder="Selecione uma opção"
          />
          <Select
            aria-label="Desabilitado"
            disabled
            className="max-w-xs"
            options={[]}
            placeholder="Desabilitado"
          />
        </Row>
      </Section>

      <Section title="Checkbox">
        <Row>
          <Checkbox aria-label="Padrão" />
          <Checkbox aria-label="Marcado" value={true} />
          <Checkbox aria-label="Com erro" error />
          <Checkbox aria-label="Desabilitado" disabled />
        </Row>
      </Section>

      <Section title="Label">
        <Row>
          <Label>Label padrão</Label>
          <Label error>Label com erro</Label>
        </Row>
      </Section>

      <Section title="Badge">
        <Row>
          <Badge variant="default">Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </Row>
      </Section>

      <Section title="Separator">
        <Separator />
        <Row>
          <span className="text-sm text-zinc-500">Esquerda</span>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm text-zinc-500">Direita</span>
        </Row>
      </Section>

      <Section title="Card">
        <Card.Root className="max-w-sm">
          <Card.Header>
            <Card.Title>Título do Card</Card.Title>
            <Card.Description>Descrição de apoio do card.</Card.Description>
          </Card.Header>
          <Card.Content>
            <p className="text-sm text-zinc-700">Conteúdo principal do card.</p>
          </Card.Content>
          <Card.Footer className="gap-2">
            <Button size="sm">Confirmar</Button>
            <Button size="sm" variant="outline">
              Cancelar
            </Button>
          </Card.Footer>
        </Card.Root>
      </Section>

      <Section title="Dialog">
        <Dialog.Root>
          <Dialog.Trigger>
            <Button variant="outline">Abrir dialog</Button>
          </Dialog.Trigger>
          <Dialog.Content aria-labelledby="playground-dialog-title">
            <Dialog.Header>
              <Dialog.Title id="playground-dialog-title">Título do Dialog</Dialog.Title>
            </Dialog.Header>
            <div className="px-6 py-4">
              <p className="text-sm text-zinc-700">Conteúdo principal do dialog.</p>
            </div>
            <Dialog.Footer>
              <Dialog.Close>
                <Button variant="outline" size="sm">Fechar</Button>
              </Dialog.Close>
              <Button variant="primary" size="sm">Confirmar</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      </Section>

      <Section title="Form">
        <Form.Root
          form={form}
          onSubmit={(data) => console.log(data)}
          className="flex max-w-sm flex-col gap-4"
        >
          <Form.Field name="name" label="Nome">
            <Input placeholder="Seu nome" />
          </Form.Field>
          <Form.Field name="description" label="Descrição">
            <Textarea placeholder="Descreva..." />
          </Form.Field>
          <Form.Field name="billable" label="Faturável">
            <Checkbox />
          </Form.Field>
          <Button type="submit">Enviar</Button>
        </Form.Root>
      </Section>

      <Section title="Skeleton">
        <div className="flex flex-wrap items-start gap-6">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-24 w-48 rounded-lg" />
        </div>
      </Section>

      <Section title="DataTable">
        <DataTable.Root
          data={filteredEntries}
          columns={TIME_COLUMNS}
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Buscar tarefa ou projeto..."
          totalCount={filteredEntries.length}
          page={1}
          pageSize={10}
        >
          <DataTable.Toolbar />
          <DataTable.Content />
          <DataTable.Pagination />
        </DataTable.Root>
      </Section>

      <Section title="Table">
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head>Tarefa</Table.Head>
              <Table.Head>Projeto</Table.Head>
              <Table.Head>Data</Table.Head>
              <Table.Head>Horas</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Implementação do dashboard</Table.Cell>
              <Table.Cell>Pontual</Table.Cell>
              <Table.Cell>28/08/2026</Table.Cell>
              <Table.Cell>3h</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Criação dos componentes UI</Table.Cell>
              <Table.Cell>Pontual</Table.Cell>
              <Table.Cell>28/08/2026</Table.Cell>
              <Table.Cell>2h</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Configuração do banco de dados</Table.Cell>
              <Table.Cell>Pontual</Table.Cell>
              <Table.Cell>27/08/2026</Table.Cell>
              <Table.Cell>1h</Table.Cell>
            </Table.Row>
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.Cell colSpan={3}>Total</Table.Cell>
              <Table.Cell>6h</Table.Cell>
            </Table.Row>
          </Table.Footer>
        </Table.Root>
      </Section>
    </main>
  );
}
