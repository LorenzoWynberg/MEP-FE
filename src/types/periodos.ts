export interface IBlock {
    id?: number
    nombre: string
    ordenBloque: number
    porcentaje: number
    estado: boolean
    sBPeriodo_Id?: number
}

export interface IPeriod {
    id?: number
    nombre: string
    estado: boolean
    bloques: Array<IBlock>
}