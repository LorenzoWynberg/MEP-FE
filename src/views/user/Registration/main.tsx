import React from 'react'
import { Row, Card } from 'reactstrap'
import { Colxx } from '../../../components/common/CustomBootstrap'
import { NavLink } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import { intersection } from 'lodash'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'
import moment from 'moment'

import UsuarioIdentificacion from './Steps/Step1.tsx'
import UsuarioInformacion from './Steps/Step2.tsx'
import UsuarioLogin from './Steps/Step3.tsx'

import CurrentSteps from './CurrentStep.tsx'

import { useSelector, useDispatch } from 'react-redux'
import { registroUsuario } from '../../../redux/registro/actions'
import { UsuarioRegistro } from '../../../types/usuario'
import colors from '../../../assets/js/colors'

type RegistrationProps = {}

type IState = {
	selects: Array<any>
	registro: UsuarioRegistro
}

const Registration: React.FC<RegistrationProps> = (props) => {
  const [errorsValidation, setErrosValidation] = React.useState<object>(null)
  const [keysErrors, setKeysErros] = React.useState<Array<string>>([])
  const [currentForm, setCurrentForm] = React.useState<number>(0)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [requesting, setRequesting] = React.useState<boolean>(false)
  const [status, setStatus] = React.useState<string>('')
  const dispatch = useDispatch()
  const { register, trigger, errors, control, getValues, setValue, watch } =
		useForm({ validateCriteriaMode: 'all', mode: 'onChange' })

  const selects = useSelector((state: IState) => state.selects)
  const { currentUser } = useSelector((state: IState) => state.registro)

  const forms: Array<any> = [
    {
      fields: [
        'type_identification',
        'identification',
        'nationality',
        'people_sex'
      ],
      component: (
        register: any,
        errors: any,
        watch: any,
        control: any,
        setValue: any,
        ids: Array<any>,
        nationalities: Array<any>,
        sexos: Array<any>
      ) => (
        <UsuarioIdentificacion
          key={0}
          showForm={currentForm === 0}
          register={register}
          errors={errors}
          watch={watch}
          control={control}
          setValue={setValue}
          ids={ids}
          nationalities={nationalities}
          sexos={sexos}
          errorsValidation={errorsValidation}
          keysErrors={keysErrors}
        />
      )
    },
    {
      fields: [
        'nombre',
        'primerApellido',
        'segundoApellido',
        'fechaNacimiento'
      ],
      component: (
        register: any,
        errors: any,
        watch: any,
        control: any,
        setValue: any
      ) => (
        <UsuarioInformacion
          key={1}
          showForm={currentForm === 1}
          register={register}
          errors={errors}
          watch={watch}
          control={control}
          setValue={setValue}
          usuario={currentUser}
          errorsValidation={errorsValidation}
          keysErrors={keysErrors}
        />
      )
    },
    {
      fields: ['email', 'password'],
      component: (
        register: any,
        errors: any,
        watch: any,
        control: any,
        setValue: any
      ) => (
        <UsuarioLogin
          key={1}
          showForm={currentForm === 2}
          register={register}
          errors={errors}
          watch={watch}
          control={control}
          setValue={setValue}
          errorsValidation={errorsValidation}
          keysErrors={keysErrors}
          requesting={requesting}
          status={status}
        />
      )
    }
  ]

  const validationFirstForm = async () => {
    const formValues = getValues()

    const data = {
      invitacionId: null,
      email: 'string',
      nombre: 'string',
      apellido: 'string',
      segundoApellido: 'string',
      sexoId: formValues.people_sex.id,
      nacionalidadId: formValues.nationality.id,
      tipoIdentificacionId: formValues.type_identification.id,
      identificacion: formValues.identification,
      fechaNacimiento: new Date(2002, 0, 1),
      password: null
    }
    setLoading(true)
    const res = await dispatch(registroUsuario(data))
    setErrosValidation(res.errors)
    const errorKeys = Object.keys(res.errors)
    const step1Rule = [
      'TipoIdentificacionId',
      'Identificacion',
      'NacionalidadId',
      'SexoId',
      'Global'
    ]
    const result = intersection(errorKeys, step1Rule)
    setKeysErros(errorKeys)
    setLoading(false)

    return !(result.length > 0)
  }

  const validationSecondForm = async () => {
    const formValues = getValues()

    const data = {
      invitacionId: null,
      email: 'string',
      nombre: formValues.nombre,
      apellido: formValues.primerApellido,
      segundoApellido: formValues.segundoApellido,
      sexoId: formValues.people_sex.id,
      nacionalidadId: formValues.nationality.id,
      tipoIdentificacionId: formValues.type_identification.id,
      identificacion: formValues.identification,
      fechaNacimiento: moment(formValues.fechaNacimiento).format(
        'YYYY-MM-DD'
      ),
      password: null
    }
    setLoading(true)
    const res = await dispatch(registroUsuario(data))
    setErrosValidation(res.errors)
    const errorKeys = Object.keys(res.errors)
    const step1Rule = [
      'nombre',
      'apellido',
      'segundoApellido',
      'fechaNacimiento',
      'Global'
    ]
    const result = intersection(errorKeys, step1Rule)
    setKeysErros(errorKeys)
    setLoading(false)

    return !(result.length > 0)
  }

  const moveToPrevious = () => {
    trigger(forms[currentForm - 1].fields).then((valid: boolean) => {
      if (valid) setCurrentForm(currentForm - 1)
    })
  }

  const moveToNext = () => {
    trigger(forms[currentForm].fields).then(async (valid: boolean) => {
      switch (currentForm) {
        case 0:
          if (valid) {
            const validationForm = await validationFirstForm()
            if (validationForm) {
              setCurrentForm(currentForm + 1)
            }
          }
          break
        case 1:
          if (valid) {
            const validationForm = await validationSecondForm()
            if (validationForm) {
              setCurrentForm(currentForm + 1)
            }
          }
          break
      }
    })
  }

  const prevButton = currentForm !== 0
  const nextButton = currentForm !== forms.length - 1

  const handleSubmit = async (e: any) => {
    trigger(forms[currentForm].fields).then(async (valid: boolean) => {
      if (valid) {
        try {
          const formValues = getValues()
          const data = {
            invitacionId: null,
            email: formValues.email,
            nombre: formValues.nombre,
            apellido: formValues.primerApellido,
            segundoApellido: formValues.segundoApellido,
            sexoId: formValues.people_sex.id,
            nacionalidadId: formValues.nationality.id,
            tipoIdentificacionId: formValues.type_identification.id,
            identificacion: formValues.identification,
            fechaNacimiento: moment(
              formValues.fechaNacimiento
            ).format('YYYY-MM-DD'),
            password: formValues.password
          }
          setRequesting(true)
          await dispatch(registroUsuario(data))
          setRequesting(false)
          setStatus('success')
        } catch (error) {
          setStatus('failed')
        }
      }
    })
  }

  const { idTypes, nationalities, sexoTypes } = selects

  return (
    <Row className='h-100'>
      <Colxx xxs='12' md='10' className='mx-auto my-auto'>
        <Card className='auth-card'>
          <div className='position-relative image-side image-side-register' />
          <div className='form-side'>
            <ContentHeader>
              <NavLink to='/' className='white'>
                <span className='logo-single' />
                <Typography
                  variant='subtitle2'
                  className='descripcion-logo'
                  style={{ fontSize: '12px' }}
                >
                  Sistema de Administración Básica de la
                  Educación y sus Recursos
                </Typography>
              </NavLink>
              <CurrentSteps forms={forms} step={currentForm} />
            </ContentHeader>
            {forms.map((form) =>
						  form.component(
						    register,
						    errors,
						    watch,
						    control,
						    setValue,
						    idTypes,
						    nationalities,
						    sexoTypes
						  )
            )}
            {!requesting
              ? (
						  status != 'success'
                    ? (
                      <ActionsButton>
                        {prevButton && (
                          <PreviousButton
                          onClick={moveToPrevious}
                        >
        Anterior
                        </PreviousButton>
                        )}

                        {nextButton && (
                          <>
                          {loading
                          ? (
                          <Loader>
                          <span className='button-loading' />
                          <strong>
                          Por favor espere...
              </strong>
                        </Loader>
                            )
                          : (
                          <NextButton
                          onClick={moveToNext}
                        >
              Siguiente
                        </NextButton>
                            )}
                        </>
                        )}

                        {currentForm === 2 && (
                          <button
                          onClick={handleSubmit}
                          className='btn btn-primary'
                          type='submit'
                        >
        Iniciar
                        </button>
                        )}
                      </ActionsButton>
						  )
                    : null
                )
              : null}
          </div>
        </Card>
      </Colxx>
    </Row>
  )
}

const ActionsButton = styled.div`
	margin-top: 15px;
`

const PreviousButton = styled.button`
	background: transparent;
	border: 1px ${colors.secondary} solid;
	border-radius: 30px;
	color: ${colors.primary};
	padding: 9px 15px;
	cursor: pointer;
	margin-right: 5px;
`

const NextButton = styled.button`
	background: ${colors.primary};
	border: 1px ${colors.primary} solid;
	border-radius: 30px;
	color: #fff;
	border: 0;
	padding: 9px 15px;
	cursor: pointer;
`

const Loader = styled.div`
	flex-direction: column;
	position: relative;
	width: 100%;
	text-align: center;
`

const ContentHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`

export default Registration
