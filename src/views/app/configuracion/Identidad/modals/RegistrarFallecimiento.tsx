import RequiredLabel from 'Components/common/RequeredLabel'
import SimpleModal from 'Components/Modal/simple'
import React, { useEffect } from 'react'
import { CustomInput, Input, Modal, ModalBody, ModalHeader } from 'reactstrap'
import styled from 'styled-components'

import colors from '../../../../../assets/js/colors'
import { UsuarioRegistro } from '../../../../../types/usuario'
import moment from 'moment'
import useNotification from 'Hooks/useNotification'
import { useActions } from 'Hooks/useActions'
import { getMatriculaInfo } from 'Redux/matricula/actions.js'
import { useSelector } from 'react-redux'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import swal from 'sweetalert'
import { useTranslation } from 'react-i18next'

type IProps = {
	visible: boolean
	handleModal: any
	handleConfirm: any
	requesting: boolean
	user: UsuarioRegistro
}
type SnackbarConfig = {
	variant: string
	msg: string
}
const RegistrarFallecimiento: React.FC<IProps> = (props) => {
  const {t} = useTranslation()

  const [active, setActive] = React.useState<boolean>(props.user?.esFallecido)
  const [fallecio, setFallecio] = React.useState<string>(
    props.user?.fechaFallecido
  )
  const { matriculaInfo } = useSelector((state) => state.matricula)
  const today = moment(new Date(Date.now())).format('yyyy-MM-DD')
  const [deathDate, setDeathDate] = React.useState(today)
  const [snackbar, handleClick] = useNotification()
  const [snackBarContent, setSnackbarContent] =
		React.useState<SnackbarConfig>({ variant: '', msg: '' })
  const showNotification = (variant: string, msg: string) => {
    setSnackbarContent({ variant, msg })
    handleClick()
  }

  const actions: any = useActions({
    getMatriculaInfo
  })

  useEffect(() => {
    if (props.user) {
      actions.getMatriculaInfo(props.user?.id)
    }
  }, [props.user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.value == 'si') {
      setActive(true)
    } else {
      setActive(false)
    }
  }
  const isInvalidDate = (date) => {
    const fechaNacimiento = moment(props.user.fechaNacimiento, 'yyyy-MM-DD')
    const fechaDefuncion = moment(date, 'yyyy-MM-DD')
    const hoy = moment(new Date(Date.now()))
    return (
      fechaDefuncion.isBefore(fechaNacimiento) ||
			hoy.isBefore(fechaDefuncion)
    )
  }

  const onDateChange = (e) => {
    if (isInvalidDate(e.target.value)) {
      // setDeathDate( moment(props.user.fechaNacimiento,'yyyy-MM-DD').format('yyyy-MM-DD') )
      showNotification(
        'error',
        'La fecha de defunción no puede ser menor a la fecha de nacimiento y tampoco puede se mayor al día de hoy'
      )
      return
    }

    setDeathDate(e.target.value)
  }
  const handleDate = (e) => {
    setFallecio(e.target.value)
  }
  return (
    <SimpleModal
      openDialog={props.visible}
      onClose={props.handleModal}
      title={t('estudiantes>indentidad_per>aplicar_camb>reg_fallecido>titulo', 'Registrar fallecimiento')}
      actions={false}
    >
      {snackbar(snackBarContent.variant, snackBarContent.msg)}
      <StyledModalBody>
        <Legend>
          {t('estudiantes>indentidad_per>aplicar_camb>reg_fallecido>ofertas_matri_1', 'La persona con la identidad:')} {props.user.identificacion} {t('estudiantes>indentidad_per>aplicar_camb>reg_fallecido>ofertas_matri_2', 'se encuentra matriculada en las siguientes ofertas:')}
        </Legend>
        <div className='my-3'>
          <TableReactImplementation
            columns={[
						  {
						    Header: t('estudiantes>indentidad_per>aplicar_camb>reg_fallecido>col_oferta', 'Oferta'),
						    accessor: 'oferta',
						    label: '',
						    column: ''
						  },
						  {
						    Header: t('estudiantes>indentidad_per>aplicar_camb>reg_fallecido>col_modalidad', 'Modalidad'),
						    accessor: 'modalidad',
						    label: '',
						    column: ''
						  },
						  {
						    Header: t('estudiantes>indentidad_per>aplicar_camb>reg_fallecido>col_nivel', 'Nivel'),
						    accessor: 'nivel',
						    label: '',
						    column: ''
						  },
						  {
						    Header: t('estudiantes>indentidad_per>aplicar_camb>reg_fallecido>col_ce', 'Centro Educativo'),
						    accessor: 'centroEducativo',
						    label: '',
						    column: ''
						  }
            ]}
            data={matriculaInfo}
            avoidSearch
          />
        </div>
        <Legend>
          {t('estudiantes>indentidad_per>aplicar_camb>reg_fallecido>mensaje', 'En esta sección puedes registrar el fallecimiento de una persona, es muy importante que esté seguro de esta información. Pues el sistema deshabilitará a la persona, en muchas de sus funciones.')}
        </Legend>
        <FormRadio>
          <Label>{t('estudiantes>indentidad_per>aplicar_camb>reg_fallecido>label', '¿La persona se debe registrar como fallecido?')}</Label>
          <CustomInput
            type='radio'
            name='esFallecido'
            label={t('general>si', 'Si')}
            value='si'
            inline
            onChange={handleChange}
          />
          <CustomInput
            type='radio'
            name='esFallecido'
            label={t('general>no', 'No')}
            value='no'
            inline
            onChange={handleChange}
          />
        </FormRadio>
        {active
          ? (
            <RequiredLabel for='fechaFallecimiento'>
              {t('estudiantes>indentidad_per>aplicar_camb>reg_fallecido>fecha_falle', 'Fecha de fallecimiento')}
              <Input
                id='inputDate'
                type='date'
                name='fechaFallecimiento'
                value={deathDate}
                onChange={onDateChange}
                onKeyDown={(e) => {
							  if (
							    e.key === 'Delete' ||
									e.key === 'Backspace'
							  ) {
							    e.preventDefault()
							  }
                }}
              />
            </RequiredLabel>
            )
          : (
				  ''
            )}

        <Actions>
          <CancelButton onClick={props.handleModal}>
            {t('general>cancelar', 'Cancelar')}
          </CancelButton>
          <ConfirmButton
            onClick={() => {
						  swal({
						    title: '¿Está seguro de realizar el registro de fallecimiento?',

						    icon: 'warning',
						    buttons: {
						      cancel: 'Cancelar',
						      ok: {
						        text: 'Si',
						        value: true
						      }
						    }
						  }).then((result) => {
						    if (result) {
						      props.handleConfirm(active, deathDate)
						      props.handleModal()
						    }
						  })
            }}
          >
            {t('general>aplicar_cambio', 'Aplicar cambio')}
          </ConfirmButton>
        </Actions>
        {props.requesting
          ? (
            <Loading>
              <span className='single-loading' />
            </Loading>
            )
          : null}
      </StyledModalBody>
    </SimpleModal>
  )
}

