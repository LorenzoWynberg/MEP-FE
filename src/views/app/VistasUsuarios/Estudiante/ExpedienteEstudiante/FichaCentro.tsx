import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import { Row, Col, ModalBody, ModalHeader, Modal, Input as ReactstrapInput } from 'reactstrap'
import { useSelector } from 'react-redux'
import {
  getFichaCentro,
  getCenterOffers,
  cleanDataCenterOffersByYear
} from 'Redux/expedienteCentro/actions'
import { useActions } from 'Hooks/useActions'
import moment from 'moment'

import colors from '../../../../assets/js/colors'
import withRouter from 'react-router-dom/withRouter'

import zona from '../../../../components/JSONFormParser/utils/opciones/zona'
import regionSocioEconomica from '../../../../components/JSONFormParser/utils/opciones/regionSocioEconomica'
import { getEducationalYears } from '../../../../redux/anioEducativo/actions'
import HTMLTable from 'Components/HTMLTable'
import { WebMapView } from './_partials/contacto/MapView'
import Grid from '@material-ui/core/Grid'
import { Checkbox } from '@material-ui/core'
import StyledMultiSelect from '../../../../components/styles/StyledMultiSelect'
import {
  GetResponseByInstitutionAndFormName
} from '../../../../redux/formularioCentroResponse/actions'
import NavigationContainer from '../../../../components/NavigationContainer'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'

type IProps = {}

type IState = {
  expedienteCentro: any
}

const columns = [
  { column: 'fullOffer', label: 'Oferta / modalidad / servicio', width: 50 },
  { column: 'total', label: 'Matrícula', width: 20 }
]

const UbicacionGeografica = (props) => {
  const [location, setLoacation] = useState([])
  useEffect(() => {
    const loadData = async () => {
      try {
        const province = await axios.get(
          `${envVariables.BACKEND_URL}/api/Provincia/GetById/${props.locationForm['75bdf8ac-c36e-e47e-a007-37cdadbf954b']}`
        )
        const canton = await axios.get(
          `${envVariables.BACKEND_URL}/api/Canton/GetById/${props.locationForm['cd492ff2-eebd-3976-163e-5b88bc3684a0']}`
        )
        const distrito = await axios.get(
          `${envVariables.BACKEND_URL}/api/Distrito/GetById/${props.locationForm['66f130cc-0656-ff48-8710-708f230a9f9b']}`
        )
        setLoacation([
          province.data.nombre,
          canton.data.nombre,
          distrito.data.nombre
        ])
      } catch (err) {
        setDireccionData(['Sin definir', 'Sin definir', 'Sin definir'])
      }
    }
    loadData()
  }, [props.locationForm])
  const long = '07701069-2859-9339-c01e-a30f0b97ce86'
  const lat = 'd76f4ce6-5424-28e6-a236-58d3774ac9bc'

  React.useEffect(() => {
    if (props.search) {
      props.search.search(`${location.join(',')}, CRI`)
    }
  }, [props.search])

  return (
    <Card className='bg-white__radius'>
      <CardTitle>Ubicación geográfica</CardTitle>
      <Form>
        <Row>
          <Col md={6} sm={12}>
            <FormGroup>
              <Label>Provincia</Label>
              <Input name='provincia' readOnly value={location[0]} />
            </FormGroup>
            <FormGroup>
              <Label>Distrito</Label>
              <Input name='distrito' readOnly value={location[1]} />
            </FormGroup>
          </Col>
          <Col md={6} sm={12}>
            <FormGroup>
              <Label>Cantón</Label>
              <Input name='canton' readOnly value={location[2]} />
            </FormGroup>
            <FormGroup>
              <Label>Poblado</Label>
              <Input
                name='poblado'
                readOnly
                value={props.centroEducativo.poblado}
              />
            </FormGroup>
          </Col>
        </Row>
        <Checkbox
          checked={props.showMap}
          color='primary'
          onClick={() => {
            props.setShowMap(!props.showMap)
          }}
        />
        <CardLink
          onClick={() => {
            props.setShowMap(!props.showMap)
          }}
        >
          Ver dirección en mapa
        </CardLink>
        {props.showMap && (
          <Row>
            <Col style={{ minHeight: '496px' }} xs='12'>
              <WebMapView
                setLocation={() => {}}
                setSearch={props.setSearch}
                setUbicacion={() => {}}
                editable={false}
              />
            </Col>
            <Col xs='6'>
              <Label>Latitud</Label>
              <Input value={props.locationForm[lat]} disabled />
            </Col>
            <Col xs='6'>
              <Label>Longitud</Label>
              <Input value={props.locationForm[long]} disabled />
            </Col>
          </Row>
        )}
      </Form>
    </Card>
  )
}

