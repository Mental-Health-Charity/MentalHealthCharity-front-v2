import { User } from "../../auth/types";
import { groupedPermissions, Permissions } from "../constants";
import { useCallback } from "react";

const usePermissions = (user?: User) => {
    const userRole = user?.user_role;

    const hasPermissions = useCallback(
        (permission: Permissions) => {
            if (!userRole) return false;

            if (groupedPermissions[userRole].includes(Permissions.AlL))
                return true;

            return groupedPermissions[userRole].includes(permission);
        },
        [userRole]
    );

    return { hasPermissions };
};

export default usePermissions;
