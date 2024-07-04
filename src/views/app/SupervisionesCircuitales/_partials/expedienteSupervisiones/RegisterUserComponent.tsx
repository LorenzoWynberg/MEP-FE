import React from 'react'
import styled from 'styled-components'
import Select from 'react-select'
import { Input, Button } from 'reactstrap'
import WizardRegisterIdentityModal from 'Views/app/configuracion/Identidad/_partials/wizardRegisterIdentityModal'
import SimpleModal from 'Components/Modal/simple'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import { useTranslation } from 'react-i18next'

interface IProps {
	onRegresarEvent?: (e) => void
	onChangeSelectTipoIdentificacion?: (obj) => void
	onChangeInputNumIdentificacion?: (e) => void
	onChangeInputEmail?: (e) => void
	onChangeSelectRol?: (obj) => void
	onChangeCircuito?: (obj) => void
	onSaveButtonClickEvent?: (e) => void
	rolOptions?: { value: number; label: string }[]
	rolId?: { value: number; label: string }
	tipoIdentificacionOptions?: { value: number; label: string }[]
	tipoIdentificacionValue?: { value: number; label: string }
	circuitoId?: { value: number; label: string }
	fullName?: string
	email?: string
	identificacion?: string
	isEditing?: boolean
	onConfirmRegisterModalCallback?: Function
	showRegisterModal?: boolean
	toggleRegisterModal?: Function
	encontrado?: boolean
	loading?: boolean
	circuitos: Array<{ label: string, value: any }>
	onChangeMultiselectCircuitos?: (
		objectValue,
		actionMeta,
		circuitosValue
	) => void
	multiselectCircuitosValue?: []
	multiselectCircuitoOptions?: []
	edit?:boolean
}

const RegisterUserComponent: React.FC<IProps> = (props) => {
  const { t } = useTranslation()
  const FormControls = () => {
    return (
      <>
        <Group>
          <label>{t('supervision_circ>expediente>recurso_hum>add>persona_encontrada', 'Persona encontrada')}:</label>
          <UserPicAndName fullname={props.fullName} />
        </Group>
        <Group>
          <label>{t('supervision_circ>expediente>recurso_hum>add>correo', 'Correo electrónico')}</label>
          <Input
            value={props.email}
            disabled={props.isEditing}
            onChange={props.onChangeInputEmail}
          />
        </Group>
        <Group>
          <label>{t('supervision_circ>expediente>recurso_hum>add>rol', 'Rol')}</label>
          <Select
            className='react-select'
            classNamePrefix='react-select'
            components={{ Input: CustomSelectInput }}
            placeholder=''
            noOptionsMessage={() => 'Sin opciones'}
            isDisabled={props.isEditing}
            onChange={props.onChangeSelectRol}
            value={props.rolId}
            options={props.rolOptions || []}
          />
        </Group>
        <Group>
          <label>{t('supervision_circ>expediente>recurso_hum>add>circuito', 'Circuito')}</label>
          {/* <Select
						placeholder=""
						isDisabled={props.isEditing}
						className="react-select"
						classNamePrefix="react-select"
						noOptionsMessage={() => 'Sin opciones'}
						components={{ Input: CustomSelectInput }}
						value={props.circuitosId}
						options={props.circuitosOptions}
						isMulti
						onChange={props.onChangeMultiselectCircuitos}
					/> */}
          <Select
            placeholder=''
            className='react-select'
            classNamePrefix='react-select'
            noOptionsMessage={() => t('supervision_circ>expediente>recurso_hum>add>no_options', 'Sin opciones')}
            components={{ Input: CustomSelectInput }}
            value={props.multiselectCircuitosValue}
            options={props.multiselectCircuitoOptions}
            isMulti
            isDisabled={props.isEditing || props.edit}
            onChange={(value, actionMeta) =>
						  props.onChangeMultiselectCircuitos
						    ? props.onChangeMultiselectCircuitos(
						      value,
						      actionMeta,
						      props.multiselectCircuitosValue
								  )
						    : ''}
          />
        </Group>
      </>
    )
  }
  return (
    <>
      <SimpleModal
        openDialog={props.showRegisterModal}
        onClose={() => props.toggleRegisterModal(false)}
        onConfirm={() => {}}
        actions={false}
        title='Registrar persona'
        stylesContent={{
				  minWidth: '30rem'
        }}
      >
        <WizardRegisterIdentityModal
          onConfirm={props.onConfirmRegisterModalCallback}
        />
      </SimpleModal>
      <>

        <Group>
          <Titulo>{t('supervision_circ>expediente>recurso_hum>add>titulo', 'Buscar persona')}</Titulo>
          <label>
            {t('supervision_circ>expediente>recurso_hum>add>dec', 'Busca la persona a la cual se le creará el usuario. Si no esta registrada podrás registrarla')}
          </label>
        </Group>

        <Group>
          <label>{t('supervision_circ>expediente>recurso_hum>add>tipo_id', 'Tipo de identificación')}</label>
          <Select
            className='react-select'
            classNamePrefix='react-select'
            components={{ Input: CustomSelectInput }}
            isDisabled={props.isEditing || props.edit}
            placeholder=''
            noOptionsMessage={() => 'Sin opciones'}
            onChange={props.onChangeSelectTipoIdentificacion}
            options={props.tipoIdentificacionOptions || []}
            value={props.tipoIdentificacionValue}
          />
        </Group>
        <Group style={{ marginBottom: '10px' }}>
          <label>{t('supervision_circ>expediente>recurso_hum>add>num_id', 'Número de identificación')}</label>
          <Input
            disabled={props.isEditing || props.edit}
            value={props.identificacion}
            onChange={props.onChangeInputNumIdentificacion}
          />
        </Group>
        {props.encontrado == false
          ? (
            <InfoDiv>
              <p style={{ margin: 0 }}>
                {t('supervision_circ>expediente>recurso_hum>add>no_found', 'No se ha encontrado un funcionario con el número de identificación ingresado.')}
              </p>
              <p style={{ margin: 0 }}>
                {t('supervision_circ>expediente>recurso_hum>add>reg', 'Puede registrarlo en el sistema haciendo click en registrar.')}
              </p>
              <Group style={{ textAlign: 'center' }}>
                <Button
                  color='primary'
                  onClick={() => props.toggleRegisterModal(true)}
                >
                  {t('general>registrar', 'Registrar')}
                </Button>
              </Group>
            </InfoDiv>
            )
          : props.fullName != ''
            ? (
				  FormControls()
              )
            : (
				  ''
              )}

      </>
    </>
  )
}

interface IPropsPic {
	picture?: string | Object
	fullname?: string
}

const UserPicAndName: React.FC<IPropsPic> = (props) => {
  return (
    <MainContainer>
      <Leftside />
      <Rightside>{props.fullname}</Rightside>
    </MainContainer>
  )
}

const MainContainer = styled.div`
	display: flex;
	border-radius: 10px;
	overflow: hidden;
	border: 1px solid #145388;
	margintop: 1rem;
`
const Leftside = styled.div`
	background-color: #145388;
	padding: 1.5rem;
	width: 30%;
`
const Rightside = styled.div`
	margin-left: 1rem;
	justify-content: flex-start;
	align-items: center;
	display: flex;
	width: 100%;
`
const InfoDiv = styled.div`
	background: #109eff4d;
	padding: 1rem;
	borderRadius: 10px;
	marginTop: 1rem;
`

const Group = styled.div`
	marginTop: 1rem;
`

const Titulo = styled.p`
	fontSize: 15px;
	fontWeight: bold;
	margin: 0;
`

export default RegisterUserComponent
