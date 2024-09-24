import { TableReactImplementation } from 'Components/TableReactImplementation'
import React, { useEffect, useMemo, useState } from 'react'
import { useActions } from 'Hooks/useActions'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import {
	Input,
	Label,
	Row,
	Col, FormGroup, Form
} from 'reactstrap'
import { WebMapView } from './MapView'
import OptionModal from 'Components/Modal/OptionModal'
import { Card, CardBody, Modal, ModalBody } from 'reactstrap'
import { getBitacoraResidenciaByIdentidad } from 'Redux/Bitacora/actions'
import VisibilityIcon from '@material-ui/icons/Visibility'
import Tooltip from '@mui/material/Tooltip'
import colors from 'Assets/js/colors'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

import moment from 'moment'
import { useTranslation } from 'react-i18next'
const useStyles = makeStyles((theme) => ({

	control: {
		padding: theme.spacing(2)
	},
}))
const HistoricoResidencia = ({ identidadId }) => {
	const { t } = useTranslation()
	const actions = useActions({
		getBitacoraResidenciaByIdentidad
	})
	const classes = useStyles()
	const [search, setSearch] = useState(null)
	const [showCoordinates, setShowCoordinates] = useState(false)
	const [selectedRow, setSelectedRow] = useState(false)
	const { bitacoraResidencia } = useSelector((state: any) => state.bitacora)
	const columns = useMemo(
		() => [
			{
				label: 'Fecha y hora',
				column: 'fechaInsercion',
				Header: t('estudiantes>expediente>contacto>historico_residencia>fecha_hora', 'Fecha y hora'),
				accessor: 'fechaInsercion',
				Cell: ({ row }) => {
					return <div>{moment(row.original?.fechaInsercion)?.format('DD/MM/YYYY HH:mm')} </div>
				}
			},
			{
				Header: t('estudiantes>expediente>contacto>historico_residencia>tipo', 'Tipo'),
				accessor: 'tipo',
				label: 'Tipo',
				column: 'tipo',
				Cell: ({ row }) => {
					return <div>{row.original?.tipo === 0 ? 'Residencia' : 'Temporal'}</div>
				}
			},
			{
				Header: t('estudiantes>expediente>contacto>historico_residencia>usuario', 'Usuario'),
				accessor: 'nombreUsuario',
				label: 'Usuario',
				column: 'user'
			},
			{
				Header: t('general>acciones', 'Acciones'),
				accessor: 'actions',
				label: 'Acciones',
				column: 'actions',
				Cell: ({ row }) => {
					return (
						<div className='d-flex justify-content-center align-items-center'>
							<Tooltip title={t('general>ver', 'Ver')}>
								<VisibilityIcon
									style={{
										cursor: 'pointer',
										color: colors.darkGray
									}}
									onClick={() => {
										setSelectedRow(row.original)
									}}
								/>
							</Tooltip>
						</div>
					)
				}
			}
		],
		[]
	)

	useEffect(() => {
		if (identidadId) {
			actions.getBitacoraResidenciaByIdentidad(identidadId)
		}
	}, [identidadId])

	const data = useMemo(() => {
		return bitacoraResidencia.map(el => ({
			...el,
			json: JSON.parse(el.json)
		}))
	}, [bitacoraResidencia])
	useEffect(() => {
		if (selectedRow?.json?.latitude && selectedRow?.json?.longitude && selectedRow?.json?.longitude != "" && selectedRow?.json?.latitude != "") {
			search?.search([selectedRow.json?.longitude, selectedRow.json?.latitude])
			setShowCoordinates(true)
		} else if (selectedRow?.json?.province?.label && selectedRow?.json?.canton?.label && selectedRow?.json?.distrito.label) {
			search.searchTerm = `${selectedRow?.json?.province?.label}, ${selectedRow?.json?.canton?.label}, ${selectedRow?.json?.distrito.label}`
			search.search(`${search.searchTerm}, CRI`)
			setShowCoordinates(false)
		}
	}, [search, selectedRow])
	return (
		<>
			<Card>
				<CardBody>
					<OptionModal
						size='xl'
						hideCancel
						isOpen={selectedRow && true}
						titleHeader={'Historico de residencia'}
						onConfirm={() =>
							setSelectedRow(false)}
					>
						<Row>
							<Col xs={4}>

								<FormGroup>
									<Label for='province'>Provincia</Label>
									<Input
										type='text'
										name='province'
										value={selectedRow?.json?.province.label}
										id='province'
										disabled
									/>
								</FormGroup>

								<FormGroup>
									<Label for='distrito'>Distrito</Label>
									<Input
										type='text'
										name='distrito'
										value={selectedRow?.json?.distrito.label}
										id='distrito'
										disabled
									/>
								</FormGroup>

								<FormGroup>
									<Label for='poblado'>Poblado</Label>
									<Input
										type='text'
										name='poblado'
										value={selectedRow?.json?.poblado.label}
										id='poblado'
										disabled
									/>
								</FormGroup>


								<FormGroup>
									<Label for='canton'>Cantón</Label>
									<Input
										type='text'
										name='canton'
										value={selectedRow?.json?.canton.label}
										id='canton'
										disabled
									/>
								</FormGroup>

							</Col>
							<Col xs={8}
								style={{

									textAlign: 'left',
									justifyContent: 'left',
									alignItems: 'left'
								}}>

								<WebMapView
									setSearch={setSearch}
								/>
							</Col>
							<Col xs={12}>

								<FormGroup>
									<Label for='direccion'>Dirección</Label>
									<Input
										type='textarea'
										name='direccion'
										value={selectedRow?.json?.direccionExacta}
										id='direccion'
										disabled
									/>
								</FormGroup>
							</Col>
							{showCoordinates && (<><Col xs={6} style={{

								textAlign: 'left',
								justifyContent: 'left',
								alignItems: 'left'
							}}><FormGroup>
									<Label for='latitude'>Latitud</Label>
									<Input
										type='text'
										name='latitude'
										value={selectedRow?.json?.latitude}
										id='latitude'
										disabled
									/>
								</FormGroup></Col>

								<Col xs={6} style={{

									textAlign: 'left',
									justifyContent: 'left',
									alignItems: 'left'
								}}><FormGroup>
										<Label for='longitude'>Longitud</Label>
										<Input
											type='text'
											name='longitude'
											value={selectedRow?.json?.longitude}
											id='longitude'
											disabled
										/>
									</FormGroup></Col></>)}

						</Row>
					</OptionModal>


					<h1>
						{t('estudiantes>expediente>contacto>historico_residencia>titulo', 'Histórico de residencias')}
					</h1>
					<TableReactImplementation columns={columns} data={data} />
				</CardBody>
			</Card >
		</>
	)
}

export default HistoricoResidencia

const MapContainer = styled(Grid)`
	@media (max-width: 870px) {
		height: 29rem;
	}
`
