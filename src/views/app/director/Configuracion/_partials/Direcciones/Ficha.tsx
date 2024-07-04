import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { Row, Col, ModalBody, ModalHeader, Modal, Input as ReactstrapInput } from 'reactstrap'
import { createRegional, updateRegional, getFormsByRegional } from 'Redux/configuracion/actions'
import { useActions } from 'Hooks/useActions'
import useNotification from '../../../../../../hooks/useNotification'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'

import { Configuracion } from '../../../../../../types/configuracion'
import { GetByName } from 'Redux/formularios/actions'

import Grid from '@material-ui/core/Grid'
import { Checkbox } from '@material-ui/core'
import { WebMapView } from '../../../ExpedienteEstudiante/_partials/contacto/MapView'
import colors from 'Assets/js/colors'

const General = React.lazy(() => import('./FichaGeneral'))

type IProps = {
	handleBack: Function
	handleUpdate: Function
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

const Ficha: React.FC<IProps> = (props) => {
  const [snackbar, handleClick] = useNotification()
  const [snackBarContent, setSnackbarContent] =
		React.useState<SnackbarConfig>({ variant: '', msg: '' })
  const [activeTab, setActiveTab] = React.useState<number>(0)
  const [disabled, setDisabled] = React.useState<boolean>(true)
  const [loading, setLoading] = React.useState<boolean>(false)
  const actions = useActions({ createRegional, updateRegional })
  const { editable, setEditable, hasEditAccess = true } = props

  const state = useSelector((store: IState) => {
    return {
      currentRegional: store.configuracion.currentRegional
    }
  })

  React.useEffect(() => {
    setDisabled(false)
  }, [state.currentRegional])

  const showNotification = (variant: string, msg: string) => {
    setSnackbarContent({ variant, msg })
    handleClick()
  }

  return (
    <Wrapper>
      <General
        {...props}
        currentRegional={state.currentRegional}
        loading={loading}
        editable={editable}
        setEditable={setEditable}
        handleEdit={false}
        handleBack={props.handleBack}
        hasEditAccess={false}
      />
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
	margin-top: 45px;
	text-align: end;

	h4 {
		text-transform: lowercase;
	}

	h4::first-letter {
		text-transform: Capitalize;
	}
`
const Title = styled.h3`
	color: #000;
	margin: 5px 3px 25px;
`
const Card = styled.div`
	background: #fff;
	position: relative;
`

const CardTitle = styled.h5`
	color: #000;
	margin-bottom: 10px;
`
const Form = styled.form`
	margin-bottom: 20px;
`

const FormGroup = styled.div`
	margin-bottom: 10px;
`

const Label = styled.label`
	color: #000;
	display: block;
`

const MapContainer = styled(Grid)`
	@media (max-width: 870px) {
		height: 29rem;
	}
`

const Input = styled(ReactstrapInput)`
	padding: 10px;
	width: 100%;
	border: 1px solid #d7d7d7;
	background-color: #e9ecef;
	outline: 0;
	&:focus {
		background: #fff;
	}
`
const CardLink = styled.a`
	color: ${colors.primary};
`
export default Ficha
