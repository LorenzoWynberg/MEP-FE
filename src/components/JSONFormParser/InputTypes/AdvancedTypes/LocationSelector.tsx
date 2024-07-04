import React, { useEffect, useState } from 'react'
import DropDown from '../Dropdown.tsx'
import TextArea from '../TextArea.tsx'
import { getCantonesByProvincia } from 'Redux/cantones/actions'
import { getDistritosByCanton } from 'Redux/distritos/actions'
import { getPobladosByDistrito } from 'Redux/poblados/actions'
import { useSelector } from 'react-redux'
import { useActions } from '../../../../hooks/useActions'

const LocationSelector: React.FC = (props: any) => {
	const { search, overrideData, setOverrideData, isTemporal } = props
	const [calledBefore, setCalledBefore] = useState(false)
	const [loadingFromMap, setLoadingFromMap] = useState(null)

	const state = useSelector(store => {
		return {
			provinces: store.provincias,
			cantones: store.cantones,
			distritos: store.distritos,
			poblados: store.poblados
		}
	})

	const actions = useActions({
		getCantonesByProvincia,
		getDistritosByCanton,
		getPobladosByDistrito
	})

	const provinceFieldName: string = `${props.field.dropDowns[0].id}`
	const province: any = props.watch(provinceFieldName)
	const cantonFieldName: string = `${props.field.dropDowns[1].id}`
	const canton: any = props.watch(cantonFieldName)
	const distritoFieldName: string = `${props.field.dropDowns[2].id}`
	const distrito: any = props.watch(distritoFieldName)
	const pobladoFieldName: string = `${props.field.dropDowns[3].id}`
	const poblado: any = props.watch(pobladoFieldName)
	const directionFieldName: string = `${props.field.dropDowns[4].id}`
	const direction: any = props.watch(directionFieldName)

	const long = props.coordinates ? props.coordinates.options[2].id : ''
	const longValue = props.watch(`${long}`)
	const lat = props.coordinates ? props.coordinates.options[1].id : ''
	const latValue = props.watch(`${lat}`)
	const getSelects = () => {
		if (!props.temporal) {
			return [
				state.provinces.provincias,
				state.cantones.cantones,
				state.distritos.distritos,
				state.poblados.poblados
			]
		} else {
			return [
				state.provinces.provincias,
				state.cantones.cantonesTemporales,
				state.distritos.distritosTemporales,
				state.poblados.pobladosTemporales
			]
		}
	}

	const selectsArray = getSelects()

	useEffect(() => {
		const loadData = async () => {
			props.setValue(provinceFieldName, null)
			props.setValue(cantonFieldName, null)
			props.setValue(distritoFieldName, null)
			props.setValue(pobladoFieldName, null)
			if (props.currentItem.solucion || props.dataForm) {
				const _el = props.currentItem.solucion ? props.currentItem.solucion : props.dataForm
				setOverrideData(false)

				await actions.getCantonesByProvincia(_el[provinceFieldName], props.temporal)
				await actions.getDistritosByCanton(_el[cantonFieldName], props.temporal)
				await actions.getPobladosByDistrito(_el[distritoFieldName], props.temporal)
			} else {
				setOverrideData(true)
			}
		}
		loadData()
	}, [props.dataForm, props.temporal])

	useEffect(() => {
		const clear = async () => {
			props.setValue(provinceFieldName, null)
			props.setValue(cantonFieldName, null)
			props.setValue(distritoFieldName, null)
			props.setValue(pobladoFieldName, null)
		}

		if (!isTemporal && props.temporal) {
			clear()
		}
	}, [isTemporal])

	const pobladosIds = state.poblados.poblados.map(el => el.id)
	useEffect(() => {
		const _el = props.currentItem.solucion ? props.currentItem.solucion : props.dataForm
		if (
			(props.currentItem.solucion || props.dataForm) &&
			!overrideData &&
			pobladosIds.includes(parseInt(_el[pobladoFieldName]))
		) {
			setTimeout(() => {
				props.setValue(provinceFieldName, _el[provinceFieldName])
				props.setValue(cantonFieldName, _el[cantonFieldName])
				props.setValue(distritoFieldName, _el[distritoFieldName])
				props.setValue(pobladoFieldName, _el[pobladoFieldName])
				setOverrideData(true)
			}, 100)
		}
	}, [state.poblados.poblados])

	useEffect(() => {
		const loadData = async () => {
			setCalledBefore(true)
			const newProvince = state.provinces.provincias.find(pr => {
				const stringCompare = pr.nombre.normalize('NFD').replace(/\p{Diacritic}/gu, '')
				return props.ubicacion.provincia == stringCompare
			}).id
			await actions.getCantonesByProvincia(newProvince, props.temporal)
			props.setValue(provinceFieldName, newProvince)
		}

		if (props.ubicacion && props.ubicacion.provincia && props.editable) {
			loadData()
		}
	}, [props.ubicacion])

	useEffect(() => {
		const loadData = async () => {
			if (overrideData && !props.ubicacion) {
				await actions.getCantonesByProvincia(province, props.temporal)

				handleSearchBySelects(province, 'provincia')
			} else if (overrideData && props.ubicacion && selectsArray[1][0]) {
				const newCanton = selectsArray[1].find(pr => {
					const stringCompare = pr.nombre.normalize('NFD').replace(/\p{Diacritic}/gu, '')
					return props.ubicacion.canton == stringCompare
				}).id
				await actions.getDistritosByCanton(newCanton, props.temporal)
				await setLoadingFromMap('canton')
				props.setValue(cantonFieldName, newCanton)
			}
		}
		if (province && props.editable) {
			loadData()
		}
	}, [province])

	useEffect(() => {
		const loadData = async () => {
			if (overrideData && !props.ubicacion && !loadingFromMap) {
				await actions.getDistritosByCanton(canton, props.temporal)
				props.setValue(distritoFieldName, null)
				props.setValue(pobladoFieldName, null)
				handleSearchBySelects(canton, 'canton')
			} else if (loadingFromMap == 'canton' && overrideData && props.ubicacion && selectsArray[2][0]) {
				const newDistrict = selectsArray[2].find(pr => {
					const stringCompare = pr.nombre.normalize('NFD').replace(/\p{Diacritic}/gu, '')
					return props.ubicacion.distrito == stringCompare
				}).id
				await actions.getPobladosByDistrito(newDistrict, props.temporal)
				await setLoadingFromMap('distrito')
				props.setValue(distritoFieldName, newDistrict)
			}
		}
		if (canton && props.editable) {
			loadData()
		}
	}, [canton, loadingFromMap])

	useEffect(() => {
		const loadData = async () => {
			if (overrideData && !props.ubicacion && !loadingFromMap) {
				await actions.getPobladosByDistrito(distrito, props.temporal)
				props.setValue(pobladoFieldName, null)
				handleSearchBySelects(distrito, 'distrito')
			} else if (loadingFromMap == 'distrito' && overrideData && props.ubicacion) {
				handleSearchBySelects(distrito, 'distrito')
				setLoadingFromMap(null)
			}
		}
		if (distrito && props.editable) {
			loadData()
		}
	}, [distrito])

	useEffect(() => {
		setTimeout(() => {
			if (search !== null && !overrideData && longValue) {
				const _searchValue = `${latValue?.replace(',', '.')}, ${longValue?.replace(',', '.')}`
				search.search(_searchValue)
				search.searchTerm = _searchValue
				search.suggest()
				props.temporal && setOverrideData(true)
			} else if (search !== null && !overrideData && !longValue) {
				const _searchValue = 'CRI'
				search.search(_searchValue)
				search.searchTerm = _searchValue
				search.suggest()
				props.temporal && setOverrideData(true)
			}
		}, 100)
	}, [longValue, search])

	const handleSearchBySelects = (data, name) => {
		if (isNaN(data) || !overrideData) return
		props.setLocation({
			latitude: '',
			longitude: ''
		})
		search.clear()
		let _newDirection = ''
		switch (name) {
			case 'provincia':
				_newDirection = `${selectsArray[0].find(pr => data == pr.id).nombre}`
				break
			case 'canton':
				_newDirection = `${selectsArray[0].find(pr => province == pr.id).nombre}, ${
					selectsArray[1].find(pr => data == pr.id).nombre
				}`
				break
			case 'distrito':
				_newDirection = `${selectsArray[0].find(pr => province == pr.id).nombre}, ${
					selectsArray[1].find(pr => canton == pr.id).nombre
				}, ${selectsArray[2].find(pr => data == pr.id).nombre}`
				break
			case 'poblado':
				_newDirection = `${selectsArray[0].find(pr => province == pr.id).nombre}, ${
					selectsArray[1].find(pr => canton == pr.id).nombre
				}, ${selectsArray[2].find(pr => distrito == pr.id).nombre}, ${
					selectsArray[3].find(pr => data == pr.id).nombre
				}`
				break
			default:
				return null
		}
		search.search(`${_newDirection}, CRI`)
		search.searchTerm = `${_newDirection}, CRI`
		search.suggest()
	}

	return props.field.dropDowns.map((component, i) => {
		switch (component.type) {
			case 'dropDown':
				return (
					<div className='mb-3'>
						<DropDown
							// register={props.register}
							field={{
								...component,
								config: { required: !props.temporal || province }
							}}
							dataForm={props.dataForm}
							watch={props?.watch}
							control={props.control}
							setValue={props?.setValue}
							overrideOptionsWith={selectsArray[i]}
							errors={props.errors}
							getValues={props?.getValues}
							editable={props.editable && !props.readOnlyFields.includes(component.id)}
						/>
					</div>
				)
			case 'textArea':
				return (
					<TextArea
						register={props.register}
						field={{
							...component,
							config: {
								required: !props.temporal || province,
								tooltipText: props.tooltips?.descripcion
							}
						}}
						overrideOptionsWith={selectsArray[i]}
						errors={props.errors}
						setValue={props.setValue}
						editable={props.editable && !props.readOnlyFields.includes(component.id)}
					/>
				)
		}
	})
}

export default LocationSelector
