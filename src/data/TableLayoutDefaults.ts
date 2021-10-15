import ColumnConfig from '@/types/columnconfig'

type TableConfig = {
    [layoutdefinition: string]: ColumnConfig[]
    questions: ColumnConfig[]
}

const formConfig: TableConfig = {
    layoutdefinition: [
        {
            field: 'title',
            header: 'Title',
        },
        {
            field: 'label',
            header: 'Label',
        }
        ,
        {
            field: 'type',
            header: 'Type',
        }
    ],
    questions: [
        {
            field: 'title',
            header: 'Title',
        },
        {
            field: 'type',
            header: 'Type',
        },
        {
            field: 'answer',
            header: 'Answer',
        }
    ]
}

export default formConfig