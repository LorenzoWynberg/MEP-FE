import React, { useState, useEffect, useMemo } from 'react'
import { useWindowSize } from 'react-use'
import {
  FormGroup,
  Label,
  Input,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle
} from 'reactstrap'
import styled from 'styled-components'
import NavigationContainer from '../../../../../../components/NavigationContainer'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import {
  getCenterOffersByYear,
  getCenterOffers
} from '../../../../../../redux/expedienteCentro/actions'
import HTMLTable from 'Components/HTMLTable'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { IoEyeSharp } from 'react-icons/io5'

import { uniqBy } from 'lodash'
import { getGroupsByLevel } from '../../../../../../redux/grupos/actions'
import { useTranslation } from 'react-i18next'

const OfertasActivas = (props) => {
  const { t } = useTranslation()
  const { width } = useWindowSize()
  const actions = useActions({
    getCenterOffersByYear,
    getCenterOffers,
    getGroupsByLevel
  })
  const [selectedOffer, setSelectedOffer] = useState({})
  const [selectedModality, setSelectedModality] = useState({})
  const [selectedLvl, setSelectedLvl] = useState({})
  const [selectedGroup, setSelectedGroup] = useState({})
  const state = useSelector((store) => {
    return {
      institucion: store.authUser.currentInstitution,
      selectedActiveYear: store.authUser.selectedActiveYear,
      levels: store.expedienteCentro.levelsExpediente,
      // ofrMdlServ: store.expedienteCentro.offers,
      // edYears: store.educationalYear.aniosEducativos,
      grupos: store.grupos.groups
    }
  })
  const { offers } = useSelector((store) => store.expedienteCentro)
  useEffect(() => {
    if (state.institucion?.id) {
      actions.getCenterOffersByYear(
        state.institucion?.id,
        state.selectedActiveYear?.id
      )
      actions.getCenterOffers(
        state.institucion?.id,
        state.selectedActiveYear?.id
      )
    }
    setSelectedOffer({})
    setSelectedModality({})
    setSelectedLvl({})
  }, [state.institucion, state.selectedActiveYear])

  // useEffect(() => {
  // 	if (offers?.le)
  // }, [offers])

  const firstStyles = {
    borderTopLeftRadius: '15px',
    borderBottomLeftRadius: '15px',
    backgroundColor: 'white'
  }
  const midStyles = {
    backgroundColor: 'white'
  }
  const lastStyles = {
    borderTopRightRadius: '15px',
    borderBottomRightRadius: '15px',
    backgroundColor: 'white'
  }
  const data = useMemo(() => {
    console.clear()
    console.log('offers', offers)
    console.log('uniqData', uniqBy(offers, 'offrMdlServId').map((item) => ({
      ...item,
      servicio: item.servicio || 'SIN SERVICIO'
    })))
    return uniqBy(offers, 'offrMdlServId').map((item) => ({
      ...item,
      servicio: item.servicio || 'SIN SERVICIO'
    })) || []
  }, [offers])

  const columns = useMemo(() => {
    return props.columns.map((el) => ({
      ...el,
      accessor: el.column,
      Header: el.label
    }))
  }, [props.columns])

  return (
    <section>
      {/* <Col md={4} xs={12}>
        <FormGroup>
          <Label>Año educativo</Label>
          <Input type="text" value={state.selectedActiveYear?.nombre} />
        </FormGroup>
      </Col> */}
      {selectedOffer.offrMdlServId ? (
        <>
          <NavigationContainer
            goBack={() => {
						  setSelectedOffer({})
						  setSelectedModality({})
						  setSelectedLvl({})
						  setSelectedGroup({})
            }}
          />
          <Container>
            <Card className='pt-1r'>
              <CardBody>
                <CardTitle>{t('expediente_ce>ofertas_educativas>detalle_ofertas', 'Detalle de oferta')}</CardTitle>

                <Row>
                  <Col>
                    <StyledTable>
                    <tr>
                    <th>Oferta</th>
                    <th>Modalidad</th>
                    <th>Servicio</th>
                    <th>Especialidad</th>
                    <th>Matrícula</th>
                  </tr>
                    {uniqBy(
											  offers.filter(
											    (item) =>
											      item.offrMdlServId ===
														selectedOffer.offrMdlServId
											  ),
											  'especialidadId'
                  ).map((item) => {
											  return (
  <Item
    active={
															selectedModality.especialidadId ===
															item.especialidadId
														}
    onClick={() => {
														  setSelectedModality(
														    item
														  )
														  setSelectedLvl({})
    }}
  >
    <td style={firstStyles}>
      {item.oferta}
    </td>
    <td style={midStyles}>
      {item.modalidad}
    </td>
    <td style={midStyles}>
      {item.servicio ||
																'SIN SERVICIO'}
    </td>
    <td style={midStyles}>
      {item.especialidad ||
																'SIN ESPECIALIDAD'}
    </td>
    <td style={lastStyles}>
      {item.total}
    </td>
  </Item>
											  )
                  })}
                  </StyledTable>
                  </Col>
                </Row>
              </CardBody>
            </Card>

            <br />
            {selectedModality.offrMdlServId && (
              <Row>
                <Col>
                  <Card className='pt-1r'>
                    <CardBody>
                    <StyledTable>
                    <tr>
                    <th className='centered'>
                    Nivel
													</th>
                    <th className='centered'>
                    Hombres
													</th>
                    <th className='centered'>
                    Mujeres
													</th>
                    <th className='centered'>
                    Total
													</th>
                    <th className='centered' />
                  </tr>
                    {state.levels
												  .filter((item) => {
												    return (
												      item.entidadMatriculaId ===
															selectedModality.entidadMatriculaId
												    )
												  })
												  .map((lvl) => {
												    return (
  <Item
    active={
																	selectedLvl.nivelId ===
																	lvl.nivelId
																}
    onClick={() => {
																  setSelectedLvl(
																    lvl
																  )
																  actions.getGroupsByLevel(
																    lvl.nivelId,
																    state
																      .institucion
																      ?.id
																  )
    }}
  >
    <td className='centered'>
      {
																		lvl.nivelNombre
																	}
    </td>
    <td className='centered'>
      {
																		lvl.hombres
																	}
    </td>
    <td className='centered'>
      {
																		lvl.mujeres
																	}
    </td>
    <td className='centered'>
      {lvl.hombres +
																		lvl.mujeres}
    </td>
    <td className='centered'>
      Detalle
    </td>
  </Item>
												    )
												  })}
                  </StyledTable>
                  </CardBody>
                  </Card>
                  <br />
                  <Card className='pt-1r'>
                    <CardBody>
                    <StyledTable>
                    <tr>
                    <th className='centered'>
                    Grupo
													</th>
                    <th className='centered'>
                    Hombres
													</th>
                    <th className='centered'>
                    Mujeres
													</th>
                    <th className='centered'>
                    Total
													</th>
                    <th className='centered' />
                  </tr>
                    {selectedLvl.nivelId &&
													state.grupos.map(
													  (group) => {
													    return (
  <Item
    onClick={() => {
																	  setSelectedGroup(
																	    group
																	  )
    }}
  >
    <td className='centered'>
      {
																			group.grupo
																		}
    </td>
    <td className='centered'>
      {
																			group.hombres
																		}
    </td>
    <td className='centered'>
      {
																			group.mujeres
																		}
    </td>
    <td className='centered'>
      {
																			group.estudiantesMatriculados
																		}
    </td>
    <td className='centered'>
      {/* <Link
                                    to={`/director/expediente-centro/mibel/${selectedLvl.nivelId}/grupo/${group.grupoId}`}
                                  >
                                    Detalle
                                  </Link> */}
    </td>
  </Item>
													    )
													  }
													)}
                  </StyledTable>
                  </CardBody>
                  </Card>
                  <br />
                </Col>
              </Row>
            )}
          </Container>
        </>
      ) : (
        <>
          <h3 className='my-3'>{t('expediente_ce>ofertas_educativas>detalle_ofertas', 'Detalle de oferta')}</h3>
          <TableReactImplementation
            columns={columns}
						// avoidSearch
            data={data}
          />
          <div className='my-3' />
        </>
      )}
    </section>
  )
}

const Item = styled.tr`
	border: ${(props) => (props.active ? '1.85px solid #155388' : 'none')};
	color: #155388;
	cursor: pointer;
	box-shadow: -2px 0px 5px rgba(0, 0, 0, 0.04);
`

const StyledTable = styled.table`
	border-spacing: 1rem;
	width: 100%;
	padding: 5px;
	tr {
		td,
		th {
			padding: 5px;
			width: 10rem;
		}

		.centered {
			text-align: center;
		}
	}
`

export default OfertasActivas
