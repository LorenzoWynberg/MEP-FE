import React, { useEffect, useState } from 'react'
import { useActions } from 'Hooks/useActions'

import JSONFormParser from 'Components/JSONFormParser/JSONFormParser'
import { GetResponseByInstitutionAndFormName, CreateNewFormResponse, UpdateFormResponse } from '../../../../../../redux/formularioCentroResponse/actions'
import { GetByName } from 'Redux/formularios/actions'
import { useSelector } from 'react-redux'
import Loader from 'Components/Loader'
import { clearDatosDirector, getRegistralInformation } from '../../../../../../redux/institucion/actions'
import {
  Card,
  CardBody,
  Input,
  Label
} from 'reactstrap'
import { useTranslation } from 'react-i18next'

const UbicacionAdministrativa = (props) => {
  const { t } = useTranslation()
  const [pageData, setPageData] = useState({ layouts: [] })
  const [categoriaForm, setCategoriaForm] = useState(0)
  const [formResponse, setFormResponse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingRequest, setLoadingRequest] = useState(false)
  const actions = useActions({ clearDatosDirector, getRegistralInformation })

  const state = useSelector((store) => {
    return {
      currentInstitution: store.authUser.currentInstitution,
      regionalLocation: store.institucion.regionalLocation
    }
  })
  // commented this but it can be useful later
  // enum inputIdsToNames {
  //     "1_5bf4b222-d752-458b-d042-c4d7bfb4850e_78d03382-84a4-a12b-a667-5eed0db93a55_col"= "Teléfono principal de circuito",
  //     "1_70cede42-9547-c9c4-dec7-32043c81f406_78d03382-84a4-a12b-a667-5eed0db93a55_col"= "Correo oficial",
  //     "1_88a28bd5-79c8-a202-dbd7-9049733f6bf7_cce066e3-dda5-8a69-1efc-569080039d08_col"= "Cédula director regional",
  //     "1_179308aa-bc99-d660-3cc9-abecccfcabf5_6e8fb38b-ea79-3e80-4a95-c10947ea1c11_col"= "Teléfono principal",
  //     "1_a6e9cccf-d3b3-ca5e-0b81-2b9b98c7a645_82328b78-bbc0-b1ca-5115-c6bb636530c2_col"= "Nombre completo del asesor supervisor",
  //     "1_a437144f-6629-ce5e-9e36-02a319440c91_78d03382-84a4-a12b-a667-5eed0db93a55_col"= "Nombre de circuito",
  //     "1_b11cd6f4-e46f-da0a-fa72-445079f960c0_82328b78-bbc0-b1ca-5115-c6bb636530c2_col"= "Correo asesor supervisor",
  //     "1_cbcdaf7c-acc3-6d44-904e-1e9f5b701ba4_cce066e3-dda5-8a69-1efc-569080039d08_col"= "Nombre completo del director regional",
  //     "1_e9bbb3d4-7671-64b3-69d8-09c509314688_82328b78-bbc0-b1ca-5115-c6bb636530c2_col"= "Cédula asesor supervisor",
  //     "1_fdd919b3-b275-f964-c52b-1117a2cc2861_cce066e3-dda5-8a69-1efc-569080039d08_col"= "Correo director regional",
  //     "3764dd69-55ef-46bc-b325-300bf8603308_6e8fb38b-ea79-3e80-4a95-c10947ea1c11_col"= "CorreoRegional",
  //     "d86b9cda-f22d-fbb0-0e49-f51dad54398b_6e8fb38b-ea79-3e80-4a95-c10947ea1c11_col" = "nombreRegional"
  // }

    enum inputNamesToIds {
        'CorreoRegional' = '3764dd69-55ef-46bc-b325-300bf8603308_6e8fb38b-ea79-3e80-4a95-c10947ea1c11_col',
        'Teléfono principal de circuito' = '1_5bf4b222-d752-458b-d042-c4d7bfb4850e_78d03382-84a4-a12b-a667-5eed0db93a55_col',
        'Nombre de circuito' = '1_a437144f-6629-ce5e-9e36-02a319440c91_78d03382-84a4-a12b-a667-5eed0db93a55_col',
        'Correo oficial' = '1_70cede42-9547-c9c4-dec7-32043c81f406_78d03382-84a4-a12b-a667-5eed0db93a55_col',
        'Cédula director regional' = '1_88a28bd5-79c8-a202-dbd7-9049733f6bf7_cce066e3-dda5-8a69-1efc-569080039d08_col',
        'Teléfono principal' = '1_179308aa-bc99-d660-3cc9-abecccfcabf5_6e8fb38b-ea79-3e80-4a95-c10947ea1c11_col',
        'Nombre completo del asesor supervisor' = '1_a6e9cccf-d3b3-ca5e-0b81-2b9b98c7a645_82328b78-bbc0-b1ca-5115-c6bb636530c2_col',
        'Correo asesor supervisor' = '1_b11cd6f4-e46f-da0a-fa72-445079f960c0_82328b78-bbc0-b1ca-5115-c6bb636530c2_col',
        'Nombre completo del director regional' = '1_cbcdaf7c-acc3-6d44-904e-1e9f5b701ba4_cce066e3-dda5-8a69-1efc-569080039d08_col',
        'Cédula asesor supervisor' = '1_e9bbb3d4-7671-64b3-69d8-09c509314688_82328b78-bbc0-b1ca-5115-c6bb636530c2_col',
        'Correo director regional' = '1_fdd919b3-b275-f964-c52b-1117a2cc2861_cce066e3-dda5-8a69-1efc-569080039d08_col',
        'nombreRegional'='d86b9cda-f22d-fbb0-0e49-f51dad54398b_6e8fb38b-ea79-3e80-4a95-c10947ea1c11_col'
    }

    useEffect(() => {
      const loadData = async () => {
        setLoading(true)
        try {
          const form = await GetByName('ubicacionAdministrativa')
          const response = await GetResponseByInstitutionAndFormName(state.currentInstitution.id, 'ubicacionAdministrativa')
          const regionalInfoResponse = await actions.getRegistralInformation(state.currentInstitution.id)
          setCategoriaForm(form.formularioCategoriaId)
          setPageData(form.formulario)
        } catch (e) {
          setPageData({ layouts: [] })
        }
        setLoading(false)
      }

      loadData()

      return () => {

      }
    }, [state.currentInstitution.id])

    useEffect(() => {
      getInputIds(state.regionalLocation)
    }, [state.regionalLocation.infoCircuital])

    const getInputIds = (data) => {
      if (data.infoCircuital) {
        const _data = {
          [inputNamesToIds['Nombre de circuito']]: data.infoCircuital.nombre,
          [inputNamesToIds['Nombre completo del asesor supervisor']]: data.infoCircuital.nombreDirector,
          [inputNamesToIds['Teléfono principal de circuito']]: data.infoCircuital.telefono,
          [inputNamesToIds['Cédula asesor supervisor']]: data.infoCircuital.identificacion,
          [inputNamesToIds['Correo oficial']]: data.infoCircuital.correo,
          [inputNamesToIds['Correo asesor supervisor']]: data.infoCircuital.correoDirector,
          [inputNamesToIds.nombreRegional]: data.infoRegional.nombre,
          [inputNamesToIds['Nombre completo del director regional']]: data.infoRegional.nombreDirector,
          [inputNamesToIds['Teléfono principal']]: data.infoRegional.telefono,
          [inputNamesToIds.CorreoRegional]: data.infoRegional.correo,
          [inputNamesToIds['Cédula director regional']]: data.infoRegional.identificacion,
          [inputNamesToIds['Correo director regional']]: data.infoRegional.correoDirector
        }
        setFormResponse(_data)
      }
    }

    const postData = async (data) => {
      setLoadingRequest(true)
      await CreateNewFormResponse({ solucion: data.solucion, institucionId: state.currentInstitution.id, formularioCategoriaId: categoriaForm })
      setLoadingRequest(false)
    }

    const putData = async (data) => {
      setLoadingRequest(true)
      await UpdateFormResponse({ ...data, id: formResponse.id })
      setLoadingRequest(false)
    }

    return (
      <div>
        {!loading ? (
          <>
            <div className='d-flex justify-content-between'>
              <Card style={{ width: '49%' }}>
                <CardBody>
                  <h3>{t('expediente_ce>informacion_general>ubicacion_adm>direccion_regional', 'Dirección regional')}</h3>
                  <div className=''>
                    <div className='my-2'>
                      <Label>{t('expediente_ce>informacion_general>ubicacion_adm>direccion_regional>nombre', 'Nombre de la dirección regional')}</Label>
                      <Input type='text' disabled value={state.regionalLocation?.infoRegional?.nombre} />
                    </div>
                    <div className='my-2'>
                      <Label>{t('expediente_ce>informacion_general>ubicacion_adm>direccion_regional>telefono', 'Teléfono principal')}</Label>
                      <Input type='text' disabled value={state.regionalLocation?.infoRegional?.telefono} />
                    </div>
                    <div className='my-2'>
                      <Label>{t('expediente_ce>informacion_general>ubicacion_adm>direccion_regional>correo', 'Correo oficial')} </Label>
                      <Input type='text' disabled value={state.regionalLocation?.infoRegional?.correo} />
                    </div>
                  </div>
                </CardBody>
              </Card>
              <Card style={{ width: '49%' }}>
                <CardBody>
                  <h3>{t('expediente_ce>informacion_general>ubicacion_adm>director_regional', 'Director regional')}</h3>
                  <div className=''>
                    <div className='my-2'>
                      <Label>{t('expediente_ce>informacion_general>ubicacion_adm>director_regional>nombre', 'Nombre completo del director regional')}</Label>
                      <Input type='text' disabled value={state.regionalLocation?.infoRegional?.nombreDirector} />
                    </div>
                    <div className='my-2'>
                      <Label>{t('expediente_ce>informacion_general>ubicacion_adm>director_regional>tipo_identificacion', 'Tipo de identificación')}</Label>
                      <Input type='text' disabled value={state.regionalLocation?.infoRegional?.tipoIdentificacion} />
                    </div>
                    <div className='my-2'>
                      <Label>{t('expediente_ce>informacion_general>ubicacion_adm>director_regional>identificacion', 'Identificación')}</Label>
                      <Input type='text' disabled value={state.regionalLocation?.infoRegional?.identificacion} />
                    </div>
                    <div className='my-2'>
                      <Label>{t('expediente_ce>informacion_general>ubicacion_adm>director_regional>correo', 'Correo director regional')}</Label>
                      <Input type='text' disabled value={state.regionalLocation?.infoRegional?.correoDirector} />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
            <div className='d-flex justify-content-between my-3'>
              <Card style={{ width: '49%' }}>
                <CardBody>
                  <h3>{t('expediente_ce>informacion_general>ubicacion_adm>supervision_circuital', 'Supervisión circuital')}</h3>
                  <div className=''>
                    <div className='my-2'>
                      <Label>{t('expediente_ce>informacion_general>ubicacion_adm>supervision_circuital>nombre', 'Nombre de circuito')}</Label>
                      <Input type='text' disabled value={state.regionalLocation?.infoCircuital.nombre} />
                    </div>
                    <div className='my-2'>
                      <Label>{t('expediente_ce>informacion_general>ubicacion_adm>supervision_circuital>telefono', 'Teléfono principal')}</Label>
                      <Input type='text' disabled value={state.regionalLocation?.infoCircuital?.telefono} />
                    </div>
                    <div className='my-2'>
                      <Label>{t('expediente_ce>informacion_general>ubicacion_adm>supervision_circuital>correo', 'Correo oficial')} </Label>
                      <Input type='text' disabled value={state.regionalLocation?.infoCircuital?.correo} />
                    </div>
                  </div>
                </CardBody>
              </Card>
              <Card style={{ width: '49%' }}>
                <CardBody>
                  <h3>{t('expediente_ce>informacion_general>ubicacion_adm>supervisor_circuital', 'Supervisor circuital')}</h3>
                  <div className=''>
                    <div className='my-2'>
                      <Label>{t('expediente_ce>informacion_general>ubicacion_adm>supervisor_circuital>nombre', 'Nombre completo del asesor supervisor')}</Label>
                      <Input type='text' disabled value={state.regionalLocation?.infoCircuital?.nombreDirector} />
                    </div>
                    <div className='my-2'>
                      <Label>{t('expediente_ce>informacion_general>ubicacion_adm>supervisor_circuital>tipo_identificacion', 'Tipo de identificación')}</Label>
                      <Input type='text' disabled value={state.regionalLocation?.infoCircuital?.tipoIdentificacion} />
                    </div>
                    <div className='my-2'>
                      <Label>{t('expediente_ce>informacion_general>ubicacion_adm>supervisor_circuital>identificacion', 'Identificación')}</Label>
                      <Input type='text' disabled value={state.regionalLocation?.infoCircuital?.identificacion} />
                    </div>
                    <div className='my-2'>
                      <Label>{t('expediente_ce>informacion_general>ubicacion_adm>supervisor_circuital>correo', 'Correo asesor supervisor')} </Label>
                      <Input type='text' disabled value={state.regionalLocation?.infoCircuital?.correoDirector} />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
            {/* <JSONFormParser
                        pageData={pageData}
                        mapFunctionObj={{}}
                        postData={postData}
                        putData={putData}
                        deleteData={() => {}}
                        dataForm={formResponse}
                        data={[]}
                        statusColor={item => (true ? "primary" : "light")}
                        loadingRequest={loadingRequest}
                        readOnly
                    /> */}
          </>
        )
          : <Loader />}
      </div>
    )
}

export default UbicacionAdministrativa
