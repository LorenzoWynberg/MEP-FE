import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import {
  Input,
  Row,
  Col,
  FormGroup,
  Card,
  CardBody,
  CardTitle,
  Container
} from 'reactstrap'
import SearchIcon from '@material-ui/icons/Search'
import Skeleton from '@material-ui/lab/Skeleton'
import { useSelector } from 'react-redux'
import {
  getInstitutionSedes,
  getInfoPresupuesto
} from '../../../../../../redux/institucion/actions'
import { useActions } from 'Hooks/useActions'
import RestoreIcon from '@material-ui/icons/Restore'

import JSONFormParser from 'Components/JSONFormParser/JSONFormParser'

import { GetByName } from 'Redux/formularios/actions'

import { GetInstitucion } from 'Redux/institucion/actions'
import { getCatalogs } from '../../../../../../redux/selects/actions'
import { catalogsEnumObj } from '../../../../../../utils/catalogsEnum'
import moment from 'moment'
import { HtmlTooltip } from '../../../../../../components/JSONFormParser/styles'
import { useWindowSize } from 'react-use'
import { useTranslation } from 'react-i18next'

const getInfo = async (data) => {
  await new Promise((resolve) => setTimeout(resolve, 3000))
  return data
}

const General = (props) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [informacionPresupuestaria, setInformacionPresupuestaria] = useState(
    []
  )
  const [sedes, setSedes] = useState([])
  const [data, setData] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [search, setSearch] = useState(false)
  const { width } = useWindowSize()
  const [pageData, setPageData] = useState<PageData | object>({ layouts: [] })
  const state = useSelector((store) => {
    return {
      sedes: store.institucion.sedes,
      institucionWithAditionalData: store.institucion.currentInstitution,
      presupuestosOfertas: store.institucion.informacionPresupuestaria,
      currentInstitution: store.authUser.currentInstitution,
      selects: store.selects
    }
  })

  const actions = useActions({
    getInstitutionSedes,
    getCatalogs,
    GetInstitucion,
    getInfoPresupuesto
  })

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setSedes([])
      setInformacionPresupuestaria([])
      await actions.getCatalogs(catalogsEnumObj.TIPOASOCIACION.id)
      await actions.getCatalogs(catalogsEnumObj.TIPOCE.id)
      await actions.GetInstitucion(state.currentInstitution.id)
      await actions.getInfoPresupuesto(state.currentInstitution.id)
      await actions.getInstitutionSedes()
      setLoading(false)
      try {
        const form = await GetByName('generalCE')
        setPageData(form.formulario)
      } catch (e) {
        setPageData({})
        setData([])
      }
    }

    loadData()
  }, [state.currentInstitution.id])

  useEffect(() => {
    setSedes(state.sedes)
  }, [state.sedes])

  const postData = async (data, editData = false) => { }

  const putData = async (data) => { }

  const objEstado = [
    { id: 1, nombre: 'ACTIVO' },
    { id: 2, nombre: 'EN PROCESO DE CIERRE' },
    { id: 3, nombre: 'CERRADO' },
    { id: 4, nombre: 'REUBICADO' },
    { id: 5, nombre: 'PROCESO DE APERTURA' },
    { id: 6, nombre: 'INACTIVO' }
  ]

  return (
    <div>
      {!loading
        ? (
          <div>
            <JSONFormParser
              pageData={pageData}
              mapFunctionObj={{}}
              postData={postData}
              putData={putData}
              deleteData={() => { }}
              dataForm={{
                '1_90d4ba36-584e-4f5d-6145-1eec25214429_301c8f69-bb14-585a-3244-5713195d51ff_col':
                  state.institucionWithAditionalData.nombre,
                '6d597f71-b229-0f19-6150-fd8753d1445c_301c8f69-bb14-585a-3244-5713195d51ff_col':
                  state.institucionWithAditionalData.codigo,
                '1_885c7d51-83d3-85f8-69d9-bd8feaff8ae2_301c8f69-bb14-585a-3244-5713195d51ff_col':
                  state.institucionWithAditionalData
                    .fechaFundacion
                    ? moment(
                      state.institucionWithAditionalData.fechaFundacion
                    ).format('DD/MM/YYYY')
                    : ' ',
                'bba3784b-65ea-eb61-1b55-3c94e16c6708_301c8f69-bb14-585a-3244-5713195d51ff_col':
                  state.institucionWithAditionalData.conocidoComo,
                '563ac934-869c-9ab6-a412-bdefcea0cfa7_c87e762b-9ebc-522f-f7b6-516bae11c3a1_col':
                  state.institucionWithAditionalData.motivoEstado,
                '1_e4d4ab42-0d1d-d43f-30ba-9a8fe36ba0f4_c87e762b-9ebc-522f-f7b6-516bae11c3a1_col':
                  objEstado.find((el) =>
                    el.id ==
                    state.institucionWithAditionalData.estadoId
                  )?.nombre,
                '66b7fb5c-faf0-5d95-bf1f-324291ed94c7_c87e762b-9ebc-522f-f7b6-516bae11c3a1_col':
                  state.selects[catalogsEnumObj.TIPOCE.name].find(
                    (s) =>
                      s.id ===
                      state.institucionWithAditionalData.datos?.find(
                        (d) => d.codigoCatalogo === 17
                      )?.elementoId
                  )?.nombre,
                '0d8e465d-3fcd-1370-bcf3-b12f6a4a69b4_301c8f69-bb14-585a-3244-5713195d51ff_col':
                  state.institucionWithAditionalData
                    .codigoPresupuestario
              }}
              data={data}
              statusColor={(item) => (true ? 'primary' : 'light')}
              readOnly
              w100
              labelStyle={{
                fontSize: '.75rem'
              }}
            />
          </div>
        )
        : (
          <Card className='pt-1r'>
            <CardBody>
              <CardTitle>
                <Skeleton
                  animation='wave'
                  variant='text'
                  height={60}
                  width='10%'
                />
              </CardTitle>
              <Row>
                <Col xs={2}>
                  <Skeleton
                    animation='wave'
                    variant='text'
                    width='100%'
                    height={60}
                  />
                </Col>
                <Col>
                  <Skeleton
                    animation='wave'
                    variant='text'
                    width='100%'
                    height='100%'
                  />
                </Col>
                <Col xs={3}>
                  <Skeleton
                    animation='wave'
                    variant='text'
                    width='100%'
                    height='100%'
                  />
                </Col>
                <Col xs={3}>
                  <Skeleton
                    animation='wave'
                    variant='text'
                    width='100%'
                    height='100%'
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Skeleton
                    animation='wave'
                    variant='text'
                    width='100%'
                    height={60}
                  />
                </Col>
                <Col>
                  <Skeleton
                    animation='wave'
                    variant='text'
                    width='100%'
                    height='100%'
                  />
                </Col>
                <Col md={6}>
                  <Skeleton
                    animation='wave'
                    variant='text'
                    width='100%'
                    height='100%'
                  />
                </Col>
              </Row>
            </CardBody>
          </Card>
        )}
      <Card className='pt-1r'>
        <CardBody
          style={
            width < 900 ? { paddingLeft: 0, paddingRight: 0 } : {}
          }
        >
          {width < 900
            ? (
              <div style={{ paddingLeft: '20px' }}>
                <CardTitle style={{ fontSize: '1.15rem' }}>
                  {t('expediente_ce>informacion_general>general>identificacion_presupues', 'Identificación presupuestaria')}
                </CardTitle>
              </div>
            )
            : (
              <CardTitle style={{ fontSize: '1.15rem' }}>
                {t('expediente_ce>informacion_general>general>identificacion_presupues', 'Identificación presupuestaria')}
              </CardTitle>
            )}
          <Container>
            {width > 900 && (
              <Row>
                <CenteredCol xs='12' md='3'>
                  <CustomLabel>
                    {t('expediente_ce>informacion_general>general>identificacion_presupues_codigos', 'Códigos presupuestarios')}
                  </CustomLabel>
                </CenteredCol>
                <CenteredCol xs='12' md='9'>
                  <CustomLabel>
                    {t('expediente_ce>informacion_general>general>identificacion_presupues_oferta', 'Oferta / Modalidad / Servicio asociado')}
                  </CustomLabel>
                </CenteredCol>
              </Row>
            )}
            {!loading &&
              width > 900 &&
              state.presupuestosOfertas.map((item) => {
                return (
                  <Row>
                    <Col xs='12' md='3'>
                      <FormGroup>
                        <Input
                          type='text'
                          disabled
                          value={`${item.codigoPresupuestario}`}
                        />
                      </FormGroup>
                    </Col>
                    <Col xs='12' md='9'>
                      <HtmlTooltip
                        title={`${item.oferta}/${item.modalidad
                          }${item.servicio
                            ? `/ ${item.servicio}`
                            : ''
                          }`}
                        placement='right'
                      >
                        <div>
                          <FormGroup>
                            <Input
                              type='text'
                              disabled
                              value={`${item.oferta
                                }/ ${item.modalidad
                                }${item.servicio
                                  ? `/ ${item.servicio}`
                                  : ''
                                }`}
                            />
                          </FormGroup>
                        </div>
                      </HtmlTooltip>
                    </Col>
                  </Row>
                )
              })}
            {!loading &&
              width < 900 &&
              state.presupuestosOfertas.map((item) => {
                return (
                  <Row
                    style={{
                      borderTop: '1px solid #000',
                      paddingTop: '0.25rem',
                      paddingBottom: '0.25rem'
                    }}
                  >
                    <Col
                      sm={12}
                      style={{
                        borderBottom:
                          '1px solid #eaeaea',
                        paddingTop: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <MobileItem>
                        <CenteredSpan>
                          {t('expediente_ce>informacion_general>general>identificacion_presupues_codigos', 'Códigos presupuestarios')}
                        </CenteredSpan>
                        <FormGroup>
                          <Input
                            type='text'
                            disabled
                            value={`${item.codigoOferta
                              }/ ${item.codigoModalidad
                              }${item.codigoServicio
                                ? `/ ${item.codigoServicio}`
                                : ''
                              }`}
                          />
                        </FormGroup>
                      </MobileItem>
                    </Col>
                    <Col
                      sm={12}
                      style={{
                        paddingTop: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <MobileItem>
                        <CenteredSpan>
                          {t('expediente_ce>informacion_general>general>identificacion_presupues_oferta', 'Oferta / Modalidad / Servicio asociado')}
                        </CenteredSpan>
                        <HtmlTooltip
                          title={`${item.oferta}/${item.modalidad
                            }${item.servicio
                              ? `/ ${item.servicio}`
                              : ''
                            }`}
                          placement='right'
                        >
                          <div>
                            <FormGroup>
                              <Input
                                type='text'
                                disabled
                                value={`${item.oferta
                                  }/ ${item.modalidad
                                  }${item.servicio
                                    ? `/ ${item.servicio}`
                                    : ''
                                  }`}
                              />
                            </FormGroup>
                          </div>
                        </HtmlTooltip>
                      </MobileItem>
                    </Col>
                  </Row>
                )
              })}
            {loading && (
              <Row>
                <Col>
                  <Skeleton
                    animation='wave'
                    variant='text'
                    width='100%'
                    height={60}
                  />
                </Col>
                <Col>
                  <Skeleton
                    animation='wave'
                    variant='text'
                    width='100%'
                    height='100%'
                  />
                </Col>
                <Col>
                  <Skeleton
                    animation='wave'
                    variant='text'
                    width='100%'
                    height='100%'
                  />
                </Col>
              </Row>
            )}
          </Container>
        </CardBody>
      </Card>
      <br />
      <Card>
        <CardBody
          style={
            width < 900 ? { paddingLeft: 0, paddingRight: 0 } : {}
          }
        >
          {width < 900
            ? (
              <div style={{ paddingLeft: '20px' }}>
                <CardTitle style={{ fontSize: '1.15rem' }}>
                  {t('expediente_ce>informacion_general>general>sedes', 'Sedes asociadas al centro educativo')}
                </CardTitle>
              </div>
            )
            : (
              <CardTitle style={{ fontSize: '1.15rem' }}>
                {t('expediente_ce>informacion_general>general>sedes', 'Sedes asociadas al centro educativo')}
              </CardTitle>
            )}

          <Container>
            {width > 900 ? (
              <>
                <Row
                  style={{ height: !search ? 0 : 'initial' }}
                >
                  <Col sm={3}>
                    <HiddenSearchInputContainer
                      search={search}
                    >
                      <HiddenSearchInput
                        value={searchValue}
                        search={search}
                        onChange={(e) => {
                          const { value } = e.target
                          setSearchValue(value)
                          setSedes(
                            state.sedes.filter(
                              (s) =>
                                s.codigo.search(
                                  value
                                ) >= 0
                            )
                          )
                        }}
                      />
                      {searchValue.length > 0 && (
                        <RestoreIcon
                          onClick={() => {
                            setSearchValue('')
                            setSedes(state.sedes)
                          }}
                        />
                      )}
                    </HiddenSearchInputContainer>
                  </Col>
                </Row>
                <Row style={{ alignItems: 'center' }}>
                  <CenteredCol
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <CustomLabel>{t('expediente_ce>informacion_general>general>sedes_codigo', 'Código')}</CustomLabel>
                    {/* <IconSearch>
                                            <SearchIcon onClick={() => {
                                                setSearch(!search)
                                                setSedes(state.sedes)
                                                setSearchValue("")
                                            }} />
                                        </IconSearch> */}
                  </CenteredCol>
                  <CenteredCol sm={3}>
                    <CustomLabel>
                      {t('expediente_ce>informacion_general>general>centro', 'Centro educativo')}
                    </CustomLabel>
                  </CenteredCol>
                  <CenteredCol sm={5}>
                    <CustomLabel>
                      {t('expediente_ce>informacion_general>general>sedes_ubicacion_adm', 'Ubicación administrativa')}
                    </CustomLabel>
                  </CenteredCol>
                  <CenteredCol>
                    <CustomLabel>
                      {t('expediente_ce>informacion_general>general>sedes_tipo', 'Tipo de asociación')}
                    </CustomLabel>
                  </CenteredCol>
                  <CenteredCol>
                    <CustomLabel>{t('expediente_ce>informacion_general>general>sedes_estado', 'Estado')}</CustomLabel>
                  </CenteredCol>
                </Row>
              </>
            ) : (
              <>
                <div style={{ position: 'relative' }}>
                  <Input
                    value={searchValue}
                    search={search}
                    onChange={(e) => {
                      const { value } = e.target
                      setSearchValue(value)
                      setSedes(
                        state.sedes.filter(
                          (s) =>
                            s.codigo.search(
                              value
                            ) >= 0
                        )
                      )
                    }}
                  />
                  <SearchIcon
                    style={{
                      position: 'absolute',
                      top: '30%',
                      right: '10px'
                    }}
                  />
                </div>
                <br />
              </>
            )}
            {!loading &&
              width >= 900 &&
              sedes.map((sede) => {
                return (
                  <Row>
                    <Col>
                      <FormGroup>
                        <Input
                          type='text'
                          disabled
                          value={sede.codigo}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm={3}>
                      <FormGroup>
                        <Input
                          type='text'
                          disabled
                          value={sede.nombre}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm={4}>
                      <HtmlTooltip
                        title={
                          sede.ubicacionAdministrativa
                            ? sede.ubicacionAdministrativa
                            : 'Sin titulo'
                        }
                        placement='right'
                      >
                        <div>
                          <FormGroup>
                            <Input
                              type='text'
                              disabled
                              value={
                                sede.ubicacionAdministrativa
                              }
                            />
                          </FormGroup>
                        </div>
                      </HtmlTooltip>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Input
                          type='text'
                          disabled
                          value={sede.tipoAsociacion}
                        />
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Input
                          type='text'
                          disabled
                          value={
                            sede.estado
                              ? 'ACTIVA'
                              : 'INACTIVA'
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                )
              })}
            {!loading &&
              width < 900 &&
              sedes.map((sede) => {
                return (
                  <Row
                    style={{
                      borderTop: '1px solid #000',
                      paddingTop: '0.25rem',
                      paddingBottom: '0.25rem'
                    }}
                  >
                    <Col
                      sm={12}
                      style={{
                        borderBottom:
                          '1px solid #eaeaea',
                        paddingTop: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <MobileItem>
                        <CenteredSpan>
                          Código
                        </CenteredSpan>
                        <FormGroup>
                          <Input
                            type='text'
                            disabled
                            value={sede.codigo}
                          />
                        </FormGroup>
                      </MobileItem>
                    </Col>
                    <Col
                      sm={12}
                      style={{
                        borderBottom:
                          '1px solid #eaeaea',
                        paddingTop: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <MobileItem>
                        <CenteredSpan>
                          Centro educativo
                        </CenteredSpan>
                        <FormGroup>
                          <Input
                            type='text'
                            disabled
                            value={sede.nombre}
                          />
                        </FormGroup>
                      </MobileItem>
                    </Col>
                    <Col
                      sm={12}
                      style={{
                        borderBottom:
                          '1px solid #eaeaea',
                        paddingTop: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <MobileItem>
                        <CenteredSpan>
                          Ubicación administrativa
                        </CenteredSpan>
                        <HtmlTooltip
                          title={
                            sede.ubicacionAdministrativa
                              ? sede.ubicacionAdministrativa
                              : 'Sin titulo'
                          }
                          placement='right'
                        >
                          <div>
                            <FormGroup>
                              <Input
                                type='text'
                                disabled
                                value={
                                  sede.ubicacionAdministrativa
                                }
                              />
                            </FormGroup>
                          </div>
                        </HtmlTooltip>
                      </MobileItem>
                    </Col>
                    <Col
                      sm={12}
                      style={{
                        borderBottom:
                          '1px solid #eaeaea',
                        paddingTop: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <MobileItem>
                        <CenteredSpan>
                          Tipo de asociación
                        </CenteredSpan>
                        <FormGroup>
                          <Input
                            type='text'
                            disabled
                            value={
                              sede.tipoAsociacion
                            }
                          />
                        </FormGroup>
                      </MobileItem>
                    </Col>
                    <Col
                      sm={12}
                      style={{
                        borderTop: '1px solid #eaeaea',
                        paddingTop: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <MobileItem>
                        <CenteredSpan>
                          Estado
                        </CenteredSpan>
                        <FormGroup>
                          <Input
                            type='text'
                            disabled
                            value={
                              sede.estado
                                ? 'ACTIVA'
                                : 'INACTIVA'
                            }
                          />
                        </FormGroup>
                      </MobileItem>
                    </Col>
                  </Row>
                )
              })}
            {loading && (
              <Row>
                <Col>
                  <Skeleton
                    animation='wave'
                    variant='text'
                    width='100%'
                    height={60}
                  />
                </Col>
                <Col>
                  <Skeleton
                    animation='wave'
                    variant='text'
                    width='100%'
                    height='100%'
                  />
                </Col>
                <Col>
                  <Skeleton
                    animation='wave'
                    variant='text'
                    width='100%'
                    height='100%'
                  />
                </Col>
                <Col>
                  <Skeleton
                    animation='wave'
                    variant='text'
                    width='100%'
                    height='100%'
                  />
                </Col>
              </Row>
            )}
          </Container>
        </CardBody>
      </Card>
    </div>
  )
}

const CenteredCol = styled(Col)`
	text-align: center;
`
const MobileItem = styled.div`
	width: 100%;
	display: grid;
	grid-template-columns: 30% 70%;
`

const HiddenSearchInputContainer = styled.div`
	width: ${(props) => (props.search ? '100%' : '0')};
	border: ${(props) => (props.search ? '' : '0')};
	transition: all 250ms ease 0s;
	display: flex;
	align-items: center;
`

const HiddenSearchInput = styled(Input)`
	border: ${(props) => (props.search ? '' : '0')};
`

const CenteredSpan = styled.span`
	display: flex;
	flex-direction: column;
	justify-content: center;
	font-size: 0.75rem !important;
`
const IconSearch = styled(SearchIcon)`
	margin: 0px 0px 8px 10px;
`

const CustomLabel = styled.label`
	font-size: 0.75rem;
`

export default General
