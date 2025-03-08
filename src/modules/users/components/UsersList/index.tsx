import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { CellMeasurer } from "react-virtualized";
import { User } from "../../../auth/types";
import SimpleCard from "../../../shared/components/SimpleCard";
import WindowListVirtualizer, { CachedListRowProps } from "../../../shared/components/WindowListVirtualizer";
import { Pagination } from "../../../shared/types";
import editUserAsAdminMutation from "../../queries/editUserAsAdminMutation";
import EditUserModal from "../EditUserModal";
import SearchUser from "../SearchUser";
import UserTableItem from "../UserTableItem";

interface Props {
    data?: Pagination<User>;
    user?: User;
    onChange: (user?: User) => void;
    onChangeSearchQuery?: (nickname: string) => void;
    isLoading: boolean;
    refetchUsers: () => void;
}

const UsersList = ({ data, onChange, onChangeSearchQuery, user, refetchUsers }: Props) => {
    const [userToEdit, setUserToEdit] = useState<User>();
    const { t } = useTranslation();
    const { mutate } = useMutation({
        mutationFn: editUserAsAdminMutation,
        onSuccess: () => {
            refetchUsers();
            toast.success(t("common.success"));
        },
    });

    const onRender = ({ index, key, style, cache, parent }: CachedListRowProps) => {
        const user = data && data.items[index];
        if (!user) return null;

        return (
            <CellMeasurer cache={cache} parent={parent} columnIndex={0} rowIndex={index} key={key}>
                <div
                    key={key}
                    style={{
                        ...style,
                        padding: "5px 0",
                    }}
                >
                    <UserTableItem onEdit={(user) => setUserToEdit(user)} user={user} />
                </div>
            </CellMeasurer>
        );
    };

    return (
        <div style={{ minHeight: "100vh" }}>
            <SimpleCard
                title={t("admin_screen.user_list_title")}
                subtitle={t("admin_screen.user_list_subtitle")}
                style={{
                    height: "100%",
                    marginBottom: "20px",
                }}
            >
                <SearchUser onChangeSearchQuery={onChangeSearchQuery} onChange={onChange} value={user} />
            </SimpleCard>

            <WindowListVirtualizer rowCount={data ? data.items.length : 0} onRender={onRender} />

            {userToEdit && (
                <EditUserModal
                    onSubmit={(val) =>
                        mutate({
                            id: userToEdit.id,
                            payload: val,
                        })
                    }
                    onClose={() => setUserToEdit(undefined)}
                    open={!!userToEdit}
                    user={userToEdit}
                />
            )}
        </div>
    );
};

export default UsersList;
