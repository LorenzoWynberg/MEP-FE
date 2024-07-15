import React, { useEffect, useState, useMemo } from 'react'
import { Col, Row, Container } from 'reactstrap'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import {
  filterInstitutionsPaginated,
  cleanInstitutions,
  GetServicioComunalByInstitucionId
} from '../../../../redux/configuracion/actions'
import withRouter from 'react-router-dom/withRouter'

import { TableReactImplementation } from 'Components/TableReactImplementation'
import { IoEyeSharp } from 'react-icons/io5'
import CancelIcon from '@mui/icons-material/RemoveCircle'
import Tooltip from '@mui/material/Tooltip'
import TouchAppIcon from '@material-ui/icons/TouchApp'
import BuildIcon from '@mui/icons-material/Build'
import {
  handleChangeInstitution,
  updatePeriodosLectivos,
  desactivarServicioComunal
} from '../../../../redux/auth/actions'
import BarLoader from 'Components/barLoader/barLoader'
import { useHistory } from 'react-router-dom'
import { CustomInput } from 'Components/CommonComponents'
import colors from 'assets/js/colors'
import { useTranslation } from 'react-i18next'
import { RemoveRedEyeRounded } from '@material-ui/icons'
import SimpleModal from 'Components/Modal/simple'

const HistoricoExpediente = (props) => {
  const [data, setData] = useState([])
  const [publicos, setPublicos] = useState(true)
  const [dropdownToggle, setDropdownToggle] = useState(false)
  const [firstCalled, setFirstCalled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [expediente, setExpediente] = useState(null)
  const { t } = useTranslation()
  const history = useHistory()

  const {
    hasAddAccess = true,
    hasEditAccess = true,
    hasDeleteAccess = true
  } = props

  const toggle = () => {
    setDropdownToggle(!dropdownToggle)
  }

  const { accessRole } = useSelector(
    (state: any) => state?.authUser?.currentRoleOrganizacion
  )
  const state = useSelector((store: any) => {
    return {
      centros: store.configuracion.instituciones,
      totalCount: store.configuracion.instituciones.totalCount,
      selects: store.selects,
      accessRole: store.authUser.currentRoleOrganizacion.accessRole,
      permisos: store.authUser.rolPermisos
    }
  })

  useEffect(() => {
    setLoading(true)
    actions
      .GetServicioComunalByInstitucionId(
        2
      )
      .then((data) => {
        console.log('data', data)
        setData(data.options)
        setLoading(false)
      })
  }, [accessRole])

  const columns = useMemo(() => {
    const tienePermiso = state.permisos.find(
      (permiso) => permiso.codigoSeccion == 'configurarinstituciones'
    )

    const BotonConfiguracion = (row) => {
      if (!tienePermiso || tienePermiso?.leer == 0) return <></>
      return (
        <Tooltip title={t('buscador_ce>buscador>columna_acciones>configurar', 'Configurar centro educativo')}>
          <BuildIcon
            onClick={() => {
              history.push(
                `/director/configuracion/centro/${row.institucionId}`
              )
            }}
            style={{
              fontSize: 25,
              color: colors.darkGray,
              cursor: 'pointer'
            }}
          />
        </Tooltip>
      )
    }
    return [
      {
        Header: t('expediente_estudiantil>area_proyecto', 'Area de Proyecto'),
        column: 'areaProyecto',
        accessor: 'areaProyecto',
        label: ''
      },
      {
        Header: t('expediente_estudiantil>nombre', 'Nombre'),
        column: 'nombreProyecto',
        accessor: 'nombreProyecto',
        label: ''
      },
      {
        Header: t('expediente_estudiantil>modalidad', 'Modalidad'),
        column: 'modalidadProyecto',
        accessor: 'modalidadProyecto',
        label: ''
      },
      {
        Header: t('expediente_estudiantil>cantidadEstudiantes', 'Cantidad Estudiantes'),
        column: 'cantidadEstudiantes',
        accessor: 'cantidadEstudiantes',
        label: ''
      },
      {
        Header: t('expediente_estudiantil>fecha_conclusion', 'Fecha de Conclusion'),
        column: 'fechaConclusionSCE',
        accessor: 'fechaConclusionSCE',
        label: ''
      },
      {
        Header: t('expediente_estudiantil>organizacion', 'Organizacion Contraparte'),
        column: 'organizacionContraparte',
        accessor: 'organizacionContraparte',
        label: ''
      },
      {
        Header: t('buscador_ce>buscador>columna_acciones', 'Acciones'),
        column: '',
        accessor: '',
        label: '',
        Cell: ({ _, row, data }) => {
          const fullRow = data[row.index]
          console.log('fullRow', fullRow)
          return (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '5px'
              }}
            >
              <Tooltip title={t('buscador_ce>buscador>columna_acciones>ficha', 'Ver ficha del SCE')}>
                <RemoveRedEyeRounded

                  onClick={() =>
                    props.history.push(
                      `/director/expediente-estudiante/servicio-comunal/${fullRow.id}`
                    )}
                  style={{
                    fontSize: 25,
                    color: colors.darkGray,
                    cursor: 'pointer'
                  }}
                />
              </Tooltip>

              <Tooltip title={t('expediente_estudiantil>eliminar', 'Eliminar Expediente')}>
                <CancelIcon
                  onClick={() => {
                    setExpediente(fullRow)
                  }}
                  style={{
                    fontSize: 25,
                    color: colors.darkGray,
                    cursor: 'pointer'
                  }}
                />
              </Tooltip>

              {/* {BotonConfiguracion(fullRow)} */}
            </div>
          )
        }
      }
    ]
  }, [t])

  const [pagination, setPagination] = useState({
    page: 1,
    selectedPageSize: 6,
    selectedColumn: '',
    searchValue: '',
    orderColumn: '',
    orientation: ''
  })

  const actions = useActions({
    filterInstitutionsPaginated,
    cleanInstitutions,
    GetServicioComunalByInstitucionId,
    handleChangeInstitution,
    updatePeriodosLectivos,
    desactivarServicioComunal
  })

  useEffect(() => {
    setFirstCalled(true)
    return () => {
      actions.cleanInstitutions()
    }
  }, [])

  const setInstitution = async (id) => {
    await actions.handleChangeInstitution(id)
    await actions.updatePeriodosLectivos(id)
  }

  return (
    <AppLayout items={directorItems}>
      <div className='dashboard-wrapper'>
        {loading && <BarLoader />}
        {expediente && <SimpleModal title="Eliminar Registro" onClose={() => setExpediente(null)}
          onConfirm={() => {
            actions.desactivarServicioComunal(expediente.id, history)
            setExpediente(null)
          }}
          openDialog={expediente}>Está seguro que desea eliminar este registro de Servicio Comunal Estudiantil?</SimpleModal>}
        <Container>
          <Row>
            <Col xs={12}>
              <h3>{t('expediente_ce>titulo', 'Expediente Centro Educativo')}</h3>
            </Col>
            {/* <Col xs={12}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}
              >
                <CustomInput
                  type="checkbox"
                  label="Buscar sólo centros educativos públicos"
                  checked={publicos}
                  onClick={() => {
                    setPublicos(!publicos)
                  }}
                />
              </div>
            </Col> */}
            <Col xs={12}>
              <TableReactImplementation
                data={data}
                showAddButton
                // avoidSearch
                onSubmitAddButton={() => { props.history.push('/director/expediente/servicio-comunal/registro') }}
                handleGetData={async (
                  searchValue,
                  _,
                  pageSize,
                  page,
                  column
                ) => {
                  setPagination({
                    ...pagination,
                    page,
                    pageSize,
                    column,
                    searchValue
                  })

                  if (firstCalled) {
                    setLoading(true)
                    await actions.getInstitucionesFinder(
                      publicos,
                      searchValue,
                      1,
                      250,
                      state.accessRole.nivelAccesoId == 3
                        ? state.accessRole
                          .organizacionId
                        : null,
                      state.accessRole.nivelAccesoId == 2
                        ? state.accessRole
                          .organizacionId
                        : null,
                      state.accessRole.nivelAccesoId == 1
                        ? state.accessRole
                          .organizacionId
                        : null
                    )
                    setLoading(false)
                  }
                }}
                columns={columns}
                orderOptions={[]}
                pageSize={10}
                backendSearch
              />
            </Col>
          </Row>
        </Container>
      </div>
    </AppLayout>
  )
}

export default withRouter(HistoricoExpediente)
