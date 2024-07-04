import React, { useMemo, useState } from 'react'
import { TableReactImplementation } from 'Components/TableReactImplementation'

import moment from 'moment'
import { IconButton, Tooltip } from '@mui/material'

import TouchAppIcon from '@material-ui/icons/TouchApp'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

interface IProps {
	data?: any[]
	traslados: any[]
	trasladoData: any
	setOneTrasladoData: any
	setTrasladosData: any
}
const TableSolicitudes: React.FC<IProps> = (props) => {
  const [pagination, setPagination] = useState({
    totalCount: 0,
    page: 0
  })
  const { t } = useTranslation()
  const { currentInstitution } = useSelector((store) => store.authUser)
  const { traslados, trasladoData, setOneTrasladoData, setTrasladosData } =
		props

  const DEFAULT_COLUMNS = useMemo(() => {
    return [
      {
        label: '',
        column: '',
        accessor: 'faIcon',
        Header: '',
        Cell: ({ row }) => {
          if (row.original.tipoTraslado == 3) {
            return (
              <div className='sc-ieecCq mZnHO'>
                <div className='iconsContainer'>
                  <img
                    style={{ width: 50 }}
                    className='btn-primary'
                    src='/assets/img/centro-no-identificado.svg'
                    alt=''
                  />
                </div>
              </div>
            )
          } else {
            return (
              <div className='sc-ieecCq mZnHO'>
                <div className='iconsContainer'>
                  {' '}
                  <i
                    className={` btn-primary far ${row.original.faIcon} icon-3-fs`}
                    aria-hidden='true'
                  />
                </div>
              </div>
            )
          }
        }
      },
      {
        label: '',
        column: 'numeroSolicitud',
        accessor: 'numeroSolicitud',
        Header: t('estudiantes>traslados>gestion_traslados>solicitudes_traslado>columna_N_solicitud', 'N. Solicitud')
      },
      {
        label: 'identificacion',
        column: 'identificacion',
        accessor: 'identificacion',
        Header: t('estudiantes>traslados>gestion_traslados>solicitudes_traslado>columna_identificacion', 'Identificación')
      },
      {
        label: '',
        column: 'nombreEstudiante',
        accessor: 'nombreEstudiante',
        Header: t('estudiantes>traslados>gestion_traslados>solicitudes_traslado>columna_nombre', 'Nombre Completo')
      },
      {
        label: 'CE Resuelve',
        column: 'ceResuelve',
        accessor: 'ceResuelve',
        Header: t('estudiantes>traslados>gestion_traslados>solicitudes_traslado>columna_CE_resuelve', 'CE Resuelve')
      },
      {
        label: 'Fecha de solicitud',
        column: 'fechaHoraSolicitud',
        accessor: 'fechaHoraSolicitud',
        Header: t('estudiantes>traslados>gestion_traslados>solicitudes_traslado>columna_fecha_solicitud', 'Fecha de solicitud')
      },
      {
        label: '',
        column: '',
        accessor: 'statusColor',
        Header: 'Estado de la solicitud',
        Cell: ({ row }) => {
          if (row.original.faIcon) {
            return (
              <div className='iconsContainer'>
                <span
                  className={`badge badge-${row.original.statusColor} badge-pill`}
                >
                  {row.original.estado}
                </span>
              </div>
            )
          }
        }
      },
      {
        label: '',
        column: '',
        accessor: 'acciones',
        Header: 'Acciones',
        Cell: ({ _, row, data }) => {
          return (
            <div
              style={{
							  display: 'flex',
							  justifyContent: 'center',
							  alignItems: 'center',
							  alignContent: 'center'
              }}
            >
              <button
                style={{
								  border: 'none',
								  background: 'transparent',
								  cursor: 'pointer',
								  color: 'grey'
                }}
                onClick={() => {
								  console.clear()
								  const setTrasladoData = async () => {
								    await setOneTrasladoData(
								      row.original.id,
								      row.original.tipo
								    )
								  }
								  setTrasladoData()
                }}
              >
                <Tooltip title='Ver Solicitud'>
                  <IconButton>
                    <TouchAppIcon
                      style={{
											  fontSize: 30,
											  cursor: 'pointer'
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </button>
            </div>
          )
        }
      }
    ]
  }, [traslados, t])

  const trasladosEstado = {
    Cancelado: 'warning',
    'En espera': 'info',
    Aceptado: 'success',
    Rechazado: 'danger'
  }

  return (
    <TableReactImplementation
      backendPaginated={false}
      columns={DEFAULT_COLUMNS}
      data={
				traslados?.map((traslado) => {
				  return {
				    ...traslado,
				    faIcon:
							traslado.tipoTraslado == 1
							  ? 'fa-arrow-alt-circle-right'
							  : traslado.tipoTraslado == 2
							    ? 'fa-arrow-alt-circle-left'
							    : 'fa-desktop',

				    fechaHoraSolicitud: moment(
				      traslado.fechaHoraSolicitud
				    ).format('DD/MM/YYYY'),
				    itemSelected: traslado.id == trasladoData?.id,
				    statusColor: trasladosEstado[traslado.estado],
				    acciones: true
				  }
				}) || []
			}
      handleGetData={async (
			  searchValue: string,
			  column: string | undefined | null,
			  page
      ) => {
			  if (currentInstitution?.id) {
          await setTrasladosData(
			      currentInstitution?.id,
			      searchValue || 'all',
			      true,
			      true,
			      'nombreEstudiante',
			      'ASC',
			      page || 1,
			      50
			    )
        }
      }}
      orderOptions={[]}
      pageSize={10}
      paginationObject={{
			  totalCount: 0,
			  page: 0
      }}
      autoResetPage={false}
      backendSearch
    />
  )
}

export default TableSolicitudes
