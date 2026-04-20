import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { User } from "../modules/auth/types";
import AdminLayout from "../modules/shared/components/AdminLayout";
import UsersList from "../modules/users/components/UsersList";
import { Roles } from "../modules/users/constants";
import { searchUserQueryOptions } from "../modules/users/queries/searchUserQueryOptions";

const UserEditorScreen = () => {
    const [role, setRole] = useState<Roles | undefined>();
    const [params, setParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState<string>(params.get("search") || "");

    const { data, isLoading, refetch } = useQuery(
        searchUserQueryOptions({
            query: searchQuery.trim() || undefined,
            role,
        })
    );

    const [selectedUser, setSelectedUser] = useState<User | undefined>(data?.items[0]);

    const handleSearch = (q: string) => {
        setParams({ search: q });
        setSearchQuery(q);
    };

    return (
        <AdminLayout>
            <div>
                <UsersList
                    isLoading={isLoading}
                    onChangeSearchQuery={handleSearch}
                    onChangeRole={(selectedRole) => setRole(selectedRole)}
                    user={selectedUser}
                    onChange={(u) => setSelectedUser(u)}
                    data={data}
                    refetchUsers={refetch}
                />
            </div>
        </AdminLayout>
    );
};

export default UserEditorScreen;
