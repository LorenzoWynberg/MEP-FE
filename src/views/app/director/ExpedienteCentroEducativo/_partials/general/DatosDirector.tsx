import React, { useEffect, useState } from 'react'
import { useActions } from 'Hooks/useActions'

import JSONFormParser from 'Components/JSONFormParser/JSONFormParser.tsx'
import { GetResponseByInstitutionAndFormName, CreateNewFormResponse, UpdateFormResponse } from '../../../../../../redux/formularioCentroResponse/actions'
import { GetByName } from 'Redux/formularios/actions'
import { useSelector } from 'react-redux'
import Loader from 'Components/Loader'
import { getDatosDirector, clearDatosDirector } from '../../../../../../redux/institucion/actions'

const DatosDirector = (props) => {
  const [pageData, setPageData] = useState({ layouts: [] })
  const [formResponse, setFormResponse] = useState({})
  const [loading, setLoading] = useState(true)
  const [loadingRequest, setLoadingRequest] = useState(false)
  const actions = useActions({ clearDatosDirector, getDatosDirector })

  const state = useSelector((store) => {
    return {
      currentInstitution: store.authUser.currentInstitution,
      institucionWithAditionalData: store.institucion.currentInstitution,
      datosDirector: store.institucion.datosDirector
    }
  })

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const form = await GetByName('datosDirectorDeCentro')
        const response = await GetResponseByInstitutionAndFormName(state.currentInstitution.id, 'datosDirectorDeCentro')
        await actions.getDatosDirector(state.currentInstitution.id)
        if (response.solucion) {
          setFormResponse({ ...JSON.parse(response.solucion), id: response.id })
        }

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

  useEffect(() => {
    setFormResponse({
      '1a3f5913-f36a-0b51-0366-3db524890ff3_cc98acae-3314-bc0c-69a0-e558b74b4032_col': state.datosDirector.nombre,
      '6a616901-aeab-08bc-3a26-336e4d3af396_cc98acae-3314-bc0c-69a0-e558b74b4032_col': state.datosDirector.email,
      '7f008588-e98b-7d7e-db6b-aae26b29359a_cc98acae-3314-bc0c-69a0-e558b74b4032_col': state.datosDirector.identificacion,
      '8fc94f52-62b0-9bc3-5db0-2f2b39b87fcd_cc98acae-3314-bc0c-69a0-e558b74b4032_col': state.datosDirector.segundoApellido,
      'b87e802d-4770-ca9e-426e-2d260946c669_cc98acae-3314-bc0c-69a0-e558b74b4032_col': state.datosDirector.primerApellido
    })
  }, [state.datosDirector])

  const postData = async (data) => {
    setLoadingRequest(true)
    await CreateNewFormResponse({ solucion: data.solucion, institucionId: state.currentInstitution.id, formularioCategoriaId: 5 })
    setLoadingRequest(false)
  }

  const putData = async (data) => {
    setLoadingRequest(true)
    await UpdateFormResponse({ ...data, id: formResponse.id })
    setLoadingRequest(false)
  }

  return (
    <div>
      {!loading
        ? <JSONFormParser
            pageData={pageData}
            mapFunctionObj={{}}
            postData={postData}
            putData={putData}
            deleteData={() => {}}
            dataForm={formResponse}
            data={[]}
            statusColor={item => (true ? 'primary' : 'light')}
            readOnly
            loadingRequest={loadingRequest}
          />
        : <Loader />}
    </div>
  )
}

export default DatosDirector
