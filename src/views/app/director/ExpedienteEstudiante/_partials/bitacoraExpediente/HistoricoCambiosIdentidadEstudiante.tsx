import React from 'react'
import styled from 'styled-components'
import { Row, Col } from 'reactstrap'
import moment from 'moment'
import colors from '../../../../../../assets/js/colors'
import HTMLTable from '../../../../../../components/HTMLTable'
import {
	getBitacorasIdentidad,
	getIdentificacionPersona,
	getBitacorasFilter
} from '../../../../../../redux/identidad/actions'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import useNotification from 'Hooks/useNotification'
import DatePicker, { registerLocale } from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import es from 'date-fns/locale/es'

import PreviewChange from '../../../../../app/configuracion/Identidad/PreviewUserBitacora'
import swal from 'sweetalert'
import { useTranslation } from 'react-i18next'

registerLocale('es', es)

type IProps = {}

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
	const [modalVisible, setModalVisible] = React.useState<boolean>(false)
	const [identidad, setIdentidad] = React.useState<any>(null)
	const [previewUser, setPreviewUser] = React.useState<any>(null)
	const [search, setSearch] = React.useState<string>('')
	const [filter, setFilter] = React.useState<string>('')
	const [random, setRandom] = React.useState<number>(-1)
	const [snackbar, handleClick] = useNotification()
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
		cantidad: 6
	})

	const state = useSelector((store: IState) => {
		return {
			bitacoras: store.identidad.bitacoras,
			user: store.identidad.data,
			identification: store.identification
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

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value)
	}

	//const handleInputSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
	const handleInputSearch = async () => {
		const { data } = await actions.getIdentificacionPersona(
			state.identification.data.identificacion
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
	}

	const handleSearch = (date: string) => {
		const parseDate = moment(date).format('DD/MM/YYYY')
		setFilter(date)
		actions.getBitacorasFilter({
			pagina: 1,
			cantidad: 10,
			filter: parseDate,
			identidadId: identidad.id
		})
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
							<ContentPicker>
								<DatePicker
									dateFormat="dd/MM/yyyy"
									peekNextMonth
									showMonthDropdown
									showYearDropdown
									dropdownMode="select"
									placeholderText={t('general>buscar', 'Buscar')}
									locale={t('general>locale', 'es')}
									onChange={(date: string) => handleSearch(date)}
									// onBlur={onBlur}
									selected={filter}
								/>
							</ContentPicker>
							<HTMLTable
								columns={columns}
								selectDisplayMode="datalist"
								showHeaders
								data={data}
								isBreadcrumb={false}
								showHeadersCenter={false}
								match={props.match}
								tableName="label.users"
								/* toggleEditModal={(item: object) => null} */
								toggleModal={() => null}
								modalOpen={false}
								pageSize={6}
								totalRegistro={state.bitacoras.totalCount}
								handlePagination={(
									pageNumber: number,
									selectedPageSize: number
								) => {
									actions.getBitacorasIdentidad({
										pagina: pageNumber,
										cantidad: selectedPageSize,
										identidadId: identidad.id
									})
								}}
								handleSearch={(
									searchValue: string,
									selectedColumn: string,
									selectedPageSize: number,
									page: number
								) => {}}
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

const Form = styled.form`
	margin-top: 30px;
	width: 40%;
`

const FormRow = styled.div`
	display: grid;
	grid-template-columns: 50% 30%;
	align-items: flex-end;
	grid-column-gap: 10px;
	margin-bottom: 13px;
`

const FormInline = styled.div`
	flex-direction: column;
`

const Label = styled.label`
	color: #000;
	display: block;
`

const Input = styled.input`
	padding: 10px;
	width: 100%;
	border: 1px solid #d7d7d7;
	background-color: #e9ecef;
	outline: 0;
	&:focus {
		background: #fff;
	}
`

const ContentPicker = styled.div`
	& .react-datepicker__input-container input {
		border-radius: 5px !important;
	}
`

const Search = styled.div``

const Button = styled.button`
	background: ${colors.primary};
	color: #fff;
	border: 0;
	min-height: 43px;
	padding: 0 20px;
	border-radius: 25px;
	cursor: pointer;
`

const Card = styled.div`
	background: #fff;
	margin-top: 30px;
`

const CardTitle = styled.h5`
	color: #000;
	margin-bottom: 10px;
`

export default HistoricoCambiosIdentidadEstudiante
