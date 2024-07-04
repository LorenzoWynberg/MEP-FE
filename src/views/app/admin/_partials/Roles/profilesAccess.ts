export const accessRoles = (name) => {
  switch (name) {
    case 'Area Curricular':
    case 'Informacion General':
      return ['leer', 'modificar']
    default:
      return ['leer', 'modificar', 'agregar', 'eliminar']
  }
}
