import axios from 'axios'
import authHeader from '@/modules/auth-header';
import Question from '@/types/question'

const apiClient = axios.create({
    baseURL: `/api`,
    withCredentials: false, // This is the default
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
})

apiClient.interceptors.request.use((config) => {
    return config;
});

type QuestionResponse = {
    data: Question[]
}

type DeleteResponse = {
    data: {
        deletedCount: number
    }
}

export default {
    async postForm(type: string, submitValues: object) {
        return await apiClient.post('/' + type, submitValues, { headers: authHeader() })
    },
    async getSchema(type: string) {
        return await apiClient.get('schema/' + type, { headers: authHeader() })
    },
    async putForm(type: string, id: string, submitValues: object) {
        return await apiClient.put('/' + type + '/' + id, submitValues, { headers: authHeader() })
    },
    async getById(type: string, id: string) {
        return await apiClient.get('/' + type + '/' + id, { headers: authHeader() })
    },
    async deleteByIds(type: string, ids: string[]): Promise<DeleteResponse> {
        return await apiClient.delete('/' + type + '/' + ids, { headers: authHeader() })
    },
    async getData(type: string, perPage: boolean, page: number): Promise<QuestionResponse> {
        return await apiClient.get('/' + type + '?_limit=' + perPage + '&_page=' + page, { headers: authHeader() })
    },
    async getDataByFilter(type: string, filter: string | string[], perPage: boolean = false, page: number = 0) {
        return await apiClient.get('/' + type + '/filter/' + filter + '?_limit=' + perPage + '&_page=' + page, { headers: authHeader() })
    },
    async getDataByFilterType(type: string, filterType: string, filter: string | string[], perPage: boolean = false, page: number = 0) {
        return await apiClient.get('/' + type + '/filter/' + filterType + '/' + filter + '?_limit=' + perPage + '&_page=' + page, { headers: authHeader() })
    }
}
