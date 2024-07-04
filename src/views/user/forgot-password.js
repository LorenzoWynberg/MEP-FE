import React, { useState, useEffect } from 'react'
import {
  Row,
  Card,
  CardTitle,
  Form,
  Label,
  Input,
  Button,
  FormText,
  Alert
} from 'reactstrap'
import { NavLink, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { resetPasswordByUsernameOrEmail } from 'Redux/UsuarioCatalogos/actions'
import { changePassword } from 'Redux/auth/actions'
import { Colxx } from 'Components/common/CustomBootstrap'
import IntlMessages from 'Helpers/IntlMessages'
import { useForm } from 'react-hook-form'

const ForgotPassword = (props) => {
  const [errorRecovery, setErrorRecovery] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingResendCode, setLoadingResendCode] = useState(false)
  const [errorBackend, setErrorBackend] = useState()
  const [login, setLogin] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, touched },
    setError,
    watch,
    setValue
  } = useForm({ validateCriteriaMode: 'all', mode: 'onChange' })

  useEffect(() => {
    if (props.match.params && props.match.params.name) {
      setValue('usuario', props.match.params.name)
      setErrorRecovery(true)
    }
  }, [])

  const toLogin = () => {
    setLogin(true)
  }

  const onSubmit = async (data) => {
    setLoadingResendCode(true)
    let user = ''
    if (errorRecovery) {
      user = watch('usuario')
    } else {
      user = data.usuario.trim()
    }
    try {
      if (user === '') {
        setError(
          'usuario',
          'validate',
          '¡Oh, no! El usuario no fue encontrado'
        )
        setLoadingResendCode(false)
        return
      }

      const response = await props.resetPasswordByUsernameOrEmail({
        username: user
      })
      if (response.error) {
        setError('usuario', 'validate', response.message)
        setErrorBackend(response.message)
      } else {
        if (response.status === 404) {
          setError(
            'usuario',
            'validate',
            '¡Oh, no! El usuario no fue encontrado'
          )
        } else if (response.status === 200) {
          setErrorRecovery(true)
        }
      }
    } catch (error) {
      setError(
        'usuario',
        'validate',
        '¡Oh no! se produjo un error al obtener el usuario'
      )
    }
    setLoadingResendCode(false)
  }
  const handleChange = (e) => {
    setValue('nuevaContrasenia', e.target.value.trim())
  }
  const handleConfirmChange = (e) => {
    setValue('nuevaContraseniaConf', e.target.value.trim())
  }
  const handleCodeChange = (e) => {
    setValue('codigo', e.target.value.trim())
  }

  let pswValid = true
  let pswConfValid = true
  let pswInvalid = false
  let pswConfInvalid = false
  const pswd = watch('nuevaContrasenia')

  if (!touched.nuevaContrasenia) {
    pswValid = null
  } else if (errors.nuevaContrasenia) {
    pswValid = false
    pswInvalid = true
  }

  if (!touched.nuevaContraseniaConf) {
    pswConfValid = null
  } else if (errors.nuevaContraseniaConf) {
    pswConfInvalid = true
  }

  const canClick = (string) =>
    RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/
    ).test(string)

  const buttonMode = !(
    canClick(watch('nuevaContrasenia')) &&
		canClick(watch('nuevaContraseniaConf')) &&
		watch('nuevaContrasenia') === watch('nuevaContraseniaConf') &&
		watch('code') !== ' ' &&
		watch('code') !== ''
  )

  const onSubmitChange = async (data) => {
    try {
      setLoading(true)
      const _request = {
        username: data.usuario.trim(),
        newPassword: data.nuevaContrasenia.trim(),
        currentPassword: data.codigo.trim()
      }
      if (data?.password === data?.newPassword) {
        const response = await props.changePassword(_request)
        if (response?.error) {
          setErrorBackend(response.error)
        } else {
          toLogin()
        }
      } else {
        setError(
          'newPassword',
          'validate',
          'Las contraseñas no coinciden'
        )
      }
    } catch (error) {
      setErrorBackend(error.message)
    }
    setLoading(false)
  }

  if (login) return <Redirect to='/user/login' />

  console.log(errors)

  return (
    <Row className='h-100'>
                {/*<div className='fixed-background-saber' />*/}
      <Colxx xxs='12' md='10' className='mx-auto my-auto'>
        <Card className='auth-card'>
          <>
            <div className='position-relative image-side '>
              <p className='text-white h2'>
                <IntlMessages id='text.passwordRecovery' />
              </p>
              <p className='white mb-0'>
                <IntlMessages id='text.codeEmail' />
              </p>
            </div>
            <div className='form-side'>
              <NavLink to='/' className='white'>
                <span className='logo-single-2-saber' />
              </NavLink>
              <CardTitle className='mb-4'>
                <IntlMessages id='user.forgot-password' />
              </CardTitle>
              <Form
                onSubmit={handleSubmit(onSubmitChange)}
                autocomplete='off'
              >
                <Label className='form-group has-top-label  required mb-4'>
                  <Input
                    autocomplete='off'
                    name='usuario'
                    type='text'
                    innerRef={register({
										  required: true,
										  minLength: 6
                  })}
                    readOnly={errorRecovery}
                    invalid={errors.usuario}
                  />
                  <IntlMessages id='user.username' />
                  {errors.usuario && (
                    <FormText
                    className='span-input-danger'
                  >
                    {errors.usuario.message}
                  </FormText>
                  )}
                </Label>
                {errorRecovery && (
                  <div>
                    <Label className='form-group has-top-label required mb-4'>
                    <Input
                    autocomplete='off'
                    name='codigo'
                    type='password'
                    innerRef={register({
												  required: true
                  })}
                    invalid={errors.codigo}
                    onChange={handleCodeChange}
                  />
                    <IntlMessages id='label.verificationCode' />
                    {errors.codigo && (
                    <FormText
                    className='span-input-danger'
                  >
                    {errors.codigo.message}
                  </FormText>
                  )}
                  </Label>
                    <Label className='form-group has-top-label'>
                    <Input
                    autocomplete='new-password'
                    valid={pswValid}
                    invalid={pswInvalid}
                    type='password'
                    className='input100'
                    name='nuevaContrasenia'
                    onChange={handleChange}
                    innerRef={register({
												  required: true,
												  minLength: 8,
												  maxLength: 15,
												  validate: {
												    lowerCase: (value) =>
												      Boolean(
												        value.match(
												          /[a-z]/
												        )
												      ),
												    upperCase: (value) =>
												      Boolean(
												        value.match(
												          /[A-Z]/
												        )
												      ),
												    numbers: (value) =>
												      Boolean(
												        value.match(
												          /\d/
												        )
												      )
												    // specialCharacter: value => Boolean(value.match(/[$@$!%*?&]/))
												  }
                  })}
                  />
                    <IntlMessages id='form.newPassword' />
                    {errors.nuevaContrasenia && (
                    <div className='password-feedback'>
                    {
														errors.nuevaContrasenia
														  .message
													}
                  </div>
                  )}
                    {errors.nuevaContrasenia &&
												errors.nuevaContrasenia
												  ?.type === 'required' && (
  <div className='password-feedback'>
    <IntlMessages id='passwordForm.fieldRequired' />
  </div>
                  )}
                    {errors.nuevaContrasenia &&
												errors.nuevaContrasenia
												  ?.type === 'lowerCase' && (
  <div className='password-feedback'>
    <IntlMessages id='passwordForm.lowercaseRequired' />
  </div>
                  )}
                    {errors.nuevaContrasenia &&
												errors.nuevaContrasenia
												  ?.type === 'upperCase' && (
  <div className='password-feedback'>
    <IntlMessages id='passwordForm.uppercaseRequired' />
  </div>
                  )}
                    {errors.nuevaContrasenia &&
												errors.nuevaContrasenia
												  ?.type === 'numbers' && (
  <div className='password-feedback'>
    <IntlMessages id='passwordForm.numbersRequired' />
  </div>
                  )}
                    {errors.nuevaContrasenia &&
												errors.nuevaContrasenia
												  ?.types ===
													'specialCharacter' && (
  <div className='password-feedback'>
    <IntlMessages id='passwordForm.specialCharacterRequired' />
  </div>
                  )}
                    {errors.nuevaContrasenia &&
												errors.nuevaContrasenia
												  ?.type === 'minLength' && (
  <div className='password-feedback'>
    <IntlMessages id='passwordForm.minLengthRequired' />
  </div>
                  )}
                    {errors.nuevaContrasenia &&
												errors.nuevaContrasenia
												  ?.type === 'maxLength' && (
  <div className='password-feedback'>
    <IntlMessages id='passwordForm.maxLengthRequired' />
  </div>
                  )}
                    {pswValid && (
                    <div className='password-good-feedback'>
                    <IntlMessages id='passwordForm.great' />
                  </div>
                  )}
                  </Label>
                    <Label className='form-group has-top-label'>
                    <Input
                    autocomplete='new-password'
                    valid={pswConfValid}
                    invalid={pswConfInvalid}
                    type='password'
                    className='input100'
                    name='nuevaContraseniaConf'
                    onChange={handleConfirmChange}
                    innerRef={register({
												  required: true,
												  validate: {
												    identical: (value) =>
												      value === pswd
												  }
                  })}
                  />
                    {errors.nuevaContraseniaConf &&
												errors.nuevaContraseniaConf
												  ?.type === 'required' && (
  <div className='password-feedback'>
    <IntlMessages id='passwordForm.fieldRequired' />
  </div>
                  )}
                    {errors.nuevaContraseniaConf &&
												errors.nuevaContraseniaConf
												  ?.type === 'identical' && (
  <div className='password-feedback'>
    <IntlMessages id='passwordForm.identicalRequired' />
  </div>
                  )}

                    <IntlMessages id='user.password-confirm' />
                  </Label>
                  </div>
                )}
                {errorBackend && (
                  <Alert color='danger'>{errorBackend}</Alert>
                )}
                <div className='d-flex justify-content-between align-items-center'>
                  {errorRecovery === false && (
                    <div className='col-6'>
                    <div className='t-left-button-container'>
                    <Button
                    color='secundary'
                    className='btn-shadow'
                    type='button'
                    onClick={() => toLogin()}
                  >
                    <IntlMessages id='button.cancel' />
                  </Button>
                  </div>
                  </div>
                  )}
                  {errorRecovery === false
                    ? (
									  loadingResendCode
                          ? (
                          <div className='d-flex justify-content-center align-items-center'>
                          <div className='loading loading-form mr-5' />
                        </div>
									  )
                          : (
                          <Button
                          color='primary'
                          className='btn-shadow'
                          type='submit'
                          size='lg'
                          onClick={handleSubmit(onSubmit)}
                        >
                          <IntlMessages id='user.reset-password-button' />
                        </Button>
									  )
                      )
                    : null}
                </div>
                {errorRecovery && (
                  <Row className='h-100'>
                    <Colxx
                    xxs='12'
                    md='6'
                    className='mx-auto my-auto'
                  >
                    {loadingResendCode
                    ? (
                    <div className='d-flex justify-content-center align-items-center'>
                    <div className='loading loading-form' />
                  </div>
                      )
                    : (
                    <Button
                    color='secondary'
                    className='btn-shadow cursor-pointer'
                    onClick={onSubmit}
                    Reenviar
                    contraseña
                    title='Esta acción resetea la contraseña y se envía nuevamente al correo electrónico asociado al usuario.'
                  >
                    <span>
                    Reenviar contraseña
    </span>
                  </Button>
                      )}
                  </Colxx>
                    <Colxx
                    xxs='12'
                    md='6'
                    className='mx-auto my-auto'
                  >
                    {loading
                    ? (
                    <div className='d-flex justify-content-center align-items-center'>
                    <div className='loading loading-form' />
                  </div>
                      )
                    : (
                    <div className='d-flex justify-content-end align-items-center'>
                    <Button
                    color='primary'
                    className='btn-shadow'
                    size='lg'
                    disabled={buttonMode}
                    type='submit'
                    onClick={handleSubmit(
														  onSubmitChange
                  )}
                  >
                    <IntlMessages id='button.changePassword' />
                  </Button>
                  </div>
                      )}
                  </Colxx>
                  </Row>
                )}
              </Form>
            </div>
          </>
        </Card>
      </Colxx>
    </Row>
  )
}

const mapStateToProps = (props) => props
const mapActionsToProps = {
  resetPasswordByUsernameOrEmail,
  changePassword
}

export default connect(mapStateToProps, mapActionsToProps)(ForgotPassword)
