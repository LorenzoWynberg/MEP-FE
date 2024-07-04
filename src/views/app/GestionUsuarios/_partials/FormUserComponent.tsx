import React, { useEffect } from 'react'
import styled from 'styled-components'
import Select from 'react-select'
import AsyncSelect from 'react-select/async'
import CreatableSelect from 'react-select/creatable'
import { Input, Button } from 'reactstrap'
import UserPicAndName from './UserPicAndName'
import WizardRegisterIdentityModal from 'Views/app/configuracion/Identidad/_partials/wizardRegisterIdentityModal'
import SimpleModal from 'Components/Modal/simple'
import GoBack from 'Components/goBack'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import { useTranslation } from 'react-i18next'

interface IProps {
	onRegresarEvent?: (e) => void
	onChangeSelectTipoIdentificacion?: (obj) => void
	onChangeInputNumIdentificacion?: (e) => void
	onChangeInputEmail?: (e) => void
	onChangeSelectRol?: (obj) => void
	onSaveButtonClickEvent?: (e) => void
	rolOptions?: { value: number; label: string }[]
	rolId?: { value: number; label: string }
	circuitosOptions?: { value: number; label: string }[]
	tipoIdentificacionOptions?: { value: number; label: string }[]
	tipoIdentificacionValue?: { value: number; label: string }
	fetchInstituciones?: (inputValue) => Promise<{ label: string; value: number }>
	fetchRegionales?: (inputValue) => Promise<{ label: string; value: number }>
	fetchCircuitos?: (regionalId) => Promise<{ label: string; value: number }>
	fetchDepartamentos?: (inputValue) => Promise<{ label: string; value: number }>
	fetchCompanias?: (inputValue) => Promise<{ label: string; value: number }>
	createCompania?: (inputString) => void
	createDepartamento?: (inputString) => void
	onChangeMultiselectInstituciones?: (objectValue, actionMeta, institucionesValue) => void
	onChangeMultiselectCircuitos?: (objectValue, actionMeta, circuitosValue) => void
	onRegionalMultiselectChange?: (objectValue, actionMeta, circuitosValue) => void
	multiselectInstitucionesValue?: []
	multiselectCircuitosValue?: []
	departamentoId?: { value: number; label: string }
	companiaId?: { value: number; label: string }
	institucionId?: { value: number; label: string }
	regionalesId?: []
	regionalId?: number
	circuitosId?: []
	circuitoId?: []
	onChangeSelectRegional?: (obj) => void
	viewState?: {
		showInstitucion: boolean
		showInstitucionMulti: boolean
		showRegional: boolean
		showRegionalMulti: boolean
		showCircuito: boolean
		showDepartamento: boolean
		showCompania: boolean
	}
	fullName?: string
	email?: string
	identificacion?: string
	isEditing?: boolean
	onConfirmRegisterModalCallback?: Function
	showRegisterModal?: boolean
	toggleRegisterModal?: Function
	encontrado?: boolean
	loading?: boolean
	departamentoOptions?: []
	companiaOptions?: []
	onDepartamentoSelectChange?: Function
	onCompaniaSelectChange?: Function
}

