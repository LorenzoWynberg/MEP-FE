import React, { useEffect } from 'react'
import styled from 'styled-components'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'

import { useSelector } from 'react-redux'
import { getIdentification } from 'Redux/identificacion/actions'
import { useActions } from 'Hooks/useActions'

import EstudianteForm from './EstudianteForm'
import { withRouter } from 'react-router-dom'
import { getFichaPersona, getFichaPersonaDatosEducativos, getFamilyMembersFicha, cleanFicha } from '../../../../redux/identificacion/actions'
import { catalogsEnumObj } from '../../../../utils/catalogsEnum'
import { getCatalogsSet } from 'Redux/selects/actions'
import { getDiscapacidades } from 'Redux/apoyos/actions'
import HTMLTable from 'Components/HTMLTable'
import NavigationContainer from '../../../../components/NavigationContainer'

type IProps = {};

type IState = {
    identificacion: any
};

const columns = [
  { column: 'anioEducativo', label: 'Año educativo', width: 10 },
  { column: 'oferta', label: 'Oferta / modalidad / servicio / especialidad', width: 25 },
  { column: 'nivel', label: 'Nivel educativo', width: 19 },
  { column: 'centroEducativo', label: 'Centro educativo', width: 20 },
  { column: 'tipoCentro', label: 'Tipo Centro', width: 20 }
]

const columnsEncargados = [
  { column: 'parentesco', label: 'Relación con el estudiante', width: 10 },
  { column: 'nombre', label: 'Nombre completo', width: 25 },
  { column: 'encargadoP', label: 'Encargado', width: 19 },
  { column: 'encargadoLegalP', label: 'Representante legal', width: 20 },
  { column: 'accesoP', label: 'Acceso a sistema', width: 20 }
]
const defuser = {
  id: 202
}
export const FichaEstudiante: React.FC<IProps> = (props) => {
  const actions = useActions({ cleanFicha, getIdentification, getFichaPersona, getFamilyMembersFicha, getCatalogsSet, getDiscapacidades, getFichaPersonaDatosEducativos })
  useEffect(() => {
    const catalogsArray = [
      catalogsEnumObj.IDENTIFICATION,
      catalogsEnumObj.ETNIAS,
      catalogsEnumObj.LENGUASINDIGENAS,
      catalogsEnumObj.ESTATUSMIGRATORIO,
      catalogsEnumObj.LENGUAMATERNA,
      catalogsEnumObj.SEXO,
      catalogsEnumObj.GENERO,
      catalogsEnumObj.ESTADOCIVIL,
      catalogsEnumObj.DISCAPACIDADES
    ]
    const response = actions.getCatalogsSet(catalogsArray)
  }, [])

  const state = useSelector((store: IState) => {
    return {
      identificacion: store.identification.dataFicha,
      miembros: store.identification.miembrosFicha,
      datosEducativos: store.identification.datosEducativosFicha,
      discapacidades: store.apoyos.discapacidadesIdentidad
    }
  })

  React.useEffect(() => {
    const fetch = async () => {
      await actions.getFichaPersona(props.match.params.studentId)
      await actions.getFichaPersonaDatosEducativos(props.match.params.studentId)
      await actions.getFamilyMembersFicha(props.match.params.studentId)
      actions.getDiscapacidades(props.match.params.studentId)
    }
    fetch()
    return () => {
      actions.cleanFicha()
    }
  }, [props.match.params.studentId])

  const actionsTable = [
    {
      actionName: 'button.remove',
      actionFunction: (ids: string[]) => {
      }
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

  return (
    <AppLayout items={directorItems}>
      <Wrapper>
        <NavigationContainer goBack={() => { props.history.goBack() }} />
        <Title>Información general de la persona</Title>
        {
                    Object.keys(state.identificacion).length > 0 &&
                      <>
                        <EstudianteForm user={state.identificacion} discapacidades={state.discapacidades} />
                        <SectionTable>
                          <Titles>Datos académicos registrados</Titles>
                          <Subtitle>*Sólo se muestran los últimos 3 años educativos</Subtitle>
                          <HTMLTable
                            columns={columns}
                            selectDisplayMode='thumblist'
                            data={state.datosEducativos}
                            isBreadcrumb={false}
                            tableName='label.users'
                            toggleEditModal={() => null}
                            toggleModal={() => null}
                            modalOpen={false}
                            selectedOrderOption={{ column: 'detalle', label: 'Nombre Completo' }}
                            showHeaders
                            editModalOpen={false}
                            modalfooter
                            loading={false}
                            orderBy={false}
                            totalRegistro={0}
                            labelSearch=''
                            handlePagination={() => null}
                            handleSearch={null}
                            handleCardClick={(_: any) => null}
                            hideMultipleOptions
                            readOnly
                            roundedStyle
                            buttonSearch
                          />
                        </SectionTable>

                        <SectionTable>
                          <Titles>Encargados del estudiante</Titles>
                          <HTMLTable
                            columns={columnsEncargados}
                            selectDisplayMode='thumblist'
                            data={state.miembros.map(el => {
                              return {
                                ...el,
                                encargadoP: el.encargado ? 'Si' : 'No',
                                encargadoLegalP: el.encargadoLegal ? 'Si' : 'No',
                                accesoP: el.acceso ? 'Si' : 'No'
                              }
                            })}
                            isBreadcrumb={false}
                            actionRow={actionRow}
                            tableName='label.fichaEstudiante'
                            toggleEditModal={() => null}
                            toggleModal={() => null}
                            modalOpen={false}
                            selectedOrderOption={{ column: 'detalle', label: 'Nombre Completo' }}
                            showHeaders
                            editModalOpen={false}
                            modalfooter
                            loading={false}
                            orderBy={false}
                            totalRegistro={0}
                            labelSearch=''
                            handlePagination={() => null}
                            handleSearch={null}
                            handleCardClick={(_: any) => null}
                            hideMultipleOptions
                            readOnly
                            buttonSearch
                            roundedStyle
                          />
                        </SectionTable>
                      </>
                }
      </Wrapper>
    </AppLayout>
  )
}

const Wrapper = styled.div``

const Title = styled.h3`color:#000;`

const Titles = styled.h4`color:#000;`

const Subtitle = styled.span`color:#000;`

const SectionTable = styled.div`
    margin-top: 60px;
`

export default withRouter(FichaEstudiante)
