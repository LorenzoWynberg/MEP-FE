import React, { useEffect, useMemo, useState } from 'react'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { useActions } from 'Hooks/useActions'
import Loader from 'Components/LoaderContainer'
import { useSelector } from 'react-redux'
import { trasladarEstudiantes } from 'Redux/matricula/actions.js'

import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import TouchAppIcon from '@material-ui/icons/TouchApp'
import { getCentrosEducativos, clearInstitutions } from 'Redux/traslado/actions'
import { useTranslation } from 'react-i18next'

const TablaInstituciones = ({ onConfirm, type = '' }) => {
	const actions: any = useActions({
		trasladarEstudiantes,
		getCentrosEducativos,
		clearInstitutions
	})
	const state = useSelector((store: any) => {
		return {
			centros: store.traslado.centrosEducativos,
			currentInstitution: store.authUser.currentInstitution
		}
	})
	const { accessRole } = useSelector((state: any) => state?.authUser?.currentRoleOrganizacion)
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState([])
	const { t } = useTranslation()

	useEffect(() => {
		return () => {
			actions.clearInstitutions()
		}
	}, [])

	useEffect(() => {
		const fetch = async () => {
			setLoading(true)
			await actions
				.getCentrosEducativos(
					'NULL',
					1,
					30,
					accessRole?.nivelAccesoId == 3 ? accessRole?.organizacionId : null,
					accessRole?.nivelAccesoId == 2 ? accessRole?.organizacionId : null,
					accessRole?.nivelAccesoId == 1 ? accessRole?.organizacionId : null
				)
				.then(() => setLoading(false))
		}
		if (type === 'desdeMiCentro') {
			fetch()
		}
	}, [])

	useEffect(() => {
		if (!state.centros.entityList) return
		const datos = state.centros.entityList
			.filter(el => el.institucionId !== state.currentInstitution?.id)
			.map(i => {
				return {
					...i,
					institucionId: i.institucionId,
					nombre: i.institucionNombre,
					codigo: i.institucionCodigo,
					tipoInstitucion: i.tipoInstitucion,
					regional: i.regionalNombre,
					estado: i.estado
				}
			})
		setData(datos)
	}, [state.centros.entityList])

	const columns = useMemo(() => {
		return [
			{
				Header: t(
					'estudiantes>traslados>gestion_traslados>solicitar_desde_mi_centro>estudiantes_matriculados>trasladar>desde_mi_centro>columna_codigo',
					'Código'
				),
				column: 'codigo',
				accessor: 'codigo',
				label: ''
			},
			{
				Header: t(
					'estudiantes>traslados>gestion_traslados>solicitar_desde_mi_centro>estudiantes_matriculados>trasladar>desde_mi_centro>columna_nombre',
					'Nombre'
				),
				column: 'nombre',
				accessor: 'nombre',
				label: ''
			},
			{
				Header: t(
					'estudiantes>traslados>gestion_traslados>solicitar_desde_mi_centro>estudiantes_matriculados>trasladar>desde_mi_centro>columna_tipo_centro',
					'Tipo de centro educativo'
				),
				column: 'tipoInstitucion',
				accessor: 'tipoInstitucion',
				label: ''
			},
			{
				Header: t(
					'estudiantes>traslados>gestion_traslados>solicitar_desde_mi_centro>estudiantes_matriculados>trasladar>desde_mi_centro>columna_ubi_admin',
					'Ubicación administrativa'
				),
				column: 'regional',
				accessor: 'regional',
				label: ''
			},
			{
				Header: t(
					'estudiantes>traslados>gestion_traslados>solicitar_desde_mi_centro>estudiantes_matriculados>trasladar>desde_mi_centro>columna_estado',
					'Estado'
				),
				column: 'estado',
				accessor: 'estado',
				label: ''
			},
			{
				Header: t(
					'estudiantes>traslados>gestion_traslados>solicitar_desde_mi_centro>estudiantes_matriculados>trasladar>desde_mi_centro>columna_acciones',
					'Acciones'
				),
				column: '',
				accessor: '',
				label: '',
				Cell: ({ _, row, data }) => {
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
							<button
								style={{
									border: 'none',
									background: 'transparent',
									cursor: 'pointer',
									color: 'grey'
								}}
								onClick={() => {
									onConfirm(fullRow)
								}}
							>
								<Tooltip
									title={t(
										'general>tooltip>trasladar_a_centro_educativo',
										'Trasladar a centro educativo'
									)}
								>
									<IconButton>
										<TouchAppIcon style={{ fontSize: 30 }} />
									</IconButton>
								</Tooltip>
							</button>
						</div>
					)
				}
			}
		]
	}, [state.centros.entityList])

	return (
		<div>
			{loading ? (
				<Loader />
			) : (
				<TableReactImplementation
					data={data}
					columns={columns}
					handleGetData={async (searchValue, _, pageSize, page, column) => {
						setLoading(true)
						await actions.getCentrosEducativos(searchValue, 1, 30, null)
						setLoading(false)
					}}
					orderOptions={[]}
					pageSize={10}
					backendSearch
				/>
			)}
		</div>
	)
}

export default TablaInstituciones
