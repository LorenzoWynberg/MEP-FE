import React, { useState, useEffect } from 'react'
import {
  Row,
  Col,
  CardTitle,
  Card,
  CardBody,
  FormGroup,
  Label,
  Button
} from 'reactstrap'
import Select from 'react-select'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import ChartAndTable from './ChartAndTable'
import { useActions } from 'Hooks/useActions'
import reportesActions from '../../../../redux/reportes/actions'
import { useSelector } from 'react-redux'
import getObjectChildKeys from '../../../../utils/getObjectKeys'

interface SelectData {
	regionalId: number | null
	circuitoId: number | null
	institucionId: number | null
	modeloOfertaId: number | null
	especialidadId: number | null
}

interface IFilterValue {
	value: any
	name: string
}

interface IActionResponse {
	error: boolean | string
}

interface IActions {
	getStudentsNivel: (request: SelectData) => IActionResponse
	getStudentsDisabilites: (request: SelectData) => IActionResponse
	getStudentsNationalities: (request: SelectData) => IActionResponse
	getStudentsGenders: (request: SelectData) => IActionResponse
	getStudentsInstitutions: (request: SelectData) => IActionResponse
	getDataFromRegional: (regionalId: number) => IActionResponse
	getRegionales: () => IActionResponse
}

interface IReportesReducer {
	loading: boolean
	error: boolean
	personasEstudiantesNivel: any[]
	personasEstudiantesDiscapacidad: any[]
	personasEstudiantesNacionalidad: any[]
	personasEstudiantesGenero: any[]
	personasEstudiantesInstitucion: any[]
	regionales: any[]
	regionalData: any[]
}

