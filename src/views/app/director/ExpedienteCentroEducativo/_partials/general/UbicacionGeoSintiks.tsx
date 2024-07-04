import React, { useEffect, useState } from 'react'
import { useActions } from 'Hooks/useActions'

import JSONFormParser from 'Components/JSONFormParser/JSONFormParser.tsx'
import { GetResponseByInstitutionAndFormName, CreateNewFormResponse, UpdateFormResponse } from '../../../../../../redux/formularioCentroResponse/actions'
import { GetByName } from 'Redux/formularios/actions'
import { useSelector } from 'react-redux'
import Loader from 'Components/Loader'
import { getDatosDirector, clearDatosDirector } from '../../../../../../redux/institucion/actions'
import Select from 'react-select'
import Selectors from 'Components/GoogleMapsLocation/Selectors'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import useNotification from 'Hooks/useNotification'
import { Institucion } from '../../../../../../api'

const RegionSocioeconomicaOptions = [
  { label: 'Central', value: 'central' },
  { label: 'Chorotega', value: 'chorotega' },
  { label: 'Pacifico Central', value: 'pacifico central' },
  { label: 'Brunca', value: 'brunca' },
  { label: 'Huetar Atlantica', value: 'huetar atlantica' },
  { label: 'Huetar Norte', value: 'huetar norte' }
]
const ZonaOptions = [
  { label: 'Urbana', value: 'urbana' },
  { label: 'Rural', value: 'rural' }
]
const TipoTerritorioOptions = [
  { label: 'Indigena', value: 'indigena' },
  { label: 'Costero', value: 'costero' },
  { label: 'Maritimo', value: 'maritimo' }
]

