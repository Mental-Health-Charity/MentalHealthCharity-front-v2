import { useCallback } from "react";
import { useUser } from "../../auth/components/AuthProvider";
import { groupedPermissions, Permissions } from "../constants";

const usePermissions = () => {
    const { user } = useUser();

    const hasPermissions = useCallback(
        (permission: Permissions) => {
            if (!user) return false;

            if (groupedPermissions[user.user_role].includes(Permissions.AlL)) return true;

            return groupedPermissions[user.user_role].includes(permission);
        },
        [user]
    );

    return { hasPermissions };
};

export default usePermissions;
