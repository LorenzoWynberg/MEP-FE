import React, { useEffect, useMemo, useState } from 'react'
import Select from 'react-select'
import { Label } from 'reactstrap'
import { useActions } from 'Hooks/useActions'
import CustomSelectInput from 'Components/common/CustomSelectInput'

import GoogleMapsLocation from './index'
import { getCitiesByStateId, getStatesByCountryId, getAllCountrys } from 'Redux/ubicacionGeografica/actions'
import { IInitState } from 'Redux/ubicacionGeografica/reducer'
import { useSelector } from 'react-redux'
import { ICity, ICountry, IState } from 'types/ubicacionGeografica'
import { getAllAsignaturas } from 'Redux/asignaturas/actions'
import { useTranslation } from 'react-i18next'

interface ILocalState {
    ubicacionGeografica: IInitState
}

interface IProps {
    editable: boolean
    onReady?: () => void
    onChange?: (e: {
        latitude: number
        longitude: number
        country: ICountry
        administrative_area_level_1: IState,
        administrative_area_level_2: ICity,
        street: string
    }, errors) => void
    readOnly?: boolean
    initialValues?: {
        countryId: number
        administrativeAreaLevel1: number
        administrativeAreaLevel2: number
        direction: string,
        longitude: number,
        latitude: number,
    }
}

