import React from 'react'
import styled from 'styled-components'
import { useForm } from 'react-hook-form'

import ModalUsuarios, { TIPO_USUARIO } from '../Centro/ModalUsuariosRegional'
import colors from '../../../../../../assets/js/colors'
import { useSelector } from 'react-redux'
import useNotification from 'Hooks/useNotification'
import { useActions } from 'Hooks/useActions'
import {
  buscarDirectores,
  saveCircuitoDirector,
  getCircuitoDirector
} from 'Redux/configuracion/actions'
import {
  Configuracion,
  CurrentCircuito
} from '../../../../../../types/configuracion'

import { getEstadoFallecido } from '../../../../../../redux/identidad/actions'
import NavigationContainer from '../../../../../../components/NavigationContainer'
import { useTranslation } from 'react-i18next'

type CurrentUser = {
	id?: string
	usuarioId: string
	identificacion: string
	nombre: string
	apellido: string
	segundoApellido: string
	emailUsuario: string
	esFallecido: boolean
}

type IProps = {
	currentUser: CurrentUser
	currentCircuito: CurrentCircuito
	handleBack: Function
	hasEditAccess: boolean
}

type IState = {
	configuracion: Configuracion
}

type SnackbarConfig = {
	variant: string
	msg: string
}

const Director = (props: IProps) => {
  const { t } = useTranslation()

  const [search, setSearch] = React.useState<string>('')
  const [loading, setLoading] = React.useState<boolean>(false)
  const [modal, setModal] = React.useState<boolean>(false)
  const [editable, setEditable] = React.useState<boolean>(true)
  const [currentUser, setCurrentUser] = React.useState<Partial<CurrentUser>>(
    {}
  )
  const [snackbar, handleClick] = useNotification()
  const [snackBarContent, setSnackbarContent] =
		React.useState<SnackbarConfig>({
		  variant: '',
		  msg: ''
		})
  const actions = useActions({
    buscarDirectores,
    saveCircuitoDirector,
    getCircuitoDirector,
    getEstadoFallecido
  })
  const { handleSubmit, register, errors, setValue, reset } = useForm()
  const { hasEditAccess = true } = props
  const state = useSelector((store: IState) => {
    return {
      currentDirector: store.configuracion.currentDirector
    }
  })

  React.useEffect(() => {
    const fetch = async () => {
      const { data } = await actions.getCircuitoDirector(
        props.currentCircuito.id
      )
      setSearch(data?.identificacion)
      setValue('nombre', data.nombre)
      setValue('primerApellido', data.primerApellido)
      setValue('segundoApellido', data.segundoApellido)
      setValue('email', data.email)
    }
    fetch()
  }, [])

  React.useEffect(() => {
    if (currentUser) {
      setValue('nombre', currentUser.nombre)
      setValue('primerApellido', currentUser.apellido)
      setValue('segundoApellido', currentUser.segundoApellido)
      setValue('email', currentUser.emailUsuario)
    }
  }, [currentUser])

  const showNotification = (variant: string, msg: string) => {
    setSnackbarContent({ variant, msg })
    handleClick()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleInputSearch = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault()

    const result = await actions.buscarDirectores({
      pagina: 1,
      cantidad: 10,
      keyword: search || '1'
    })

    const fallecido = await getFallecido(
      result.data.entityList[0].identificacion
    )

    if (fallecido === true) {
      showNotification(
        'error',
        'La persona que usted eligió se encuentra fallecida, favor verificar.'
      )
    }
    if (!result.error) {
      if (result.data.entityList.length === 0) {
        showNotification(
          'error',
          'El director que busca no cuenta con usuario en sistema'
        )
        setModal(!modal)
      }

      if (result.data.entityList.length === 1) {
        const user = result.data.entityList.find(
          (item: any) => item.identificacion == search
        )
        setSearch(user.identificacion)
        setCurrentUser(user || {})

        if (search === user.identificacion) {
          setModal(false)
        }
      } else if (result.data.entityList.length > 0) {
        setModal(!modal)
      }
    }
  }

  const onSearch = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e?.preventDefault()
    const result = await actions.buscarDirectores({
      pagina: 1,
      cantidad: 10,
      keyword: search || '1'
    })

    const fallecido = await getFallecido(
      result.data.entityList[0].identificacion
    )

    if (fallecido === true) {
      showNotification(
        'error',
        'La persona que usted eligió se encuentra fallecida, favor verificar.'
      )
    }
    if (!result.error) {
      if (result.data.entityList.length === 0) {
        showNotification(
          'error',
          'El director que busca no cuenta con usuario en sistema'
        )
        setModal(!modal)
      }
      return result.data.entityList
    }
  }

  const onSubmit = async (values) => {
    try {
      if (currentUser && currentUser.esFallecido) {
        showNotification(
          'error',
          'La persona que usted eligió se encuentra fallecida, favor verificar.'
        )
        return
      }

      const data = {
        UserId: currentUser.usuarioId || state.currentDirector.id,
        CircuitoId: props.currentCircuito.id
      }

      if (data.UserId == undefined) {
        showNotification('error', 'Por favor complete los campos')
        return
      }

      setLoading(true)
      await actions.saveCircuitoDirector(data)
      setLoading(false)
      showNotification(
        'success',
        'Se ha asignado el director correctamente'
      )
      setEditable(!editable)
    } catch (error) {
      setLoading(false)
      showNotification('error', 'Oops, Algo ha salido mal')
    }
  }

  const handleSelection = async (item) => {
    const res = await getFallecido(item.identificacion)
    if (res === true) {
      showNotification(
        'error',
        'La persona que usted eligió se encuentra fallecida, favor verificar.'
      )
    } else {
      setCurrentUser(item)
      setSearch(item.identificacion)
      setModal(!modal)
    }
  }

  const handleCancel = async () => {
    const { data } = await actions.getCircuitoDirector(
      props.currentCircuito.id
    )
    if (Object.keys(data).length === 0) {
      setSearch('')
      reset()
    } else {
      setSearch(data.identificacion)
      setValue('nombre', data.nombre)
      setValue('primerApellido', data.primerApellido)
      setValue('segundoApellido', data.segundoApellido)
      setValue('email', data.email)
    }
    setEditable(true)
  }

  const getFallecido = async (filterText) => {
    const res = await actions.getEstadoFallecido(filterText, true)
    return res.data
  }

  return (
    <Wrapper>
      <NavigationContainer
        goBack={props.handleBack}
      />
      {snackbar(snackBarContent.variant, snackBarContent.msg)}
      <Card className='bg-white__radius'>
        <CardTitle>{t('configuracion>superviciones_circuitales>agregar>supervisor>titulo', 'Datos del supervisor')}</CardTitle>
        <Form>
          <FormRow>
            <FormInline>
              <Label>{t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>asignar_director>numero_identificacion', 'Identificación')}</Label>
              <Input
                type='text'
                value={search}
                onChange={handleChange}
                disabled={editable}
              />
            </FormInline>
            <Search>
              <Button
                onClick={handleInputSearch}
                opacity={editable}
                disabled={!!editable}
              >
                {t('general>buscar', 'Buscar')}
              </Button>
            </Search>
          </FormRow>
          <FormGroup>
            <Label>{t('configuracion>anio_educativo>columna_acciones>ver>calendarios_asociados>agregar_calendarios>periodos>columna_nombre', 'Nombre')}</Label>
            <Input
              name='nombre'
              type='text'
              ref={register({ required: true })}
              disabled
            />
            {errors.nombre && (
              <ErrorFeedback>{t('configuracion>superviciones_circuitales>agregar>estado>campo_requerido', 'Campo requerido')}</ErrorFeedback>
            )}
          </FormGroup>
          <FormGroup>
            <Label>{t('configuración>direcciones_regionales>agregar>director>primer_apellido', 'Primer apellido')}</Label>
            <Input
              name='primerApellido'
              type='text'
              ref={register({ required: true })}
              disabled
            />
            {errors.primerApellido && (
              <ErrorFeedback>{t('configuracion>superviciones_circuitales>agregar>estado>campo_requerido', 'Campo requerido')}</ErrorFeedback>
            )}
          </FormGroup>
          <FormGroup>
            <Label>{t('configuración>direcciones_regionales>agregar>director>segundo_apellido', 'Segundo apellido')} *</Label>
            <Input
              name='segundoApellido'
              type='text'
              ref={register({ required: true })}
              disabled={false}
            />
            {errors.segundoApellido && (
              <ErrorFeedback>{t('configuracion>superviciones_circuitales>agregar>estado>campo_requerido', 'Campo requerido')}</ErrorFeedback>
            )}
          </FormGroup>
          <FormGroup>
            <Label>{t('configuración>direcciones_regionales>agregar>director>correo_electronico', 'Correo electrónico')}</Label>
            <Input
              name='email'
              type='text'
              ref={register({ required: true })}
              disabled
            />
            {errors.email && (
              <ErrorFeedback>{t('configuracion>superviciones_circuitales>agregar>estado>campo_requerido', 'Campo requerido')}</ErrorFeedback>
            )}
          </FormGroup>
        </Form>
        {loading
          ? (
            <Loading>
              <span className='single-loading' />
            </Loading>
            )
          : null}
      </Card>
      <Actions>
        {editable
          ? (
            <>
              {hasEditAccess
                ? (
                  <ActionButton
                    onClick={() => setEditable(!editable)}
                  >
                    {t('general>editar', 'Editar')}
                  </ActionButton>
                  )
                : null}
            </>
            )
          : (
            <>
              <BackButton onClick={handleCancel}>{t('general>cancelar', 'Cancelar')}</BackButton>
              <ActionButton onClick={handleSubmit(onSubmit)}>
                {editable ? t('general>editar', 'Editar') : t('general>guardar', 'Guardar')}
              </ActionButton>
            </>
            )}
      </Actions>
      {modal && (
        <ModalUsuarios
          title={t('sup_circuital>selec_super', 'Seleccionar Supervisor')}
          tipoUsuario={TIPO_USUARIO.SUPERVISOR_CIRCUITAL}
          visible={modal}
          handleInputSearch={onSearch}
          search={search}
          setSearch={setSearch}
          handleSelection={handleSelection}
          handleCancel={() => setModal(!modal)}
        />
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
	background: transparent;
	padding-top: 0px;
`

const Card = styled.div`
	background: #fff;
	margin-top: 30px;
	width: 50%;
	position: relative;
	@media (max-width: 768px) {
		width: 100%;
	}
`

const Loading = styled.div`
	width: 100%;
	min-height: 381px;
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

const CardTitle = styled.h5`
	color: #000;
	margin-bottom: 10px;
`

const Form = styled.form`
	color: #000;
`

const FormRow = styled.div`
	display: grid;
	grid-template-columns: 50% 30%;
	align-items: flex-end;
	grid-column-gap: 10px;
	margin-bottom: 13px;
`

const FormGroup = styled.div`
	flex-direction: column;
	margin-bottom: 13px;
	position: relative;
`

const FormInline = styled.div`
	flex-direction: column;
`

const Label = styled.label`
	color: #000;
	display: block;
`

const Input = styled.input`
	padding: 10px;
	width: 100%;
	border: 1px solid #d7d7d7;
	background-color: #e9ecef;
	outline: 0;
	&:focus {
		background: #fff;
	}
`

const ErrorFeedback = styled.span`
	color: #bd0505;
	right: 0;
	font-weight: bold;
	font-size: 9px;
	position: absolute;
	bottom: -15px;
`

const Search = styled.div``

const Button = styled.button`
	background: ${colors.primary};
	color: #fff;
	border: 0;
	min-height: 43px;
	padding: 0 20px;
	border-radius: 25px;
	cursor: ${(props) => (props.disabled ? 'initial' : 'pointer')};
	opacity: ${(props) => (props.opacity ? 0.6 : 1)};
`

const Actions = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	margin-top: 20px;
`

const BackButton = styled.button`
	background: transparent;
	border: 1px ${colors.secondary} solid;
	border-radius: 30px;
	color: ${colors.secondary};
	padding: 9px 15px;
	cursor: pointer;
	margin-right: 5px;
`

const ActionButton = styled.button`
	background: ${colors.primary};
	border: 1px ${colors.primary} solid;
	border-radius: 30px;
	color: #fff;
	border: 0;
	padding: 9px 15px;
	cursor: pointer;
`

export default Director
