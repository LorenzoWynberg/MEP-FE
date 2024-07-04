import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { GetByName } from 'Redux/formularios/actions'
import {
  saveFormularioLocalizacion,
  updateFormularioLocalizacion,
  getFormsByRegional,
  updateRegional,
  getRegionalById
} from 'Redux/configuracion/actions'
import Loader from 'Components/Loader'
import { CurrentRegional } from '../../../../../../types/configuracion'
import useNotification from 'Hooks/useNotification'
import withRouter from 'react-router-dom/withRouter'
import NavigationContainer from '../../../../../../components/NavigationContainer'
import { Card, CardBody, Form } from 'reactstrap'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import { useTranslation } from 'react-i18next'
import { EditButton } from 'Components/EditButton'

import Selectors from 'Components/GoogleMapsLocation/Selectors'

type IProps = {
  currentRegional: CurrentRegional
  handleBack: Function
  hasEditAccess: boolean
  mapTitle: string
}

type SnackbarConfig = {
	variant: string
	msg: string
}

interface IState {
  configuracion: {
    currentRegional: CurrentRegional
    expedienteRegional: CurrentRegional
  }
}

const Ubicacion = (props: IProps) => {
  const { t } = useTranslation()

  const [_pageData, setPageData] = React.useState({ layouts: [] })
  const [data, setData] = useState<{
    countryId: number
    administrativeAreaLevel1: number
    administrativeAreaLevel2: number
    direction: string
    longitude: number
    latitude: number
  }>(null)
  const [errors, setErrors] = useState({})
  const [formResponse, setFormResponse] = React.useState<any>()
  const [loading, setLoading] = React.useState<boolean>(true)
  const [loadingMap, setLoadingMap] = useState(true)
  const [loadingRequest, setLoadingRequest] = React.useState<boolean>(false)
  const [editable, setEditable] = useState(false)
  const [categoriaForm, setCategoriaForm] = React.useState<number>(0)
  const [snackBarContent, setSnackbarContent] = React.useState<SnackbarConfig>({ variant: '', msg: '' })
  const [snackbar, handleClick] = useNotification()
  const { hasEditAccess = true } = props

  const state = useSelector((state: IState) => ({
    currentRegional: state.configuracion.currentRegional
  }))

  const actions = useActions({
    updateRegional,
    getRegionalById
  })

  React.useEffect(() => {
    const fetchForm = async () => {
      setLoading(true)
      try {
        const form = await GetByName('ubicacionRegionCircuito')
        const response = await getFormsByRegional(
          props.currentRegional.id,
          form.formularioCategoriaId
        )
        if (response.length > 0) {
          const solucion = JSON.parse(response[0].solucion)
          setFormResponse({ ...solucion, id: response[0].id })
        }

        setCategoriaForm(form.formularioCategoriaId)
        setPageData(form.formulario)
      } catch (e) {
        setPageData({ layouts: [] })
      }
      setLoading(false)
    }
    fetchForm()
  }, [])

  const postData = async () => {
    setLoadingRequest(true)
    const reqData = {
      solucion: {
        countryId: data.countryId,
        administrativeAreaLevel1: data.administrativeAreaLevel1,
        administrativeAreaLevel2: data.administrativeAreaLevel2,
        direction: data.direction,
        longitude: data.longitude,
        latitude: data.latitude,
        tablesData: {}
      },
      circuitoId: null,
      regionalId: props.currentRegional.id,
      formularioCategoriaId: categoriaForm
    }
    reqData.solucion = JSON.stringify(reqData.solucion) as any
    const response = await saveFormularioLocalizacion(reqData)
    const reqDataUbicacion: CurrentRegional = {
      ...state.currentRegional,
      esActivo: state.currentRegional?.esActivo === 'Activo',
      codigoDgsc2: undefined,
      codigoDgsc: state.currentRegional?.codigoDgsc2,
      ubicacionGeograficaJson: JSON.stringify({
        [data.dropdownIds.provincia]: data.province.id,
        [data.dropdownIds.canton]: data.canton.id,
        [data.dropdownIds.distrito]: data.distrito.id,
        [data.dropdownIds.poblado]: data.poblado.id,
        [data.dropdownIds.direccionExacta]: data.direction,
        [data.dropdownIds.longitude]: data.longitude,
        [data.dropdownIds.latitude]: data.latitude
      })
    }
    const res2 = await actions.updateRegional(reqDataUbicacion)
    const solucion = JSON.parse(response.data.solucion)
    setFormResponse({ ...solucion, id: response.data.id })
    if (res2?.error || response?.error) {
      showNotification('error', res2.message)
      setLoadingRequest(false)
      return
    }
    showNotification('success', 'Datos guardados con éxito')
    setLoadingRequest(false)
  }

  const putData = async () => {
    setLoadingRequest(true)
    if (
      !data.countryId ||
        !data.administrativeAreaLevel1 ||
        !data.administrativeAreaLevel2 ||
        !data.direction ||
        !data.longitude ||
        !data.latitude
    ) {
      showNotification('error', t('general>mensaje>rellenar_campos','Debe rellenar todos los campos'))
      setLoadingRequest(false)
      return
    }
    const reqDataUbicacion: CurrentRegional = {
      ...state.currentRegional,
      esActivo: state.currentRegional?.esActivo === 'Activo',
      codigoDgsc2: undefined,
      codigoDgsc: state.currentRegional?.codigoDgsc2,
      ubicacionGeograficaJson: JSON.stringify({
        paisId: data.countryId,
        areaAdministrativaNivel1: data.administrativeAreaLevel1,
        areaAdministrativaNivel2: data.administrativeAreaLevel2,
        direccionExacta: data.direction,
        longitud: data.longitude,
        latitud: data.latitude
      })
    }
   var response =  await actions.updateRegional(reqDataUbicacion)

     if (response.error){
      showNotification('error', response.message)
     }else{
      actions.getRegionalById(state.currentRegional?.id)
      showNotification('success', 'Datos guardados con éxito')
     }
    
    setLoadingRequest(false)
  }

  const showNotification = (variant: string, msg: string) => {
    setSnackbarContent({ variant, msg })
    handleClick()
  }

  const values = useMemo(() => {
    return state.currentRegional.ubicacionGeograficaJson
      ? JSON.parse(state.currentRegional.ubicacionGeograficaJson)
      : undefined
  }, [state.currentRegional])

  return (
    <Wrapper>
      {snackbar(snackBarContent.variant, snackBarContent.msg)}
      <NavigationContainer
        goBack={props.handleBack}
      />
      <Form
        onSubmit={(e) => {
          e.preventDefault()
          if (!errors || Object.keys(errors)?.length === 0) {
            putData()
            setEditable(false)
          }
        }}
      >
        {!loading
          ? (
            <>
              <Card>
                <CardBody>
                {
                    loadingMap && (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          overflow: 'hidden',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          position: 'absolute'
                        }}
                      >
                        <Loader />
                      </div>
                    )
                  }
                  <Selectors
                    editable={editable}
                    readOnly={false}
                    onReady={() => {
                      setLoadingMap(false)
                    }}
                    initialValues={{
                      ...values,
                      countryId: values?.paisId,
                      administrativeAreaLevel1: values?.areaAdministrativaNivel1,
                      administrativeAreaLevel2: values?.areaAdministrativaNivel2,
                      direction: values?.direccionExacta,
                      longitude: values?.longitud,
                      latitude: values?.latitud,
                    }}
                    onChange={(e, _errors) => {
                      setErrors(_errors)
                      setData({
                        countryId: e?.country?.id,
                        administrativeAreaLevel1: e?.administrative_area_level_1?.id,
                        administrativeAreaLevel2: e?.administrative_area_level_2?.id,
                        direction: e?.street,
                        longitude: e.longitude,
                        latitude: e.latitude
                      })
                    }}
                  />
                </CardBody>
              </Card>
              {hasEditAccess && (
                <div className='d-flex justify-content-center align-items-center my-5'>
                  <EditButton
                    editable={editable}
                    setEditable={(value) => {
                      if (!loadingMap) {
                        setEditable(value)
                      }
                    }}
                    loading={loadingRequest}
                  />
                </div>
              )}
            </>
            )
          : (
            <Loader />
            )}
      </Form>
    </Wrapper>
  )
}

const Wrapper = styled.div`
	margin-top: 10px;
`

export default withRouter(Ubicacion)
