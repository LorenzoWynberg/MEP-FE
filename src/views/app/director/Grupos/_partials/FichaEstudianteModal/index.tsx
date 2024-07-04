import React, { useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Button
} from 'reactstrap'
import ContentTab from 'Components/Tab/Content'
import HeaderTab from 'Components/Tab/Header'
import { useSelector } from 'react-redux'
import {
  getIdentification,
  getFichaPersona,
  getFichaPersonaDatosEducativos,
  getFamilyMembersFicha,
  cleanFicha
} from 'Redux/identificacion/actions'
import { useActions } from 'Hooks/useActions'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import EstudianteForm from '../../../ExpedienteEstudiante/EstudianteForm'

import { catalogsEnumObj } from 'utils/catalogsEnum'
import { getCatalogsSet } from 'Redux/selects/actions'
import { getDiscapacidades } from 'Redux/apoyos/actions'
import HTMLTable from 'Components/HTMLTable'
type IProps = {
    studentId: number
    show: boolean
    setShow: Function
}

type IState = {
    identificacion: any
    miembros: any
    datosEducativos: any
    discapacidades: any
}

const columns1 = [
  { column: 'anioEducativo', label: 'Año educativo', width: 10 },
  {
    column: 'oferta',
    label: 'Oferta / modalidad / servicio / especialidad',
    width: 25
  },
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

interface ILandingProps {
    text?: string
}
export const FichaEstudiante: React.FC<IProps> = (props) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState(0)
  const optionsTab = ['Estudiante', 'Datos Academicos', 'Encargados']
  const actions = useActions({
    cleanFicha,
    getIdentification,
    getFichaPersona,
    getFamilyMembersFicha,
    getCatalogsSet,
    getDiscapacidades,
    getFichaPersonaDatosEducativos
  })
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

  const state = useSelector<any, IState>((store: any) => {
    return {
      identificacion: store.identification.dataFicha,
      miembros: store.identification.miembrosFicha,
      datosEducativos: store.identification.datosEducativosFicha,
      discapacidades: store.apoyos.discapacidadesIdentidad
    }
  })

  const columns = useMemo(() => {
    return [
      {
        Header: 'Año educativo',
        column: 'anioEducativo',
        accessor: 'anioEducativo',
        label: ''
      },
      {
        Header: 'Oferta / modalidad / servicio / especialidad',
        column: 'oferta',
        accessor: 'oferta',
        label: ''
      },
      {
        Header: 'Nivel educativo',
        column: 'nivel',
        accessor: 'nivel',
        label: ''
      },
      {
        Header: 'Centro educativo',
        column: 'centroEducativo',
        accessor: 'centroEducativo',
        label: ''
      },
      {
        Header: 'Tipo Centro',
        column: 'tipoCentro',
        accessor: 'tipoCentro',
        label: ''
      }
    ]
  }, [])

  const columnsEncargados = useMemo(() => {
    return [
      {
        Header: 'Relación con el estudiante',
        column: 'parentesco',
        accessor: 'parentesco',
        label: ''
      },
      {
        Header: 'Nombre completo',
        column: 'nombre',
        accessor: 'nombre',
        label: ''
      },
      {
        Header: 'Encargado',
        column: 'encargado',
        accessor: 'encargado',
        label: ''
      },
      {
        Header: 'Representante legal',
        column: 'encargadoLegalP',
        accessor: 'encargadoLegalP',
        label: ''
      },
      {
        Header: 'Acceso a sistema',
        column: 'accesoP',
        accessor: 'accesoP',
        label: ''
      }
    ]
  }, [])

  React.useEffect(() => {
    if (!props.studentId) return

    setIsLoading(true)
    setActiveTab(0)

    const fetch = async () => {
      await actions.getFichaPersona(props.studentId)
      await actions.getFichaPersonaDatosEducativos(props.studentId)
      await actions.getFamilyMembersFicha(props.studentId)
      await actions.getDiscapacidades(props.studentId)
      setIsLoading(false)
    }
    fetch()
    /* return () => {
            actions.cleanFicha()
        } */
  }, [props.studentId])

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
        // props.history.push(`/director/ficha-estudiante/${item.idIdentidad}`)
      },
      actionDisplay: () => true
    }
  ]

  return (
    <Modal
      size='lg'
      style={{ maxWidth: '1300px', width: '100%' }}
      isOpen={props.show}
      toggle={() => props.setShow(!props.show)}
      scrollable
    >
      <ModalHeader toggle={() => props.setShow(!props.show)}>
        Ficha Informativa
      </ModalHeader>
      <ModalBody>
        <HeaderTab
          options={optionsTab}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        {isLoading || !props.studentId ? (
          <Loading>
            <div className='single-loading' />
          </Loading>
        ) : (
          <ContentTab activeTab={activeTab} numberId={activeTab}>
            {activeTab === 0 && (
              <EstudianteForm
                user={state.identificacion}
                discapacidades={state.discapacidades}
              />
            )}
            {activeTab === 1 && (
              <SectionTable>
                <Titles>Datos académicos registrados</Titles>
                <Subtitle>
                  *Sólo se muestran los últimos 3 años
                  educativos
                        </Subtitle>
                <TableReactImplementation
                  data={state.datosEducativos}
                  handleGetData={() => {}}
                  orderOptions={[]}
                  columns={columns}
                />
                {/* <HTMLTable
                                    columns={columns1}
                                    selectDisplayMode="thumblist"
                                    data={state.datosEducativos}
                                    isBreadcrumb={false}
                                    tableName="label.users"
                                    toggleEditModal={() => null}
                                    toggleModal={() => null}
                                    modalOpen={false}
                                    selectedOrderOption={{
                                        column: 'detalle',
                                        label: 'Nombre Completo',
                                    }}
                                    showHeaders={true}
                                    editModalOpen={false}
                                    modalfooter={true}
                                    loading={false}
                                    orderBy={false}
                                    totalRegistro={0}
                                    labelSearch={''}
                                    handlePagination={() => null}
                                    handleSearch={null}
                                    handleCardClick={(_: any) => null}
                                    hideMultipleOptions={true}
                                    readOnly={true}
                                    roundedStyle
                                    buttonSearch
                                /> */}
              </SectionTable>
            )}

            {activeTab === 2 && (
              <SectionTable>
                <Titles>Encargados del estudiante</Titles>
                <TableReactImplementation
                  data={state.miembros.map((el) => {
                      return {
                        ...el,
                        encargadoP: el.encargado
                          ? 'Si'
                          : 'No',
                        encargadoLegalP: el.encargadoLegal
                          ? 'Si'
                          : 'No',
                        accesoP: el.acceso ? 'Si' : 'No'
                      }
                    })}
                  handleGetData={() => {}}
                  orderOptions={[]}
                  columns={columnsEncargados}
                />
                {/* <HTMLTable
                                    columns={columnsEncargados}
                                    selectDisplayMode="thumblist"
                                    data={state.miembros.map((el) => {
                                        return {
                                            ...el,
                                            encargadoP: el.encargado
                                                ? 'Si'
                                                : 'No',
                                            encargadoLegalP: el.encargadoLegal
                                                ? 'Si'
                                                : 'No',
                                            accesoP: el.acceso ? 'Si' : 'No',
                                        }
                                    })}
                                    isBreadcrumb={false}
                                    actionRow={actionRow}
                                    tableName="label.fichaEstudiante"
                                    toggleEditModal={() => null}
                                    toggleModal={() => null}
                                    modalOpen={false}
                                    selectedOrderOption={{
                                        column: 'detalle',
                                        label: 'Nombre Completo',
                                    }}
                                    showHeaders={true}
                                    editModalOpen={false}
                                    modalfooter={true}
                                    loading={false}
                                    orderBy={false}
                                    totalRegistro={0}
                                    labelSearch={''}
                                    handlePagination={() => null}
                                    handleSearch={null}
                                    handleCardClick={(_: any) => null}
                                    hideMultipleOptions={true}
                                    readOnly={true}
                                    buttonSearch
                                    roundedStyle
                                /> */}
              </SectionTable>
            )}
          </ContentTab>
        )}
      </ModalBody>
      <ModalFooter style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          color='primary'
          onClick={() => props.setShow(!props.show)}
        >
          Cerrar
        </Button>
      </ModalFooter>
    </Modal>
  )
}

const Loading = styled.div`
    position: absolute;
    background: rgba(255, 255, 255, 0.7);
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
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

export default FichaEstudiante
