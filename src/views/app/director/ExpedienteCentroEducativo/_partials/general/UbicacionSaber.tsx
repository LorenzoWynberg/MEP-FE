import React, {useEffect, useState} from 'react';
import { useActions } from 'Hooks/useActions';

import JSONFormParser from "Components/JSONFormParser/JSONFormParser";
import { GetResponseByInstitutionAndFormName, CreateNewFormResponse, UpdateFormResponse } from '../../../../../../redux/formularioCentroResponse/actions';
import { GetByName } from 'Redux/formularios/actions';
import { useSelector } from 'react-redux';
import Loader from 'Components/Loader';
import { getDatosDirector, clearDatosDirector } from '../../../../../../redux/institucion/actions';

const UbicacionGeografica = (props) => {
    const [pageData, setPageData] = useState({layouts:[]})
    const [formResponse, setFormResponse] = useState({})
    const [loading, setLoading] = useState(true)
    const [loadingRequest, setLoadingRequest] = useState(false)
    const [categoriaForm, setCategoriaForm]= useState(0)
    const actions = useActions({clearDatosDirector, getDatosDirector})

    const state = useSelector((store) => {
        return {
            currentInstitution: store.authUser.currentInstitution,
        }
    })

    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            try {
                const form = await GetByName('ubicacionGeografica');
                const response = await GetResponseByInstitutionAndFormName(state.currentInstitution.id, "ubicacionGeografica", true)
                if (response.solucion) {
                    setFormResponse({...JSON.parse(response.solucion), id: response.id})
                } else {
                    setFormResponse(null)
                }
                setCategoriaForm(form.formularioCategoriaId)
                setPageData(form.formulario);
            } catch (e) {
                setPageData({layouts:[]});
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
        const response = await CreateNewFormResponse({solucion:data.solucion, institucionId:state.currentInstitution.id, formularioCategoriaId:categoriaForm})
        await setFormResponse(JSON.parse(response.data.solucion))
        setLoadingRequest(false)
    }

    const putData = async (data) => {
        setLoadingRequest(true)
        const response = await UpdateFormResponse({...data, id: formResponse.id})
        await setFormResponse(JSON.parse(response.data.solucion))
        setLoadingRequest(false)
    }

    const newPageData = pageData

    const indexContent = newPageData?.contents?.findIndex((el) => el?.config?.titulo === 'Ubicación temporal')
    const indexLayout = newPageData?.contents?.findIndex((el) => el?.config?.titulo === 'Ubicación temporal')
    if (
        indexContent && indexContent !== -1 && 
        indexLayout && indexLayout !== -1 /*&& 
        !formResponse['d65200df-4d2c-763e-8999-a3cddf592b05'] && 
        !formResponse['6fbb1a78-25a8-36a3-6787-157a44330fb5']*/
    ) {

        newPageData?.contents?.splice(indexContent, 1)
        newPageData?.layouts?.splice(indexLayout, 1)
    }

    return (
        <div>
           {!loading ? 
           <JSONFormParser
            pageData={pageData}
            mapFunctionObj={{}}
            postData={postData}
            putData={putData}
            deleteData={() => {}}
            dataForm={formResponse}
            data={[]}
            statusColor={item => (true ? "primary" : "light")}
            loadingRequest={loadingRequest}
            readOnly={true}
            editable={false}
            readOnlyFields={[
                "32d9a522-a699-7c0d-dd6c-a345c3a19144_b347f9f9-c45a-774c-229d-609a4e963ff1_col",
                "47a5b311-01d4-fea6-9483-08bfeee22725_b347f9f9-c45a-774c-229d-609a4e963ff1_col",
                "1_9e604610-910a-d393-7926-47b9c6fea6eb_b347f9f9-c45a-774c-229d-609a4e963ff1_col",
                "75bdf8ac-c36e-e47e-a007-37cdadbf954b",
                "cd492ff2-eebd-3976-163e-5b88bc3684a0",
                "66f130cc-0656-ff48-8710-708f230a9f9b",
                "9905c516-75b5-6c94-4703-507b2dfc00d0",
                "012e6d31-8890-e6be-3234-cd4bdd1a10e9",
                "07701069-2859-9339-c01e-a30f0b97ce86",
                "d76f4ce6-5424-28e6-a236-58d3774ac9bc",
            ]}
           /> :
            <Loader/>
           }
        </div>
    )
}

export default UbicacionGeografica