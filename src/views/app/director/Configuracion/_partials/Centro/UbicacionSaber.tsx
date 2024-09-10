import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { GetByName } from 'Redux/formularios/actions'
import {
	CreateNewFormResponse,
	UpdateFormResponse
} from '../../../../../../redux/formularioCentroResponse/actions'
import Loader from 'Components/Loader'
import JSONFormParser from 'Components/JSONFormParser/JSONFormParser'
import { updateLocation } from '../../../../../../redux/configuracion/actions'
import { useActions } from 'Hooks/useActions'
import { withRouter } from 'react-router-dom'
import swal from 'sweetalert'
import { Label, Input, FormGroup, CustomInput } from 'reactstrap'

const Ubicacion = props => {
	const [pageData, setPageData] = useState()
	const [formResponse, setFormResponse] = useState({})
	const [isTemporal, setIsTemporal] = useState(false)
	const [isEdit, setIsEdit] = useState(false)
	const [loading, setLoading] = useState(true)
	const [loadingRequest, setLoadingRequest] = useState(false)

	const { hasEditAccess = true } = props

	const actions = useActions({ updateLocation })
	const state = useSelector(store => {
		return {
			currentInstitution: store.configuracion.currentInstitution,
			location: store.configuracion.location
		}
	})

	useEffect(() => {
		const loadData = async () => {
			const form = await GetByName('ubicacionGeografica')
			if (Object.keys(state.location).length > 0) {
				setFormResponse({ ...state.location })
				if (
					state.location?.isTemporal !== null &&
					state.location?.isTemporal !== undefined
				) {
					setIsTemporal(state.location.isTemporal)
				}
			} else {
				setFormResponse(null)
			}
			setPageData(form.formulario)
			setLoading(false)
		}
		if (!state.currentInstitution.id) {
			props.setActiveTab(0)
		} else {
			loadData()
		}
	}, [])

	const postData = async data => {
		setLoadingRequest(true)

		const _solucion = JSON.parse(data.solucion)
		const _data = { ..._solucion, isTemporal }

		data.solucion = JSON.stringify(_data)

		const response = await CreateNewFormResponse({
			solucion: data.solucion,
			institucionId: state.currentInstitution.id,
			formularioCategoriaId: 8
		})
		await setFormResponse(JSON.parse(response.data.solucion))
		actions.updateLocation({
			...JSON.parse(response.data.solucion),
			id: response.data.id
		})
		setLoadingRequest(false)
	}

	const putData = async data => {
		setLoadingRequest(true)

		const _solucion = JSON.parse(data.solucion)
		const _data = { ..._solucion, isTemporal }

		data.solucion = JSON.stringify(_data)
		const response = await UpdateFormResponse({
			...data,
			id: formResponse.id
		})

		await setFormResponse(JSON.parse(response.data.solucion))
		actions.updateLocation({
			...JSON.parse(response.data.solucion),
			id: formResponse.id
		})

		setLoadingRequest(false)
	}

	const disabledTemporal = () => {
		const newValue = !isTemporal
		if (!newValue) {
			swal({
				title: 'Desactivar ubicación temporal',
				text: 'Al desactivar la ubicación temporal, la información de los campos del formulario se limpiarán',
				icon: 'warning',
				className: 'text-alert-modal',
				buttons: {
					cancel: 'Cancelar',
					ok: {
						text: 'Aceptar',
						value: true
					}
				}
			}).then(async res => {
				if (res) {
					setIsTemporal(newValue)
					clearTemp()
				}
			})
		} else {
			setIsTemporal(newValue)
		}
	}

	const clearTemp = async () => {
		const _data = {
			solucion: JSON.stringify({
				...formResponse,
				'348f4d67-29f4-b254-369e-b8c5a0817025': '', // Provincia
				'bf1b226c-5ede-8bd8-48c5-0f41a71b2643': '', // canton
				'0368c047-9975-b19e-29a3-0acd6cbf5050': '', // distrito
				'2d3d8977-5778-fbf9-ac41-c06e0e13b3b6': '', // Poblado
				'6fbb1a78-25a8-36a3-6787-157a44330fb5': '', // Lon
				'd65200df-4d2c-763e-8999-a3cddf592b05': '', // Lat
				'71168050-db09-86b6-78a8-4ab5568aa966': '', // DirExac
				'c45338e8-d6f6-c7af-e8f1-7d43afe6c7d8_9a61c7dd-7ad8-5808-2deb-36ab85f79d55_col':
					'' // Mot
			})
		}
		setLoading(true)

		await putData(_data)
		setLoading(false)
	}

	return (
		<div>
			{!loading ? (
				<JSONFormParser
					pageData={pageData}
					mapFunctionObj={{}}
					postData={postData}
					putData={putData}
					deleteData={() => {}}
					dataForm={formResponse}
					data={[]}
					statusColor={item => (true ? 'primary' : 'light')}
					loadingRequest={loadingRequest}
					disableButton={!hasEditAccess}
					setEditable={v => {
						setIsEdit(Boolean(v))
					}}
					isTemporal={isTemporal}
				/>
			) : (
				<Loader />
			)}
		</div>
	)
}

export default withRouter(Ubicacion)