const UbicacionGeografica = (props) => {
  const { t } = useTranslation()
  const [pageData, setPageData] = useState({ layouts: [] })
  const [formResponse, setFormResponse] = useState({})
  const [loading, setLoading] = useState(true)
  const [loadingRequest, setLoadingRequest] = useState(false)
  const [categoriaForm, setCategoriaForm] = useState(0)
  const actions = useActions({ clearDatosDirector, getDatosDirector })
  const [snackbar, handleClick] = useNotification()
  const [snackbarState, setSnackbarState] = useState<any>({})
  const [formState, setFormState] = useState<any>({})

  const state = useSelector((store) => {
    return {
      currentInstitution: store.authUser.currentInstitution
    }
  })

  useEffect(() => {
    const loadData = async () => {
      const institucionId = state.currentInstitution.id
      setLoading(true)
      const json = await Institucion.getUbicacionJson(institucionId)
      if (json) setFormState(json)
      setLoading(false)
    }

    loadData()
  }, [])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const form = await GetByName('ubicacionGeografica')
        const response = await GetResponseByInstitutionAndFormName(state.currentInstitution.id, 'ubicacionGeografica', true)
        if (response.solucion) {
          setFormResponse({ ...JSON.parse(response.solucion), id: response.id })
        } else {
          setFormResponse({})
        }
        setCategoriaForm(form.formularioCategoriaId)
        setPageData(form.formulario)
      } catch (e) {
        setPageData({ layouts: [] })
      }
      setLoading(false)
    }

    loadData()

    return () => {
      actions.clearDatosDirector()
    }
  }, [state.currentInstitution.id])

  const postData = async (data) => {
    setLoadingRequest(true)
    const response = await CreateNewFormResponse({ solucion: data.solucion, institucionId: state.currentInstitution.id, formularioCategoriaId: categoriaForm })
    await setFormResponse(JSON.parse(response.data.solucion))
    setLoadingRequest(false)
  }

  const putData = async (data) => {
    setLoadingRequest(true)
    const response = await UpdateFormResponse({ ...data, id: formResponse.id })
    await setFormResponse(JSON.parse(response.data.solucion))
    setLoadingRequest(false)
  }

  const newPageData = pageData

  const indexContent = newPageData?.contents?.findIndex((el) => el?.config?.titulo === 'Ubicación temporal')
  const indexLayout = newPageData?.contents?.findIndex((el) => el?.config?.titulo === 'Ubicación temporal')
  if (
    indexContent && indexContent !== -1 &&
        indexLayout && indexLayout !== -1/* &&
        !formResponse['d65200df-4d2c-763e-8999-a3cddf592b05'] &&
        !formResponse['6fbb1a78-25a8-36a3-6787-157a44330fb5'] */
  ) {
    newPageData?.contents?.splice(indexContent, 1)
    newPageData?.layouts?.splice(indexLayout, 1)
  }

  return (
    <div>
      {!loading
           		? <div>
             {loading && <Loader />}
             {snackbar(snackbarState.type, snackbarState.msg)}
             <Container onSubmit={(e) => {
               e.preventDefault()
             }}
             >
               <Card>
                 <h4>{t('configuracion>centro_educativo>ver_centro_educativo>ubicacion>poblacional', 'Poblacional')}</h4>
                 <FiledsContainer>
                   <div>
                     <label>{t('configuracion>centro_educativo>ver_centro_educativo>ubicacion>region_socioeconomica', 'Región socioeconómica')}</label>
                     <Select
                       name='regionSocioeconomica'
                       options={RegionSocioeconomicaOptions}
                       placeholder={t('general>seleccionar', 'Seleccionar')}
                       isDisabled
                       noOptionsMessage={() => t('general>no_registros', 'No hay registros')}
                                    //    onChange={(e)=>onChangeSelect(e,"regionSocioeconomica")}
                       value={formState?.regionSocioeconomica}
                     />
                   </div>
                   <div>
                     <label>{t('configuracion>centro_educativo>ver_centro_educativo>ubicacion>zona', 'Zona')}</label>
                     <Select
                       name='zona'
                       options={ZonaOptions}
                       placeholder={t('general>seleccionar', 'Seleccionar')}
                       isDisabled
                       noOptionsMessage={() => t('general>no_registros', 'No hay registros')}
                                    //    onChange={(e)=>onChangeSelect(e,"zona")}
                       value={formState?.zona}
                     />
                   </div>
                   <div>
                     <label>{t('configuracion>centro_educativo>ver_centro_educativo>ubicacion>tipo_territorio', 'Tipo de territorio')}</label>
                     <Select
                       name='tipoTerritorio'
                       options={TipoTerritorioOptions}
                       placeholder={t('general>seleccionar', 'Seleccionar')}
                       isDisabled
                       noOptionsMessage={() => t('general>no_registros', 'No hay registros')}
                                    //    onChange={(e)=>onChangeSelect(e,"tipoTerritorio")}
                       value={formState?.tipoTerritorio}
                     />
                   </div>
                 </FiledsContainer>
               </Card>
               <Card>
                 <h4>{t('configuracion>centro_educativo>ver_centro_educativo>ubicacion>geografica', 'Geográfica')}</h4>
                 <Selectors
                   editable={false}
                   initialValues={{
                    countryId: formState?.paisId,
                    administrativeAreaLevel1: formState?.areaAdministrativaNivel1,
                    administrativeAreaLevel2: formState?.areaAdministrativaNivel2,
                    direction: formState?.direccionExacta,
                    longitude: formState?.longitud,
                    latitude: formState?.latitud,
                   }}
                 />
               </Card>
             </Container>
               </div>
        : <Loader />}
    </div>
  )
}

const Container = styled.form`
	display: grid;
	grid-template-columns: 1fr;
`
const Card = styled.div`
	border: initial;
	background: #fff;
	border-radius: calc(0.85rem - 1px);
	box-shadow: 0 1px 15px rgb(0 0 0 / 4%), 0 1px 6px rgb(0 0 0 / 4%);
	margin-bottom: 1.5rem;
	padding: 1.5rem;
`
const FiledsContainer = styled.div`
	display: grid;
	gap: 1rem;
	width: 100%;
	grid-template-columns: 1fr 1fr;
`

export default UbicacionGeografica
