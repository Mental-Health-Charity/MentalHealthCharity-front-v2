import { Badge } from "@/components/ui/badge";
import { Pause, Play, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ActionMenu from "../../../shared/components/ActionMenu";
import { ArticleCategory } from "../../types";

interface Props {
    category: ArticleCategory;
    onDelete: (id: number) => void;
    onEdit: (newCategory: ArticleCategory) => void;
    onToggleActive: (id: number) => void;
}

const CategoryItem = ({ category, onDelete, onEdit, onToggleActive }: Props) => {
    const { t } = useTranslation();
    const [isEditMode, setIsEditMode] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const toggleEditMode = () => {
        setIsEditMode((prev) => !prev);

        if (isEditMode && inputRef.current) {
            onEdit({
                ...category,
                name: inputRef.current.value,
            });
        }
    };

    return (
        <div className="border-border-brand flex w-full items-center justify-between rounded-[5px] border-2 p-2.5 px-5">
            {isEditMode ? (
                <input
                    ref={inputRef}
                    defaultValue={category.name}
                    className="border-border-brand focus:border-primary-brand rounded border bg-transparent px-2 py-1 text-sm outline-none"
                />
            ) : (
                <span className="text-text-body">{category.name}</span>
            )}
            <div className="flex items-center gap-1">
                <button className="hidden" onClick={toggleEditMode}>
                    {isEditMode ? "Save" : "Edit"}
                </button>
                <Badge className={category.is_active ? "bg-success-brand text-white" : "bg-danger-brand text-white"}>
                    {category.is_active ? t("common.active") : t("common.inactive")}
                </Badge>
                <ActionMenu
                    actions={[
                        {
                            id: "delete",
                            label: t("common.remove"),
                            icon: <Trash2 className="size-4" />,
                            onClick: () => onDelete(category.id),
                        },
                        {
                            id: "toggle",
                            icon: category.is_active ? <Pause className="size-4" /> : <Play className="size-4" />,
                            label: category.is_active ? t("common.disable") : t("common.enable"),
                            onClick: () => onToggleActive(category.id),
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export default CategoryItem;
