import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ComponentAction } from "../../types";

interface Props {
    actions: ComponentAction[];
}

const ActionMenu = ({ actions }: Props) => {
    const { defaultActions, dividerActions } = useMemo(() => {
        return actions.reduce(
            (acc, action) => {
                if (action.variant === "divider") {
                    acc.dividerActions.push(action);
                } else {
                    acc.defaultActions.push(action);
                }
                return acc;
            },
            {
                defaultActions: [] as ComponentAction[],
                dividerActions: [] as ComponentAction[],
            }
        );
    }, [actions]);

    const renderItem = (action: ComponentAction) => {
        const content = (
            <DropdownMenuItem
                key={action.id}
                disabled={action.disabled}
                onClick={(e) => {
                    e.stopPropagation();
                    action.onClick?.(e);
                }}
                className="cursor-pointer gap-2"
            >
                {action.icon && <span className="flex h-5 w-5 shrink-0 items-center">{action.icon}</span>}
                <span>{action.label}</span>
            </DropdownMenuItem>
        );

        if (action.href) {
            return (
                <Link
                    key={action.id}
                    to={action.href}
                    reloadDocument
                    onClick={(e) => e.stopPropagation()}
                    className="no-underline"
                >
                    {content}
                </Link>
            );
        }

        return content;
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors focus-visible:outline-none"
            >
                <MoreHorizontal size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {defaultActions.map(renderItem)}
                {dividerActions.length > 0 && <DropdownMenuSeparator />}
                {dividerActions.map(renderItem)}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ActionMenu;
