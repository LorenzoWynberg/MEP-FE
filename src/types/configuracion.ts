export interface Configuracion {
    instituciones: Instituciones;
    currentInstitution: CurrentInstitution;
    centrosPadre: any[];
    regionales: any[];
    currentRegional: CurrentRegional;
    currentCircuito: CurrentCircuito;
    currentDirector: CurrentDirector;
    circuitos: any[];
    directores: Directores;
    usuarios: Usuarios;
    sedes: any[];
    loading: boolean;
    error: boolean;
    errors: any[];
    fields: any[];
}

export interface Instituciones {
    entityList: any[];
}

export interface CurrentInstitution {
    nombre: string;
}

export interface CurrentRegional {
    id: number;
    codigo: string;
    codigoPresupuestario: string;
    nombre: string;
    telefono: string;
    correoElectronico: string;
    codigoDgsc2: number;
    codigoDgsc?: number
    esActivo: boolean | string;
    estatus: string;
    conocidoComo: string;
    ubicacionGeograficaJson: string;
}

export interface CurrentCircuito {
    id: number;
    codigo: string;
    nombre: string;
    estatus: string;
    regionalesId: number;
    codigoDgsc: number;
    codigoCircuito: number;
    telefono: string;
    correoElectronico: string;
    conocidoComo: string;
    codigoPresupuestario: string;
    esActivo: any;
    imagenUrl: string;
    ubicacionGeograficaJson: string;
}

export interface CurrentDirector {
    id: number;
    codigo: string;
    codigoPresupuestario: string;
    nombre: string;
    telefono: string;
    correoElectronico: string;
    codigoDgsc: number;
    estado: boolean;
    estatus: string;
}

export interface Directores {
    entityList: any[];
}

export interface Usuarios {
    entityList: any[];
}
