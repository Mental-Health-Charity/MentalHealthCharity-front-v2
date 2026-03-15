import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Command, CommandEmpty, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { Loader2, User as UserIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { User } from "../../../auth/types";
import useDebounce from "../../../shared/hooks/useDebounce";
import { Roles } from "../../constants";
import { searchUserQueryOptions } from "../../queries/searchUserQueryOptions";

interface Props {
    onChange: (user?: User) => void;
    onChangeSearchQuery?: (nickname: string) => void;
    value?: User;
    disabled?: boolean;
}

const SearchUser = ({ onChange, value, onChangeSearchQuery, disabled }: Props) => {
    const [role, setRole] = useState<Roles | undefined>();
    const [username, setUsername] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();
    const debouncedValue = useDebounce(username, 500);
    const inputRef = useRef<HTMLInputElement>(null);

    const { data, refetch } = useQuery(
        searchUserQueryOptions({
            query: debouncedValue,
            role,
        })
    );

    useEffect(() => {
        if (onChangeSearchQuery) {
            onChangeSearchQuery(debouncedValue);
        }
    }, [debouncedValue]);

    useEffect(() => {
        if (debouncedValue) {
            setIsLoading(true);
            refetch()
                .then(() => setIsLoading(false))
                .catch((err) => {
                    console.error(err);
                    setIsLoading(false);
                });
        }
    }, [debouncedValue, role]);

    const handleOptionChange = (selectedUser?: User) => {
        onChange(selectedUser || undefined);
        setOpen(false);
        if (selectedUser) {
            setUsername(selectedUser.full_name);
        }
    };

    const options = data ? data.items : [];

    return (
        <div className="flex w-full items-end gap-2.5">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger
                    render={
                        <div className="flex-1">
                            <Label htmlFor="search-user">{t("search_user.label", "Wyszukaj użytkownika")}</Label>
                            <div className="relative">
                                <Input
                                    ref={inputRef}
                                    id="search-user"
                                    disabled={disabled}
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        if (!open) setOpen(true);
                                    }}
                                    onFocus={() => {
                                        if (username || options.length > 0) setOpen(true);
                                    }}
                                    placeholder={
                                        value?.full_name || t("search_user.placeholder", "Wyszukaj użytkownika")
                                    }
                                    autoComplete="off"
                                />
                                {isLoading && (
                                    <Loader2 className="text-muted-foreground absolute top-1/2 right-2 size-4 -translate-y-1/2 animate-spin" />
                                )}
                            </div>
                        </div>
                    }
                />
                <PopoverContent className="w-[var(--anchor-width)] p-0" align="start" sideOffset={4}>
                    <Command shouldFilter={false}>
                        <CommandList>
                            {options.length === 0 && !isLoading && (
                                <CommandEmpty>{t("search_user.no_results", "Brak wyników")}</CommandEmpty>
                            )}
                            {isLoading && options.length === 0 && (
                                <div className="flex items-center justify-center py-4">
                                    <Loader2 className="text-muted-foreground size-4 animate-spin" />
                                </div>
                            )}
                            {options.map((option) => (
                                <CommandItem
                                    key={option.id}
                                    value={String(option.id)}
                                    onSelect={() => handleOptionChange(option)}
                                    className="cursor-pointer"
                                >
                                    <Avatar className="rounded-md">
                                        <AvatarImage src={option.chat_avatar_url || ""} />
                                        <AvatarFallback className="rounded-md">
                                            <UserIcon className="size-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-muted-foreground font-bold">{option.full_name}</p>
                                        <p className="text-muted-foreground text-xs">{option.email}</p>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            <div className="min-w-[120px]">
                <Label htmlFor="role-filter">{t("search_user.role_label", "Role")}</Label>
                <select
                    id="role-filter"
                    disabled={disabled}
                    value={role || ""}
                    onChange={(e) => setRole(e.target.value === "" ? undefined : (e.target.value as Roles))}
                    className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-full rounded-lg border bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:ring-3 disabled:opacity-50"
                >
                    <option value="">{t("search_user.any_role", "Każda rola")}</option>
                    {Object.values(Roles).map((r) => (
                        <option key={r} value={r}>
                            {r}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default SearchUser;
