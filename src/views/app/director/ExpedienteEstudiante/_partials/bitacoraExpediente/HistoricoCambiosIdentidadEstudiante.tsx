import React from 'react'
import styled from 'styled-components'
import { Row, Col } from 'reactstrap'
import moment from 'moment'
import HTMLTable from 'Components/HTMLTable'
import withAuthorization from '../../../../../../Hoc/withAuthorization'
import {
	getBitacorasIdentidad,
	getIdentificacionPersona,
	getBitacorasFilter
} from 'Redux/identidad/actions'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import useNotification from 'Hooks/useNotification'
import { registerLocale } from 'react-datepicker'
import BarLoader from 'Components/barLoader/barLoader'
import 'react-datepicker/dist/react-datepicker.css'
import es from 'date-fns/locale/es'
import PreviewChange from '../../../../../app/configuracion/Identidad/PreviewUserBitacora'
import swal from 'sweetalert'
import { useTranslation } from 'react-i18next'

registerLocale('es', es)

type IProps = { identificacion: any }

type IState = {
	identidad: any
}

type SnackbarConfig = {
	variant: string
	msg: string
}

const HistoricoCambiosIdentidadEstudiante: React.FC<IProps> = props => {
	const [t] = useTranslation()
	const [data, setData] = React.useState<any[]>([])
	const [identidad, setIdentidad] = React.useState<any>(null)
	const [previewUser, setPreviewUser] = React.useState<any>(null)
	const [random, setRandom] = React.useState<number>(-1)
	const [snackbar, handleClick] = useNotification()
	const [loading, setLoading] = React.useState(true)
	const [snackBarContent, setSnackbarContent] = React.useState<SnackbarConfig>({
		variant: '',
		msg: ''
	})

	const columns = [
		{
			column: 'fechaActualizacion',
			label: t(
				'estudiantes>indentidad_per>historico_camb>fecha',
				'Fecha del evento'
			),
			width: 30
		},
		{
			column: 'nombreCompleto',
			label: t(
				'estudiantes>indentidad_per>historico_camb>user',
				'Usuario aplicó cambio'
			),
			width: 70
		}
	]

	const [paginationData, setPaginationData] = React.useState({
		pagina: 1,
		cantidad: 10
	})

	const state = useSelector((store: IState) => {
		return {
			bitacoras: store.identidad.bitacoras,
			user: store.identidad.data
		}
	})

	React.useEffect(() => {
		setData(
			state.bitacoras.entityList.map((item: any, index) => {
				return {
					...item,
					fechaActualizacion: moment(item.fechaActualizacion).format(
						'DD/MM/YY h:mm a'
					),
					rowId: index,
					itemSelected: false,
					nombreCompleto: `${item.nombreCompleto}`
				}
			}) || []
		)
	}, [state.bitacoras])

	React.useEffect(() => {
		handleInputSearch()
	}, [])

	const actions = useActions({
		getBitacorasIdentidad,
		getIdentificacionPersona,
		getBitacorasFilter
	})

	const showNotification = (variant: string, msg: string) => {
		setSnackbarContent({ variant, msg })
		handleClick()
	}

	const handleInputSearch = async () => {
		setLoading(true)
		const { data } = await actions.getIdentificacionPersona(
			props.identificacion
		)
		setIdentidad(data)
		if (Object.keys(data).length === 0) {
			swal({
				title: t('general>error>siento', '¡Lo siento!'),
				text: t(
					'general>error>no_register',
					'Esta persona no se encuentra registrada'
				),
				icon: 'warning',
				buttons: {
					ok: {
						text: 'Ok',
						value: true
					}
				}
			})
		} else {
			const res = await actions.getBitacorasIdentidad({
				pagina: paginationData.pagina,
				cantidad: paginationData.cantidad,
				identidadId: data.id
			})
			if (!res.error) {
				if (res.data.totalCount === 0) {
					showNotification(
						'warning',
						'No se han registrado cambios a esta identidad'
					)
				}
			} else {
				showNotification(
					'error',
					t(
						'general>error',
						'Oops. Algo ha salido mal. Por favor intentelo luego'
					)
				)
			}
		}
		setLoading(false)
	}

	const handleDetail = (item: any) => {
		const identidad = JSON.parse(item.identidad)
		setRandom(Math.random())
		setPreviewUser(identidad[0])
	}

	const setSelectedRow = row => {
		setData(
			data.map(item => {
				item.itemSelected = row.rowId == item.rowId

				return item
			})
		)
	}

	if (state.bitacoras.loading || state.user.loading || loading)
		return <BarLoader />

	return (
		<Wrapper>
			{snackbar(snackBarContent.variant, snackBarContent.msg)}
			<Title>
				{t(
					'estudiantes>indentidad_per>historico_camb>titulo',
					'Histórico de cambios a la identidad'
				)}
			</Title>
			{identidad ? (
				<Row>
					<Col md={6}>
						<Card className="bg-white__radius">
							<CardTitle>
								{t(
									'estudiantes>indentidad_per>historico_camb>bitacora',
									'Bitácora de cambios'
								)}
							</CardTitle>
							{data.length > 0 && (
								<p style={{ marginTop: '5px' }}>
									{t(
										'estudiantes>indentidad_per>historico_camb>mensaje',
										'Seleccione la fila de información para visualizar la ficha de datos que muestra los cambios realizados en la identidad de la persona.'
									)}
								</p>
							)}
							<HTMLTable
								columns={columns}
								selectDisplayMode="datalist"
								showHeaders
								data={data}
								isBreadcrumb={false}
								showHeadersCenter={false}
								tableName="label.users"
								toggleModal={() => null}
								modalOpen={false}
								pageSize={paginationData.cantidad}
								totalRegistro={state.bitacoras.totalCount}
								handlePagination={(
									pageNumber: number,
									selectedPageSize: number
								) => {
									setPaginationData({
										pagina: pageNumber,
										cantidad: selectedPageSize
									})
									actions.getBitacorasIdentidad({
										pagina: pageNumber,
										cantidad: selectedPageSize,
										identidadId: identidad.id
									})
								}}
								toggleEditModal={e => {
									handleDetail(e)
									setSelectedRow(e)
								}}
								selectedOrderOption={{
									column: 'detalle',
									label: 'Nombre Completo'
								}}
								editModalOpen={false}
								modalfooter
								loading={state.bitacoras.loading}
								orderBy={false}
								backendPaginated
								hideMultipleOptions
								readOnly
								disableSearch
								selectedBgColor="#14538850"
							/>
						</Card>
					</Col>
					{previewUser !== null ? (
						<Col md={6}>
							<PreviewChange
								key={random}
								title={t(
									'estudiantes>indentidad_per>historico_camb>datos_solicitados',
									'Datos solicitados'
								)}
								disabled
								user={previewUser}
							/>
						</Col>
					) : null}
				</Row>
			) : null}
		</Wrapper>
	)
}

const Wrapper = styled.div`
	margin-top: 20px;
`

const Title = styled.h4`
	color: #000;
`

const Card = styled.div`
	background: #fff;
	margin-top: 30px;
`

const CardTitle = styled.h5`
	color: #000;
	margin-bottom: 10px;
`

export default withAuthorization({
	id: 100,
	Modulo: 'Expediente Estudiantil',
	Apartado: 'Bitácora expediente',
	Seccion: 'Histórico cambios de identidad'
})(HistoricoCambiosIdentidadEstudiante)
