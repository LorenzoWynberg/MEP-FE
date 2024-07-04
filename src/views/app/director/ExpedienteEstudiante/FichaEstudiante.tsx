import React, { useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import colors from 'Assets/js/colors'
import { useSelector } from 'react-redux'
import { getIdentification } from 'Redux/identificacion/actions'
import { useActions } from 'Hooks/useActions'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import Tooltip from '@mui/material/Tooltip'
import EstudianteForm from './EstudianteForm'
import { withRouter } from 'react-router-dom'
import {
  getFichaPersona,
  getFichaPersonaDatosEducativos,
  getFamilyMembersFicha,
  cleanFicha
} from '../../../../redux/identificacion/actions'
import { catalogsEnumObj } from '../../../../utils/catalogsEnum'
import { getCatalogsSet } from 'Redux/selects/actions'
import { getDiscapacidades } from 'Redux/apoyos/actions'
import {getVerApoyosRecibidos,getVerApoyosNoRecibidos} from 'Redux/matricula/apoyos/actions'
import NavigationContainer from '../../../../components/NavigationContainer'
import { getRolesByUserId } from 'Redux/UsuarioCatalogos/actions'
import CuentaCorreo from './CuentaCorreo'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'

import { RiFileInfoLine } from 'react-icons/ri'
type IProps = {}

type IState = {
  identificacion: any
}

export const FichaEstudiante: React.FC<IProps> = (props) => {
  const {t} = useTranslation()
  const history = useHistory()

  const [InsititucionesConAcceso, setInsititucionesConAcceso] = useState<any[]>(
    []
  )
  const actions = useActions({
    cleanFicha,
    getIdentification,
    getFichaPersona,
    getFamilyMembersFicha,
    getCatalogsSet,
    getDiscapacidades,
    getVerApoyosRecibidos,
    getVerApoyosNoRecibidos,
    getFichaPersonaDatosEducativos,
    getRolesByUserId
  })
  useEffect(() => {
    debugger
    const catalogsArray = [
      catalogsEnumObj.IDENTIFICATION,
      catalogsEnumObj.ETNIAS,
      catalogsEnumObj.LENGUASINDIGENAS,
      catalogsEnumObj.ESTATUSMIGRATORIO,
      catalogsEnumObj.LENGUAMATERNA,
      catalogsEnumObj.SEXO,
      catalogsEnumObj.GENERO,
      catalogsEnumObj.ESTADOCIVIL,
      catalogsEnumObj.DISCAPACIDADES,
      catalogsEnumObj.TIPOSAPOYOS
    ]
    const response = actions.getCatalogsSet(catalogsArray)
  }, [])

  const state = useSelector((store: IState) => {
    return {
      identificacion: store.identification.dataFicha,
      miembros: store.identification.miembrosFicha,
      datosEducativos: store.identification.datosEducativosFicha,
      discapacidades: store.apoyos.discapacidadesIdentidad,
      userRoles: store.usuarioCatalogos.userRoles,
      auth: store.authUser,
      apoyosRecibidos:store.matriculaApoyos.verApoyosRecibidosIdentidad,
      apoyosNoRecibidos:store.matriculaApoyos.verApoyosNoRecibidosIdentidad,
    }
  })

  useEffect(() => {
    setInsititucionesConAcceso(
      state.datosEducativos.map((el) => el.centroEducativoId)
    )
  }, [state.datosEducativos])

  React.useEffect(() => {
    const fetch = async () => {
      await actions.getFichaPersona(props.match.params.studentId)
      await actions.getFichaPersonaDatosEducativos(props.match.params.studentId)
      await actions.getFamilyMembersFicha(props.match.params.studentId)
      actions.getRolesByUserId(props.match.params.studentId)
      actions.getDiscapacidades(props.match.params.studentId)
      actions.getVerApoyosRecibidos(props.match.params.studentId)
      actions.getVerApoyosNoRecibidos(props.match.params.studentId)
    }
    fetch()
    return () => {
      actions.cleanFicha()
    }
  }, [props.match.params.studentId])

  

  const actionsTable = [
    {
      actionName: 'button.remove',
      actionFunction: (ids: string[]) => {}
    }
  ]

  const actionRow = [
    {
      actionName: 'Visualizar',
      actionFunction: (item: any) => {
        props.history.push(`/director/ficha-estudiante/${item.idIdentidad}`)
      },
      actionDisplay: () => true
    }
  ]

  const columns = useMemo(() => {
    return [
      {
        Header: t('estudiantes>buscador_per>datos_acade>anio_ed', 'Año educativo'),
        column: 'anioEducativo',
        label: '',
        accessor:'anioEducativo' },
      {
        Header: t('estudiantes>buscador_per>datos_acade>oferta', 'Oferta / modalidad / servicio / especialidad4'),
        column: 'oferta',
        label: '',
        accessor:'oferta'
      },
      {
        Header: t('estudiantes>buscador_per>datos_acade>nivel_educativo', 'Nivel educativo'),
        column: 'nivel',
        label: '',
        accessor:'nivel'
      },
      {
        Header: t('estudiantes>buscador_per>datos_acade>centro_educativo', 'Centro educativo'),
        column: 'centroEducativo',
        label: '',
        accessor:'centroEducativo'
      },
      {
        Header: t('estudiantes>buscador_per>datos_acade>tipo_educativo', 'Tipo Centro'),
        column: 'tipoCentro',
        label: '',
        accessor:'tipoCentro'
    },
    ]
  },[t])

  const columnsEncargados = useMemo(() => {
    return [
      {
        Header: t("estudiantes>expediente>hogar>miembros_hogar>col_relacion_estudiante", "Relación con el estudiante"),
        column: 'parentesco',
        label: '',
        accessor: 'parentesco'
      },
      {
        Header: t("buscador_ce>ver_centro>datos_director>nombre", "Nombre completo"),
        column: 'nombre',
        label: '',
        accessor: 'nombre'
      },
      {
        Header: t('general>column>encargado','Encargado'),
        column: 'encargadoP',
        label: '',
        accessor: 'encargadoP'
      },
      {
        Header: t("configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>representante_legal", "Representante legal"),
        column: 'encargadoLegalP',
        label: '',
        accessor: 'encargadoLegalP'
      },
      {
        Header: t('general>column>acceso_al_sistema','Acceso a sistema'),
        column: 'accesoP',
        label: '',
        accessor: 'accesoP'
      },
      {
				Header: t("buscador_ce>buscador>columna_acciones", "Acciones"),
				column: '',
				accessor: '',
				label: '',
				Cell: ({ cell, row, data }) => {
					const fullRow = data[row.index]
					return (
						<div className="d-flex justify-content-center align-items-center">
							<Tooltip title={t("general>tooltip>visualizar","Visualizar")}>
								<RiFileInfoLine
									onClick={() => {
                    props.history.push(`/director/ficha-estudiante/${fullRow.idIdentidad}`)
									}}
									style={{
										fontSize: 30,
										color: colors.darkGray,
										cursor: 'pointer'
									}}
								/>
							</Tooltip>
						</div>
					)
				}
			}
    ]
  },[t])

  const columnsRoles = useMemo(() => {
    return [
      {
        Header: t(" dir_regionales>col_nombre", "Nombre",),
        column: 'rolAsignadoNombre',
        accessor: 'rolAsignadoNombre',
        label: ''
      },
      {
        Header: t("estudiantes>buscador_per>info_gen>acceso", "Nivel de acceso"),
        column: 'nivelAcceso',
        accessor: 'nivelAcceso',
        label: ''
      },
      {
        Header: t("configuracion>centro_educativo>ver_centro_educativo>asignar_director>editar>centros_educativos", "Centros educativos"),
        column: 'instituciones',
        accessor: 'instituciones',
        label: ''
      },
      {
        Header: t("estudiantes>buscador_per>info_gen>circuitos", "Circuitos"),
        column: 'circuitos',
        accessor: 'circuitos',
        label: ''
      },
      {
        Header: t("estudiantes>buscador_per>info_gen>regionales", "Regionales"),
        column: 'regionales',
        accesor: 'regionales',
        label: ''
      }
    ]
  }, [t])

  return (
    <AppLayout items={directorItems}>
      <Wrapper>
        <NavigationContainer
          goBack={() => {
            history.push('/director/buscador/estudiante')
          }}
        />
        <Title className='mt-2'>{t('estudiantes>buscador_per>info_gen>titulo', 'Información general de la persona')}</Title>
        {Object.keys(state.identificacion).length > 0 && (
          <>
            <EstudianteForm
              user={state.identificacion}
              discapacidades={state.discapacidades}
              apoyosRecibidos={state.apoyosRecibidos}
              apoyosNoRecibidos={state.apoyosNoRecibidos}
            />
            {state.datosEducativos?.length > 0 && <CuentaCorreo
              {...props}
              esPrivado={state.auth.currentInstitution.esPrivado}
              avoidChanges={
                !(
                  Boolean(state.auth.currentInstitution?.id) &&
                  InsititucionesConAcceso.includes(
                    state.auth.currentInstitution?.id
                  )
                )
              }
                                                  />}

            <SectionTable>
              <Titles>{t('estudiantes>buscador_per>info_gen>datos_acad_reg', 'Datos académicos registrados')}</Titles>
              <Subtitle>
                {t('estudiantes>buscador_per>info_gen>datos_acad_reg>msj', '*Sólo se muestran los últimos 3 años educativos')}
              </Subtitle>
              <TableReactImplementation
                data={state.datosEducativos}
                handleGetData={() => {}}
                orderOptions={[]}
                columns={columns}
              />
            
            </SectionTable>

            <SectionTable>
              <Titles>{t('estudiantes>buscador_per>info_gen>enc_est', 'Encargados del estudiante')}</Titles>
              <TableReactImplementation
                data={state.miembros.map((el) => {
                  return {
                    ...el,
                    encargadoP: el.encargado ? 'Si' : 'No',
                    encargadoLegalP: el.encargadoLegal ? 'Si' : 'No',
                    accesoP: el.acceso ? 'Si' : 'No'
                  }
                })}
                handleGetData={() => {}}
                orderOptions={[]}
                columns={columnsEncargados}
              />
             
            </SectionTable>
            <SectionTable>
              <Titles>{t('estudiantes>buscador_per>info_gen>roles', 'Roles')}</Titles>
              <TableReactImplementation
                data={state.userRoles}
                handleGetData={() => {}}
                orderOptions={[]}
                columns={columnsRoles}
              />
             
            </SectionTable>
          </>
        )}
      </Wrapper>
    </AppLayout>
  )
}

const Wrapper = styled.div``

const Title = styled.h3`
  color: #000;
`

const Titles = styled.h4`
  color: #000;
`

const Subtitle = styled.span`
  color: #000;
`

const SectionTable = styled.div`
  margin-top: 60px;
`

export default withRouter(FichaEstudiante)
