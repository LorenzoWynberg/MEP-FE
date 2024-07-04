import React, { useEffect, useState, Dispatch, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { Col, Label, ModalBody, Input, Form } from 'reactstrap'

import Select from 'react-select'
import styled from 'styled-components'
import { Checkbox } from '@material-ui/core'

import { getCantonesByProvincia } from 'Redux/cantones/actions'
import { getDistritosByCanton } from 'Redux/distritos/actions'
import { getPobladosByDistrito } from 'Redux/poblados/actions'
import { useActions } from 'Hooks/useActions'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import { WebMapView } from 'Views/app/director/ExpedienteEstudiante/_partials/contacto/MapView'
import { EditButton } from 'Components/EditButton'
import { useTranslation } from 'react-i18next'

interface IProps {
	temp?: boolean
	title?: string
	dropdownIds?: {
		provincia: string
		canton: string
		distrito: string
		poblado: string
		direccionExacta: string
		longitude: string
		latitude: string
	}
	handleChange?: (e: {
		dropdownIds: {
			provincia: string
			canton: string
			distrito: string
			poblado: string
			direccionExacta: string
			longitude: string
			latitude: string
		}
		province: {
			id: number
			codigo: string
			nombre: string
			estado: boolean
		}
		canton: {
			id: number
			codigo: string
			nombre: string
			provinciasId: number
			estado: boolean
		}
		distrito: {
			id: number
			codigo: string
			nombre: string
			cantonesId: number
			codigoPostal: number
		}
		poblado: {
			id: number
			codigo: string
			nombre: string
			distritosId: number
			estado: boolean
		}
		direction: string
		longitude: string
		latitude: string
	}) => void
	values?: {
		[key: string]: string | number
	}
	onSubmit?: (e) => void
	loading?: boolean
	hideButton?: boolean
	display?: 'vertical' | 'horizontal'
	editable?: boolean
	setEditable?: Dispatch<React.SetStateAction<boolean>>
	readOnly?: boolean
}

interface IStore {
	provincias: {
		provincias: Array<{
			id: number
			codigo: string
			nombre: string
			estado: boolean
		}>
	}
	cantones: {
		cantones: Array<{
			id: number
			codigo: string
			nombre: string
			provinciasId: number
			estado: boolean
		}>
		cantonesTemporales: Array<{
			id: number
			codigo: string
			nombre: string
			provinciasId: number
			estado: boolean
		}>
	}
	distritos: {
		distritos: Array<{
			id: number
			codigo: string
			nombre: string
			cantonesId: number
			codigoPostal: number
		}>
		distritosTemporales: Array<{
			id: number
			codigo: string
			nombre: string
			cantonesId: number
			codigoPostal: number
		}>
	}
	poblados: {
		poblados: Array<{
			id: number
			codigo: string
			nombre: string
			distritosId: number
			estado: boolean
		}>
		pobladosTemporales: Array<{
			id: number
			codigo: string
			nombre: string
			distritosId: number
			estado: boolean
		}>
	}
}

const LocationForm: React.FC<IProps> = (props) => {
  const { t } = useTranslation()

  const {
    temp = false,
    title,
    dropdownIds = {
      provincia: 'provinciaId',
      canton: 'cantonId',
      distrito: 'distritoId',
      poblado: 'pobladoId',
      direccionExacta: 'direccionExacta',
      longitude: 'longitud',
      latitude: 'latitud'
    },
    values,
    handleChange = () => {},
    onSubmit = () => {},
    loading,
    hideButton,
    display = 'vertical',
    editable = false,
    setEditable = (e) => {},
    readOnly
  } = props
  const [ubicacion, setUbicacion] = useState(null)
  const [calledBefore, setCalledBefore] = useState(false)
  const [loadingFromMap, setLoadingFromMap] = useState(null)
  const [overrideData, setOverrideData] = useState(false)
  const [search, setSearch] = useState(null)
  const [showMap, setShowMap] = useState(display === 'horizontal')
  const [mapMounted, setMapMounted] = useState(false)
  const [mount, setMount] = useState(false)

  const { watch, setValue, errors, control, handleSubmit, setError } =
		useForm()

  const state = useSelector((store: IStore) => {
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
  const province: any = watch(dropdownIds?.provincia)
  const canton: any = watch(dropdownIds?.canton)
  const distrito: any = watch(dropdownIds?.distrito)
  const poblado: any = watch(dropdownIds?.poblado)
  const direction: any = watch(dropdownIds?.direccionExacta)
  const longValue = watch(dropdownIds?.longitude)
  const latValue = watch(dropdownIds?.latitude)

  const selects = useMemo(() => ({
    provincia: {
      name: dropdownIds?.provincia,
      label: t('buscador_ce>ver_centro>ubicacion_geografica>provincia', 'Provincia'),
      options: state.provinces.provincias
    },
    canton: {
      name: dropdownIds?.canton,
      label: t('configuracion>centro_educativo>ver_centro_educativo>canton', 'Cantón'),
      options: !temp
        ? state.cantones.cantones
        : state.cantones.cantonesTemporales
    },
    distrito: {
      name: dropdownIds?.distrito,
      label: t('buscador_ce>ver_centro>ubicacion_geografica>distrito', 'Distrito'),
      options: !temp
        ? state.distritos.distritos
        : state.distritos.distritosTemporales
    },
    poblado: {
      name: dropdownIds?.poblado,
      label: t('buscador_ce>ver_centro>ubicacion_geografica>poblado', 'Poblado'),
      options: !temp
        ? state.poblados.poblados
        : state.poblados.pobladosTemporales
    }
  }), [dropdownIds, state.provinces, state.cantones, state.distritos, state.poblados])

  // NOTE: onChange Trigger
  useEffect(() => {
    console.clear()
    console.log(values)
    console.log({
      province,
      canton,
      distrito,
      poblado,
      direction,
      longitude: longValue,
      latitude: latValue,
      dropdownIds
    })
    handleChange({
      province,
      canton,
      distrito,
      poblado,
      direction,
      longitude: longValue,
      latitude: latValue,
      dropdownIds
    })
  }, [province, canton, distrito, poblado, longValue, latValue, direction])

  // NOTE: LOAD INITIAL OPTIONS
  useEffect(() => {
    const loadData = async () => {
      if (values && !calledBefore) {
        setOverrideData(false)
        await actions.getCantonesByProvincia(
          values[dropdownIds?.provincia],
          temp
        )
        await actions.getDistritosByCanton(
          values[dropdownIds?.canton],
          temp
        )
        await actions.getPobladosByDistrito(
          values[dropdownIds?.distrito],
          temp
        )
      } else {
        setOverrideData(true)
      }
    }
    loadData()
  }, [])

  // NOTE: SET INITIAL DATA
  useEffect(() => {
    if (
      values &&
			Object.keys(values)?.length > 0 &&
			selects?.poblado?.options?.length > 0 &&
			!mount
    ) {
      const initialProvince = selects?.provincia?.options?.find(
        (pr) => pr?.id === Number(values[dropdownIds?.provincia])
      )
      const initialCanton = selects?.canton?.options?.find(
        (cn) => cn?.id === Number(values[dropdownIds?.canton])
      )
      const initialDistrito = selects?.distrito?.options?.find(
        (dr) => dr?.id === Number(values[dropdownIds?.distrito])
      )
      const initialPoblado = selects?.poblado?.options?.find(
        (pb) => pb?.id === Number(values[dropdownIds?.poblado])
      )

      setValue(dropdownIds?.provincia, initialProvince)
      setValue(dropdownIds?.canton, initialCanton)
      setValue(dropdownIds?.distrito, initialDistrito)
      setValue(dropdownIds?.poblado, initialPoblado)
      setValue(
        dropdownIds?.direccionExacta,
        values[dropdownIds?.direccionExacta]
      )
      setValue(dropdownIds?.longitude, values[dropdownIds?.longitude])
      setValue(dropdownIds?.latitude, values[dropdownIds?.latitude])
      setMount(true)
    }
  }, [values, selects?.poblado?.options])

  useEffect(() => {
    const loadData = async () => {
      setCalledBefore(true)
      const newProvince = state.provinces.provincias.find(
        (pr) => {
          const stringCompare = pr.nombre.normalize('NFD').replace(/\p{Diacritic}/gu, '')
          return ubicacion.provincia == stringCompare
        }
      )
      await actions.getCantonesByProvincia(newProvince?.id, temp)
      setValue(dropdownIds?.provincia, newProvince)
    }

    if (ubicacion && ubicacion.provincia && editable) {
      loadData()
    }
  }, [ubicacion])

  // NOTE: LOAD CANTONES
  useEffect(() => {
    const loadData = async () => {
      if (overrideData && !ubicacion) {
        await actions.getCantonesByProvincia(province?.id, temp)
        setValue(dropdownIds?.canton, null)
        setValue(dropdownIds?.distrito, null)
        setValue(dropdownIds?.poblado, null)
        setValue(dropdownIds?.longitude, 'No seleccionado')
        setValue(dropdownIds?.latitude, 'No seleccionado')
        handleSearchBySelects(province, 'provincia')
      } else if (overrideData && ubicacion && selects?.canton?.options) {
        const newCanton = selects?.canton?.options?.find(
          (cn) => {
            const stringCompare = cn.nombre.normalize('NFD').replace(/\p{Diacritic}/gu, '')
            return ubicacion.canton == stringCompare
          }
        )
        await actions.getDistritosByCanton(newCanton?.id, temp)
        await setLoadingFromMap('canton')
        setValue(dropdownIds?.canton, newCanton)
      }
    }
    if (province && editable) {
      loadData()
    }
  }, [province])

  // NOTE: LOAD DISTRITOS
  useEffect(() => {
    const loadData = async () => {
      if (overrideData && !ubicacion && !loadingFromMap) {
        await actions.getDistritosByCanton(canton?.id, temp)
        setValue(dropdownIds?.distrito, null)
        setValue(dropdownIds?.poblado, null)
        handleSearchBySelects(canton, 'canton')
      } else if (
        loadingFromMap == 'canton' &&
				overrideData &&
				ubicacion &&
				selects?.distrito?.options
      ) {
        const newDistrict = selects?.distrito?.options?.find(
          (dt) => {
            const stringCompare = dt.nombre.normalize('NFD').replace(/\p{Diacritic}/gu, '')
            return ubicacion.distrito == stringCompare
          }
        )
        await actions.getPobladosByDistrito(newDistrict?.id, temp)
        await setLoadingFromMap('distrito')
        setValue(dropdownIds?.distrito, newDistrict)
      }
    }
    if (canton && editable) {
      loadData()
    }
  }, [canton, loadingFromMap])

  // NOTE: LOAD POBLADOS
  useEffect(() => {
    const loadData = async () => {
      
      if (overrideData && !ubicacion && !loadingFromMap) {
        await actions.getPobladosByDistrito(distrito?.id, temp)
        setValue(dropdownIds?.poblado, null)
        handleSearchBySelects(distrito, 'distrito')
      } else if (
        loadingFromMap == 'distrito' &&
				overrideData &&
				ubicacion
      ) {
        handleSearchBySelects(distrito, 'distrito')
        setLoadingFromMap(null)
      }
    }
    if (distrito && editable) {
      loadData()
    }
  }, [distrito])

  useEffect(() => {
    if (mapMounted) {
      setTimeout(() => {
        if (search !== null && !overrideData && longValue) {
          const _searchValue = `${longValue?.replace(
						',',
						'.'
					)}, ${latValue?.replace(',', '.')}`
          search.search(_searchValue)
          search.searchTerm = _searchValue
          search.suggest()
          temp && setOverrideData(true)
        } else if (search !== null && !overrideData && !longValue) {
          const _searchValue = 'CRI'
          search.search(_searchValue)
          search.searchTerm = _searchValue
          search.suggest()
          temp && setOverrideData(true)
        }
      }, 100)

      setTimeout(() => {
        setOverrideData(true)
      }, 1000)
    }
  }, [longValue, search, mapMounted])

  const handleSearchBySelects = (data, name) => {
    if (isNaN(data) || !overrideData) return
    setValue(dropdownIds?.longitude, 'No seleccionado')
    setValue(dropdownIds?.latitude, 'No seleccionado')
    search.clear()
    let _newDirection = ''
    switch (name) {
      case 'provincia':
        _newDirection = `${
					selects?.provincia?.options?.find((pr) => data == pr.id)
						.nombre
				}`
        break
      case 'canton':
        _newDirection = `${
					selects?.provincia?.options?.find(
						(pr) => province?.id == pr.id
					).nombre
				}, ${
					selects?.canton?.options?.find(
						(canton) => data == canton.id
					).nombre
				}`
        break
      case 'distrito':
        _newDirection = `${
					selects?.provincia?.options?.find((pr) => province?.id == pr.id).nombre
				}, ${selects?.canton?.options?.find((cn) => canton?.id == cn.id).nombre
				}, ${selects?.distrito?.options?.find((dt) => data == dt.id).nombre}`
        break
      case 'poblado':
        _newDirection = `${
					selects?.provincia?.options?.find((pr) => province?.id == pr.id)
						.nombre
				}, ${
					selects?.canton?.options?.find((cn) => canton?.id == cn.id)
						.nombre
				}, ${
					selects?.distrito?.options?.find(
						(dt) => distrito?.id == dt.id
					).nombre
				}, ${
					selects?.poblado?.options?.find((pb) => data == pb.id)
						.nombre
				}`
        break
      default:
        return null
    }
    search.search(`${_newDirection}, CRI`)
    search.searchTerm = `${_newDirection}, CRI`
    search.suggest()
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{ width: '100%' }}>
        <Form
          onSubmit={handleSubmit((d) => {
					  if (
					    !d[dropdownIds?.latitude] ||
							d[dropdownIds?.latitude] === 'No seleccionado' ||
							!d[dropdownIds?.longitude] ||
							d[dropdownIds?.longitude] === 'No seleccionado'
					  ) {
					    setError(dropdownIds?.latitude, {
					      type: 'required'
					    })
					    return
					  }
					  onSubmit({
					    province,
					    canton,
					    distrito,
					    poblado,
					    direction,
					    longitude: longValue,
					    latitude: latValue,
					    dropdownIds
					  })
          })}
        >
          <div>
            <h4>{title}</h4>
            <div
              className={
								display === 'horizontal'
								  ? 'd-flex justify-content-between'
								  : ''
							}
              style={{ overflow: 'scroll' }}
            >
              <Col sm={12} md={display === 'vertical' ? 12 : 6}>
                {Object.values(selects).map((el) => (
                  <div key={el?.name} className='my-3'>
                    <Label>{`${el?.label} ${
											readOnly ? '' : '*'
										}`}
                  </Label>
                    <Controller
                    control={control}
                    name={el?.name}
                    rules={{ required: !readOnly }}
                    styles={{
											  menuPortal: (base) => ({
											    ...base,
											    position: 'relative',
											    zIndex: 999
											  })
                  }}
                    as={
                    <Select
                    components={{
													  Input: CustomSelectInput
                  }}
                    className='react-select'
                    classNamePrefix='react-select'
                    placeholder=''
                    getOptionLabel={(
													  option: any
                  ) =>
													  option.descripcion
													    ? `${option.nombre} - ${option.descripcion}`
													    : option.nombre}
                    getOptionValue={(
													  option: any
                  ) =>
													  option.value ||
														option.id}
                    options={el?.options}
                    styles={{
													  menuPortal: (base) => ({
													    ...base,
													    zIndex: 999
													  })
                  }}
                    isDisabled={!editable}
                  />
											}
                  />
                    {errors[el?.name] && (
                    <span style={{ color: 'red' }}>
                    {t('configuracion>anio_educativo>agregar>campo_requerido', 'Este campo es requerido')}
                  </span>
                  )}
                  </div>
                ))}
                <div className='my-3'>
                  <Label>
                    {t('ubicacion_geografica>direccion_exacta', 'Dirección Exacta')} {readOnly ? '' : '*'}
                  </Label>
                  <div>
                    <Controller
                    name={dropdownIds?.direccionExacta}
                    control={control}
                    rules={{ required: !readOnly }}
                    as={
                    <Input
                    rows={3}
                    style={{
													  resize: 'none',
													  width: '100%'
                  }}
                    type='textarea'
                    disabled={!editable}
                  />
											}
                  />
                    {errors[
										  dropdownIds?.direccionExacta
                  ] && (
                  <span style={{ color: 'red' }}>
                  {t('configuracion>anio_educativo>agregar>campo_requerido', 'Este campo es requerido')}
                </span>
                  )}
                  </div>
                </div>
                {display === 'horizontal' && (
                  <>
                    <div className='d-flex justify-content-between'>
                    <div style={{ width: '49%' }}>
                    <Label>
                    {t('configuracion>centro_educativo>ver_centro_educativo>ubicacion>latitud', 'Latitud')}{' '}
                    {readOnly ? '' : '*'}
                  </Label>
                    <Controller
                    control={control}
                    name={dropdownIds?.latitude}
                    rules={{
													  required: !readOnly
                  }}
                    as={
                    <Input
                    type='text'
                    disabled
                  />
													}
                  />
                  </div>
                    <div style={{ width: '49%' }}>
                    <Label>
                    {t('configuracion>centro_educativo>ver_centro_educativo>ubicacion>longitud', 'Longitud')}
                    {readOnly ? '' : '*'}
                  </Label>
                    <Controller
                    control={control}
                    name={
														dropdownIds?.longitude
													}
                    rules={{
													  required: !readOnly
                  }}
                    as={
                    <Input
                    type='text'
                    disabled
                  />
													}
                  />
                  </div>
                  </div>
                    {(errors[dropdownIds?.latitude] ||
											errors[dropdownIds?.longitude]) && (
  <span style={{ color: 'red' }}>
    {t('configuracion>anio_educativo>agregar>marcar_mapa', 'Debe marcar la ubicación en el mapa')}
  </span>
                  )}
                  </>
                )}
                {display === 'vertical' && (
                  <div className='my-3'>
                    <Checkbox
                    checked={showMap}
                    color='primary'
                    onClick={() => {
											  setShowMap(!showMap)
                  }}
                  />
                    {t('dir_regionales>ver>ver_dir_mapa', 'Ver dirección en el mapa')}
                  </div>
                )}
              </Col>
              {showMap && (
                <Col
                  sm={12}
                  md={display === 'vertical' ? 12 : 6}
                >
                  <div className='my-4'>
                    <StyledMapWithoutModal
                    style={{
											  height:
													display === 'vertical'
													  ? '338px'
													  : '529px'
                  }}
                  >
                    <WebMapView
                    setLocation={(value) => {
												  console.clear()
												  console.log({
												    [dropdownIds?.longitude]:
															value?.longitude,
												    [dropdownIds?.latitude]:
															value?.latitude
												  })
												  setValue(
												    dropdownIds?.longitude,
												    value?.longitude
												  )
												  setValue(
												    dropdownIds?.latitude,
												    value?.latitude
												  )
                  }}
                    setUbicacion={(value) => {
												  setUbicacion(value)
                  }}
                    editable={editable}
                    setSearch={(value) => {
												  setSearch(value)
                  }}
                    onMount={() => {
												  setMapMounted(true)
                  }}
                  />
                  </StyledMapWithoutModal>
                  </div>
                  {display === 'vertical' && (
                    <div className='d-flex justify-content-between'>
                    <div style={{ width: '49%' }}>
                    <Label>
                    Latitud{' '}
                    {readOnly ? '' : '*'}
                  </Label>
                    <Controller
                    control={control}
                    name={dropdownIds?.latitude}
                    rules={{
													  required: !readOnly
                  }}
                    as={
                    <Input
                    type='text'
                    disabled
                  />
													}
                  />
                  </div>
                    <div style={{ width: '49%' }}>
                    <Label>
                    Longitud{' '}
                    {readOnly ? '' : '*'}
                  </Label>
                    <Controller
                    control={control}
                    name={
														dropdownIds?.longitude
													}
                    rules={{
													  required: !readOnly
                  }}
                    as={
                    <Input
                    type='text'
                    disabled
                  />
													}
                  />
                  </div>
                  </div>
                  )}
                </Col>
              )}
            </div>
          </div>
          {
						!hideButton && (
  <div
    style={{
								  margin: '1rem auto'
    }}
    className='d-flex justify-content-center'
  >
    <EditButton
      editable={editable}
      setEditable={setEditable}
      loading={loading}
    />
  </div>
						)
					}
        </Form>
      </div>
    </div>
  )
}

const StyledMapWithoutModal = styled(ModalBody)`
	padding: 0 !important;
`

export default LocationForm
