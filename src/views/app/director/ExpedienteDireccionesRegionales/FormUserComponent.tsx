import React, { useEffect } from 'react'
import styled from 'styled-components'
import Select from 'react-select'
import { Input, Button } from 'reactstrap'
import WizardRegisterIdentityModal from 'Views/app/configuracion/Identidad/_partials/wizardRegisterIdentityModal'
import SimpleModal from 'Components/Modal/simple'
import { useTranslation } from 'react-i18next'
interface IProps {
	onRegresarEvent?: (e) => void
	onChangeSelectTipoIdentificacion?: (obj) => void
	onChangeInputNumIdentificacion?: (e) => void
	onChangeInputEmail?: (e) => void
	onChangeSelectRol?: (obj) => void
	onChangeRegional?: (obj) => void
	onSaveButtonClickEvent?: (e) => void
	rolOptions?: { value: number; label: string }[]
	rolId?: { value: number; label: string }
	regionalId?: { value: number; label: string }
	tipoIdentificacionOptions?: { value: number; label: string }[]
	tipoIdentificacionValue?: { value: number; label: string }
	fullName?: string
	email?:string
	identificacion?:string
	isEditing?:boolean
	onConfirmRegisterModalCallback?: Function,
	showRegisterModal?: boolean,
	toggleRegisterModal?: Function
	encontrado?: boolean
	loading?: boolean
	regionales: Array<{ label: string, value: any }>
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
          <label>{t('supervision_circ>expediente>recurso_hum>add>correo', 'Correo electrónico')}</label>
          <Input value={props.email} onChange={props.onChangeInputEmail} />
        </Group>
        <Group>
          <label>{t('supervision_circ>expediente>recurso_hum>add>rol', 'Rol')}</label>
          <Select
            placeholder=''
            noOptionsMessage={() => t('general>no_opt', 'Sin opciones')}
            onChange={props.onChangeSelectRol}
            value={props.rolId}
            options={props.rolOptions || []}
          />
        </Group>
        <Group>
          <label>{t('supervision_circ>expediente>recurso_hum>add>regional', 'Regional')}</label>
          <Select
            placeholder=''
            noOptionsMessage={() => t('general>no_opt', 'Sin opciones')}
            onChange={props.onChangeRegional}
            value={props.regionalId}
            isDisabled
            options={props.regionales || []}
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
        <WizardRegisterIdentityModal onConfirm={props.onConfirmRegisterModalCallback} />
      </SimpleModal>
      <>
        <Group>
          <label>{t('supervision_circ>expediente>recurso_hum>add>tipo_id', 'Tipo de identificación')}</label>
          <Select
            isDisabled={props.isEditing}
            placeholder=''
            noOptionsMessage={() => t('general>no_opt', 'Sin opciones')}
            onChange={props.onChangeSelectTipoIdentificacion}
            options={props.tipoIdentificacionOptions || []}
            value={props.tipoIdentificacionValue}
          />
        </Group>
        <Group style={{ marginBottom: '10px' }}>
          <label>{t('supervision_circ>expediente>recurso_hum>add>num_id', 'Número de identificación')}</label>
          <Input disabled={props.isEditing} value={props.identificacion} onChange={props.onChangeInputNumIdentificacion} />
        </Group>
        {props.encontrado == false
          ? <InfoDiv>
            <p style={{ margin: 0 }}>
              {t('supervision_circ>expediente>recurso_hum>add>no_found', 'No se ha encontrado un funcionario con el número de identificación ingresado.')}
            </p>
            <p style={{ margin: 0 }}>
              {t('supervision_circ>expediente>recurso_hum>add>reg', 'Puede registrarlo en el sistema haciendo click en registrar.')}
            </p>
            <Group style={{ textAlign: 'center' }}>
              <Button color='primary' onClick={() => props.toggleRegisterModal(true)}>{t('general>registrar', 'Registrar')}</Button>
            </Group>
            </InfoDiv>
          : props.fullName != '' ? FormControls() : ''}
      </>
    </>
  )
}

interface IPropsPic {
    picture?: string| Object
    fullname?: string
}

const UserPicAndName:React.FC<IPropsPic> = (props) => {
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
	background:#109eff4d;
	padding: 1rem;
	border-radius: 10px;
	margin-top: 1rem;
`

const Group = styled.div`
	margin-top: 1rem;
`

export default FormUserComponent
