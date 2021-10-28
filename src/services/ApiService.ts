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
        return apiClient.post('/' + type, submitValues, { headers: authHeader() })
    },
    async putForm(type: string, id: string, submitValues: object) {
        return apiClient.put('/' + type + '/' + id, submitValues, { headers: authHeader() })
    },
    async getById(type: string, id: string) {
        console.log('service.getDataById, before awaited')
        const response = await apiClient.get('/' + type + '/' + id, { headers: authHeader() })
        console.log('service.getDataById, after awaited')
        //hard coded fake some data ...
        response.data.setting0 = 2;
        response.data.setting1 = 1;
        debugger
        return response
    },
    async deleteByIds(type: string, ids: string[]): Promise<DeleteResponse> {
        return apiClient.delete('/' + type + '/' + ids, { headers: authHeader() })
    },
    async getData(type: string, perPage: boolean, page: number): Promise<QuestionResponse> {
        return apiClient.get('/' + type + '?_limit=' + perPage + '&_page=' + page, { headers: authHeader() })
    },
    async getDataByFilter(type: string, filter: string | string[], perPage: boolean = false, page: number = 0) {
        console.log('service.getDataByFilter, before awaited')
        let response = await apiClient.get('/' + type + '/filter/' + filter + '?_limit=' + perPage + '&_page=' + page, { headers: authHeader() })
        console.log('service.getDataByFilter, after awaited')
        debugger
        return response
    }
}
