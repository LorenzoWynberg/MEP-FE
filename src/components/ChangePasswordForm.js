import React, { useState } from 'react'
import { Input, Label, Button, Alert } from 'reactstrap'
import InputWrapper from 'Components/wrappers/InputWrapper'
import IntlMessages from '../helpers/IntlMessages'
import { useForm } from 'react-hook-form'
import Loader from 'Components/LoaderContainer'

const CambiarPassword = (props) => {
  const {
    handleSubmit,
    errors,
    watch,
    register,
    formState,
    setValue,
    reset
  } = useForm({ validateCriteriaMode: 'all', mode: 'onChange' })
  const pswd = watch('newPasswd')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const submitData = async (data) => {
    setLoading(true)
    const _data = {
      accessToken: props.token,
      previousPassword: data.actualPassword,
      proposedPassword: data.newPasswd
    }
    const response = await props.onSubmit(_data)
    setLoading(false)
    if (response.error) {
      setError(response.error)
      props.snackBarController('error', response.error)
    } else {
      props.snackBarController(
        'info',
        'Contraseña actualizada correctamente'
      )
      props.setModalOpen()
      reset()
    }
  }

  let pswValid = true
  let pswConfValid = true
  let pswInvalid = false
  let pswConfInvalid = false

  if (!formState.touched.newPasswd) {
    pswValid = null
  } else if (errors.newPasswd) {
    pswValid = false
    pswInvalid = true
  }

  if (!formState.touched.newPasswordConf) {
    pswConfValid = null
  } else if (errors.newPasswordConf) {
    pswConfInvalid = true
  }

  const canClick = (string) =>
    RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/
    ).test(string)
  const buttonMode = !(
    canClick(watch('newPasswd')) &&
		canClick(watch('newPasswordConf')) &&
		watch('newPasswd') === watch('newPasswordConf')
  )

  const handleChange = (e) => {
    setValue('newPasswd', e.target.value.trim())
  }

  const handlePasswordChange = (e) => {
    setValue('actualPassword', e.target.value.trim())
  }

  const handleConfirmChange = (e) => {
    setValue('newPasswordConf', e.target.value.trim())
  }

  return (
    <form className='input-wrapper' onSubmit={handleSubmit(submitData)}>
      {loading && <Loader />}
      <Label className='form-group has-top-label'>
        <Input
          invalid={errors.actualPassword}
          type='password'
          className='input100'
          name='actualPassword'
          onChange={handlePasswordChange}
          innerRef={register({ required: true })}
        />
        <IntlMessages id='form.actualPassword' />
      </Label>
      <Label className='form-group has-top-label'>
        <Input
          valid={pswValid}
          invalid={pswInvalid}
          type='password'
          className='input100'
          name='newPasswd'
          onChange={handleChange}
          innerRef={register({
					  required: true,
					  minLength: 6,
					  maxLength: 15,
					  validate: {
					    lowerCase: (value) => Boolean(value.match(/[a-z]/)),
					    upperCase: (value) => Boolean(value.match(/[A-Z]/)),
					    numbers: (value) => Boolean(value.match(/\d/))
					  }
          })}
        />
        <IntlMessages id='form.newPassword' />
        {errors.newPasswd && (
          <div className='password-feedback'>
            {errors.newPasswd.message}
          </div>
        )}
        {errors.newPasswd && errors.newPasswd?.type === 'required' && (
          <div className='password-feedback'>
            <IntlMessages id='passwordForm.fieldRequired' />
          </div>
        )}
        {errors.newPasswd && errors.newPasswd?.type === 'lowerCase' && (
          <div className='password-feedback'>
            <IntlMessages id='passwordForm.lowercaseRequired' />
          </div>
        )}
        {errors.newPasswd && errors.newPasswd?.type === 'upperCase' && (
          <div className='password-feedback'>
            <IntlMessages id='passwordForm.uppercaseRequired' />
          </div>
        )}
        {errors.newPasswd && errors.newPasswd?.type === 'numbers' && (
          <div className='password-feedback'>
            <IntlMessages id='passwordForm.numbersRequired' />
          </div>
        )}
        {errors.newPasswd &&
					errors.newPasswd?.types === 'specialCharacter' && (
  <div className='password-feedback'>
    <IntlMessages id='passwordForm.specialCharacterRequired' />
  </div>
        )}
        {errors.newPasswd && errors.newPasswd?.type === 'minLength' && (
          <div className='password-feedback'>
            <IntlMessages id='passwordForm.minLengthRequired' />
          </div>
        )}
        {errors.newPasswd && errors.newPasswd?.type === 'maxLength' && (
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
          valid={pswConfValid}
          invalid={pswConfInvalid}
          type='password'
          className='input100'
          name='newPasswordConf'
          onChange={handleConfirmChange}
          innerRef={register({
					  required: true,
					  validate: {
					    identical: (value) => value === pswd
					  }
          })}
        />
        {errors?.newPasswordConf &&
					errors?.newPasswordConf?.types?.required && (
  <div className='password-feedback'>
    <IntlMessages id='passwordForm.fieldRequired' />
  </div>
        )}
        {errors?.newPasswordConf &&
					errors?.newPasswordConf?.types?.identical && (
  <div className='password-feedback'>
    <IntlMessages id='passwordForm.identicalRequired' />
  </div>
        )}

        <IntlMessages id='user.password-confirm' />
      </Label>
      {error ? <Alert color='danger'>{error}</Alert> : null}
      <InputWrapper>
        <div className='text-zero button-container'>
          <div className='row'>
            <div className='col-6'>
              <div className='t-left-button-container'>
                <Button
                  color='secundary'
                  className='btn-shadow'
                  type='button'
                  onClick={() => {
									  props.setModalOpen()
									  reset()
                  }}
                >
                  <IntlMessages id='button.cancel' />
                </Button>
              </div>
            </div>
            <div className='col-6'>
              <div className='t-right-button-container'>
                {loading && (
                  <div className='loading loading-form ml-4' />
                )}
                {!loading && (
                  <Button
                    disabled={buttonMode}
                    color='primary'
                    className='btn-shadow'
                    size='lg'
                    type='submit'
                  >
                    <IntlMessages id='user.new-password-button' />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </InputWrapper>
    </form>
  )
}

export default CambiarPassword
