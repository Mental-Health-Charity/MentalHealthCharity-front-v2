import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, ChevronRight, FileText, MessageSquareText, Search, Settings } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { ChatSortByOptions } from "../../../chat/constants";
import editNoteMutation from "../../../chat/queries/editNoteMutation";
import getChatsMutation from "../../../chat/queries/getChatsMutation";
import { Chat } from "../../../chat/types";
import Modal from "../../../shared/components/Modal";
import useDebounce from "../../../shared/hooks/useDebounce";
import { translatedRoles } from "../../../users/constants";
import acceptFormMutation from "../../queries/acceptFormMutation";
import rejectFormMutation from "../../queries/rejectFormMutation";
import updateFormNoteMutation from "../../queries/updateFormNoteMutation";
import { FormNote, formNoteFields, FormResponse, MenteeForm, VolunteerForm } from "../../types";
import FormTableItem from "../FormTableItem";

type ManagerTab = "application" | "transfer" | "manage";
type TransferStep = 1 | 2 | 3;

interface TransferField {
    key: string;
    label: string;
    previewValue: string;
    fullValue: string;
}

interface Props {
    open: boolean;
    form: FormResponse<MenteeForm | VolunteerForm> | null;
    onClose: () => void;
    renderStepAddnotation: (step: number) => string;
    onRefetch?: () => void | Promise<unknown>;
    formNoteKeys: formNoteFields[];
}

const MAX_FIELD_PREVIEW_LENGTH = 400;

const normalizeAndLimitText = (value: string, maxLength = MAX_FIELD_PREVIEW_LENGTH) => {
    const normalized = value.replace(/\s+/g, " ").trim();

    if (normalized.length <= maxLength) {
        return normalized || "-";
    }

    return `${normalized.slice(0, maxLength)}...`;
};

const stringifyFieldValue = (value: unknown, t: (key: string, options?: Record<string, unknown>) => string): string => {
    if (value === null || value === undefined) {
        return "-";
    }

    if (typeof value === "string") {
        return value;
    }

    if (typeof value === "number") {
        return String(value);
    }

    if (typeof value === "boolean") {
        return value ? t("common.yes", { defaultValue: "Yes" }) : t("common.no", { defaultValue: "No" });
    }

    if (Array.isArray(value)) {
        if (value.length === 0) {
            return "-";
        }

        return value
            .map((item) => {
                if (typeof item === "string") {
                    return item;
                }

                if (item && typeof item === "object" && "name" in item) {
                    return String((item as { name: string }).name);
                }

                return JSON.stringify(item);
            })
            .join(", ");
    }

    if (typeof value === "object") {
        if ("name" in value) {
            return String((value as { name: string }).name);
        }

        return JSON.stringify(value);
    }

    return String(value);
};

