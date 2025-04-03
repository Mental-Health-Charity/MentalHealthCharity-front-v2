import { Box, Button, Typography } from "@mui/material";
import {
    CellChange,
    CellLocation,
    Column,
    Id,
    MenuOption,
    ReactGrid,
    Row,
    SelectionMode,
    TextCell,
} from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import { useMutation } from "@tanstack/react-query";
import { t } from "i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Modal from "../../../shared/components/Modal";
import { Pagination } from "../../../shared/types";
import { translatedRoles } from "../../../users/constants";
import acceptFormMutation from "../../queries/acceptFormMutation";
import rejectFormMutation from "../../queries/rejectFormMutation";
import updateFormNoteMutation from "../../queries/updateFormNoteMutation";
import { FormNote, formNoteFields, FormResponse, MenteeForm, VolunteerForm } from "../../types";
import FormTableItem from "../FormTableItem";

interface Props {
    data: Pagination<FormResponse<MenteeForm | VolunteerForm>>;
    renderStepAddnotation: (step: number) => string;
    onRefetch?: () => void;
    formNoteKeys: formNoteFields[];
}

const FormsTable = ({ data, renderStepAddnotation, onRefetch, formNoteKeys }: Props) => {
    const forms = useMemo(() => data?.items ?? [], [data]);
    const [showForm, setShowForm] = useState<FormResponse<VolunteerForm | MenteeForm> | null>(null);
    const [showManageModal, setShowManageModal] = useState<FormResponse<VolunteerForm | MenteeForm> | null>(null);

    const initializeNotes = useCallback(() => {
        return forms.reduce((acc, form) => {
            const formNotes = formNoteKeys.reduce((noteAcc, key) => {
                if (noteAcc) {
                    noteAcc[key] = form.notes?.[key] || "";
                }
                return noteAcc;
            }, {} as FormNote);
            return { ...acc, [form.id]: formNotes };
        }, {});
    }, [forms, formNoteKeys]);

    const [notes, setNotes] = useState<{ [key: number]: FormNote }>(initializeNotes());

    useEffect(() => {
        setNotes(initializeNotes());
    }, [data]);

    const { mutate: updateNote } = useMutation({
        mutationFn: updateFormNoteMutation,
        onSuccess: () => {
            toast.success(t("common.success"));
        },
    });

    const { mutate: acceptForm } = useMutation({
        mutationFn: acceptFormMutation,
        onSuccess: () => {
            onRefetch && onRefetch();
            toast.success(t("common.success"));
            setShowManageModal(null);
        },
    });

    const { mutate: rejectForm } = useMutation({
        mutationFn: rejectFormMutation,
        onSuccess: () => {
            onRefetch && onRefetch();
            toast.success(t("common.success"));
            setShowManageModal(null);
        },
    });

    const handleCellsChanged = useCallback(
        (changes: CellChange[]) => {
            changes.forEach((change) => {
                const rowIndex = parseInt((change.rowId as string).split("-")[1], 10);
                const form = forms[rowIndex];
                if (!form) return;

                if (formNoteKeys.includes(change.columnId as formNoteFields)) {
                    const newValue = (change.newCell as TextCell).text;

                    setNotes((prev) => {
                        const newNoteForForm = { ...prev[form.id], [change.columnId]: newValue };
                        return { ...prev, [form.id]: newNoteForForm };
                    });

                    updateNote({ id: form.id, notes: { ...notes[form.id], [change.columnId]: newValue } });
                }
            });
        },
        [forms, formNoteKeys, updateNote]
    );

    const [columns, setColumns] = useState<Column[]>([
        { columnId: "name", width: 200, resizable: true, reorderable: true },
        { columnId: "email", width: 220, resizable: true, reorderable: true },
        { columnId: "role", width: 110, resizable: true, reorderable: true },
        { columnId: "date", width: 110, resizable: true, reorderable: true },
        { columnId: "progress", width: 340, resizable: true, reorderable: true },
        ...formNoteKeys.map(
            (key) =>
                ({
                    columnId: key,
                    width: key.length * 13 > 100 ? key.length * 13 : 200,
                    resizable: true,
                    reorderable: true,
                }) as Column
        ),
        { columnId: "actions", width: 120, resizable: true, reorderable: true },
    ]);

    const headerRow: Row<TextCell> = {
        rowId: "header",
        reorderable: true,
        resizable: true,
        cells: [
            { type: "text", text: t("forms_fields.name"), nonEditable: true, className: "header" },
            { type: "text", text: t("forms_fields.email"), nonEditable: true, className: "header" },
            { type: "text", text: t("forms_fields.role"), nonEditable: true, className: "header" },
            { type: "text", text: t("forms_fields.creation_date"), nonEditable: true, className: "header" },
            { type: "text", text: t("forms_fields.progress"), nonEditable: true, className: "header" },
            ...(formNoteKeys.map(
                (key) =>
                    ({
                        type: "text",
                        text: t(`forms_fields.${key}`),
                        nonEditable: true,
                        className: "header",
                    }) as TextCell
            ) ?? []),
            { type: "text", text: t("forms_fields.actions"), nonEditable: true, className: "header" },
        ],
    };

    const simpleHandleContextMenu = (
        _selectedRowIds: Id[],
        _selectedColIds: Id[],
        _selectionMode: SelectionMode,
        menuOptions: MenuOption[],
        _selectedRanges: CellLocation[][]
    ): MenuOption[] => {
        return menuOptions.filter((option) => option.id === "copy");
    };

    const getRows = (forms: FormResponse<VolunteerForm | MenteeForm>[]): Row[] => [
        headerRow,
        ...forms.map<Row>((form, idx) => ({
            rowId: `row-${idx}`,
            cells: [
                {
                    type: "text",
                    text: form.created_by.full_name || (t("forms_fields.unknown_name") as string),
                    nonEditable: true,
                },
                { type: "text", text: form.created_by.email, nonEditable: true },
                { type: "text", text: translatedRoles[form.created_by.user_role], nonEditable: true },
                { type: "date", date: new Date(form.creation_date), nonEditable: true },
                {
                    type: "text",
                    text: `${renderStepAddnotation(form.current_step)} (${form.current_step}/${form.form_type.max_step})`,
                    nonEditable: true,
                    renderer: (props) =>
                        form.current_step === 1 ? (
                            <Button onClick={() => setShowForm(form)} sx={{ padding: 0 }}>
                                {props}
                            </Button>
                        ) : (
                            props
                        ),
                },

                ...formNoteKeys.map(
                    (key) =>
                        ({
                            type: "text",
                            text: notes[form.id]?.[key] || "",

                            editable: true,
                        }) as TextCell
                ),
                {
                    type: "text",
                    text: "",
                    nonEditable: true,
                    renderer: () => (
                        <Button
                            style={{
                                fontSize: "16px",
                                color: "white",
                            }}
                            variant="contained"
                            color="secondary"
                            onClick={() => setShowManageModal(form)}
                        >
                            {t("forms_fields.manage")}
                        </Button>
                    ),
                },
            ],
        })),
    ];

    const rows = useMemo(() => getRows(forms), [forms, notes]);

    const handleColumnResize = (columnId: string | number, newWidth: number) => {
        setColumns((prevColumns) =>
            prevColumns.map((col) => (col.columnId === columnId ? { ...col, width: newWidth } : col))
        );
    };

    return (
        <div style={{ width: "100%" }}>
            <ReactGrid
                onContextMenu={simpleHandleContextMenu}
                rows={rows}
                columns={columns}
                onColumnResized={handleColumnResize}
                onCellsChanged={handleCellsChanged}
            />
            <Modal title={t("common.preview")} open={!!showForm} onClose={() => setShowForm(null)}>
                <Box sx={{ maxWidth: "900px", display: "flex", justifyContent: "center" }}>
                    <FormTableItem form={showForm!} />
                </Box>
            </Modal>
            {showManageModal && (
                <Modal
                    title={t("form.manage_forms_title")}
                    open={!!showManageModal}
                    onClose={() => setShowManageModal(null)}
                >
                    <Box
                        sx={{
                            maxWidth: "900px",
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                        }}
                    >
                        <Typography fontSize={20}>
                            {t("form.manage_forms_subtitle", {
                                step: renderStepAddnotation(showManageModal.current_step + 1),
                            })}
                        </Typography>
                        <Box marginTop={2} display="flex" gap={2}>
                            <Button onClick={() => acceptForm(showManageModal)} variant="contained">
                                {t("form.next_step")}
                            </Button>
                            <Button onClick={() => rejectForm(showManageModal)} variant="outlined" color="primary">
                                {t("form.reject")}
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            )}
        </div>
    );
};

export default FormsTable;
