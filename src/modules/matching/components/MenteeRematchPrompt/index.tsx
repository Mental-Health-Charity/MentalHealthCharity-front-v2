import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useUser } from "../../../auth/components/AuthProvider";
import Modal from "../../../shared/components/Modal";
import { Roles } from "../../../users/constants";
import { MenteeMatchingStatus } from "../../types";
import { myMatchingStateQueryOptions } from "../../queries/myMatchingStateQueryOptions";
import rematchDecisionMutation from "../../queries/rematchDecisionMutation";

const MenteeRematchPrompt = () => {
    const { t } = useTranslation();
    const { user } = useUser();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const isMentee = user?.user_role === Roles.USER;

    const { data } = useQuery(
        myMatchingStateQueryOptions({
            enabled: isMentee,
            retry: false,
            refetchOnWindowFocus: true,
        })
    );

    const { mutate, isPending } = useMutation({
        mutationFn: rematchDecisionMutation,
        onSuccess: (state) => {
            setOpen(false);
            queryClient.setQueryData(["matching", "me", "state"], state);
            queryClient.invalidateQueries({ queryKey: ["chat"] });
            toast.success(
                state.status === MenteeMatchingStatus.WAITING
                    ? t("matching.rematch_requested_success", {
                          defaultValue: "Zgłoszenie do ponownego sparowania zostało zapisane.",
                      })
                    : t("matching.rematch_declined_success", {
                          defaultValue: "Dziękujemy za odpowiedź.",
                      })
            );
        },
    });

    useEffect(() => {
        if (!isMentee || !data) return;

        if (data.status === MenteeMatchingStatus.PAUSED && !data.current_chat_id) {
            setOpen(true);
        }
    }, [data, isMentee]);

    if (!isMentee) return null;

    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            title={t("matching.rematch_prompt_title", { defaultValue: "Czat został zamknięty" })}
        >
            <div className="flex flex-col gap-5">
                <p className="text-muted-foreground text-sm">
                    {t("matching.rematch_prompt_description", {
                        defaultValue:
                            "Ten czat został zamknięty. Czy chcesz byśmy utworzyli dla Ciebie czat z innym wolontariuszem?",
                    })}
                </p>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isPending}
                        onClick={() => mutate({ wants_rematch: false })}
                    >
                        {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                        {t("common.no", { defaultValue: "Nie" })}
                    </Button>
                    <Button type="button" disabled={isPending} onClick={() => mutate({ wants_rematch: true })}>
                        {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                        {t("common.yes", { defaultValue: "Tak" })}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default MenteeRematchPrompt;
