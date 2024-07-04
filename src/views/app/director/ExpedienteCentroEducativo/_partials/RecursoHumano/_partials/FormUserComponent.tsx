import React from 'react'
import styled from 'styled-components'
import Select from 'Components/Form/select/react-select'
import { Input, Button } from 'reactstrap'
import UserPicAndName from './UserPicAndName'
import WizardRegisterIdentityModal from 'Views/app/configuracion/Identidad/_partials/wizardRegisterIdentityModal'
import SimpleModal from 'Components/Modal/simple'
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
	tipoIdentificacionOptions?: { value: number; label: string }[]
	tipoIdentificacionValue?: { value: number; label: string }
	fullName?: string
	email?: string
	identificacion?: string
	isEditing?: boolean
	onConfirmRegisterModalCallback?: Function
	showRegisterModal?: boolean
	toggleRegisterModal?: Function
	encontrado?: boolean
	loading?: boolean
}

const FormUserComponent: React.FC<IProps> = (props) => {
  const { t } = useTranslation()
  const FormControls = () => {
    return (
      <>
        <Group>
          <label>{t('supervision_circ>expediente>recurso_hum>add>persona_encontrada', 'Persona encontrada')}:</label>
          <UserPicAndName fullname={props.fullName} />
        </Group>
        <Group>
          <label>{t('buscador_ce>ver_centro>datos_contacto>correo', 'Correo electrónico')}</label>
          <Input
            value={props.email}
            onChange={props.onChangeInputEmail}
          />
        </Group>
        <Group>
          <label>{t('estudiantes>expediente>hogar>miembros_hogar>agregar>rol', 'Rol')}</label>
          <Select
            placeholder=''
            onChange={props.onChangeSelectRol}
            value={props.rolId}
            options={props.rolOptions || []}
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
        txtBtn='general>aceptar'
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
          <label>{t('configuracion>centro_educativo>ver_centro_educativo>administracion_auxiliar>agregar>tipo_identificacion', 'Tipo de identificación')}</label>
          <Select
            isDisabled={props.isEditing}
            placeholder=''
            onChange={props.onChangeSelectTipoIdentificacion}
            options={props.tipoIdentificacionOptions || []}
            value={props.tipoIdentificacionValue}
          />
        </Group>
        <Group style={{ marginBottom: '10px' }}>
          <label>{t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>asignar_director>numero_identificacion', 'Número de identificación')}</label>
          <Input
            disabled={props.isEditing}
            value={props.identificacion}
            onChange={props.onChangeInputNumIdentificacion}
          />
        </Group>
        {props.encontrado == false
          ? (
            <InfoDiv>
              <p style={{ margin: 0 }}>
                {t('supervision_circ>expediente>recurso_hum>add>no_found', 'No se ha encontrado un funcionario con el número de identificación ingresado')}
              </p>
              <p style={{ margin: 0 }}>
                {t('supervision_circ>expediente>recurso_hum>add>reg', 'Puede registrarlo en el sistema haciendo click en registrar')}
              </p>
              <Group style={{ textAlign: 'center' }}>
                <Button
                  color='primary'
                  onClick={() => props.toggleRegisterModal(true)}
                >
                  {t('boton>general>registrar', 'Registrar')}
                </Button>
              </Group>
            </InfoDiv>
            )
          : (
				  props.fullName != '' && FormControls()
            )}
      </>
    </>
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
`

const Titulo = styled.p`
	font-size: 15px;
	font-weight: bold;
	padding-bottom: 0.5rem;
`

const Texto = styled.p`
	font-size: 12px;
	padding-bottom: 1rem;
`

const Regresar = styled.label`
	font-size: 16px;
	font-weight: bold;
	padding-bottom: 1rem;
	cursor: pointer;
	width: fit-content;
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
	min-width: 500px;
	min-height: 100px;
	border-color: gray;
	background: white;
	padding: 15px;
	box-shadow: 0 0 10px 5px lightgrey;
`
export default FormUserComponent
