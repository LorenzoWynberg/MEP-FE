import React from 'react'
import styled from 'styled-components'
import JSONFormParser from 'Components/JSONFormParser/JSONFormParser'
import { GetByName } from '../../../../../../redux/formularios/actions'
import Loader from 'Components/Loader'

type IProps = {
    handleBack: Function
};

export const CreateGrup: React.FC<IProps> = (props) => {
  const [pageForm, setPageForm] = React.useState<object>({ layouts: [] })
  const [editable, setEditable] = React.useState<boolean>(true)
  const [formResponse, setFormResponse] = React.useState<any>(null)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [loadingRequest, setLoadingRequest] = React.useState<boolean>(false)
  React.useEffect(() => {
    const fetchForm = async () => {
      setLoading(true)
      const form = await GetByName('grupoLectivo')
      if (props.currentItem.grupoId) {
        setFormResponse({
          id: props.currentItem.grupoId,
          '86f5bdd7-5fe7-6693-86ab-9ad796e3efbe_39f969ae-9c9f-791a-2e64-c09a43a13db1_col': props.currentItem.limiteEstudiantes,
          'aede7b0d-95dd-4aa1-082f-f08c55ecff2a_39f969ae-9c9f-791a-2e64-c09a43a13db1_col': props.currentItem.grupo,
          // 'b0140c1e-bd3d-6e93-3964-81441be937ce_39f969ae-9c9f-791a-2e64-c09a43a13db1_col': props.currentItem.reservados,
          'ee83be8d-e56c-6076-e7ec-f23deee0773b_39f969ae-9c9f-791a-2e64-c09a43a13db1_col': props.currentItem.imagen && {
            files: [
              {
                url: props.currentItem.imagen,
                title: 'Imagen de grupo',
                show: true,
                upload: false
              }
            ],
            type: 'imagen'
          },
          '01ce27bd-3263-2c1a-c6c0-4e7f50ee31b8_39f969ae-9c9f-791a-2e64-c09a43a13db1_col': props.currentItem.estado ? 1 : 2,
          'ccf28b76-1ba9-adee-b900-799586c0ec5a_39f969ae-9c9f-791a-2e64-c09a43a13db1_col': props.currentItem.estudiantesMatriculados || 0
        })
      } else {
        setFormResponse({
          '01ce27bd-3263-2c1a-c6c0-4e7f50ee31b8_39f969ae-9c9f-791a-2e64-c09a43a13db1_col': 1,
          'ccf28b76-1ba9-adee-b900-799586c0ec5a_39f969ae-9c9f-791a-2e64-c09a43a13db1_col': 0
        })
      }
      setPageForm(form.formulario)
      setLoading(false)
    }
    fetchForm()
  }, [])

  React.useEffect(() => {
    if (!editable && formResponse && formResponse['01ce27bd-3263-2c1a-c6c0-4e7f50ee31b8_39f969ae-9c9f-791a-2e64-c09a43a13db1_col']) {
      props.handleBack()
    }
  }, [editable])

  const postData = (data) => {
    const parsedData = JSON.parse(data.solucion)
    const _data = {}
    _data.estado = true
    _data.limiteEstudiante = parsedData['86f5bdd7-5fe7-6693-86ab-9ad796e3efbe_39f969ae-9c9f-791a-2e64-c09a43a13db1_col']
    _data.nombre = parsedData['aede7b0d-95dd-4aa1-082f-f08c55ecff2a_39f969ae-9c9f-791a-2e64-c09a43a13db1_col']
    // _data.reservados = parsedData['b0140c1e-bd3d-6e93-3964-81441be937ce_39f969ae-9c9f-791a-2e64-c09a43a13db1_col']
    if (parsedData['ee83be8d-e56c-6076-e7ec-f23deee0773b_39f969ae-9c9f-791a-2e64-c09a43a13db1_col']) {
      _data.imagen = parsedData['ee83be8d-e56c-6076-e7ec-f23deee0773b_39f969ae-9c9f-791a-2e64-c09a43a13db1_col'].files[0].url
    }
    props.sendItemsData(_data)
  }

  const putData = (data) => {
    
    const parsedData = JSON.parse(data.solucion)
    const _data = {}
    _data.estado = parsedData['01ce27bd-3263-2c1a-c6c0-4e7f50ee31b8_39f969ae-9c9f-791a-2e64-c09a43a13db1_col'] < 2
    _data.limiteEstudiante = parsedData['86f5bdd7-5fe7-6693-86ab-9ad796e3efbe_39f969ae-9c9f-791a-2e64-c09a43a13db1_col']
    _data.nombre = parsedData['aede7b0d-95dd-4aa1-082f-f08c55ecff2a_39f969ae-9c9f-791a-2e64-c09a43a13db1_col']
    // _data.reservados = parsedData['b0140c1e-bd3d-6e93-3964-81441be937ce_39f969ae-9c9f-791a-2e64-c09a43a13db1_col']
    const aux = parsedData['ee83be8d-e56c-6076-e7ec-f23deee0773b_39f969ae-9c9f-791a-2e64-c09a43a13db1_col']
    if (aux) {
      _data.imagen = aux.files[0] ? aux.files[0].url : null
    }
    props.sendItemsData(_data)
  }

  const editableArray = ['ccf28b76-1ba9-adee-b900-799586c0ec5a_39f969ae-9c9f-791a-2e64-c09a43a13db1_col']
  const editableArrayWithState = ['ccf28b76-1ba9-adee-b900-799586c0ec5a_39f969ae-9c9f-791a-2e64-c09a43a13db1_col', '01ce27bd-3263-2c1a-c6c0-4e7f50ee31b8_39f969ae-9c9f-791a-2e64-c09a43a13db1_col']
  if (props.loading) return <Loader />
  return (
    <Wrapper>
      {
                loading
                  ? <span className='single-loading' />
                  : <ContentForm>
                    <JSONFormParser
                      pageData={pageForm}
                      editable
                      postData={postData}
                      putData={putData}
                      deleteData={() => {}}
                      dataForm={formResponse}
                      data={[]}
                      statusColor={(_: boolean) => (true ? 'primary' : 'light')}
                      readOnly={false}
                      readOnlyFields={!props.currentItem.grupoId ? editableArrayWithState : editableArray}
                      loadingRequest={loadingRequest}
                      setEditable={setEditable}
                    />
                  </ContentForm>
            }
    </Wrapper>
  )
}

const Wrapper = styled.div``

const ContentForm = styled.div`
    width: 45%;
    position: relative;
`

const Back = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 0;
    cursor: pointer;
`

const BackTitle = styled.span`
    color: #000;
    font-size: 14px;
    font-size: 16px;
`

export default CreateGrup
