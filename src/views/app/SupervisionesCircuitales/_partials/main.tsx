import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import {
  getRegionales,
  createCircuito,
  updateCircuito
} from 'Redux/configuracion/actions'
import { useActions } from 'Hooks/useActions'
import useNotification from '../../../../hooks/useNotification'

import HeaderTab from 'Components/Tab/Header'
import ContentTab from 'Components/Tab/Content'

import { Configuracion } from '../../../../types/configuracion'
import { useTranslation } from 'react-i18next'

const General = React.lazy(
  () => import('../../director/Configuracion/_partials/Supervisiones/General')
)
const Contacto = React.lazy(
  () =>
    import('../../director/Configuracion/_partials/Supervisiones/Contacto')
)
const Director = React.lazy(
  () =>
    import('../../director/Configuracion/_partials/Supervisiones/Director')
)
const UbicacionSaber = React.lazy(
  () =>
    import('../../director/Configuracion/_partials/Supervisiones/UbicacionSaber')
)

type IProps = {
	handleBack: Function
	editable: boolean
	setEditable: Function
	hasEditAccess: boolean
}

type SnackbarConfig = {
	variant: string
	msg: string
}

type IState = {
	configuracion: Configuracion
}

const CrearDirecciones: React.FC<IProps> = (props) => {
  const { t } = useTranslation()
  const [snackbar, handleClick] = useNotification()
  const [snackBarContent, setSnackbarContent] =
		React.useState<SnackbarConfig>({ variant: '', msg: '' })
  const [activeTab, setActiveTab] = React.useState<number>(0)
  const { editable, setEditable } = props
  const [disabled, setDisabled] = React.useState<boolean>(true)
  const [loading, setLoading] = React.useState<boolean>(false)
  const actions = useActions({
    getRegionales,
    createCircuito,
    updateCircuito
  })

  const { hasEditAccess = true } = props

  const state = useSelector((store: IState) => {
    return {
      currentCircuito: store.configuracion.currentCircuito,
      regionales: store.configuracion.allRegionales
    }
  })

  React.useEffect(() => {
    const fetch = async () => {
      await actions.getRegionales()
    }
    fetch()
  }, [])

  React.useEffect(() => {
    if (Object.keys(state.currentCircuito).length === 0) {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  }, [state.currentCircuito])

  const optionsTab = [
    t('supervision_circ>config>nav>info_gen', 'Información general'),
    t('supervision_circ>config>nav>contacto', 'Contacto'),
    t('supervision_circ>config>nav>supervisor', 'Supervisor'),
    t('supervision_circ>config>nav>ubi', 'Ubicación')
  ]

  const showNotification = (variant: string, msg: string) => {
    setSnackbarContent({ variant, msg })
    handleClick()
  }

  const handleCreate = async (data) => {
    try {
      setLoading(true)
      if (Object.keys(state.currentCircuito).length === 0) {
        await actions.createCircuito(data)
        showNotification('success', 'Se actualizó correctamente')
      } else {
        const error = await actions.updateCircuito(data)
        if (error.error) {
          for (const fieldName in error.errors) {
            if (error.errors.hasOwnProperty(fieldName)) {
              showNotification('error', error.errors[fieldName])
              setEditable(true)
            }
          }
        } else {
          showNotification('success', 'Se actualizó correctamente')
        }
      }
      setLoading(false)
      setDisabled(false)
    } catch (error) {
      showNotification('error', 'Oops, Algo ha salido mal')
    }
  }
  const handleEdit = () => setEditable(!editable)

  return (
    <Wrapper>
      {snackbar(snackBarContent.variant, snackBarContent.msg)}
      <TitleHeader className='d-none d-sm-block'>
        <h4 style={{ textTransform: 'uppercase' }}>
          {state.currentCircuito.regional}
        </h4>
        <h4 className='circuito' style={{ textTransform: 'uppercase' }}>
          {state.currentCircuito.nombre}
        </h4>
      </TitleHeader>
      <HeaderTab
        options={optionsTab}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        disabled={disabled}
      />
      <ContentTab activeTab={activeTab} numberId={activeTab}>
        {
					{
					  0: (
  <General
    {...props}
    regionales={state.regionales}
    currentCircuito={state.currentCircuito}
    handleCreate={handleCreate}
    loading={loading}
    editable={editable}
    setEditable={setEditable}
    handleEdit={handleEdit}
    handleBack={props.handleBack}
    hasEditAccess={hasEditAccess}
  />
					  ),
					  1: (
  <Contacto
    {...props}
    currentCircuito={state.currentCircuito}
    hasEditAccess={hasEditAccess}
  />
					  ),
					  2: (
  <Director
    {...props}
    currentCircuito={state.currentCircuito}
    hasEditAccess={hasEditAccess}
  />
            ),
            3: (
              <>
                  <UbicacionSaber
                    {...props}
                    currentCircuito={state.currentCircuito}
                    hasEditAccess={hasEditAccess}
                  />
              </>
            )
          }[activeTab]
				}
      </ContentTab>
    </Wrapper>
  )
}

const Wrapper = styled.div`
	margin-top: 10px;
`

const TitleHeader = styled.div`
	position: absolute;
	top: 0;
	right: 0;
	margin-top: 30px;
	text-align: end;

	h4 {
		text-transform: lowercase;
	}

	h4::first-letter {
		text-transform: Capitalize;
	}

	.circuito {
		color: green;
	}
`

export default CrearDirecciones
