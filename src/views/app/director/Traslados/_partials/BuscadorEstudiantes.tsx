import React, { useEffect, useState, useMemo } from 'react'
import { Col, Row } from 'reactstrap'

import { getStudentFilter, clearStudentsData } from 'Redux/traslado/actions.js'

import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import withRouter from 'react-router-dom/withRouter'
import { format, parseISO } from 'date-fns'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { RiFileInfoLine } from 'react-icons/ri'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import TouchAppIcon from '@material-ui/icons/TouchApp'
import { useTranslation } from 'react-i18next'

const BuscadorEstudiantes = (props) => {
  const { t } = useTranslation()
  const { onConfirm } = props
  const [data, setData] = useState<object[]>([])
  const { currentInstitution } = useSelector((state) => state.authUser)
  const [loading, setLoading] = useState(false)

  const actions = useActions({
    getStudentFilter,
    clearStudentsData
  })

  const columns = useMemo(() => {
    return [
      {
        Header: t('estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>columna_tipo_id', 'Tipo Identificación'),
        column: 'tipoIdentificacion',
        accessor: 'tipoIdentificacion',
        label: ''
      },
      {
        Header: t('estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>columna_identificacion', 'Identificación'),
        column: 'identificacion',
        accessor: 'identificacion',
        label: ''
      },
      {
        Header: t('estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>columna_nombre_ap', 'Nombre / Apellidos'),
        column: 'nombreEstudiante',
        accessor: 'nombreEstudiante',
        label: ''
      },
      {
        Header: t('estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>columna_fecha_nacimiento', 'Fecha de nacimiento'),
        column: 'fechaNacimientoP',
        accessor: 'fechaNacimientoP',
        label: ''
      },
      {
        Header: t('estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>columna_centro_educativo', 'Centro educativo'),
        column: 'institucion',
        accessor: 'institucion',
        label: ''
      },
      {
        Header: t('estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>columna_tipo_centro', 'Tipo de centro'),
        column: 'tipoInstitucion',
        accessor: 'tipoInstitucion',
        label: ''
      },
      {
        Header: t('estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>columna_nombre_direccion_regional', 'Nombre de dirección regional'),
        column: 'regional',
        accessor: 'regional',
        label: ''
      },
      {
        Header: t('estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>columna_acciones', 'Acciones'),
        column: '',
        accessor: '',
        label: '',
        Cell: ({ cell, row, data }) => {
          const fullRow = data[row.index]
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
                onClick={() => onConfirm(fullRow)}
              >
                <Tooltip title={t('boton>general>trasladar', 'Trasladar')}>
                  <IconButton>
                    <TouchAppIcon
                      style={{ fontSize: 30 }}
                    />
                  </IconButton>
                </Tooltip>
              </button>
            </div>
          )
        }
      }
    ]
  }, [t])

  useEffect(() => {
    return () => {
      actions.clearStudentsData()
    }
  }, [])

  const state = useSelector((store: any) => {
    return {
      ...store.traslado
    }
  })

  useEffect(() => {
    setData(
      state.studentsToTranslate.filter((el) => el.idInstitucion !== currentInstitution?.id).map((item) => {
        return {
          ...item,
          estadoP: !item.fallecido ? 'Activo' : 'Fallecido',
          institucion: `${item.codigoinstitucion} ${item.institucion}`,
          fechaNacimientoP: item.fechaNacimiento
            ? format(parseISO(item.fechaNacimiento), 'dd/MM/yyyy')
            : ''
        }
      })
    )
  }, [state.studentsToTranslate])
  return (
    <div>
      <Row>
        <Col xs={12}>
          <h3>{t('estudiantes>traslados>gestion_traslados>solicitar_hacia_mi_centro>estudiantes', 'Estudiantes')}</h3>
        </Col>
        <Col xs={12}>
          <TableReactImplementation
            data={data}
            handleGetData={async (
						  searchValue: string,
						  column: string | undefined | null
            ) => {
						  if (!searchValue) return
						  setLoading(true)
						  await actions.getStudentFilter(searchValue, 1, 100)
						  setLoading(false)
            }}
            columns={columns}
            orderOptions={[]}
            pageSize={10}
            backendSearch
          />
        </Col>
      </Row>
    </div>
  )
}

export default withRouter(BuscadorEstudiantes)
