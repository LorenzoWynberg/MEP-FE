import React from 'react'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { useTranslation } from 'react-i18next'

interface IProps {
    data?: any[]
}
const TableDirectoresAnteriores:React.FC<IProps> = (props) => {
  const { t } = useTranslation()

  const DEFAULT_COLUMNS = [
    {
      label: '',
      column: 'identificacion',
      accessor: 'identificacion',
      Header: t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>columna_identificacion', 'Identificación')
    }, {
      label: '',
      column: 'nombre',
      accessor: 'nombre',
      Header: t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>columna_nombre_completo', 'Nombre Completo')
    }, {
      label: '',
      column: 'rol',
      accessor: 'rol',
      Header: t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>columna_rol', 'Rol(es)')
    }, {
      label: '',
      column: 'rige',
      accessor: 'rige',
      Header: t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>columna_rige', 'Rige')
    }, {
      label: '',
      column: 'vence',
      accessor: 'vence',
      Header: t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>columna_vence', 'Vence')
    }, {
      label: '',
      column: 'tiempoFuncion',
      accessor: 'tiempoFuncion',
      Header: t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>columna_tiempo_en_funcion', 'Tiempo en función')
    }, {
      label: '',
      column: 'estado',
      accessor: 'estado',
      Header: t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>columna_estado', 'Estado'),
      Cell: ({ cell, row, data }) => {
        const rowData = data[row.index]
        if (rowData.estado) { return <>Activo</> } else { return <>Inactivo</> }
      }
    }
  ]

  return (
    <TableReactImplementation avoidSearch backendPaginated={false} columns={DEFAULT_COLUMNS} data={props.data || []} />
  )
}

export default TableDirectoresAnteriores