export const FichaCentro: React.FC<IProps> = (props) => {
  const [locationForm, setLocationForm] = React.useState({})
  const [data, setData] = React.useState([])
  const [total, setTotal] = React.useState([])
  const [currentExtentions, setCurrentExtentions] = React.useState()
  const [search, setSearch] = React.useState(null)
  const [showMap, setShowMap] = React.useState(false)
  const [institutionImage, setInstitutionImage] = React.useState(null)
  const actions = useActions({
    getFichaCentro,
    getCenterOffers,
    getEducationalYears,
    cleanDataCenterOffersByYear
  })

  const state = useSelector((store: IState) => {
    return {
      centroEducativo: store.expedienteCentro.data,
      offers: store.expedienteCentro.offers,
      years: store.educationalYear.aniosEducativos
    }
  })

  React.useEffect(() => {
    const fetch = async () => {
      await actions.getFichaCentro(props.match.params.centroId)
      const response = await GetResponseByInstitutionAndFormName(
        props.match.params.centroId,
        'perfildelcentro'
      )
      setInstitutionImage(
        response.solucion
          ? JSON.parse(response.solucion)[
            'd3b5c6f3-65f8-d7e4-9f1c-79614c45f686_c4f172cf-8f80-999e-c5e7-a95cfbdc60b1_col'
          ]?.files[0]?.url
          : ''
      )
      const educationalYears = await actions.getEducationalYears()
      await actions.getCenterOffers(
        props.match.params.centroId,
        educationalYears.data[0].id
      )
    }
    fetch()
    actions.cleanDataCenterOffersByYear()
  }, [])

  React.useEffect(() => {
    setLocationForm(
      state.centroEducativo.ubicacion
        ? JSON.parse(state.centroEducativo.ubicacion)
        : {}
    )
  }, [state.centroEducativo.ubicacion])

  React.useEffect(() => {
    let _total = 0
    setData(
      state.offers.map((item) => {
        _total += item.total
        return {
          ...item,
          fullOffer: `${item.oferta}/${item.modalidad}/${
            item.servicio || 'SIN SERVICIO'
          }`
        }
      })
    )
    setTotal(_total)
  }, [state.offers])

  const fake: Array<any> = [
    {
      year: '2019',
      oferta: 'Oferta / modalidad / servicio / especialidad',
      matricula: 'Nivel'
    },
    {
      year: '2020',
      oferta: 'Oferta / modalidad / servicio / especialidad',
      matricula: 'Nivel'
    }
  ]

  const actionsTable = [
    {
      actionName: 'button.remove',
      actionFunction: (ids: string[]) => {
        //
      }
    }
  ]

  const actionRow = [
    {
      actionName: 'Visualizar',
      actionFunction: (item: any) => {
        //
      },
      actionDisplay: () => true
    }
  ]

  const CentroEducativo = () => {
    const centroTipo = state.centroEducativo.esPrivado ? 'Privado' : 'Público'
    const centroEstado = state.centroEducativo.estado ? 'Activo' : 'Inactivo'
    const fundacion = `${moment(state.centroEducativo.fechaFundacion).format(
      'DD/MM/YYYY'
    )}`
    return (
      <Card className='bg-white__radius'>
        <CardTitle>Centro educativo</CardTitle>
        <Form>
          <FormGroup>
            <Label>Nombre oficial</Label>
            <Input
              name='identificacion'
              value={state.centroEducativo.nombreOficial || ''}
              readOnly
            />
          </FormGroup>
          <Row>
            <Col
              md={5}
              className='d-flex align-items-center justify-content-center'
            >
              <Avatar
                src={institutionImage || '/assets/img/centro-educativo.png'}
                alt='Profile picture'
              />
            </Col>
            <Col md={7}>
              <FormGroup>
                <Label>Código</Label>
                <Input
                  name='codigo'
                  value={state.centroEducativo.codigoSaber || ''}
                  readOnly
                />
              </FormGroup>
              <FormGroup>
                <Label>Tipo de centro educativo</Label>
                <Input
                  name='tipo_centro'
                  value={centroTipo || ''}
                  readOnly
                />
              </FormGroup>
              <FormGroup>
                <Label>Estado del centro educativo</Label>
                <Input
                  name='estado_centro'
                  value={state.centroEducativo.estadoCentro || ''}
                  readOnly
                />
              </FormGroup>
            </Col>
          </Row>
          <FormGroup>
            <Label>Conocido como</Label>
            <Input
              name='conocidoComo'
              value={state.centroEducativo.conocidoComo || ''}
              autoComplete='off'
              readOnly
            />
          </FormGroup>
          <FormGroup>
            <Label>Fecha de fundación</Label>
            <Input
              name='fundacion'
              autoComplete='off'
              value={fundacion || ''}
              readOnly
              style={{ width: '30%' }}
            />
          </FormGroup>
          <FormGroup>
            <Label>Categorías vinculadas al centro educativo</Label>
            <StyledMultiSelect
              options={[]}
              selectedOptions={[]}
              editable={false}
            />
          </FormGroup>
        </Form>
      </Card>
    )
  }

  const DatosContacto = () => {
    return (
      <Card className='bg-white__radius'>
        <CardTitle>Datos de contacto</CardTitle>
        <Form style={{ width: '70%' }}>
          <FormGroup>
            <Label>Correo electrónico</Label>
            <Input
              name='identificacion'
              value={state.centroEducativo.email_1}
              readOnly
            />
          </FormGroup>
          <FormGroup>
            <Label>Dirección web</Label>
            <Input
              name='identificacion'
              readOnly
              value={state.centroEducativo.pagina}
            />
          </FormGroup>
          <StyledTable className='table-extention'>
            <HTMLTable
              columns={[
                {
                  label: 'Teléfonos',
                  column:
                    'f26f66d0-936a-b6f4-c161-4cd9a4b84339_89e0ec4e-1a1b-def9-311d-5136ff311910_col'
                },
                {
                  label: 'Descripción',
                  column:
                    'c8851fbf-ea92-4123-8678-ad474d14493f_89e0ec4e-1a1b-def9-311d-5136ff311910_col'
                }
              ]}
              data={
                state.centroEducativo.telefonos
                  ? state.centroEducativo.telefonos.map((el) => JSON.parse(el))
                  : []
              }
              actions={[]}
              pageSize={6}
              rollBackLabel={' '}
              isBreadcrumb={false}
              showHeadersCenter={false}
              editModalOpen={false}
              modalfooter
              tableName='label.ficha'
              loading={false}
              roundedStyle
              toggleEditModal={(el) => {
                if (Object.keys(el.tablesData).length > 0) {
                  setCurrentExtentions(el)
                }
              }}
              readOnly
              hideMultipleOptions
              disableSearch
            />
            <p>* Puede dar clic al teléfono para ver las extensiones.</p>
            <Modal isOpen={Boolean(currentExtentions)} keepMounted={false}>
              {currentExtentions && (
                <>
                  <ModalHeader
                    toggle={() => {
                      setCurrentExtentions()
                    }}
                  >
                    Extensiones
                  </ModalHeader>
                  <ModalBody>
                    <StyledTable>
                      <th>Extensión</th>
                      <th>Descripción</th>
                      {currentExtentions.tablesData[
                        '49465a64-9674-ec8c-e1a7-ac0b94bdd6e9_46eacd9e-16b2-c92b-fb3d-3722f850f5a2_col'
                      ] &&
                        currentExtentions.tablesData[
                          '49465a64-9674-ec8c-e1a7-ac0b94bdd6e9_46eacd9e-16b2-c92b-fb3d-3722f850f5a2_col'
                        ].map((item) => {
                          return (
                            <tr>
                              <td>{item.columnValues[0]?.value}</td>
                              <td>{item.columnValues[1]?.value}</td>
                            </tr>
                          )
                        })}
                    </StyledTable>
                  </ModalBody>
                </>
              )}
            </Modal>
          </StyledTable>
        </Form>
      </Card>
    )
  }

  const DatosDirector = () => {
    return (
      <Card className='bg-white__radius'>
        <CardTitle>Datos del director</CardTitle>
        <Form>
          <FormGroup>
            <Label>Identificación</Label>
            <Input
              name='identificacion'
              readOnly
              value={state.centroEducativo.identificacion}
              style={{ width: '30%' }}
            />
          </FormGroup>
          <FormGroup>
            <Label>Nombre completo</Label>
            <Input
              name='nombre'
              readOnly
              value={state.centroEducativo?.nombre}
              style={{ width: '70%' }}
            />
          </FormGroup>
          <FormGroup>
            <Label>Correo electrónico</Label>
            <Input
              name='nombre'
              readOnly
              value={state.centroEducativo?.email}
              style={{ width: '70%' }}
            />
          </FormGroup>
        </Form>
      </Card>
    )
  }

  const UbicacionAdministrativa = () => {
    return (
      <Card className='bg-white__radius'>
        <CardTitle>Ubicación administrativa</CardTitle>
        <Form>
          <FormGroup>
            <Label>Dirección regional</Label>
            <Input
              name='regional'
              readOnly
              value={state.centroEducativo?.regional}
              style={{ width: '70%' }}
            />
          </FormGroup>
          <FormGroup>
            <Label>Circuito</Label>
            <Input
              name='circuito'
              readOnly
              value={state.centroEducativo?.circuito}
              style={{ width: '70%' }}
            />
          </FormGroup>
        </Form>
      </Card>
    )
  }

  const UbicacionPoblacional = () => {
    return (
      <Card className='bg-white__radius'>
        <CardTitle>Ubicación poblacional</CardTitle>
        <Form>
          <FormGroup>
            <Label>Región socioeconómica</Label>
            {/* <Input
              name="region"
              type="select"
              readOnly={true}
              value={
                locationForm[
                  '47a5b311-01d4-fea6-9483-08bfeee22725_b347f9f9-c45a-774c-229d-609a4e963ff1_col'
                ]
              }
              style={{ width: '70%' }}
            >
              {regionSocioEconomica.map((item) => {
                return <option value={item.id}>{item.nombre}</option>
              })}
            </Input> */}
            <Input
              name='region'
              readOnly
              value={regionSocioEconomica[0]?.nombre}
              style={{ width: '70%' }}
            />
          </FormGroup>
          <FormGroup>
            <Label>Zona</Label>
            {/* <Input
              name="zona"
              type="select"
              readOnly={true}
              value={
                locationForm[
                  '1_9e604610-910a-d393-7926-47b9c6fea6eb_b347f9f9-c45a-774c-229d-609a4e963ff1_col'
                ]
              }
              style={{ width: '70%' }}
            >
              {zona.map((item) => {
                return <option value={item.id}>{item.nombre}</option>
              })}
            </Input> */}
            <Input
              name='region'
              readOnly
              value={zona[0]?.nombre}
              style={{ width: '70%' }}
            />
          </FormGroup>
          <FormGroup>
            <Label>Tipo de territorio</Label>
            {/* <Input
              name="tipo"
              type="select"
              readOnly={true}
              value={
                locationForm[
                  '32d9a522-a699-7c0d-dd6c-a345c3a19144_b347f9f9-c45a-774c-229d-609a4e963ff1_col'
                ]
              }
              style={{ width: '70%' }}
            >
              <option>Sin definir</option>
              {territorio.map((item) => {
                return <option value={item.id}>{item.nombre}</option>
              })}
            </Input> */}
            <Input
              name='region'
              readOnly
              value='Sin definir'
              style={{ width: '70%' }}
            />
          </FormGroup>
        </Form>
      </Card>
    )
  }

  const Ofertas = () => {
    return (
      <SectionTable>
        <CardTitle>Ofertas educativas</CardTitle>
        <Row>
          <Col style={{ display: 'flex' }} xs='12' md='6'>
            <Label>Año educativo</Label>
            <Input
              type='select'
              onChange={(e) => {
                const { value } = e.target
                actions.getCenterOffers(props.match.params.centroId, value)
              }}
            >
              {state.years.map((item) => {
                return <option value={item.id}>{item.nombre}</option>
              })}
            </Input>
          </Col>
          <Col>
            <p>Matrícula total del centro educativo {total}</p>
          </Col>
        </Row>

        <HTMLTable
          columns={columns}
          selectDisplayMode='thumblist'
          data={data}
          actions={actionsTable}
          pageSize={6}
          tableName='label.ficha'
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
          disableSearch
        />
      </SectionTable>
    )
  }

  return (
    <AppLayout items={directorItems}>
      <NavigationContainer
        goBack={() => {
          props.history.goBack()
        }}
      />
      <Wrapper>
        <Title>Información general del centro educativo</Title>
        <Row>
          <Col md={6} sm={12}>
            {CentroEducativo()}
            {DatosContacto()}
            {DatosDirector()}
          </Col>
          <Col md={6} sm={12}>
            {UbicacionAdministrativa()}
            <UbicacionGeografica
              locationForm={locationForm}
              search={search}
              centroEducativo={state.centroEducativo}
              setSearch={setSearch}
              showMap={showMap}
              setShowMap={setShowMap}
            />
            {UbicacionPoblacional()}
            {Ofertas()}
          </Col>
        </Row>
      </Wrapper>
    </AppLayout>
  )
}

const Wrapper = styled.div``

const Title = styled.h3`
  color: #000;
  margin: 5px 3px 25px;
`

const StyledTable = styled.table`
  border-spacing: 1.8rem;
  width: 100%;
`

const Card = styled.div`
  background: #fff;
  position: relative;
`

const CardTitle = styled.h5`
  color: #000;
  margin-bottom: 10px;
`

const Form = styled.form`
  margin-bottom: 20px;
`

const FormGroup = styled.div`
  margin-bottom: 10px;
`

const Label = styled.label`
  color: #000;
  display: block;
`

const MapContainer = styled(Grid)`
  @media (max-width: 870px) {
    height: 29rem;
  }
`

const Input = styled(ReactstrapInput)`
  padding: 10px;
  width: 100%;
  border: 1px solid #d7d7d7;
  background-color: #e9ecef;
  outline: 0;
  &:focus {
    background: #fff;
  }
`

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
`

const CardLink = styled.a`
  color: ${colors.primary};
`

const SectionTable = styled.div`
  margin-top: 20px;
`

export default withRouter(FichaCentro)
