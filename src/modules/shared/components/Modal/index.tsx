import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import CloseButton from "../CloseButton";

interface Props {
    open: boolean;
    onClose: (event?: React.MouseEvent | React.KeyboardEvent | Event, reason?: string) => void;
    title: string;
    children?: React.ReactNode;
    className?: string;
    contentClassName?: string;
}

const Modal = ({ open, onClose, title, children, className, contentClassName }: Props) => {
    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent
                className={cn("max-h-[90vh] overflow-y-auto sm:max-w-lg", className)}
                showCloseButton={false}
            >
                <DialogHeader className="flex flex-row items-center justify-between gap-2.5">
                    <DialogTitle className="text-foreground text-2xl font-bold">{title}</DialogTitle>
                    <CloseButton onClick={() => onClose()} />
                </DialogHeader>
                <div className={cn(contentClassName)}>{children}</div>
            </DialogContent>
        </Dialog>
    );
};

export default Modal;
