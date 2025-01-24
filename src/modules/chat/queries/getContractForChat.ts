import { queryOptions, UseQueryOptions } from '@tanstack/react-query';
import { url } from '../../../api';
import { ChatContractOptions, Contract } from '../types';
import getAuthHeaders from '../../auth/helpers/getAuthHeaders';
import handleApiError from '../../shared/helpers/handleApiError';

export const getContractForChat = (
    options: ChatContractOptions,
    additionals?: Omit<UseQueryOptions<Contract>, 'queryFn'>
) =>
    queryOptions<Contract>({
        queryKey: ['chats', options],
        queryFn: async () => {
            try {
                const headers = getAuthHeaders();
                const response = await fetch(url.chat.getContractForChat(options), {
                    headers,
                });

                const data = await response.json();

                if (!response.ok) {
                    throw handleApiError(data);
                }

                return data;
            } catch (error) {
                console.error('Error fetching chats:', error);
                throw error;
            }
        },
        ...additionals,
    });
