import Fieldconfig from '@/types/fieldconfig'

type Pipo = {
    fields: Fieldconfig[],
    dataType: string,
    id?: string,
    columns?: number,
    title?: string,
    readOnly?: boolean,
}

export default Pipo
