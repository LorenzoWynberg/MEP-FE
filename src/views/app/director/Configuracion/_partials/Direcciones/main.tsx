import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { createRegional, updateRegional } from 'Redux/configuracion/actions'
import { useActions } from 'Hooks/useActions'
import useNotification from '../../../../../../hooks/useNotification'

import HeaderTab from 'Components/Tab/Header'
import ContentTab from 'Components/Tab/Content'

import { Configuracion } from '../../../../../../types/configuracion'
import { useTranslation } from 'react-i18next'

const General = React.lazy(() => import('./General'))
const Contacto = React.lazy(() => import('./Contacto'))
const Director = React.lazy(() => import('./Director'))
const UbicacionSaber = React.lazy(() => import('./UbicacionSaber'))

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

const CrearDirecciones: React.FC<IProps> = props => {
	const { t } = useTranslation()

	const [snackbar, handleClick] = useNotification()
	const [snackBarContent, setSnackbarContent] = React.useState<SnackbarConfig>({
		variant: '',
		msg: ''
	})
	const [activeTab, setActiveTab] = React.useState(0)
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
		if (Object.keys(state.currentRegional).length === 0) {
			setDisabled(true)
		} else {
			setDisabled(false)
		}
	}, [state.currentRegional])

	const optionsTab = [
		t('dir_regionales>ver>nav>info_gen', 'Información general'),
		t('dir_regionales>ver>nav>contacto', 'Contacto'),
		t('dir_regionales>ver>nav>director', 'Director'),
		t('dir_regionales>ver>nav>ubi', 'Ubicación')
	]

	const showNotification = (variant: string, msg: string) => {
		setSnackbarContent({ variant, msg })
		handleClick()
	}

	const handleCreate = async data => {
		try {
			setLoading(true)
			if (Object.keys(state.currentRegional).length === 0) {
				const res = await actions.createRegional(data)
				// debugger
				if (res.error) {
					showNotification('error', res.message)
					setLoading(false)
					return
				}
				showNotification('success', 'Se creó correctamente')
			} else {
				const response = await actions.updateRegional(data)

				if (response.error) {
					showNotification('error', response.message)
				} else {
					showNotification('success', 'Se actualizó correctamente')
				}
			}
			setLoading(false)
			setDisabled(false)
		} catch (error) {
			showNotification('error', 'Oops, Algo ha salido mal')
			setLoading(false)
		}
	}

	const handleEdit = () => setEditable(!editable)

	return (
		<Wrapper>
			{snackbar(snackBarContent.variant, snackBarContent.msg)}
			<TitleHeader className='d-none d-sm-block' />
			<HeaderTab
				options={optionsTab}
				activeTab={activeTab}
				setActiveTab={e => {
					setActiveTab(e)
				}}
				disabled={disabled}
			/>
			<ContentTab activeTab={activeTab} numberId={activeTab}>
				{
					{
						0: (
							<General
								{...props}
								currentRegional={state?.currentRegional}
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
								handleBack={props.handleBack}
								currentRegional={state.currentRegional}
								hasEditAccess
							/>
						),
						2: (
							<Director
								{...props}
								handleBack={props.handleBack}
								currentRegional={state.currentRegional}
								hasEditAccess={hasEditAccess}
							/>
						),
						3: (
							<>	
								<UbicacionSaber
								{...props}
								handleBack={props.handleBack}
								currentRegional={state.currentRegional}
								hasEditAccess={hasEditAccess}/>
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
	margin-top: 45px;
	text-align: end;

	h4 {
		text-transform: lowercase;
	}

	h4::first-letter {
		text-transform: Capitalize;
	}
`

export default CrearDirecciones