const RecruitmentManagerModal = ({ open, form, onClose, renderStepAddnotation, onRefetch, formNoteKeys }: Props) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<ManagerTab>("application");
    const [transferStep, setTransferStep] = useState<TransferStep>(1);
    const [chatQuery, setChatQuery] = useState("");
    const [chatResults, setChatResults] = useState<Chat[]>([]);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [selectedFieldKeys, setSelectedFieldKeys] = useState<string[]>([]);
    const [recruitmentNotes, setRecruitmentNotes] = useState<Partial<Record<formNoteFields, string>>>({});
    const [hasNotesChanged, setHasNotesChanged] = useState(false);
    const lastSavedNotesKeyRef = useRef("");

    const debouncedChatQuery = useDebounce(chatQuery, 400);

    const transferFields = useMemo<TransferField[]>(() => {
        if (!form?.fields) {
            return [];
        }

        return Object.entries(form.fields).map(([key, value]) => {
            const fullValue = stringifyFieldValue(value, t);

            return {
                key,
                label: t(`forms_fields.${key}`, { defaultValue: key }),
                previewValue: normalizeAndLimitText(fullValue),
                fullValue,
            };
        });
    }, [form, t]);

    const selectedTransferFields = useMemo(
        () => transferFields.filter((field) => selectedFieldKeys.includes(field.key)),
        [selectedFieldKeys, transferFields]
    );

    const notesPayload = useMemo(
        () =>
            formNoteKeys.reduce(
                (acc, noteKey) => {
                    acc[noteKey] = recruitmentNotes[noteKey] || "";
                    return acc;
                },
                {} as Record<formNoteFields, string>
            ),
        [formNoteKeys, recruitmentNotes]
    );

    const notesPayloadKey = useMemo(() => JSON.stringify(notesPayload), [notesPayload]);
    const debouncedNotesPayloadKey = useDebounce(notesPayloadKey, 700);

    const isAuthorInSelectedChat = useMemo(() => {
        if (!selectedChat || !form) {
            return true;
        }

        return selectedChat.participants.some((participant) => participant.id === form.created_by.id);
    }, [selectedChat, form]);

    const { mutate: searchChats, isPending: isSearchingChats } = useMutation({
        mutationFn: getChatsMutation,
        onSuccess: (data) => {
            setChatResults(data.items.filter((chat) => !chat.is_group_chat));
        },
    });

    const { mutate: updateChatNote, isPending: isUpdatingChatNote } = useMutation({
        mutationFn: editNoteMutation,
        onSuccess: () => {
            toast.success(t("recruitment_manager.transfer.note_update_success"));
            setTransferStep(1);
            setChatQuery("");
            setSelectedChat(null);
            setSelectedFieldKeys([]);
        },
    });

    const { mutate: updateRecruitmentNotes, isPending: isUpdatingRecruitmentNotes } = useMutation({
        mutationFn: updateFormNoteMutation,
        onSuccess: (_, variables) => {
            lastSavedNotesKeyRef.current = JSON.stringify(variables.notes ?? {});
            toast.success(
                t("recruitment_manager.manage.notes_saved", {
                    defaultValue: "Recruitment notes saved",
                })
            );
            // onRefetch && onRefetch();
        },
    });

    const { mutate: acceptForm, isPending: isAcceptPending } = useMutation({
        mutationFn: acceptFormMutation,
        onSuccess: () => {
            onRefetch && onRefetch();
            toast.success(t("common.success", { defaultValue: "Success" }));
            onClose();
        },
    });

    const { mutate: rejectForm, isPending: isRejectPending } = useMutation({
        mutationFn: rejectFormMutation,
        onSuccess: () => {
            onRefetch && onRefetch();
            toast.success(t("common.success", { defaultValue: "Success" }));
            onClose();
        },
    });

    useEffect(() => {
        if (!open) {
            return;
        }

        setActiveTab("application");
        setTransferStep(1);
        setChatQuery("");
        setSelectedChat(null);
        setSelectedFieldKeys([]);
        setHasNotesChanged(false);

        const initialNotes = formNoteKeys.reduce(
            (acc, key) => {
                acc[key] = form?.notes?.[key] || "";
                return acc;
            },
            {} as Partial<Record<formNoteFields, string>>
        );

        setRecruitmentNotes(initialNotes);
        lastSavedNotesKeyRef.current = JSON.stringify(initialNotes);
    }, [open, form?.id, form?.notes, formNoteKeys]);

    useEffect(() => {
        if (!open || activeTab !== "transfer" || transferStep !== 1) {
            return;
        }

        searchChats({
            page: 1,
            size: 50,
            search: debouncedChatQuery,
            unread_first: true,
            sort_by: ChatSortByOptions.LATEST_MESSAGE_DATE,
        });
    }, [open, activeTab, transferStep, debouncedChatQuery, searchChats]);

    useEffect(() => {
        if (!open || !form || !hasNotesChanged || formNoteKeys.length === 0) {
            return;
        }

        if (debouncedNotesPayloadKey === lastSavedNotesKeyRef.current) {
            return;
        }

        const parsedNotes = JSON.parse(debouncedNotesPayloadKey) as Record<formNoteFields, string>;

        updateRecruitmentNotes({
            id: form.id,
            notes: parsedNotes as FormNote,
        });
    }, [open, form, formNoteKeys.length, hasNotesChanged, debouncedNotesPayloadKey, updateRecruitmentNotes]);

    if (!form) {
        return null;
    }

    const tabs = [
        {
            key: "application" as const,
            label: t("recruitment_manager.tabs.application_form"),
            icon: FileText,
        },
        {
            key: "transfer" as const,
            label: t("recruitment_manager.tabs.transfer_to_chat"),
            icon: MessageSquareText,
        },
        {
            key: "manage" as const,
            label: t("recruitment_manager.tabs.manage_recruitment"),
            icon: Settings,
        },
    ];

    const transferNoteContent = [
        `## ${t("recruitment_manager.transfer.note_header")}`,
        `${t("recruitment_manager.transfer.form_id")}: ${form.id}`,
        `${t("recruitment_manager.transfer.author")}: ${form.created_by.full_name}`,
        `${t("recruitment_manager.transfer.role")}: ${translatedRoles[form.created_by.user_role]}`,
        "",
        ...selectedTransferFields.map((field) => `- **${field.label}**: ${field.fullValue}`),
    ].join("\n");

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={t("recruitment_manager.title")}
            className="sm:max-w-6xl"
            contentClassName="mt-2"
        >
            <div className="flex min-h-[560px] flex-col gap-4 md:flex-row">
                <aside className="border-border/60 bg-muted/20 w-full rounded-xl border p-2 md:max-w-[250px]">
                    <div className="flex flex-col gap-1.5">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.key;

                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                                        isActive
                                            ? "bg-primary-brand text-white"
                                            : "text-foreground hover:bg-muted border border-transparent"
                                    }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <Icon className="size-4" />
                                        {tab.label}
                                    </span>
                                    <ChevronRight className="size-4" />
                                </button>
                            );
                        })}
                    </div>
                </aside>

                <section className="border-border/60 bg-card min-h-[520px] flex-1 rounded-xl border p-4">
                    {activeTab === "application" && <FormTableItem form={form} className="max-w-full" />}

                    {activeTab === "transfer" && (
                        <div className="flex h-full flex-col gap-4">
                            <div className="border-border/50 bg-muted/20 flex items-center justify-between rounded-lg border px-3 py-2">
                                <p className="text-sm font-medium">
                                    {t("recruitment_manager.transfer.step_label", { step: transferStep })}
                                </p>
                                <Badge variant="outline">3</Badge>
                            </div>

                            {transferStep === 1 && (
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            {t("recruitment_manager.transfer.select_chat_title")}
                                        </h3>
                                        <p className="text-muted-foreground mt-1 text-sm">
                                            {t("recruitment_manager.transfer.select_chat_description")}
                                        </p>
                                    </div>

                                    <div className="relative">
                                        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                                        <Input
                                            value={chatQuery}
                                            onChange={(event) => setChatQuery(event.target.value)}
                                            placeholder={t("recruitment_manager.transfer.chat_search_placeholder")}
                                            className="pl-9"
                                        />
                                    </div>

                                    <div className="border-border/50 max-h-[300px] overflow-y-auto rounded-lg border">
                                        {isSearchingChats ? (
                                            <p className="text-muted-foreground p-4 text-sm">
                                                {t("recruitment_manager.transfer.searching_chats")}
                                            </p>
                                        ) : chatResults.length === 0 ? (
                                            <p className="text-muted-foreground p-4 text-sm">
                                                {t("recruitment_manager.transfer.no_chat_results")}
                                            </p>
                                        ) : (
                                            <div className="divide-border/50 divide-y">
                                                {chatResults.map((chat) => (
                                                    <button
                                                        key={chat.id}
                                                        type="button"
                                                        onClick={() => setSelectedChat(chat)}
                                                        className={`flex w-full items-start justify-between gap-4 p-4 text-left transition-colors ${
                                                            selectedChat?.id === chat.id
                                                                ? "bg-primary-brand/10"
                                                                : "hover:bg-muted/40"
                                                        }`}
                                                    >
                                                        <div>
                                                            <p className="text-sm font-semibold">{chat.name}</p>
                                                            <p className="text-muted-foreground mt-1 text-xs">
                                                                {t("recruitment_manager.transfer.chat_participants", {
                                                                    count: chat.participants.length,
                                                                })}
                                                            </p>
                                                        </div>
                                                        {selectedChat?.id === chat.id && (
                                                            <CheckCircle2 className="text-primary-brand mt-0.5 size-4" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-end">
                                        <Button onClick={() => setTransferStep(2)} disabled={!selectedChat}>
                                            {t("recruitment_manager.transfer.to_field_selection")}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {transferStep === 2 && (
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            {t("recruitment_manager.transfer.select_fields_title")}
                                        </h3>
                                        <p className="text-muted-foreground mt-1 text-sm">
                                            {t("recruitment_manager.transfer.select_fields_description")}
                                        </p>
                                    </div>

                                    <div className="border-border/50 max-h-[360px] overflow-y-auto rounded-lg border">
                                        <div className="divide-border/50 divide-y">
                                            {transferFields.map((field) => {
                                                const isChecked = selectedFieldKeys.includes(field.key);

                                                return (
                                                    <label
                                                        key={field.key}
                                                        className="hover:bg-muted/30 flex cursor-pointer items-start gap-3 p-3"
                                                    >
                                                        <Checkbox
                                                            checked={isChecked}
                                                            onCheckedChange={(checked) => {
                                                                const shouldSelect = Boolean(checked);
                                                                setSelectedFieldKeys((prev) => {
                                                                    if (shouldSelect) {
                                                                        return prev.includes(field.key)
                                                                            ? prev
                                                                            : [...prev, field.key];
                                                                    }

                                                                    return prev.filter((key) => key !== field.key);
                                                                });
                                                            }}
                                                        />
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-semibold">{field.label}</p>
                                                            <p className="text-muted-foreground mt-1 text-xs">
                                                                {field.previewValue}
                                                            </p>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <Button variant="outline" onClick={() => setTransferStep(1)}>
                                            {t("common.back", { defaultValue: "Back" })}
                                        </Button>
                                        <Button
                                            onClick={() => setTransferStep(3)}
                                            disabled={selectedFieldKeys.length === 0}
                                        >
                                            {t("recruitment_manager.transfer.to_confirmation")}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {transferStep === 3 && (
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            {t("recruitment_manager.transfer.confirmation_title")}
                                        </h3>
                                        <p className="text-muted-foreground mt-1 text-sm">
                                            {t("recruitment_manager.transfer.confirmation_description")}
                                        </p>
                                    </div>

                                    <div className="border-border/50 bg-muted/20 rounded-lg border p-3 text-sm">
                                        <p>
                                            <span className="font-semibold">
                                                {t("recruitment_manager.transfer.selected_chat")}:{" "}
                                            </span>
                                            {selectedChat?.name}
                                        </p>
                                        <p className="mt-1">
                                            <span className="font-semibold">
                                                {t("recruitment_manager.transfer.selected_fields")}:
                                            </span>{" "}
                                            {selectedTransferFields.length}
                                        </p>
                                    </div>

                                    {!isAuthorInSelectedChat && (
                                        <Alert className="border-warning-brand/50 bg-warning-brand/10 text-warning-brand">
                                            <AlertTriangle className="size-4" />
                                            <AlertTitle>
                                                {t("recruitment_manager.transfer.author_not_in_chat_title")}
                                            </AlertTitle>
                                            <AlertDescription>
                                                {t("recruitment_manager.transfer.author_not_in_chat_description")}
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    <div className="border-border/50 max-h-[300px] overflow-y-auto rounded-lg border p-3">
                                        <pre className="text-foreground text-xs break-words whitespace-pre-wrap">
                                            {transferNoteContent}
                                        </pre>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <Button variant="outline" onClick={() => setTransferStep(2)}>
                                            {t("common.back", { defaultValue: "Back" })}
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                if (!selectedChat) {
                                                    return;
                                                }

                                                updateChatNote({
                                                    id: selectedChat.id,
                                                    content: transferNoteContent,
                                                });
                                            }}
                                            disabled={
                                                !selectedChat ||
                                                selectedTransferFields.length === 0 ||
                                                isUpdatingChatNote
                                            }
                                        >
                                            {t("recruitment_manager.transfer.confirm_transfer")}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "manage" && (
                        <div className="flex h-full flex-col justify-between gap-6">
                            <div>
                                <h3 className="text-lg font-semibold">{t("recruitment_manager.manage.title")}</h3>
                                <p className="text-muted-foreground mt-1 text-sm">
                                    {t("form.manage_forms_subtitle", {
                                        step: renderStepAddnotation(form.current_step + 1),
                                    })}
                                </p>

                                {formNoteKeys.length > 0 && (
                                    <div className="border-border/60 mt-4 rounded-lg border p-3">
                                        <div className="mb-3 flex items-center justify-between">
                                            <h4 className="text-sm font-semibold">
                                                {t("recruitment_manager.manage.notes_title", {
                                                    defaultValue: "Recruitment notes",
                                                })}
                                            </h4>
                                            <p className="text-muted-foreground text-xs">
                                                {isUpdatingRecruitmentNotes
                                                    ? t("recruitment_manager.manage.saving_notes", {
                                                          defaultValue: "Saving...",
                                                      })
                                                    : t("recruitment_manager.manage.autosave_hint", {
                                                          defaultValue: "Autosave is enabled",
                                                      })}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                                            {formNoteKeys.map((noteKey) => (
                                                <div key={noteKey} className="flex flex-col gap-1.5">
                                                    <label className="text-xs font-medium">
                                                        {t(`forms_fields.${noteKey}`)}
                                                    </label>
                                                    <textarea
                                                        value={recruitmentNotes[noteKey] || ""}
                                                        onChange={(event) => {
                                                            setHasNotesChanged(true);
                                                            setRecruitmentNotes((prev) => ({
                                                                ...prev,
                                                                [noteKey]: event.target.value,
                                                            }));
                                                        }}
                                                        className="border-input focus-visible:border-ring focus-visible:ring-ring/50 min-h-24 w-full resize-y rounded-md border bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:ring-2"
                                                        placeholder={t(`forms_fields.${noteKey}`)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="border-border/60 flex flex-col gap-4 border-t pt-6">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <Button
                                        className="w-full"
                                        onClick={() => acceptForm({ id: form.id })}
                                        disabled={isAcceptPending || isRejectPending}
                                    >
                                        {t("form.next_step")}
                                    </Button>
                                    <Button
                                        className="w-full"
                                        onClick={() => rejectForm({ id: form.id })}
                                        variant="outline"
                                        disabled={isAcceptPending || isRejectPending}
                                    >
                                        {t("form.reject")}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </Modal>
    );
};

export default RecruitmentManagerModal;
