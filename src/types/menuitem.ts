type MenuItem = {
    label: string
    key?: string
    icon?: string
    to?: string | object
    items?: MenuItem[]
}

export default MenuItem
