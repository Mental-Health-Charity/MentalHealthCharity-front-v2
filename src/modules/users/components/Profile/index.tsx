import { Roles, translatedRoles } from "../../constants";
import ChangeAvatar from "../ChangeAvatar";

interface Props {
    username: string;
    role: Roles;
    avatar_url?: string;
    isOwner: boolean;
    onSubmit: (values: { avatar: File }) => void;
}

const UserProfileHeading = ({ role, username, avatar_url, isOwner, onSubmit }: Props) => {
    return (
        <div>
            <div className="flex flex-row items-end gap-5">
                <ChangeAvatar disabled={!isOwner} avatar={avatar_url} username={username} onSubmit={onSubmit} />
                <div>
                    <p className="text-muted-foreground text-2xl font-bold uppercase">{username}</p>
                    <p className="text-muted-foreground text-xl font-bold uppercase">{translatedRoles[role]}</p>
                </div>
            </div>
        </div>
    );
};

export default UserProfileHeading;