const Tablero = (props) => {
  const [selectData, setSelectData] = useState<SelectData>({})
  const [circuitos, setCircuitos] = useState<any[]>([])
  const [instituciones, setInstituciones] = useState<any[]>([])
  const [modelos, setModelos] = useState<any[]>([])
  const [especialidades, setEspecialidades] = useState<any[]>([])

  const state: IReportesReducer = useSelector((store: any) => store.reportes)

  const actions: IActions = useActions(reportesActions)

  useEffect(() => {
    actions.getRegionales()
  }, [])

  useEffect(() => {
    if (selectData.regionalId) {
      actions.getDataFromRegional(selectData.regionalId?.id)
    }
  }, [selectData.regionalId])

  useEffect(() => {
    actions.getStudentsNivel(getObjectChildKeys(selectData, 'id'))
    actions.getStudentsDisabilites(getObjectChildKeys(selectData, 'id'))
    actions.getStudentsNationalities(getObjectChildKeys(selectData, 'id'))
    actions.getStudentsGenders(getObjectChildKeys(selectData, 'id'))
    actions.getStudentsInstitutions(getObjectChildKeys(selectData, 'id'))
  }, [selectData])

  useEffect(() => {
    const newCircuitos = []
    state.regionalData.forEach((regional) => {
      if (regional.circuitos) {
        regional.circuitos.forEach((circuito) => {
          newCircuitos.push({ ...circuito, id: circuito.CircuitoId })
        })
      }
    })
    setCircuitos(newCircuitos)
  }, [state.regionalData])

  useEffect(() => {
    const newInstituciones = []
    circuitos.forEach((circuito) => {
      if (
        circuito.Instituciones &&
				circuito.id === selectData.circuitoId?.id
      ) {
        circuito.Instituciones.forEach((institucion) => {
          newInstituciones.push({
            ...institucion,
            id: institucion.InstitucionId
          })
        })
      }
    })
    setInstituciones(newInstituciones)
  }, [selectData.circuitoId])

  useEffect(() => {
    const newModelos = []
    instituciones.forEach((institucion) => {
      if (
        institucion.ModeloOferta &&
				selectData.institucionId?.id === institucion.id
      ) {
        institucion.ModeloOferta.forEach((modelServ) => {
          newModelos.push({
            ...modelServ,
            id: modelServ.ModeloOfertaId
          })
        })
      }
    })
    setModelos(newModelos)
  }, [selectData.institucionId])

  useEffect(() => {
    const newEsp = []
    modelos.forEach((modelServ) => {
      if (
        modelServ.Especialidades &&
				modelServ.id === selectData.modeloOfertaId?.id
      ) {
        modelServ.Especialidades.forEach((esp) => {
          newEsp.push({ ...esp, id: esp.Especialidadid })
        })
      }
    })
    setEspecialidades(newEsp)
  }, [selectData.modeloOfertaId])

  const handleFilterChange = (value: IFilterValue | IFilterValue[]) => {
    const _selects = { ...selectData }
    if (Array.isArray(value)) {
      value.forEach((item) => {
        _selects[item.name] = item.value
      })
    } else {
      _selects[value.name] = value.value
    }
    setSelectData(_selects)
  }

  return (
    <>
      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <CardTitle>Filtrar datos</CardTitle>
              <div
                style={{
								  width: '100%',
								  justifyContent: 'flex-end',
								  display: 'flex'
                }}
              >
                <Button
                  color='primary'
                  onClick={() => {
									  setSelectData({})
                  }}
                >
                  Restablecer filtros
                </Button>
              </div>
              <div>
                <div style={{ display: 'flex' }}>
                  <FormGroup className='select-rounded-container__20'>
                    <Label>Filtrar por regional</Label>
                    <Select
                    components={{
											  Input: CustomSelectInput
                  }}
                    className='select-rounded react-select'
                    classNamePrefix='select-rounded react-select'
                    options={state.regionales}
                    getOptionLabel={(option: any) =>
											  option.nombre}
                    getOptionValue={(option: any) =>
											  option.id}
                    placeholder=''
                    value={selectData.regionalId || {}}
                    onChange={(value) => {
											  handleFilterChange([
											    {
											      value,
											      name: 'regionalId'
											    },
											    {
											      value: {},
											      name: 'circuitoId'
											    },
											    {
											      value: {},
											      name: 'institucionId'
											    },
											    {
											      value: {},
											      name: 'modeloOfertaId'
											    },
											    {
											      value: {},
											      name: 'especialidadId'
											    }
											  ])
                  }}
                  />
                  </FormGroup>
                  <FormGroup className='select-rounded-container__20'>
                    <Label>Filtrar por circuito</Label>
                    <Select
                    components={{
											  Input: CustomSelectInput
                  }}
                    className='select-rounded react-select'
                    classNamePrefix='select-rounded react-select'
                    options={[
											  {
											    id: null,
											    Circuitonombre:
														'Todos los circuitos'
											  },
											  ...circuitos
                  ]}
                    placeholder=''
                    getOptionLabel={(option: any) =>
											  option.Circuitonombre}
                    getOptionValue={(option: any) =>
											  option.id}
                    value={selectData.circuitoId || {}}
                    onChange={(value) => {
											  handleFilterChange([
											    {
											      value: value.id
											        ? value
											        : {},
											      name: 'circuitoId'
											    },
											    {
											      value: {},
											      name: 'institucionId'
											    },
											    {
											      value: {},
											      name: 'modeloOfertaId'
											    },
											    {
											      value: {},
											      name: 'especialidadId'
											    }
											  ])
                  }}
                  />
                  </FormGroup>
                  <FormGroup className='select-rounded-container__20'>
                    <Label>
                    Filtrar por centro educativo
										</Label>
                    <Select
                    components={{
											  Input: CustomSelectInput
                  }}
                    className='select-rounded react-select'
                    classNamePrefix='select-rounded react-select'
                    getOptionLabel={(option: any) =>
											  option.NombreInstitucion}
                    getOptionValue={(option: any) =>
											  option.id}
                    options={[
											  {
											    id: null,
											    NombreInstitucion:
														'Todas las instituciones'
											  },
											  ...instituciones
                  ]}
                    placeholder=''
                    value={
												selectData.institucionId || {}
											}
                    onChange={(value) => {
											  handleFilterChange([
											    {
											      value: value.id
											        ? value
											        : {},
											      name: 'institucionId'
											    },
											    {
											      value: {},
											      name: 'modeloOfertaId'
											    },
											    {
											      value: {},
											      name: 'especialidadId'
											    }
											  ])
                  }}
                  />
                  </FormGroup>
                </div>
                {selectData.institucionId && (
                  <div style={{ display: 'flex' }}>
                    <FormGroup className='select-rounded-container-50__20-margin'>
                    <Label>
                    Filtrar por modelo de oferta
											</Label>
                    <Select
                    components={{
												  Input: CustomSelectInput
                  }}
                    className='select-rounded react-select'
                    classNamePrefix='select-rounded react-select'
                    getOptionLabel={(option: any) =>
												  option.NombreModeloOferta}
                    getOptionValue={(option: any) =>
												  option.id}
                    options={[
												  {
												    id: null,
												    NombreModeloOferta:
															'Todos los modelos'
												  },
												  ...modelos
                  ]}
                    placeholder=''
                    value={
													selectData.modeloOfertaId ||
													{}
												}
                    onChange={(value) => {
												  handleFilterChange([
												    {
												      value: value.id
												        ? value
												        : {},
												      name: 'modeloOfertaId'
												    },
												    {
												      value: {},
												      name: 'especialidadId'
												    }
												  ])
                  }}
                  />
                  </FormGroup>
                    <FormGroup className='select-rounded-container-50'>
                    <Label>
                    Filtrar por especialidad
											</Label>
                    <Select
                    components={{
												  Input: CustomSelectInput
                  }}
                    className='select-rounded react-select'
                    classNamePrefix='select-rounded react-select'
                    getOptionLabel={(option: any) =>
												  option.NombreEspecialidad}
                    getOptionValue={(option: any) =>
												  option.id}
                    options={[
												  {
												    id: null,
												    NombreEspecialidad:
															'Sin especialidad'
												  },
												  ...especialidades
                  ]}
                    placeholder=''
                    value={
													selectData.especialidadId ||
													{}
												}
                    onChange={(value) => {
												  handleFilterChange({
												    value: value.id
												      ? value
												      : {},
												    name: 'especialidadId'
												  })
                  }}
                  />
                  </FormGroup>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <br />
      {selectData.regionalId && (
        <>
          <Row>
            <Col>
              <ChartAndTable
                chartLabel='Personas estudiantes matriculadas por nivel'
                chartType='column'
                columns={[
								  { column: 'modalidad', label: 'Modalidad' },
								  {
								    label: 'Especialidad / Servicio',
								    column: 'especialidad'
								  },
								  { column: 'nivel', label: 'Nivel' },
								  { column: 'total', label: 'Total' }
                ]}
                data={state.personasEstudiantesNivel.map(
								  (el) => ({
								    ...el,
								    value: el.total,
								    label: el.nivel
								  })
                )}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <ChartAndTable
                chartLabel='Personas estudiantes matriculadas por discapacidad'
                chartType='column'
                columns={[
								  {
								    column: 'discapacidad',
								    label: 'Discapacidad'
								  },
								  { label: 'Hombres', column: 'hombres' },
								  { column: 'mujeres', label: 'Mujeres' },
								  { column: 'total', label: 'Total' }
                ]}
                data={state.personasEstudiantesDiscapacidad.map(
								  (el) => ({
								    ...el,
								    value: el.total,
								    label: el.discapacidad
								  })
                )}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <ChartAndTable
                chartLabel='Personas estudiantes matriculadas por nacionalidad'
                chartType='column'
                columns={[
								  {
								    column: 'nacionalidad',
								    label: 'Nacionalidad'
								  },
								  { label: 'Hombres', column: 'hombres' },
								  { column: 'mujeres', label: 'Mujeres' },
								  { column: 'total', label: 'Total' }
                ]}
                data={state.personasEstudiantesNacionalidad.map(
								  (el) => ({
								    ...el,
								    value: el.total,
								    label: el.nacionalidad
								  })
                )}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <ChartAndTable
                chartLabel='Personas estudiantes matriculadas por género'
                chartType='pie'
                columns={[
								  { column: 'circuito', label: 'Circuito' },
								  { label: 'Hombres', column: 'hombres' },
								  { column: 'mujeres', label: 'Mujeres' },
								  { column: 'total', label: 'Total' }
                ]}
                data={state.personasEstudiantesGenero.map(
								  (el) => ({
								    ...el,
								    value: el.total,
								    label: el.genero
								  })
                )}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <ChartAndTable
                chartLabel='Personas estudiantes matriculadas por centro'
                chartType='column'
                columns={[
								  { column: 'circuito', label: 'Circuito' },
								  {
								    label: 'Institución',
								    column: 'institucion'
								  },
								  { label: 'Hombres', column: 'hombres' },
								  { column: 'mujeres', label: 'Mujeres' },
								  { column: 'total', label: 'Total' }
                ]}
                data={state.personasEstudiantesInstitucion.map(
								  (el) => ({
								    ...el,
								    value: el.total,
								    label: el.institucion
								  })
                )}
              />
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

export default Tablero
