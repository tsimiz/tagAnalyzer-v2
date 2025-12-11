import axios from 'axios';
import type { TagInfo, TagSearchRequest, SubscriptionInfo } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const tagService = {
  getAllTags: async (): Promise<TagInfo[]> => {
    const response = await api.get<TagInfo[]>('/api/tags');
    return response.data;
  },

  searchTags: async (searchRequest: TagSearchRequest): Promise<TagInfo[]> => {
    const response = await api.post<TagInfo[]>('/api/tags/search', searchRequest);
    return response.data;
  },

  getSubscriptions: async (): Promise<SubscriptionInfo[]> => {
    const response = await api.get<SubscriptionInfo[]>('/api/tags/subscriptions');
    return response.data;
  },
};
