import {
    Box,
    Chip,
    IconButton,
    ListItem,
    ListItemText,
    TextField,
} from "@mui/material";
import { ArticleCategory } from "../../types";
import useTheme from "../../../../theme";
import { useTranslation } from "react-i18next";
import ActionMenu from "../../../shared/components/ActionMenu";
import EditIcon from "@mui/icons-material/Edit";
import { useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

interface Props {
    category: ArticleCategory;
    onDelete: (id: number) => void;
    onEdit: (newCategory: ArticleCategory) => void;
    onToggleActive: (id: number) => void;
}

const CategoryItem = ({
    category,
    onDelete,
    onEdit,
    onToggleActive,
}: Props) => {
    const theme = useTheme();
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
        <ListItem
            sx={{
                padding: "10px 20px",
                border: `2px solid ${theme.palette.colors.border}`,
                borderRadius: "5px",
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            {isEditMode ? (
                <TextField ref={inputRef} value={category.name} />
            ) : (
                <ListItemText>{category.name}</ListItemText>
            )}
            <Box>
                {/* <IconButton>
                    <EditIcon onClick={toggleEditMode} />
                </IconButton> */}
                <Chip
                    sx={{
                        backgroundColor: category.is_active
                            ? theme.palette.colors.success
                            : theme.palette.colors.danger,
                        color: theme.palette.common.white,
                    }}
                    label={
                        category.is_active
                            ? t("common.active")
                            : t("common.inactive")
                    }
                />
                <ActionMenu
                    actions={[
                        {
                            id: "delete",
                            label: t("common.remove"),
                            icon: <DeleteIcon />,
                            onClick: () => onDelete(category.id),
                        },
                        {
                            id: "toggle",
                            icon: category.is_active ? (
                                <PauseIcon />
                            ) : (
                                <PlayArrowIcon />
                            ),
                            label: category.is_active
                                ? t("common.disable")
                                : t("common.enable"),
                            onClick: () => onToggleActive(category.id),
                        },
                    ]}
                />
            </Box>
        </ListItem>
    );
};

export default CategoryItem;
