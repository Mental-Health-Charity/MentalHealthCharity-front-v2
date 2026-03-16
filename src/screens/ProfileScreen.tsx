import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ArticleStatus } from "../modules/articles/constants";
import { articlesByUserQueryOptions } from "../modules/articles/queries/articlesByUserQueryOptions";
import { useUser } from "../modules/auth/components/AuthProvider";
import Loader from "../modules/shared/components/Loader";
import UserProfileHeading from "../modules/users/components/Profile";
import UserProfileArticles from "../modules/users/components/UserProfileArticles";
import UserProfileDescription from "../modules/users/components/UserProfileDescription";
import UserProfileSettings from "../modules/users/components/UserProfileSettings";
import { Roles } from "../modules/users/constants";
import { editPublicProfileMutation } from "../modules/users/queries/editPublicProfileMutation";
import { readPublicProfileQueryOptions } from "../modules/users/queries/readPublicProfileQueryOptions";
import updateAvatarMutation from "../modules/users/queries/updateAvatarMutation";

const ProfileScreen = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const { t } = useTranslation();

    const shouldFetchProfile = Number(userId) !== user?.id || user?.user_role !== Roles.USER;

    const {
        data,
        isLoading,
        isSuccess,
        refetch: refreshProfile,
    } = useQuery(
        readPublicProfileQueryOptions(
            { id: Number(userId) || -1 },
            {
                enabled: !!userId && shouldFetchProfile,
            }
        )
    );

    const { mutate: updateProfile } = useMutation({
        mutationFn: editPublicProfileMutation,
        onSuccess() {
            toast.success(t("profile.profile_updated"));
            refreshProfile();
        },
    });

    const { mutate: updateAvatar } = useMutation({
        mutationFn: updateAvatarMutation,
        onSuccess() {
            toast.success(t("profile.profile_updated"));
            refreshProfile();
        },
        onError(error) {
            toast.error(t(error.message));
        },
    });

    const isOwner = !!user && user.id === Number(userId);
    const isPublicProfile = isSuccess;

    const { data: articles } = useQuery(
        articlesByUserQueryOptions(
            {
                status: ArticleStatus.SENT,
                author: Number(userId) || -1,
                page: 1,
                size: 24,
            },
            {
                enabled: isPublicProfile,
                queryKey: [
                    "articlesByUser",
                    {
                        status: ArticleStatus.SENT,
                        author: Number(userId) || -1,
                    },
                ],
            }
        )
    );

    if (!userId || (!data && !isOwner)) {
        navigate("/404");
        return null;
    }

    if (isLoading) {
        return <Loader variant="fullscreen" />;
    }

    const role = isPublicProfile ? data.user.user_role : (user?.user_role ?? null);
    const username = isPublicProfile ? data.user.full_name : (user?.full_name ?? null);
    const avatar = data && data.avatar_url;

    return (
        // min height 100vh
        <div className="h-full w-full">
            {/* Taller gradient banner */}
            <div className="from-primary-brand-50 to-background h-[280px] w-full bg-gradient-to-b" />

            {/* Profile content pulled up */}
            <div className="mx-auto -mt-[140px] flex max-w-[800px] flex-col gap-5 px-5 pb-12">
                {username && role && (
                    <UserProfileHeading
                        onSubmit={({ avatar }) =>
                            updateAvatar({
                                id: Number(userId),
                                avatar,
                            })
                        }
                        isOwner={isOwner}
                        username={username}
                        role={role}
                        avatar_url={avatar}
                    />
                )}
                {isOwner && user && <UserProfileSettings email={user.email} username={user.full_name} />}
                {isPublicProfile && data && (
                    <UserProfileDescription
                        onSubmit={(val) =>
                            updateProfile({
                                ...val,
                                id: data.user.id,
                                avatar_url: data.avatar_url,
                            })
                        }
                        isOwner={isOwner}
                        content={data.description}
                    />
                )}
                {articles && <UserProfileArticles articles={articles.items} />}
            </div>
        </div>
    );
};

export default ProfileScreen;
