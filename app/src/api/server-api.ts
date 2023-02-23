import axios from 'axios';
import { createGlobalState } from '@vueuse/core'
import { CollectionRewardInfo, CollectionRewardInfoJSON, DBCollectionInfo } from 'src/types';
export function _createServerAPI() {
  const baseURL = 'http://localhost:3000/api';

  const server_api = {
    server_api: {
      admin: {
        get: async (query: string) => await (await axios.get(`${baseURL}/admin`, { params: query })).data,
        getInfo: async (query: string) => await (await axios.get(`${baseURL}/admin/info/${query}`)).data,
        post: async (data: any) => await (await axios.post(`${baseURL}/admin`, data)).data,

        // other API endpoints go here...
      },
      collection: {
        get: {
          byOwner: async (query: string) => await (await axios.get(`${baseURL}/collection/owner`, { params: query })).data,
          one: async (query: string) => await (await axios.get(`${baseURL}/collection/info/${query}`)).data,
          all: async () => await (await axios.get(`${baseURL}/collection`)).data,
          hashlist: async (query: string) => await (await axios.get(`${baseURL}/collection/hashlist/${query}`)).data
        },
        add: {
          hashlist: async (data: { wallet: string, name?: string, hashlist: string[], pda: string }) => await (await axios.post(`${baseURL}/collection/hashlist/add`, data)).data,
          style: async (pda: string, wallet: string, style: DBCollectionInfo['style']) => await (await axios.post(`${baseURL}/collection/style/add`, { wallet, style, pda })).data
        },
        update: async (data: { wallet: string, pda: string, data: CollectionRewardInfoJSON }) => await (await axios.post(`${baseURL}/collection/update`, data)).data,
        post: async (data: any) => await (await axios.post(`${baseURL}/collection`, data)).data,
        new: async (data: any) => await (await axios.post(`${baseURL}/collection/new`, data)).data
        // other API endpoints go here...
      },
      user: {
        get: async (query: string) => await (await axios.get(`${baseURL}/user`, { params: query })).data,
        post: async (data: any) => await (await axios.post(`${baseURL}/user`, data)).data,
        // other API endpoints go here...
      },
      general: {
        getRelations: async () => await (await axios.get(`${baseURL}/relations`)).data
      },
      nft: {
        getCollectionFor: async (tokenMint: string) => await (await axios.get(`${baseURL}/user/nft/collection/${tokenMint}`)).data
      }
      // other API groups go here...

    }
  }
  return server_api
}


export const useServerAPI = createGlobalState(() => _createServerAPI())