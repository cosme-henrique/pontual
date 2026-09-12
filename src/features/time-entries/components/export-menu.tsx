import { FileSpreadsheet, FileText } from "lucide-react";
import { buttonVariants } from "@/shared/ui";

type ExportMenuProps = {
  month: string;
};

export function ExportMenu({ month }: ExportMenuProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <a
        href={`/api/time-entries/export?month=${month}&format=xlsx`}
        className={buttonVariants({ variant: "outline" })}
      >
        <FileSpreadsheet size={16} aria-hidden="true" />
        Exportar Planilha
      </a>
      <a
        href={`/api/time-entries/export?month=${month}&format=pdf`}
        className={buttonVariants({ variant: "outline" })}
      >
        <FileText size={16} aria-hidden="true" />
        Exportar PDF
      </a>
    </div>
  );
}
