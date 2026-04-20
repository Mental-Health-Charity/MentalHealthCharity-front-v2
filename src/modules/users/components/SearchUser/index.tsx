import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Loader2, User as UserIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { User } from "../../../auth/types";
import useDebounce from "../../../shared/hooks/useDebounce";
import { Roles } from "../../constants";
import getUserAvatarUrl from "../../helpers/getUserAvatarUrl";
import { searchUserQueryOptions } from "../../queries/searchUserQueryOptions";

interface Props {
    onChange: (user?: User) => void;
    onChangeSearchQuery?: (nickname: string) => void;
    onChangeRole?: (role?: Roles) => void;
    value?: User;
    disabled?: boolean;
}

const SearchUser = ({ onChange, value, onChangeSearchQuery, onChangeRole, disabled }: Props) => {
    const [role, setRole] = useState<Roles | undefined>();
    const [username, setUsername] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();
    const debouncedValue = useDebounce(username, 500);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const { data, refetch } = useQuery(
        searchUserQueryOptions({
            query: debouncedValue.trim() || undefined,
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

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
            <div ref={containerRef} className="relative flex-1">
                <Label htmlFor="search-user">{t("search_user.label", "Wyszukaj użytkownika")}</Label>
                <div className="relative my-2">
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
                        onKeyDown={(e) => {
                            if (e.key === "Escape") setOpen(false);
                        }}
                        placeholder={value?.full_name || t("search_user.placeholder", "Wyszukaj użytkownika")}
                        autoComplete="off"
                    />
                    {isLoading && (
                        <Loader2 className="text-muted-foreground absolute top-1/2 right-2 size-4 -translate-y-1/2 animate-spin" />
                    )}
                </div>

                {/* Dropdown */}
                {open && (username || options.length > 0) && (
                    <div className="bg-popover ring-foreground/10 absolute top-full right-0 left-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-lg shadow-md ring-1">
                        {options.length === 0 && !isLoading && (
                            <p className="text-muted-foreground py-4 text-center text-sm">
                                {t("search_user.no_results", "Brak wyników")}
                            </p>
                        )}
                        {isLoading && options.length === 0 && (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="text-muted-foreground size-4 animate-spin" />
                            </div>
                        )}
                        {options.map((option) => (
                            <button
                                key={option.id}
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleOptionChange(option);
                                }}
                                className="hover:bg-accent flex w-full cursor-pointer items-center gap-3 px-3 py-2.5 text-left transition-colors"
                            >
                                <Avatar className="size-8 rounded-md">
                                    <AvatarImage src={getUserAvatarUrl(option) || ""} />
                                    <AvatarFallback className="rounded-md text-xs">
                                        <UserIcon className="size-3.5" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                    <p className="text-foreground truncate text-sm font-medium">{option.full_name}</p>
                                    <p className="text-muted-foreground truncate text-xs">{option.email}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="min-w-[120px]">
                <Label htmlFor="role-filter">{t("search_user.role_label", "Role")}</Label>
                <div className="relative my-2">
                    <select
                        id="role-filter"
                        disabled={disabled}
                        value={role || ""}
                        onChange={(e) => {
                            const selectedRole = e.target.value === "" ? undefined : (e.target.value as Roles);
                            setRole(selectedRole);
                            onChangeRole?.(selectedRole);
                        }}
                        className="border-input bg-paper text-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-10 w-full appearance-none rounded-lg border px-2.5 py-1 pr-8 text-sm outline-none focus-visible:ring-3 disabled:opacity-50"
                    >
                        <option className="bg-paper text-foreground" value="">
                            {t("search_user.any_role", "Każda rola")}
                        </option>
                        {Object.values(Roles).map((r) => (
                            <option className="bg-paper text-foreground" key={r} value={r}>
                                {r}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="text-muted-foreground pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2" />
                </div>
            </div>
        </div>
    );
};

export default SearchUser;
