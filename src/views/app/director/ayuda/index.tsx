import React, { useEffect, useState } from 'react'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import {
  createBitacoraAyuda,
  getBitacoraAyudaInstitution
} from 'Redux/Bitacora/actions'
import Ayuda from './help'
import HeaderTab from 'Components/Tab/Header'
import styled from 'styled-components'
import ManualTab from './manualTab'
import { useTranslation } from 'react-i18next'

const AyudaDirector = (props) => {
  const [activeTab, setActiveTab] = useState<number>(0)
  const { t } = useTranslation()
  const state = useSelector((store: any) => {
    return {
      bitacora: store.bitacora,
      institution: store.authUser.currentInstitution
    }
  })
  const actions = useActions({
    createBitacoraAyuda,
    getBitacoraAyudaInstitution
  })

  useEffect(() => {
    const fetch = async () => {
      const _dataGet = {
        pagina: 1,
        SB_InstitucionId: state.institution?.id
      }
      await actions.getBitacoraAyudaInstitution(state.institution?.id)
    }
    fetch()
  }, [])

  useEffect(() => {
    const fetch = async () => {
      const _dataPost = {
        tabActive: activeTab,
        json: '',
        sB_InstitucionId: state.institution?.id
      }
      await actions.createBitacoraAyuda(_dataPost)
    }
    fetch()
  }, [activeTab])

  const options = [
    t('ayuda>opcion1', 'Preguntas'),
    t('ayuda>opcion2', 'Videos de Ayuda'),
    t('ayuda>opcion3', 'Manuales y documentos')
  ]

  return (
    <AppLayout items={directorItems}>
      <div className='dashboard-wrapper'>
        <h1>{t('ayuda>titulo', 'Ayuda')}</h1>
        {/* <ModalHistorial /> */}
        <HeaderTab
          options={options}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <br />
        {
					{
					  0: (
        <Questions>
        <iframe src="https://saber.tawk.help/" title="Preguntas frecuentes (FAQ)" style={{width:'100%', minHeight:600, border:'none'}}></iframe>
        </Questions>
					  ),
					  1: <Ayuda />,
					  2: <ManualTab />
					}[activeTab]
				}
      </div>
    </AppLayout>
  )
}
const Questions = styled.div`
	ul.nav::before {
		left: 0;
		right: 0;
		margin-left: auto;
		margin-right: auto;
		width: 40%;

		@media (max-width: 1620px) {
			width: 45%;
		}

		@media (max-width: 1300px) {
			width: 55%;
		}
	}
`
export default AyudaDirector
