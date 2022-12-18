import axios from 'axios';
import { createGlobalState } from '@vueuse/core'
export function _createServerAPI() {
  const baseURL = 'http://localhost:3000/api';

  return {
    admin: {
      get: async (query: string) => await (await axios.get(`${baseURL}/admin`, { params: query })).data,
      getInfo: async (query: string) => await (await axios.get(`${baseURL}/admin/info/${query}`)).data,
      post: async (data: any) => await (await axios.post(`${baseURL}/admin`, data)).data,
      // other API endpoints go here...
    },
    collection: {
      get: async (query: string) => await (await axios.get(`${baseURL}/collection`, { params: query })).data,
      post: async (data: any) => await (await axios.post(`${baseURL}/collection`, data)).data,
      // other API endpoints go here...
    },
    user: {
      get: async (query: string) => await (await axios.get(`${baseURL}/user`, { params: query })).data,
      post: async (data: any) => await (await axios.post(`${baseURL}/user`, data)).data,
      // other API endpoints go here...
    },
    // other API groups go here...
  };

}

export const useServerAPI = createGlobalState(() => _createServerAPI())