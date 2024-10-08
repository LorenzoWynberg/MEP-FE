enum types {
  GET_SINGLE_LECTION = 'GET_SINGLE_LECTION',
  LOADING_LECTIONS = 'LOADING_LECTIONS',
  UPDATE_LECTION = 'UPDATE_LECTION',
  ADD_LECTION = 'CREATE_LECTION',
  DELETE_LECTION = 'DELETE_LECTION',
  GET_LECTIONS_BY_OFFER_INSTITUTION_ID = 'GET_LECTIONS_BY_OFFER_INSTITUTION_ID',
  GET_ALL_LECTIONS = 'GET_ALL_LECTIONS',
  SET_CURRENT_LECTION = 'SET_CURRENT_LECTION',
  GET_LECTIONS_SUBJECT_GROUP = 'GET_LECTIONS_SUBJECT_GROUP',
  ADD_LECTIONS_SUBJECT_GROUP = 'ADD_LECTIONS_SUBJECT_GROUP',
  UPDATE_LECTIONS_SUBJECT_GROUP = 'UPDATE_LECTIONS_SUBJECT_GROUP',
  REMOVE_LECTIONS_SUBJECT_GROUP = 'REMOVE_LECTIONS_SUBJECT_GROUP',
}

export interface Lection {
  id?: number;
  orden: number;
  nombre: string;
  horaInicio: Date;
  horaFin: Date;
  esReceso: boolean;
  horarioId: number;
}

export default types
