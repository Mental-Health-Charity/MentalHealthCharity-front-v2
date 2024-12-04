import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { searchUserQueryOptions } from "../modules/users/queries/searchUserQueryOptions";
import UsersList from "../modules/users/components/UsersList";
import AdminLayout from "../modules/shared/components/AdminLayout";
import { Roles } from "../modules/users/constants";
import { User } from "../modules/auth/types";
import { useSearchParams } from "react-router-dom";

const UserEditorScreen = () => {
    const [role, setRole] = useState<Roles | undefined>();
    const [params, setParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState<string>(
        params.get("search") || ""
    );

    const { data, isLoading } = useQuery(
        searchUserQueryOptions({
            query: searchQuery,
            role,
        })
    );

    const [selectedUser, setSelectedUser] = useState<User | undefined>(
        data?.items[0]
    );

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
                    user={selectedUser}
                    onChange={(u) => setSelectedUser(u)}
                    data={data}
                />
            </div>
        </AdminLayout>
    );
};

export default UserEditorScreen;
