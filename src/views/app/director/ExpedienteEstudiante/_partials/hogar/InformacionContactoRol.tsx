import React, { useEffect, useState } from 'react'
import { Row, Col, Card, CardBody, FormGroup, Label, Input, FormFeedback } from 'reactstrap'
import IntlMessages from '../../../../../../helpers/IntlMessages'
import ReactInputMask from 'react-input-mask'
import RequiredLabel from '../../../../../../components/common/RequeredLabel'
import Styled from 'styled-components'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import { getRolesByTipo } from 'Redux/roles/actions'
import colors from 'Assets/js/colors'
import Select from 'react-select'
import { useTranslation } from 'react-i18next'

const InformacionContacto = props => {
	const { t } = useTranslation()
	const state = useSelector((store: any) => {
		return {
			roles: store.roles.roles,
			tipoRoles: store.roles.tipoRoles
		}
	})
	const [loading, setLoading] = useState(false)
	const actions = useActions({
		getRolesByTipo
	})

	useEffect(() => {
		const fetch = async () => {
			setLoading(true)
			await actions.getRolesByTipo(2)
			setLoading(false)
		}
		fetch()
	}, [])

	useEffect(() => {
		console.log('props', props)
	}, [props])

	return (
		<Card className='mt-5'>
			<CardBody>
				<Row>
					<Col sm='12' md='12'>
						<h5>
							{t(
								'estudiantes>expediente>hogar>miembros_hogar>agregar>info_contac',
								'Información de contacto'
							)}
						</h5>
					</Col>
					<Col sm='12' md='12'>
						<FormGroup>
							{props.label ? (
								<Label>
									*
									{t(
										'estudiantes>expediente>hogar>miembros_hogar>agregar>tel_prin',
										'Teléfono principal'
									)}
								</Label>
							) : (
								<RequiredLabel>
									<IntlMessages id='form.phoneNumber' />
								</RequiredLabel>
							)}
							<ReactInputMask
								mask='9999-9999'
								value={props.personalData.telefono}
								disabled={!props.editable}
								type='text'
								name='telefono'
								onChange={e => {
									props.handleChange(e)
								}}
								invalid={props.fields.Telefono}
							>
								{inputProps => <Input {...inputProps} disabled={!props.editable} />}
							</ReactInputMask>
							<FormFeedback>
								{props.fields.Telefono && props.errors.Telefono.replace("'Telefono'", 'Telefóno')}
							</FormFeedback>
						</FormGroup>
					</Col>
					<Col sm='12' md='12'>
						<FormGroup>
							<Label>
								{t(
									'estudiantes>expediente>hogar>miembros_hogar>agregar>tel_alt',
									'Teléfono alternativo'
								)}
							</Label>
							<ReactInputMask
								type='text'
								mask='9999-9999'
								name='telefonoSecundario'
								value={props.personalData.telefonoSecundario}
								disabled={!props.editable}
								invalid={props.fields.TelefonoSecundario}
								onChange={e => {
									props.handleChange(e)
								}}
							>
								{inputProps => <Input {...inputProps} disabled={!props.editable} />}
							</ReactInputMask>
							<FormFeedback>
								{props.fields.TelefonoSecundario && props.errors.TelefonoSecundario}
							</FormFeedback>
						</FormGroup>
					</Col>
					<Col sm='12' md='12'>
						<FormGroup>
							{props.label ? (
								<Label>
									*
									{t(
										'estudiantes>expediente>hogar>miembros_hogar>agregar>correo',
										'Correo electrónico'
									)}
								</Label>
							) : (
								<RequiredLabel>
									<IntlMessages id='form.email' />
								</RequiredLabel>
							)}
							<Input
								type='email'
								name='email'
								value={props.personalData.email}
								disabled={!props.editable}
								onChange={e => {
									props.handleChange(e)
								}}
								invalid={props.fields.Email}
							/>
							<FormFeedback>
								{props.fields.Email && props.errors.Email.replace("'Email'", 'Correo electrónico')}
							</FormFeedback>
						</FormGroup>
						<FormGroup>
							<Label>{t('estudiantes>expediente>hogar>miembros_hogar>agregar>rol', 'Rol')}</Label>
							<Select
								options={state?.roles?.map(el => ({
									label: el?.nombre,
									value: el
								}))}
								defaultValue={{
									label: state.roles[
										state.roles.findIndex(el => el?.id === props?.personalData?.idRol)
									]?.nombre,
									value: state.roles[
										state.roles.findIndex(el => el?.id === props?.personalData?.idRol)
									]
								}}
								isDisabled={!props.editable}
								onChange={({ value }) =>
									props.handleChange({
										target: { name: 'rolId', value }
									})
								}
								placeholder='Seleccione un rol'
							/>
						</FormGroup>
					</Col>
				</Row>
			</CardBody>
		</Card>
	)
}

const Filter = Styled.div`
  .dropdown-toggle {
      min-width: 200px!important;
      display: flex!important;
      align-items: center!important;
      border: 1px solid ${colors.gray}!important;
      justify-content: space-between!important;
  }
`

export default InformacionContacto
