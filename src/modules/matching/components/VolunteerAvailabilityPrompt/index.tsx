import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useUser } from "../../../auth/components/AuthProvider";
import { Roles } from "../../../users/constants";
import Modal from "../../../shared/components/Modal";
import updateVolunteerAvailabilityMutation from "../../queries/updateVolunteerAvailabilityMutation";
import { volunteerAvailabilityQueryOptions } from "../../queries/volunteerAvailabilityQueryOptions";

const MIN_CAPACITY = 1;
const MAX_CAPACITY = 10;

const VolunteerAvailabilityPrompt = () => {
    const { t } = useTranslation();
    const { user } = useUser();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [capacity, setCapacity] = useState("2");
    const isVolunteer = user?.user_role === Roles.VOLUNTEER;

    const { data, isFetching } = useQuery(
        volunteerAvailabilityQueryOptions({
            enabled: isVolunteer,
            retry: false,
            refetchOnWindowFocus: true,
        })
    );

    const { mutate, isPending } = useMutation({
        mutationFn: updateVolunteerAvailabilityMutation,
        onSuccess: (updatedAvailability) => {
            queryClient.setQueryData(["volunteerAvailability"], updatedAvailability);
            setOpen(false);
            toast.success(t("matching.availability_saved", { defaultValue: "Dyspozycyjność została zapisana" }));
        },
    });

    useEffect(() => {
        if (!isVolunteer || !data) return;

        if (data.declared_capacity) {
            setCapacity(String(data.declared_capacity));
        }

        setOpen(data.must_prompt);
    }, [data, isVolunteer]);

    if (!isVolunteer) return null;

    const parsedCapacity = Number(capacity);
    const isValidCapacity =
        Number.isInteger(parsedCapacity) && parsedCapacity >= MIN_CAPACITY && parsedCapacity <= MAX_CAPACITY;

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isValidCapacity || isPending) return;

        mutate({ declared_capacity: parsedCapacity });
    };

    return (
        <Modal
            open={open}
            onClose={() => {
                if (!data?.must_prompt || data.declared_capacity) {
                    setOpen(false);
                }
            }}
            title={t("matching.availability_title", { defaultValue: "Twoja dyspozycyjność" })}
        >
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <p className="text-muted-foreground text-sm">
                    {t("matching.availability_description", {
                        defaultValue: "Podaj, ile aktywnych rozmów możesz jednocześnie prowadzić. Zakres: od 1 do 10.",
                    })}
                </p>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="volunteer-availability">
                        {t("matching.availability_capacity", { defaultValue: "Liczba rozmów" })}
                    </Label>
                    <Input
                        id="volunteer-availability"
                        type="number"
                        min={MIN_CAPACITY}
                        max={MAX_CAPACITY}
                        value={capacity}
                        onChange={(event) => setCapacity(event.target.value)}
                        disabled={isPending}
                    />
                    {!isValidCapacity && (
                        <p className="text-destructive text-sm">
                            {t("matching.availability_validation", {
                                defaultValue: "Wpisz liczbę od 1 do 10.",
                            })}
                        </p>
                    )}
                </div>

                {data?.warning && <p className="text-destructive text-sm">{data.warning}</p>}

                <div className="flex items-center justify-between gap-3">
                    {isFetching && <Loader2 className="text-muted-foreground size-4 animate-spin" />}
                    <Button className="ml-auto" type="submit" disabled={!isValidCapacity || isPending}>
                        {isPending && <Loader2 className="size-4 animate-spin" />}
                        {t("common.save")}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default VolunteerAvailabilityPrompt;
