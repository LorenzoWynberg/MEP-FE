export interface PaginatedRequest {
    Pagina: number;
    CantidadPagina: number;
    TipoColumna?: string;
    Busqueda?: string;
    InstitucionId: number;
}

export interface SendMallaCurricularData {
    nivelOferta: object,
    sendData: MallaAsignaturaInstData,
    currentLevel: object,
    currentAsignatura: object
}

export interface MallaAsignaturaInstData {
    asignaturaGrupo: array;
    asignaturaId: number;
    cantidadLecciones: number;
    cantidadcreditos: number;
    componenteclasificacion: string;
    datosMallaCurricularinstitucion: object;
    elementosCatalogoId: number;
    estado: boolean
    mallaCurricularAsignaturaInstitucionId: number;
    mallaCurricularesInstitucionId: number;
    nivelId: number;
    nivelOfertaId: number;
    nombreAsignatura: string;
    nombreOferta: string;
    nombreTipoEvaluacion: string;
    nombreelementosCatalogo: string;
    nombreperiodo: string;
    notapromocion: number;
    opcional: boolean;
    periodoId: number;
    redondeo: number;
    rubricaAprendizaje: number;
    tipoEvaluacionId: number;
}
