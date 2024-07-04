export interface ICountry {
    id: number
    nombre: string
    iso3: string
    iso2: string
    latitud: number
    longitud: number
}

export interface IState {
    id: number
    sb_paisId: number
    nombre: string
    latitud: number
    longitud: number
}

export interface ICity {
    id: number
    sb_estadoPaisId: number
    nombre: string
    latitud: number
    longitud: number
}
