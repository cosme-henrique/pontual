import { DialogRoot } from "./dialog-root";
import { DialogTrigger } from "./dialog-trigger";
import { DialogContent } from "./dialog-content";
import { DialogHeader } from "./dialog-header";
import { DialogTitle } from "./dialog-title";
import { DialogFooter } from "./dialog-footer";
import { DialogClose } from "./dialog-close";

export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Content: DialogContent,
  Header: DialogHeader,
  Title: DialogTitle,
  Footer: DialogFooter,
  Close: DialogClose,
};

export { useDialog } from "./use-dialog";
