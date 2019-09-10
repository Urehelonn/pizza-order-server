export enum PizzaSizeType {
    S = 'small',
    M = 'medium',
    L = 'large',
    XL = 'Xlarge'
}

export interface ProductProfile {
    price: number
    name: string
    default: boolean
    selected: boolean
    [key: string]: any
}