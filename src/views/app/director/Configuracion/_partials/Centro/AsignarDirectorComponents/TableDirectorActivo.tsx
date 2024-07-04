import React from 'react'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import moment from 'moment'
import { useTranslation } from 'react-i18next'

const convertDate = (str) => {
  if (str == null || str == '0001-01-01T00:00:00') { return 'No ha iniciado sesión' } else return moment(str).format('DD/MM/YYYY h:mm:ss a')
}

interface IProps {
	data?: any[]
}
const TableDirectorActivo: React.FC<IProps> = (props) => {
  const { t } = useTranslation()

  const DEFAULT_COLUMNS = [
    {
      label: '',
      column: 'identificacion',
      accessor: 'identificacion',
      Header: t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>columna_identificacion', 'Identificación')
    },
    {
      label: '',
      column: 'nombre',
      accessor: 'nombre',
      Header: t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>columna_nombre_completo', 'Nombre Completo')
    },
    {
      label: '',
      column: 'correo',
      accessor: 'email',
      Header: t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>columna_correo', 'Correo')
    },
    {
      label: '',
      column: 'sesion',
      accessor: 'ultimoInicioSesion',
      Header: t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>columna_ultimo_inicio_sesion', 'Último inicio de sesión'),
      Cell: ({ _, row, data }) => {
        const fullRow = data[row.index]
        return <>{convertDate(fullRow.ultimoInicioSesion)}</>
      }
      //	show: false
    },
    {
      label: '',
      column: 'roles',
      accessor: 'roles',
      Header: t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>columna_rol', 'Rol(es)')
    },
    {
      label: '',
      column: 'institucion',
      accessor: 'institucion',
      Header: t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>columna_centro _educativo', 'Centro educativo')
    },
    {
      label: '',
      column: 'estado',
      accessor: 'estado',
      Header: t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>columna_estado', 'Estado')
    },
    {
      label: '',
      column: 'acciones',
      accessor: 'acciones',
      Header: t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>columna_acciones', 'Acciones')
    }
  ]

  return (
    <TableReactImplementation
      avoidSearch
      backendPaginated={false}
      columns={DEFAULT_COLUMNS}
      data={props.data}
    />
  )
}

export default TableDirectorActivo
