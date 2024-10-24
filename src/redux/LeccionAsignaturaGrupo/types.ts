enum types {
  LOADING_LECTIONS_SUBJECT_GROUP = 'LOADING_LECTIONS_SUBJECT_GROUP',
  GET_LECTIONS_SUBJECT_GROUP = 'GET_LECTIONS_SUBJECT_GROUP',
  ADD_LECTIONS_SUBJECT_GROUP = 'ADD_LECTIONS_SUBJECT_GROUP',
  UPDATE_LECTIONS_SUBJECT_GROUP = 'UPDATE_LECTIONS_SUBJECT_GROUP',
  REMOVE_LECTIONS_SUBJECT_GROUP = 'REMOVE_LECTIONS_SUBJECT_GROUP',
  GET_LECTIONS_SUBJECT_GROUP_BY_LECTIONS = 'GET_LECTIONS_SUBJECT_GROUP_BY_LECTIONS',
  ADD_LECTIONS_SUBJECT_GROUP_MULTIPLE = 'ADD_LECTIONS_SUBJECT_GROUP_MULTIPLE',
}

export interface LectionSubjectGroup {
  id?: number;
  diaSemana: number;
  leccionId: number;
  asignaturaGrupoId: number;
  groupId?: number;
}

export default types