const CustomModal = styled(Modal)`
	box-shadow: none;
`

const StyledModalBody = styled(ModalBody)`
	padding: 20px 30px !important;
`

const Loading = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #ffffffb8;
	position: absolute;
	z-index: 1;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
`

const Header = styled(ModalHeader)`
	padding: 15px 30px !important;
	border-bottom-width: 1px;
	border-bottom-color: #ddd;
	font-size: 30px;
`

const Icon = styled.span`
	font-size: 25px;
`

const FormRadio = styled.div`
	display: block;
	margin-top: 18px;
	margin-bottom: 15px;
`

const Label = styled.label`
	color: #000;
	display: block;
`

const Actions = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-around;
	width: 60%;
	justify-content: space-around;
	margin: 20px auto 0px;
`

const CancelButton = styled.button`
	border: 1px ${colors.secondary} solid;
	background: transparent;
	border-radius: 20px;
	color: ${colors.secondary};
	padding: 10px 20px;
	margin-right: 10px;
	cursor: pointer;
`

const ConfirmButton = styled.button`
	background: ${colors.primary};
	border-radius: 20px;
	color: #fff;
	border: 0;
	padding: 10px 20px;
	cursor: pointer;
`

const Legend = styled.p`
	margin: 0;
`

export default RegistrarFallecimiento
