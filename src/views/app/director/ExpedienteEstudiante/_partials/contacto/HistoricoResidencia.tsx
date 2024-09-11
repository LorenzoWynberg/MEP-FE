import { TableReactImplementation } from 'Components/TableReactImplementation'
import React, { useEffect, useMemo, useState } from 'react'
import { useActions } from 'Hooks/useActions'

import { Card, CardBody, Modal, ModalBody } from 'reactstrap'
import { getBitacoraResidenciaByIdentidad } from 'Redux/Bitacora/actions'
import VisibilityIcon from '@material-ui/icons/Visibility'
import Tooltip from '@mui/material/Tooltip'
import colors from 'Assets/js/colors'
import { useSelector } from 'react-redux'

import moment from 'moment'
import { useTranslation } from 'react-i18next'
import Selectors from 'Components/GoogleMapsLocation/Selectors'

const HistoricoResidencia = ({ identidadId }) => {
	const { t } = useTranslation()
	const actions = useActions({
		getBitacoraResidenciaByIdentidad
	})
	const [selectedRow, setSelectedRow] = useState(null)
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
	return (
		<>
			<Card>
				<CardBody>
					<Modal
						size='xl'
						isOpen={selectedRow}
						toggle={() => {
							setSelectedRow(null)
						}}
					>
						<ModalBody>
							<Selectors
								readOnly
								editable={false}
								initialValues={{
									countryId: selectedRow?.json?.paisId,
									administrativeAreaLevel1: selectedRow?.json?.areaAdministrativaNivel1,
									administrativeAreaLevel2: selectedRow?.json?.areaAdministrativaNivel2,
									direction: selectedRow?.json?.direccionExacta,
									longitude: selectedRow?.json?.longitud,
									latitude: selectedRow?.json?.latitud
								}}
							/>
						</ModalBody>
					</Modal>

					<h1>
						{t('estudiantes>expediente>contacto>historico_residencia>titulo', 'Histórico de residencias')}
					</h1>
					<TableReactImplementation columns={columns} data={data} />
				</CardBody>
			</Card>
		</>
	)
}

export default HistoricoResidencia
