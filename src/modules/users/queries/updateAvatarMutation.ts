import { url } from '../../../api';
import getAuthHeaders from '../../auth/helpers/getAuthHeaders';
import { User } from '../../auth/types';
import handleApiError from '../../shared/helpers/handleApiError';

const updateAvatarMutation = async ({ id, avatar }: { id: number; avatar: string }): Promise<User> => {
    const headers = getAuthHeaders();

    try {
        const res = await fetch(url.users.updateUserAvatar({ id }), {
            method: 'PUT',
            headers,
            body: JSON.stringify({
                avatar,
            }),
        });

        if (!res.ok) {
            throw handleApiError(res);
        }

        return await res.json();
    } catch (e) {
        handleApiError(e);
        throw e;
    }
};

export default updateAvatarMutation;
