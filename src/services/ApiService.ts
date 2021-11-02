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
    getSchema(type: string) {
        return apiClient.get('schema/' + type, { headers: authHeader() })
    },
    postForm(type: string, submitValues: object) {
        return apiClient.post('/' + type, submitValues, { headers: authHeader() })
    },
    putForm(type: string, id: string, submitValues: object) {
        return apiClient.put('/' + type + '/' + id, submitValues, { headers: authHeader() })
    },
    getById(type: string, id: string) {
        return apiClient.get('/' + type + '/' + id, { headers: authHeader() })
    },
    deleteByIds(type: string, ids: string[]): Promise<DeleteResponse> {
        return apiClient.delete('/' + type + '/' + ids, { headers: authHeader() })
    },
    getData(type: string, perPage: boolean, page: number): Promise<QuestionResponse> {
        return apiClient.get('/' + type + '?_limit=' + perPage + '&_page=' + page, { headers: authHeader() })
    },
    getDataByFilter(type: string, filter: string | string[], perPage: boolean = false, page: number = 0) {
        return apiClient.get('/' + type + '/filter/' + filter + '?_limit=' + perPage + '&_page=' + page, { headers: authHeader() })
    }
}
