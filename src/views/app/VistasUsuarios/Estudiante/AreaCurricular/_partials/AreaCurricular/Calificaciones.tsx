import React, { useMemo, useState, useEffect } from 'react'
import Icon from 'Assets/icons/calendarioPreviewCursoLectivos'
import styled from 'styled-components'
import Table from 'Components/Table-filter/Table'
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import {
	setCalificacionesEstudiante,
	setMallaAsignaturaInformacion
} from '../../../../../../../redux/VistasUsuarios/actions'
import {
	TablaComponenteCalificacion,
	TablaRubricaAprendizaje
} from './Tables/tables'
import IndicadoresAprendizajeModal from './modals/IndicadoresAprendizajeModal'

interface ILandingProps {
	text: string
}
const Landing: React.FC<ILandingProps> = props => {
	const { text } = props
	return (
		<ContainerLanding>
			<Icon />
			<LabelStyled>{text}</LabelStyled>
		</ContainerLanding>
	)
}

const Calificaciones = props => {
	const [openModal, setOpenModal] = useState<'' | 'see-obs' | 'see-comp'>('')
	const [seeComp, setSeeComp] = useState(false)
	const [listData, setListData] = useState([])
	const [selectedSubject, setSelectedSubject] = useState(null)
	const [isCualitative, setIsCualitative] = useState(null)
	const [isDetail, setIsDetail] = useState(null)
	const [detailData, setDetailData] = useState<any>([])
	const [isRubricaModal, setIsRubricaModal] = useState<boolean>(false)
	const [contenidosModalData, setContenidosModalData] = useState<any>([])

	const onSelected = subject => {
		setSelectedSubject(subject)
	}
	const actions = useActions({
		setCalificacionesEstudiante,
		setMallaAsignaturaInformacion
	})

	const toggleModal = (type: '' | 'see-obs' | 'see-comp') => {
		if (type !== '' && type === openModal) {
			setOpenModal('')
		} else {
			setOpenModal(type)
		}
	}

	const state = useSelector((store: any) => {
		return {
			institution: store.authUser.currentInstitution,
			calificaciones: store.VistasUsuarios.calificaciones,
			info_malla: store.VistasUsuarios.info_malla,
			estudianteSeleccionado: store.VistasUsuarios.estudianteSeleccionado
		}
	})

	const handleLoadClasifications = async () => {
		const response = await actions.setCalificacionesEstudiante(4, 447)

		if (!response) return

		const componentesCalificacion = response.map(
			item => item.componenteclasificacion
		)

		const arr = componentesCalificacion.flatMap(componente => {
			if (componente) {
				return componente.map(
					item => item.sb_mallaCurricularAsignaturaId
				)
			}
		})
		const ids = []
		for (const i of arr) {
			if (i && !ids.includes(i)) ids.push(i)
		}

		await actions.setMallaAsignaturaInformacion(ids)
	}

	useEffect(() => {
		handleLoadClasifications()
	}, [])

	useEffect(() => {
		if (state.calificaciones) {
			setListData(state.calificaciones)
		}
	}, [state.calificaciones])

	const setDataDetailEvent = fullRow => {
		const componentesCalificacion =
			fullRow?.componenteclasificacion &&
			fullRow.componenteclasificacion.map(item => {
				return { ...item, subRows: item.instrumentos }
			})

		const getContenidosRubrica = rubricaAprendizaje => {
			return rubricaAprendizaje.flatMap(rubrica => {
				const rubricaJson = JSON.parse(rubrica.json)
				const contenidosInfo = rubricaJson.Contenidos.map(cont => {
					const niveles = cont.columnas.reduce((acc, col, index) => {
						acc[index] = col.nombre
						return acc
					}, {})

					const indicadores = cont.filas.map(fila => fila.nombre)

					return {
						nombre: cont.nombre,
						descripcion: cont.descripcion,
						niveles,
						indicadores,
						contenido: cont
					}
				})
				return contenidosInfo
			})
		}

		const buildGrid = (contenidosMetadata, calificaciones) => {
			/**
			 * Salida debe ser tal que
			 * [{
			 *   contenido: "",
			 *   nivel: "",
			 *   subRows: [{
			 *      contenido: "",
			 *      nivel: ""
			 *   }],
			 *   detalle: ""
			 * }]
			 */
			const calificacionesJson = JSON.parse(calificaciones)
			/* selectedIds = ["db2f5ded-1fcf-d061-6985-30794ad758e2","db2f5ded-1fcf-d061-6985-30794ad758e2"] */
			const { selectedIds } = calificacionesJson

			const celdasFindIndex = (fila, guidArr) => {
				for (const guid of guidArr) {
					const index = fila.celdas.findIndex(
						celda => celda.guid === guid
					)
					if (index < 0) continue
					else return index
				}
				return -1
			}

			const salida = contenidosMetadata.map(metadataItem => {
				const subRows = metadataItem.contenido.filas.map(fila => {
					for (let i = 0; i < metadataItem.indicadores.length; i++) {
						const indice = celdasFindIndex(fila, selectedIds)

						return {
							contenido: fila.celdas[i].nombre,
							nivel:
								indice < 0
									? '-'
									: metadataItem.contenido.niveles[indice],
							detalle: ''
						}
					}
				})
				return {
					contenido: metadataItem.contenido.nombre,
					nivel: '-',
					detalle: '',
					subRows,
					contenidoObj: metadataItem.contenido,
					calificaciones: fullRow.calificaciones
				}
			})
			return salida
		}
		const getComponenteRubrica = esCualitativa => {
			if (!esCualitativa) return
			const contenidosMetadata = getContenidosRubrica(
				fullRow.rubricaAprendizaje
			)
			const gridData = buildGrid(
				contenidosMetadata,
				fullRow.calificaciones
			)
			return gridData
		}

		const componenteRubrica = getComponenteRubrica(fullRow.esCualitativa)
		if (fullRow.esCualitativa === true) {
			setContenidosModalData(
				JSON.parse(fullRow?.rubricaAprendizaje[0]?.json)?.Contenidos
			)
		}

		setDetailData(
			fullRow.esCualitativa === true
				? componenteRubrica
				: componentesCalificacion
		)
	}

	const tableValues = useMemo(() => {
		const columns = [
			{
				Header: 'Asignatura',
				accessor: 'nombreAsignatura',
				Cell: ({ value, row, data }) => {
					const fullRow = data[row.index]

					return (
						<div
							style={{ color: 'blue', cursor: 'pointer' }}
							onClick={() => {
								setIsCualitative(fullRow.esCualitativa)
								setDataDetailEvent(fullRow)
								onSelected(value)
							}}
						>
							{value}
						</div>
					)
				}
			},
			{
				Header: 'Calificación',
				accessor: 'calificaciones',
				Cell: ({ value, row, data }) => {
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
							{fullRow.esCualitativa === true ? (
								<Span
									style={{ cursor: 'pointer' }}
									onClick={() => {
										setIsCualitative(fullRow.esCualitativa)
										setDataDetailEvent(fullRow)
										// setDetailData(fullRow.esCualitativa === true ? fullRow.rubricaAprendizaje : fullRow.componenteclasificacion)
									}}
								>
									VER INDICADORES
								</Span>
							) : (
								<div>{fullRow.notaFinal}%</div>
							)}
						</div>
					)
				}
			}
		]

		return {
			columns,
			listData
		}
	}, [listData])

	const detailTableValues = useMemo(() => {
		/* const columns = [
      {
        Header: ' ',
        id: 'expander',
        Cell: ({ row }) =>
          // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
          // to build the toggle for expanding a row
          row.canExpand ? (
            <span
              {...row.getToggleRowExpandedProps({
                style: {
                  // We can even use the row.depth property
                  // and paddingLeft to indicate the depth
                  // of the row
                  paddingLeft: `${row.depth * 2}rem`,
                },
              })}
            >
              {row.isExpanded ? (
                <Tooltip title="Ver desglose">
                  <img
                    src="/assets/img/desplegable.svg"
                    alt=""
                    style={{ transform: 'rotate(-90deg)' }}
                  />
                </Tooltip>
              ) : (
                <Tooltip title="Ver desglose">
                  <img
                    src="/assets/img/desplegable.svg"
                    alt=""
                    style={{ transform: 'rotate(180deg)' }}
                  />
                </Tooltip>
              )}
            </span>
          ) : null,
      },
      {
        Header: 'Componente',
        accessor: 'sb_componenteCalificacionId',
        Cell: ({ value }) => {
          return <div>{getMallaAsignaturaInfo(value)?.actividadesEvaluacion}</div>
        },
      },
      {
        Header: 'Puntos',
        id: 1,
        Cell: ({ value, row, data }) =>{
          const fullRow = data[row.index]

          return <div>{fullRow.puntos || ' - '}</div>},
      },
      {
        Header: 'Porcentaje',
        id: 2,
        Cell: ({ value, row, data }) => {
          const fullRow = data[row.index]

          return <div>{fullRow.valor}</div>},
      },
      {
        Header: 'Rúbrica',
        accessor: 'rubricaAprendizaje',
        Cell: ({ value }) => (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
              color: 'grey',
              fontSize: '25px',
              cursor: 'pointer',
            }}
          >
            <IoEyeSharp />
          </div>
        ),
      },
      {
        Header: 'Observaciones',
        id: 3,
        Cell: ({ value }) => (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
              color: 'grey',
              fontSize: '25px',
              cursor: 'pointer',
            }}
            onClick={() => toggleModal('see-obs')}
          >
            <HiDocumentSearch />
          </div>
        ),
      },
    ] */

		if (!listData) return {}
		const dataRows = listData.map(item => ({
			...item,
			subRows: item.instrumentos
		}))

		return {
			dataRows
		}
	}, [listData])

	return (
		<>
			<IndicadoresAprendizajeModal
				showModal={isRubricaModal}
				setShowModal={setIsRubricaModal}
				contenidos={contenidosModalData}
			/>
			<Modal
				isOpen={openModal === 'see-obs'}
				toggle={() => toggleModal('see-obs')}
			>
				<ModalHeader>Ver incidencia</ModalHeader>
				<ModalBody>
					<Margin>
						<P>Componente</P>
						Trabajo cotidiano
					</Margin>
					<div style={{ display: 'flex' }}>
						<Margin>
							<P>Puntos</P>
							45/50
						</Margin>
						<Margin style={{ marginLeft: '150px' }}>
							<P>Porcentaje</P>
							25/30
						</Margin>
					</div>
					<Margin>
						<P>Observaciones</P>
						Lorem ipsum, dolor sit amet consectetur adipisicing
						elit. Molestiae labore neque soluta alias quos at ex
						consequuntur minus impedit vero omnis harum,
						reprehenderit unde. Iure aliquid qui consectetur
						assumenda beatae.
					</Margin>
					<div>
						<P>Archivo</P>
						{props.files?.length > 0 && (
							<Button color='primary'>
								Ver ({props.files?.length} archivo
								{props.files?.length > 1 && 's'})
							</Button>
						)}
					</div>
				</ModalBody>
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<Button
						onClick={() => {
							toggleModal('')
						}}
						color='primary'
					>
						Cerrar
					</Button>
				</div>
			</Modal>
			<Container>
				<Card>
					<FeeadBack style={{ marginBottom: '3.3rem' }}>
						<FeedBackTitle>Calificaciones</FeedBackTitle>
					</FeeadBack>
					<Table
						columns={tableValues.columns}
						data={tableValues.listData}
						avoidFilter
						avoidCss
					/>
				</Card>
				<Card>
					<FeeadBack style={{ marginBottom: '1.5rem' }}>
						<FeedBackTitle>
							Detalle de la Calificación
						</FeedBackTitle>
						{selectedSubject}
					</FeeadBack>
					{isCualitative === null ? (
						<Landing text='Selecciona una asignatura para ver su detalle' />
					) : isCualitative === true ? (
						<TablaRubricaAprendizaje
							rows={detailData}
							setShowModal={() => setIsRubricaModal(true)}
						/>
					) : (
						<TablaComponenteCalificacion rows={detailData} />
					)}
					{/* (<TableDetail listData={listData} toggleModal={() => toggleModal('see-comp')}/>) */}
				</Card>
			</Container>
		</>
	)
}

const Container = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 20px;
	min-height: 30rem;
	max-height: 100%;
`
const Card = styled.div`
	background: #fafafa;
	border-radius: 12px;
	padding: 25px;
	box-shadow: 1px 0px 10px 5px #eaeaea;
`
const ContainerLanding = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
	justify-content: center;
	flex-flow: column;
	padding: 30px 10px;
	background: #f2f2f2;
`
const LabelStyled = styled.label`
	width: 308px;
	text-align: center;
	margin: auto;
	font-size: 16px;
	margin-top: 10px;
	line-height: 16px;
`
const FeeadBack = styled.div`
	margin-botton: 20px;
`
const FeedBackTitle = styled.h4`
	color: #000;
`
const FeedBackDescription = styled.p`
	color: #000;
`

const Span = styled.span`
	color: #fff;
	background: #145388;
	border-radius: 10px;
	display: flex;
	justify-content: center;
	width: 11rem;
`

const Margin = styled.div`
	margin-bottom: 1rem;
	font-weight: bolder;
`
const P = styled.p`
	margin: 0;
	font-weight: lighter;
`

export default Calificaciones
