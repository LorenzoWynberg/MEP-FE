import React from 'react'
import { Container } from 'reactstrap'
import swal from 'sweetalert'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import HeaderTab from 'Components/Tab/Header'
import ContentTab from 'Components/Tab/Content'

import { requestAlert, requestAlertDirector } from '../../../../../redux/alertaTemprana/actions'

import SolicitudForm from './SolicitudForm'

import AlertasEnviadas from './Enviadas'
import AlertasRevision from './EnRevision'
import AlertasAprobadas from './Aprobadas'
import Rechazadas from './Rechazadas'

type AlertaProps = {

}

type IStore = {
    alertaTemprana: any,
    authUser: any
}

const Solicitudes: React.FC<AlertaProps> = (props) => {
  const [loading, setLoading] = React.useState<boolean>(false)
  const [visibleForm, setVisibleForm] = React.useState<boolean>(false)
  const [activeTab, setActiveTab] = React.useState<number>(0)
  const optionsTab: Array<string> = ['Enviadas', 'En revisión', 'Aprobadas', 'Rechazadas']

  const actions = useActions({ requestAlert, requestAlertDirector })

  const state = useSelector((store: IStore) => {
    return {
      sents: store.alertaTemprana.alertsSend,
      currentInstitution: store.authUser.currentInstitution
    }
  })

  const handleRequest = async (values: any) => {
    try {
      setLoading(true)
      const res = await actions.requestAlertDirector({ ...values, sb_institucionesId: state.currentInstitution.id })
      setLoading(false)

      if (!res.error) {
        swal({
          title: 'Correcto',
          text: 'Se ha enviado la solicitud correctamente.',
          icon: 'success',
          className: 'text-alert-modal',
          buttons: {
            ok: {
              text: '¡Entendido!',
              value: true,
              className: 'btn-alert-color'
            }
          }
        }).then((result) => {
          if (result) {
            setVisibleForm(!visibleForm)
          }
        })
      } else {
        swal({
          title: 'Oops',
          text: res.message,
          icon: 'warning',
          className: 'text-alert-modal',
          buttons: {
            ok: {
              text: 'Aceptar',
              value: true,
              className: 'btn-alert-color'
            }
          }
        })
      }
    } catch (error) {
      setLoading(false)
    }
  }

  const handleForm = () => setVisibleForm(!visibleForm)

  const handleCancel = () => setVisibleForm(!visibleForm)

  return (
    <Container>
      {
                visibleForm
                  ? <SolicitudForm loading={loading} handleRequest={handleRequest} handleCancel={handleCancel} />
                  : <>
                    <HeaderTab
                      options={optionsTab}
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                    />
                    <ContentTab activeTab={activeTab} numberId={activeTab}>
                      {activeTab === 0 && <AlertasEnviadas {...props} visibleForm={visibleForm} handleForm={handleForm} />}
                      {activeTab === 1 && <AlertasRevision {...props} />}
                      {activeTab === 2 && <AlertasAprobadas {...props} />}
                      {activeTab === 3 && <Rechazadas {...props} />}
                    </ContentTab>
                  </>
            }
    </Container>
  )
}

export default Solicitudes
