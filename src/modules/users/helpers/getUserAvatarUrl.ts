import resolveAssetUrl from "../../shared/helpers/resolveAssetUrl";
import { User } from "../../auth/types";

const getUserAvatarUrl = (user?: User) => {
    if (!user) return undefined;

    return resolveAssetUrl(user.user_public_profile?.avatar_url) || resolveAssetUrl(user.chat_avatar_url);
};

export default getUserAvatarUrl;
