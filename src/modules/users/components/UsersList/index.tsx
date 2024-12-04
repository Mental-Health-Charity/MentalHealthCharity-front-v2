import { useState } from "react";
import { User } from "../../../auth/types";
import SimpleCard from "../../../shared/components/SimpleCard";
import WindowListVirtualizer from "../../../shared/components/WindowListVirtualizer";
import { Pagination } from "../../../shared/types";
import { useTranslation } from "react-i18next";
import SearchUser from "../SearchUser";
import EditUserModal from "../EditUserModal";
import { ListRowProps } from "react-virtualized";
import UserTableItem from "../UserTableItem";

interface Props {
    data?: Pagination<User>;
    user?: User;
    onChange: (user?: User) => void;
    onChangeSearchQuery?: (nickname: string) => void;
    isLoading: boolean;
}

const UsersList = ({ data, onChange, onChangeSearchQuery, user }: Props) => {
    const [userToEdit, setUserToEdit] = useState<User>();
    const { t } = useTranslation();

    const onRender = ({ index, key, style }: ListRowProps) => {
        const user = data && data.items[index];
        if (!user) return null;

        return (
            <UserTableItem
                key={key}
                onEdit={(user) => setUserToEdit(user)}
                user={user}
                sx={{
                    ...style,
                }}
            />
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
                <SearchUser
                    onChangeSearchQuery={onChangeSearchQuery}
                    onChange={onChange}
                    value={user}
                />
            </SimpleCard>

            <WindowListVirtualizer
                rowCount={data ? data.items.length : 0}
                rowHeight={90}
                onRender={onRender}
            />

            {userToEdit && (
                <EditUserModal
                    onSubmit={() => console.log("elo")}
                    onClose={() => setUserToEdit(undefined)}
                    open={!!userToEdit}
                    user={userToEdit}
                />
            )}
        </div>
    );
};

export default UsersList;
