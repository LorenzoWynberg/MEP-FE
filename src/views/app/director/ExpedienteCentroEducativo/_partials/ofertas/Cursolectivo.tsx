import React, { useState, useEffect } from 'react'
import { useWindowSize } from 'react-use'
import {
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
import { useSelector } from 'react-redux'
import { getCursosLectivosByYear } from '../../../../../../redux/cursoLectivo/actions'
import { useActions } from 'Hooks/useActions'
import { getLvlOfferByCursoLectivoAndInst } from '../../../../../../redux/modelosOferta/actions'
import { format, parseISO } from 'date-fns'
import { useTranslation } from 'react-i18next'

const CursoLectivo = (props) => {
  const { t } = useTranslation()
  const { width } = useWindowSize()
  const [selectedCurso, setSelectedCurso] = useState({})
  const [selectedLvl, setSelectedLvl] = useState({})
  const [selectedActivity, setSelectedActivity] = useState({})
  const [currentYear, setCurrentYear] = useState(null)
  const state = useSelector((store) => {
    return {
      institucion: store.authUser.currentInstitution,
      cursos: store.cursoLectivo.cursosLectivos,
      edYears: store.educationalYear.aniosEducativos,
      lvlOffers: store.modelosOfertas.levelOffers
    }
  })
  const actions = useActions({
    getCursosLectivosByYear,
    getLvlOfferByCursoLectivoAndInst
  })

  useEffect(() => {
    actions.getCursosLectivosByYear(currentYear || 1)
    setSelectedCurso({})
  }, [currentYear, state.institucion.id])

  const actividades = []

  return (
    <section>
      <Container>
        <Row>
          <Col md={5} xs={12}>
            <div
              style={{
							  display: 'flex',
							  justifyContent: 'space-between'
              }}
            >
              <div style={{ width: '45%' }}>
                <Label>{t('buscador_ce>ver_centro>ofertas educativas>año_educativo', 'Año educativo')}</Label>
                <Input
                  type='select'
                  onChange={(e) => {
									  setCurrentYear(e.target.value)
                  }}
                >
                  {state.edYears.map((year) => (
                    <option value={year.id}>
                    {year.nombre}
                  </option>
                  ))}
                </Input>
              </div>
              <div>
                <Label>{t('estudiantes>matricula_estudiantil>curso_lectivo', 'Curso lectivo')}</Label>
                <Input
                  type='text'
                  value={selectedCurso.nombre}
                  disabled
                />
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={8} xs={12}>
            <StyledTable>
              <tr>
                <th>{t('estudiantes>matricula_estudiantil>curso_lectivo', 'Curso lectivo')}</th>
                <th>{t('configuracion>anio_educativo>agregar>fecha_inicio', 'Fecha inicia')}</th>
                <th>{t('configuracion>anio_educativo>agregar>fecha_final', 'Fecha fin')}</th>
              </tr>
              {state.cursos.map((item) => {
							  console.log(item, 'ITEM')
							  return (
  <Item
    active={selectedCurso.id === item.id}
    onClick={() => {
										  setSelectedCurso(item)
										  actions.getLvlOfferByCursoLectivoAndInst(
										    item.id,
										    state.institucion.id
										  )
    }}
  >
    <td>
      {item.calendarios.map(
											  (e) => e.nombre
      )}
    </td>
    <td>
      {item.fechaInicio
											  ? format(
											    parseISO(
											      item.fechaInicio
											    ),
											    'dd/MM/yyyy'
												  )
											  : '12/12/2020'}
    </td>
    <td>
      {item.fechaFinal
											  ? format(
											    parseISO(
											      item.fechaFinal
											    ),
											    'dd/MM/yyyy'
												  )
											  : '12/12/2020'}
    </td>
  </Item>
							  )
              })}
            </StyledTable>
          </Col>
        </Row>
        <br />
        {selectedCurso.id && (
          <Row>
            <Col md={6} xs={12}>
              <Card>
                <CardBody>
                  <CardTitle>{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>ofertas_relacionadas>columna_niveles_asociados', 'Niveles asociados')}</CardTitle>
                  <StyledTable>
                    <tr>
                    <th className='centered'>
                    {t('buscador_ce>ver_centro>ofertas educativas>columna_oferta', 'Oferta/ Modalidad/ Servicio')}
                  </th>
                    <th className='centered'>{t('configuracion>ofertas_educativas>niveles>agregar>nivel', 'Nivel')}</th>
                  </tr>
                    {state.lvlOffers
										  .sort((a, b) => {
										    if (a.nivelId > b.nivelId) {
										      return -1
										    }
										    if (a.nivelId > b.nivelId) {
										      return 1
										    }
										    return 0
										  })
										  .map((lvl) => {
										    return (
  <Item
    onClick={() => {
														  setSelectedLvl(lvl)
    }}
  >
    <td className='centered'>{`${
															lvl.ofertaNombre
														} / ${
															lvl.modalidadNombre
														} / ${
															lvl.servicioNombre ||
															'SIN SERVICIO'
														} ${lvl?.especialidadNombre ? `/ ${lvl?.especialidadNombre}` : ''}`}
    </td>
    <td className='centered'>
      {lvl.nivelNombre}
    </td>
  </Item>
										    )
										  })}
                  </StyledTable>
                </CardBody>
              </Card>
              <br />
              <Card>
                <CardBody>
                  <CardTitle>
                    {t('expediente_ce>ofertas_educativas>actividades', 'Actividades de curso lectivo')}
                  </CardTitle>
                  <StyledTable>
                    <tr>
                    <th className='centered'>
                    {t('expediente_ce>ofertas_educativas>actividad', 'Actividad')}
                  </th>
                    <th className='centered'>
                    {t('configuracion>anio_educativo>agregar>fecha_inicio', 'Fecha inicia')}
                  </th>
                    <th className='centered'>
                    {t('configuracion>anio_educativo>agregar>fecha_final', 'Fecha fin')}
                  </th>
                  </tr>
                    {actividades.map((group) => {
										  return (
  <Item
    onClick={() => {
													  setSelectedActivity(
													    group
													  )
    }}
  >
    <td className='centered'>
      {group.nombre}
    </td>
    <td className='centered'>
      {group.fechaInicio ||
															'12/12/2020'}
    </td>
    <td className='centered'>
      {group.fechaFin ||
															'12/12/2020'}
    </td>
  </Item>
										  )
                  })}
                  </StyledTable>
                </CardBody>
              </Card>
              <br />
            </Col>
          </Row>
        )}
      </Container>

      <div />
    </section>
  )
}

const Item = styled.tr`
	border: ${(props) => (props.active ? '1.85px solid #109DD9' : 'none')};
	color: #109dd9;
`

const StyledTable = styled.table`
	border-spacing: 1rem;
	width: 100%;
	padding: 5px;
	tr {
		td,
		th {
			padding: 5px;
		}

		.centered {
			text-align: center;
		}
	}
`

export default CursoLectivo
