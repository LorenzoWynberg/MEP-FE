import { useSelector } from 'react-redux'

export interface Section {
    id: number;
    Modulo: string;
    Apartado: string;
    Seccion: string;
}

export const Sections: Section[] = [
  {
    id: 1,
    Modulo: 'Expediente Estudiantil',
    Apartado: 'Informacion General',
    Seccion: 'Informacion General'
  },
  {
    id: 2,
    Modulo: 'Expediente Estudiantil',
    Apartado: 'Informacion de Contacto',
    Seccion: 'Informacion de Contacto'
  },
  {
    id: 3,
    Modulo: 'Expediente Estudiantil',
    Apartado: 'Informacion de Contacto',
    Seccion: 'Informacion de Residencia'
  },
  {
    id: 4,
    Modulo: 'Expediente Estudiantil',
    Apartado: 'Informacion de Contacto',
    Seccion: 'Informacion de Domicilio Temporal'
  },
  {
    id: 5,
    Modulo: 'Expediente Estudiantil',
    Apartado: 'Informacion del Hogar',
    Seccion: 'Otros Datos del estudiante'
  },
  {
    id: 6,
    Modulo: 'Expediente Estudiantil',
    Apartado: 'Informacion del Hogar',
    Seccion: 'Miembros del hogar'
  },
  {
    id: 7,
    Modulo: 'Expediente Estudiantil',
    Apartado: 'Informacion de Beneficios',
    Seccion: 'MEP'
  },
  {
    id: 8,
    Modulo: 'Expediente Estudiantil',
    Apartado: 'Informacion de Beneficios',
    Seccion: 'SINIRUBE'
  },
  {
    id: 9,
    Modulo: 'Expediente Estudiantil',
    Apartado: 'Apoyos Educativos',
    Seccion: 'Apoyos Educativos'
  },
  {
    id: 10,
    Modulo: 'Expediente Estudiantil',
    Apartado: 'Area Curricular',
    Seccion: 'Area Curricular'
  },
  {
    id: 11,
    Modulo: 'Expediente Estudiantil',
    Apartado: 'Salud',
    Seccion: 'Salud'
  },
  {
    id: 12,
    Modulo: 'Expediente Estudiantil',
    Apartado: 'Oferta Educativa',
    Seccion: 'Historial de centros Educativos'
  },
  {
    id: 13,
    Modulo: 'Expediente Estudiantil',
    Apartado: 'Oferta Educativa',
    Seccion: 'Informacion academica'
  },
  {
    id: 14,
    Modulo: 'Expediente Estudiantil',
    Apartado: 'Cuenta de Correo',
    Seccion: 'Cuenta de Correo'
  }
]

interface AuthSection {
    agregar: boolean | null;
    eliminar: boolean | null;
    id: number;
    leer: boolean | null;
    modificar: boolean | null;
    seccionId: number;
}

export const useAuthValidation = (currentSection: Section): AuthSection => {
  const state = useSelector((store) => {
    return store.authUser.currentRoleOrganizacion.perfiles
  })

  return (state.find(el => el.seccionId === currentSection.id) || {})
}

export const useAuthHandler = (currentSection: Section): any => {
  const state = useSelector((store) => {
    return store.authUser.currentRoleOrganizacion.perfiles
  })

  return (action, cb, toggleSnackbar = (variant, msg) => {}) => {
    const element = state.find(el => el.seccionId === currentSection.id)
    if (element[action]) {
      return (cb())
    } else {
      toggleSnackbar('error', 'No tiene autorización para realizar esta acción')
    }
  }
}
