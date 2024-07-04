import React, { useEffect, useState } from 'react'
import JSONFormParser from '../../../../../../components/JSONFormParser/JSONFormParser.tsx'
import {
  PageData,
  FormResponse
} from '../../../../components/JSONFormParser/Interfaces.ts'
import axios from 'axios'
import { envVariables } from '../../../../../../constants/enviroment'
import { useSelector } from 'react-redux'
import { expedienteBaseUrl } from '../../../_partials/expetienteBaseUrl.ts'
import { CreateNewFormResponse, UpdateFormResponse, GetResponseByInstitutionAndFormName } from '../../../../../../redux/formularioCentroResponse/actions'
import Loader from 'Components/Loader'
import { useTranslation } from 'react-i18next'

const Edificaciones: React.FC = (props) => {
  const { t } = useTranslation()
  const [pageData, setPageData] = useState<PageData | object>({ layouts: [] })
  const [formResponse, setFormResponse] = useState<FormResponse | object>({})
  const [loading, setLoading] = useState(false)
  const [formId, setFormId] = useState(null)
  const state = useSelector(store => {
    return {
      auth: store.authUser
    }
  })

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const response = await axios.get(
                    `${envVariables.BACKEND_URL}${expedienteBaseUrl}Formulario/GetByName/obrasComplementarias`
        )
        const formResponseFromBackend = await GetResponseByInstitutionAndFormName(state.auth.currentInstitution.id, 'obrasComplementarias')
        const form = JSON.parse(response.data.formulario)
        setFormId(response.data.formularioCategoriaId)
        formResponseFromBackend.solucion && setFormResponse({ ...JSON.parse(formResponseFromBackend.solucion), id: formResponseFromBackend.id })
        setPageData(form)
      } catch (e) {
        setPageData({})
      }
      setLoading(false)
    }
    loadData()
  }, [state.auth.currentInstitution])

  const postData = async (data) => {
    const response = await CreateNewFormResponse({ solucion: data.solucion, institucionId: state.auth.currentInstitution.id, formularioCategoriaId: formId })

    setFormResponse({ ...JSON.parse(response.data.solucion), id: response.data.id })
    return response
  }

  const putData = async data => {
    const response = await UpdateFormResponse({ ...data, id: formResponse.id })

    setFormResponse({ ...JSON.parse(response.data.solucion), id: response.data.id })
    return response
  }

  return (
    <div>
      <br />
      <p>
        {t("expediente_ce>infraestructura>obras_complementarias>title", "Este apartado busca detallar información de elementos importantes de la infraestructura de un centro educativo, pero que no pertenencen propiamente a los edificios o que son sistemas complementarios para su funcionamiento. En algunos se hará una referencia general del estado de conservación y/o funcionamiento, desde la perspectiva del usuario.")}
      </p>
      <br />
      {!loading
        ? <JSONFormParser
            pageData={pageData}
            postData={postData}
            putData={putData}
            dataForm={formResponse}
            data={[]}
          />
        : <Loader />}
    </div>
  )
}

export default Edificaciones