const Selectors = ({
  editable = true,
  onChange = (values) => {},
  readOnly = false,
  initialValues = null,
  onReady = () => {},
} : IProps) => {
  const { t } = useTranslation()
  // const { countries, states, cities } = useSelector((state: ILocalState) => state.ubicacionGeografica)
  const [countries, setCountries] = useState([])
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [address, setAddress] = useState('')
  const [errors, setErrors] = useState(null)
  const [mount, setMount] = useState(false)
  const [loading, setLoading] = useState(true)
  const [values, setValues] = useState<{
        latitude: number
        longitude: number
        country: ICountry
        administrative_area_level_1: IState,
        administrative_area_level_2: ICity,
        street: string
    }>({
      latitude: null,
      longitude: null,
      country: null,
      administrative_area_level_1: null,
      administrative_area_level_2: null,
      street: null
    })

  const actions = useActions({
    getAllCountrys,
    getStatesByCountryId,
    getCitiesByStateId,
    getAllAsignaturas
  })

  useEffect(() => {
    onChange(values, errors)
  }, [values])

  useEffect(() => {
    if (initialValues?.countryId && countries?.length > 0) {
      const loadData = async () => {
        const resStates = await actions.getStatesByCountryId(initialValues?.countryId)
        const resCities = await actions.getCitiesByStateId(initialValues?.administrativeAreaLevel1)
        setStates(resStates?.data)
        setCities(resCities?.data)
      }
      loadData()
    }
  }, [initialValues?.countryId, countries?.length])

  useEffect(() => {
    if (
      (countries?.length > 0 && states?.length > 0 && cities?.length > 0 && loading && initialValues?.countryId) ||
      (countries?.length > 0 && loading && !initialValues?.countryId)
      ) {
      setLoading(false)
      onReady()
    }
    if (
      !mount &&
      initialValues?.countryId &&
      countries?.length > 0 &&
      states?.length > 0 &&
      cities?.length > 0 &&
      !values?.country
    ) {
      const country = countries.find((el) => el?.id === initialValues?.countryId)
      const state = states.find((el) => el?.id === initialValues?.administrativeAreaLevel1)
      const city = cities.find((el) => el?.id === initialValues?.administrativeAreaLevel2)
      setValues({
        ...values,
        administrative_area_level_1: state,
        administrative_area_level_2: city,
        longitude: initialValues?.longitude,
        latitude: initialValues?.latitude,
        street: initialValues?.direction,
        country
      })
      setAddress(`${values?.latitude || initialValues?.latitude}, ${values?.longitude || initialValues?.longitude}`)
      setMount(true)
    }
  }, [mount, initialValues?.countryId, cities, states, countries])

  useEffect(() => {
    const loadCountries = async () => {
      if (countries?.length === 0) {
        const resCountries = await actions.getAllCountrys()
        setCountries(resCountries?.data)
      }
    }

    loadCountries()
  }, [countries?.length])

  const validateAddress = async ({ lat, lng }, geocoder) => {
    const latlng = {
      lat,
      lng
    }
    const res = await geocoder.geocode({ location: latlng }).then(({ results }) => {
      const val = results[0]
      const country = val.address_components?.find((el) => el?.types?.includes('country'))
      const level1 = val.address_components?.find((el) => el?.types?.includes('administrative_area_level_1'))
      // const level2 = val.address_components?.find((el) => el?.types?.includes('administrative_area_level_2') || el?.types?.includes('locality'))
      if (country?.short_name === values?.country?.iso2 &&
                level1?.short_name.includes(values?.administrative_area_level_1?.nombre)) {
        return true
      }
      return false
    })
    return res
  }

  const handleChange = async (name, val) => {
    const newErrors = errors ? JSON.parse(JSON.stringify(errors)) : {}
    if (newErrors[name]) delete newErrors[name]

    setErrors(newErrors)
    if (name === 'country') {
      setAddress(val?.nombre)
      setCities([])
      setValues({
        ...values,
        [name]: val,
        latitude: val?.latitud,
        longitude: val?.longitud,
        administrative_area_level_1: null,
        administrative_area_level_2: null
      })
      const resStates = await actions.getStatesByCountryId(val.id)
      setStates(resStates?.data)
    } else if (name === 'administrative_area_level_1') {
      setAddress(`${values?.country?.nombre}, ${val?.nombre}`)
      setValues({
        ...values,
        [name]: val,
        latitude: val?.latitud,
        longitude: val?.longitud,
        administrative_area_level_2: null
      })
      const resCities = await actions.getCitiesByStateId(val.id)
      setCities(resCities?.data)
    } else if (name === 'administrative_area_level_2') {
      setValues({
        ...values,
        [name]: val,
        latitude: val?.latitud,
        longitude: val?.longitud
      })
      setAddress(`${values?.country?.nombre}, ${values.administrative_area_level_1.nombre}, ${val?.nombre}`)
    } else {
      setValues({
        ...values,
        [name]: val,
        latitude: val?.latitud,
        longitude: val?.longitud
      })
    }
  }

  const selects = useMemo(() => {
    return [
      {
        name: 'country',
        value: values.country,
        label: t('configuracion>centro_educativo>ver_centro_educativo>ubicacion>pais', 'País'),
        options: countries
      },
      {
        name: 'administrative_area_level_1',
        value: values.administrative_area_level_1,
        label: t('configuracion>centro_educativo>ver_centro_educativo>ubicacion>estado', 'Estado'),
        options: states
      },
      {
        name: 'administrative_area_level_2',
        value: values.administrative_area_level_2,
        label: t('configuracion>centro_educativo>ver_centro_educativo>ubicacion>ciudad', 'Ciudad'),
        options: cities
      }
    ]
  }, [values, states, cities, countries, initialValues, t])
  return (
    <div className='d-flex justify-content-between align-items-start'>
      <div style={{ width: '49%' }}>
        {
            selects.map((el) => (
              <div className='mb-3' key={el?.name}>
                <Label>{el?.label} {!readOnly && '*'}</Label>
                <Select
                  placeholder={t('general>seleccionar', 'Seleccionar')}
                  noOptionsMessage={() => t('general>no_registros', 'No hay registros')}
                  components={{ Input: CustomSelectInput }}
                  className='react-select'
                  isDisabled={!editable}
                  onBlur={() => {
                    if (!values[el?.name]) {
                      setErrors({ [el?.name]: true })
                    }
                  }}
                  styles={{
                    control: (s) => ({
                      ...s,
                      border: errors && errors[el?.name] ? '1px solid red !important' : ''
                    })
                  }}
                  classNamePrefix='react-select'
                  name={el?.name}
                  value={el?.value}
                  getOptionLabel={(e) => e?.nombre}
                  getOptionValue={(e) => e as any}
                  onChange={(val) => {
                    if (el?.name === 'country') {
                      setStates([])
                      setCities([])
                    }

                    if (el?.name === 'administrative_area_level_1') {
                      setCities([])
                    }
                    handleChange(el?.name, val)
                  }}
                  options={el?.options}
                />
                {
                        errors && errors[el.name] && (
                          <div className='d-flex justify-content-center my-3'>
                            <span style={{ color: 'red' }}>{t("campo_requerido", "Este campo es requerido")}</span>
                          </div>
                        )
                    }
              </div>
            ))
        }
        <Label>{t("ubicacion_geografica>direccion_exacta", "Dirección exacta")} {!readOnly && '*'}</Label>
        <textarea
          rows={4}
          value={values.street}
          disabled={!editable}
          onBlur={(e) => {
            if (!values[e.target.name]) {
              setErrors({ [e.target.name]: true })
            }
          }}
          onChange={(e) => {
            const copy = JSON.parse(JSON.stringify(errors))
            delete copy.street
            setErrors(copy)
            setValues({
              ...values,
              [e.target.name]: e.target.value
            })
          }}
          name='street'
          style={{
            resize: 'none',
            width: '100%'
          }}
        />
        {
            errors && errors.street && (
              <div className='d-flex justify-content-center my-3'>
                <span style={{ color: 'red' }}>{t("campo_requerido", "Este campo es requerido")}</span>
              </div>
            )
        }
      </div>
      <div style={{ width: '49%' }}>
        <GoogleMapsLocation
          readOnly={readOnly}
          markerDraggable
          editable={editable}
          width='100%'
          height='300px'
          onMarkerDrag={({ lat, lng }) => {
            setValues({
              ...values,
              latitude: lat,
              longitude: lng
            })
          }}
          lat={values?.latitude}
          lng={values?.longitude}
          address={address}
          setAddress={setAddress}
          validateAddress={validateAddress}
        />
      </div>
    </div>
  )
}

export default Selectors