const FormUserComponent: React.FC<IProps> = props => {
	const { t } = useTranslation()
	const {
		showCircuito,
		showCompania,
		showDepartamento,
		showInstitucion,
		showInstitucionMulti,
		showRegional,
		showRegionalMulti
	} = props.viewState
	const formBody = {
		rolId: props.rolId,
		multiselectInstitucionesValue: props.multiselectInstitucionesValue,
		multiselectCircuitosValue: props.multiselectCircuitosValue,
		regionalId: props.regionalId,
		circuitosId: props.circuitosId,
		circuitoId: props.circuitoId,
		fullName: props.fullName
	}

	const FormControls = () => {
		return (
			<>
				<Group>
					<label>
						{t('gestion_usuario>usuarios>persona_encontrada', 'Persona encontrada:')}
					</label>
					<UserPicAndName fullname={props.fullName} />
				</Group>
				<Group>
					<label>
						{t('gestion_usuario>usuarios>correo_electronico', 'Correo electrónico')}
					</label>
					<Input value={props.email} onChange={props.onChangeInputEmail} />
				</Group>
				<Group>
					<label>{t('gestion_usuario>usuarios>rol', 'Rol')}</label>
					<Select
						components={{ Input: CustomSelectInput }}
						placeholder=''
						className='react-select'
						classNamePrefix='react-select'
						noOptionsMessage={() =>
							t('gestion_usuario>usuarios>no_options_message', 'Sin opciones')
						}
						onChange={props.onChangeSelectRol}
						value={props.rolId}
						options={props.rolOptions || []}
					/>
				</Group>
				<Group style={showRegionalMulti ? {} : { display: 'none' }}>
					<label>{t('gestion_usuario>usuarios>regionales', 'Regionales')}</label>
					<AsyncSelect
						className='react-select'
						classNamePrefix='react-select'
						components={{ Input: CustomSelectInput }}
						placeholder=''
						noOptionsMessage={() => 'Sin opciones'}
						isMulti
						cacheOptions
						defaultOptions
						onChange={props.onRegionalMultiselectChange}
						loadOptions={props.fetchRegionales}
						value={props.regionalesId}
					/>
				</Group>
				<Group style={showRegional ? {} : { display: 'none' }}>
					<label>{t('gestion_usuario>usuarios>regional', 'Regional')}</label>
					<AsyncSelect
						placeholder=''
						className='react-select'
						classNamePrefix='react-select'
						components={{ Input: CustomSelectInput }}
						noOptionsMessage={() =>
							t('gestion_usuario>usuarios>no_options_message', 'Sin opciones')
						}
						cacheOptions
						defaultOptions
						value={props.regionalId}
						onChange={props.onChangeSelectRegional}
						loadOptions={props.fetchRegionales}
					/>
				</Group>
				<Group style={showCircuito ? {} : { display: 'none' }}>
					<label>{t('gestion_usuario>usuarios>circuitos', 'Circuitos')}</label>
					<Select
						placeholder=''
						className='react-select'
						classNamePrefix='react-select'
						noOptionsMessage={() =>
							t('gestion_usuario>usuarios>no_options_message', 'Sin opciones')
						}
						components={{ Input: CustomSelectInput }}
						isMulti
						value={props.circuitosId}
						options={props.circuitosOptions}
						onChange={props.onChangeMultiselectCircuitos}
					/>
				</Group>
				<Group style={showInstitucionMulti ? {} : { display: 'none' }}>
					<label>
						{t('gestion_usuario>usuarios>centro_educativo', 'Centro educativo')}
					</label>
					<AsyncSelect
						placeholder=''
						className='react-select'
						classNamePrefix='react-select'
						noOptionsMessage={() =>
							t('gestion_usuario>usuarios>no_options_message', 'Sin opciones')
						}
						components={{ Input: CustomSelectInput }}
						isMulti
						cacheOptions
						value={props.multiselectInstitucionesValue}
						onChange={(value, actionMeta) =>
							props.onChangeMultiselectInstituciones(
								value,
								actionMeta,
								props.multiselectInstitucionesValue
							)
						}
						loadOptions={props.fetchInstituciones}
					/>
				</Group>
				<Group style={showInstitucion ? {} : { display: 'none' }}>
					<label>{t('gestion_usuario>usuarios>institucion', 'Institución')}</label>
					<AsyncSelect
						placeholder=''
						className='react-select'
						classNamePrefix='react-select'
						noOptionsMessage={() =>
							t('gestion_usuario>usuarios>no_options_message', 'Sin opciones')
						}
						components={{ Input: CustomSelectInput }}
						cacheOptions
						defaultOptions
						loadOptions={props.fetchInstituciones}
						value={props.institucionId}
					/>
				</Group>
				<Group style={showDepartamento ? {} : { display: 'none' }}>
					<label>{t('gestion_usuario>usuarios>departamento', 'Departamento')}</label>
					<CreatableSelect
						placeholder=''
						className='react-select'
						classNamePrefix='react-select'
						noOptionsMessage={() =>
							t('gestion_usuario>usuarios>no_options_message', 'Sin opciones')
						}
						components={{ Input: CustomSelectInput }}
						onChange={props.onDepartamentoSelectChange}
						formatCreateLabel={inputValue => `Crear departamento ${inputValue}`}
						options={props.departamentoOptions}
						onCreateOption={props.createDepartamento}
						value={props.departamentoId}
					/>
				</Group>
				<Group style={showCompania ? {} : { display: 'none' }}>
					<label>{t('gestion_usuario>usuarios>compania', 'Compañía')}</label>
					<CreatableSelect
						placeholder=''
						className='react-select'
						classNamePrefix='react-select'
						components={{ Input: CustomSelectInput }}
						noOptionsMessage={() =>
							t('gestion_usuario>usuarios>no_options_message', 'Sin opciones')
						}
						onChange={props.onCompaniaSelectChange}
						formatCreateLabel={inputValue => `Crear compañia ${inputValue}`}
						options={props.companiaOptions}
						onCreateOption={props.createCompania}
						value={props.companiaId}
					/>
				</Group>
			</>
		)
	}
	return (
		<Contenedor className='mt-3 mb-5'>
			<SimpleModal
				openDialog={props.showRegisterModal}
				onClose={() => props.toggleRegisterModal(false)}
				onConfirm={() => {}}
				actions={false}
				title={t('gestion_usuario>usuarios>registrar_persona', 'Registrar persona')}
				stylesContent={{
					minWidth: '30rem'
				}}
			>
				<WizardRegisterIdentityModal onConfirm={props.onConfirmRegisterModalCallback} />
			</SimpleModal>
			<GoBack onClick={props.onRegresarEvent} />

			<AgregarUsuario>
				{props.isEditing
					? t('gestion_usuario>usuarios>btn_editar', 'Editar')
					: t('gestion>usuario>btn_agregar', 'Agregar')}{' '}
				Usuario
			</AgregarUsuario>
			<Card>
				{!props.isEditing && (
					<>
						<Titulo>
							{t('gestion_usuario>usuarios>buscar_persona', 'Buscar Persona')}
						</Titulo>
						<Texto>
							{t(
								'gestion_usuario>usuarios>mensaje_buscar_persona',
								'Busca la persona a la cual se le creará el usuario. Si no está registrada podrás registrarla.'
							)}
						</Texto>
					</>
				)}

				<Group>
					<label>
						{t(
							'gestion_usuario>usuarios>tipo_de_identificacion',
							'Tipo de identificación'
						)}
					</label>
					<Select
						isDisabled={props.isEditing}
						placeholder=''
						className='react-select'
						classNamePrefix='react-select'
						noOptionsMessage={() =>
							t('gestion_usuario>usuarios>no_options_message', 'Sin opciones')
						}
						components={{ Input: CustomSelectInput }}
						onChange={props.onChangeSelectTipoIdentificacion}
						options={props.tipoIdentificacionOptions || []}
						value={props.tipoIdentificacionValue}
					/>
				</Group>
				<Group style={{ marginBottom: '10px' }}>
					<label>
						{t(
							'gestion_usuario>usuarios>numero_de_identificacion',
							'Número de identificación'
						)}
					</label>
					<Input
						disabled={props.isEditing}
						value={props.identificacion}
						onChange={props.onChangeInputNumIdentificacion}
					/>
				</Group>
				{props.encontrado == false ? (
					<InfoDiv>
						<p style={{ margin: 0 }}>
							{t(
								'gestion_usuario>usuarios>id_not_found_message',
								'No se ha encontrado un funcionario con el número de identificación ingresado.'
							)}
						</p>
						<p style={{ margin: 0 }}>
							{t(
								'gestion_usuario>usuarios>register_person_message',
								'Puede registrarlo en el sistema haciendo click en registrar.'
							)}
						</p>
						<Group style={{ textAlign: 'center' }}>
							<Button color='primary' onClick={() => props.toggleRegisterModal(true)}>
								{t('gestion_usuario>usuarios>registrar', 'Registrar')}
							</Button>
						</Group>
					</InfoDiv>
				) : props.fullName != '' ? (
					FormControls()
				) : (
					''
				)}
				<ButtonContainer>
					<Button
						onClick={props.onRegresarEvent}
						style={{ marginRight: '1rem' }}
						outline
						color='primary'
					>
						{t('gestion_usuario>usuarios>btn_cancelar', 'Cancelar')}
					</Button>
					<Button
						style={
							props.fullName != '' && props.fullName != null
								? {}
								: { display: 'none' }
						}
						onClick={props.onSaveButtonClickEvent}
						color='primary'
					>
						{props.isEditing
							? t('gestion_usuario>usuarios>btn_guardar', 'Guardar ')
							: t('gestion_usuario>usuarios>btn_crear', 'Crear usuario')}
					</Button>
				</ButtonContainer>
			</Card>
		</Contenedor>
	)
}

const InfoDiv = styled.div`
	background: #109eff4d;
	padding: 1rem;
	border-radius: 10px;
	margin-top: 1rem;
`

const Group = styled.div`
	margin-top: 1rem;
`

const ButtonContainer = styled.div`
	display: flex;
	justify-content: center;
	margin-top: 2.5rem;
	margin-top: 2rem;
`

const Titulo = styled.span`
	font-size: 15px;
	font-weight: bold;
	padding-bottom: 0.5rem;
`

const Texto = styled.span`
	font-size: 12px;
	padding-bottom: 1rem;
`

const AgregarUsuario = styled.span`
	font-size: 14px;
	font-weight: bold;
	padding-bottom: 1rem;
`

const Contenedor = styled.div`
	display: flex;
	justify-content: center;
	flex-direction: column;
	width: 50%;
`
const Card = styled.div`
	display: flex;
	flex-direction: column;
	border-radius: 15px;
	max-width: 60%;
	min-width: 100%;
	min-height: 100px;
	border-color: gray;
	background: white;
	padding: 15px;
	box-shadow: 0 0 10px 5px lightgrey;
`
export default FormUserComponent
