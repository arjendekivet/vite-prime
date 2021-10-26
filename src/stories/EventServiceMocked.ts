import { action } from '@storybook/addon-actions'

const EventService: any = {}

EventService.deleteByIds = (dataType: string, selectedIds: any) => {
    const tethered = function (resolve: any, reject: any) {
        const returnData = { data: { deletedCount: selectedIds.length } }
        resolve(returnData)
    }
    return new Promise(tethered);
}

EventService.getDataByFilter = (dataType: string, layoutKey: string) => {
    const tethered = function (resolve: any, reject: any) {
        const returnData: any = { data: [] }
        resolve(returnData)
    }
    return new Promise(tethered);
}

EventService.getData = (type: string, perPage: boolean, page: number) => {
    const tethered = function (resolve: any, reject: any) {
        const returnData: any = { data: [] }
        resolve(returnData)
    }
    return new Promise(tethered);
}

EventService.getById = (type: string, id: string) => {
    const tethered = function (resolve: any, reject: any) {
        const returnData: any = { data: [] }
        action('getById')({ type, id })
        resolve(returnData)
    }
    return new Promise(tethered);
}

EventService.putForm = (type: string, id: string, submitValues: object) => {
    const tethered = function (resolve: any, reject: any) {
        const returnData: any = { data: submitValues }
        action('putForm')(submitValues)
        resolve(returnData)
    }
    return new Promise(tethered);
}

EventService.postForm = (type: string, submitValues: object) => {
    const tethered = function (resolve: any, reject: any) {
        const returnData: any = { data: submitValues }
        action('postForm')(submitValues)
        resolve(returnData)
    }
    return new Promise(tethered);
}

export default EventService