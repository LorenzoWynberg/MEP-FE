import React from 'react'
import styled from 'styled-components'
import { Email, Lock, RemoveRedEye } from '@material-ui/icons'

type IFormInput = {
    showForm: boolean,
    errors: any,
    register: any,
    control: any,
    setValue: any,
    watch: any,
    ids: Array<any>
    nationalities: Array<any>,
    sexos: Array<any>,
    errorsValidation: any,
    keysErrors: Array<string>,
    requesting: boolean,
    status: string
}

const Step3: React.FC<IFormInput> = (props) => {
  const [visible, setVisible] = React.useState<boolean>(false)

  const handlePass = () => setVisible(!visible)

  const renderGlobalErrorValidation = (keyError: string) => {
    if (props.keysErrors.includes(keyError)) {
      if (props.errorsValidation[keyError] !== undefined) {
        return <span>{props.errorsValidation[keyError][0]}</span>
      }
    }
  }

  return (
    <Wrapper showForm={props.showForm}>
      {
                renderGlobalErrorValidation('Global') ? <ErrorValidation>{renderGlobalErrorValidation('Global')}</ErrorValidation> : null
            }
      {
                props.requesting
                  ? <Loader>
                    <span className='button-loading' />
                    <strong>Por favor espere...</strong>
                  </Loader>
                  : props.status == 'success'
                    ? <Feedback>Su cuenta se ha creado correctamente, ya puede revisar su correo electrónico para seguir las instrucciones.</Feedback>
                    : <>
                      <Feedback>Una vez que su cuenta esté creada, podrá iniciar sesión con su identificación ó su correo electrónico</Feedback>
                      <Form autoComplete='on'>
                        <FormGroup>
                          <Label>Correo electrónico</Label>
                          <ContentInput>
                            <Input
                              name='email'
                              control={props.control}
                              ref={props.register({
                                required: true,
                                pattern: {
                                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                  message: 'Dirección invalida'
                                }
                              })}
                            />
                            <ContentIcon>
                              <IconEmail />
                            </ContentIcon>
                            {props.errors.email && props.errors.email.type === 'required' && <ErrorFeedback>Campo requerido</ErrorFeedback>}
                            {props.errors.email && props.errors.email.type === 'pattern' && <ErrorFeedback>Dirección invalida</ErrorFeedback>}
                          </ContentInput>
                        </FormGroup>
                        <FormGroup>
                          <Label>Contraseña</Label>
                          <ContentInput>
                            <Input
                              type={visible ? 'text' : 'password'}
                              name='password'
                              control={props.control}
                              ref={props.register({
                                required: true,
                                minLength: 8,
                                maxLength: 15,
                                validate: {
                                  lowerCase: value => Boolean(value.match(/[a-z]/)),
                                  upperCase: value => Boolean(value.match(/[A-Z]/)),
                                  numbers: value => Boolean(value.match(/\d/)),
                                  specialCharacter: value => Boolean(value.match(/[$@$!%*?&]/))
                                }
                              })}
                            />
                            <ContentIcon>
                              <IconPassword />
                            </ContentIcon>
                            <ShowPass onClick={handlePass}>
                              <Eye />
                            </ShowPass>
                            {props.errors.password && <ErrorFeedback>Campo requerido</ErrorFeedback>}
                          </ContentInput>
                          {
                                        props.errors.password &&
                                          <Restricciones>
                                            <Title>La contraseña debe contener:</Title>
                                            {props.errors.password && props.errors.password.type === 'lowerCase' && (
                                              <FeedBackItem>Al menos una letra minúscula</FeedBackItem>
                                            )}
                                            {props.errors.password && props.errors.password.type === 'upperCase' && (
                                              <FeedBackItem>Al menos una letra mayúscula</FeedBackItem>
                                            )}
                                            {props.errors.password && props.errors.password.type === 'numbers' && (
                                              <FeedBackItem>Al menos un número</FeedBackItem>
                                            )}
                                            {props.errors.password && props.errors.password.type === 'specialCharacter' && (
                                              <FeedBackItem>Al menos un caracter especial o símbolo</FeedBackItem>
                                            )}
                                            {props.errors.password && props.errors.password.type === 'minLength' && (
                                              <FeedBackItem>Al menos 8 caracteres</FeedBackItem>
                                            )}
                                            {props.errors.password && props.errors.password.type === 'maxLength' && (
                                              <FeedBackItem>Como máximo 15 caracteres</FeedBackItem>
                                            )}
                                          </Restricciones>
                                    }
                        </FormGroup>
                      </Form>
                      </>
            }
    </Wrapper>
  )
}

const Wrapper = styled.div`
    display: ${(props: IFormInput) => props.showForm ? 'block' : 'none'};
`

const ErrorValidation = styled.div`
    background: #f77d7d;
    text-align: center;
    color: #fff;
    padding: 5px;
    position: absolute;
    width: 77%;
    bottom: 25px;
`

const Feedback = styled.span`
    color: #109ED9;
    font-size: 16px;
`

const Form = styled.form`
    margin-top: 12px;
    display: block;
    width: 100%;
`

const FormGroup = styled.div`
    margin-bottom: 10px;
    &:last-child{
        margin-bottom: 0px;
    }
`

const Label = styled.label`
    color: #000;
`

const ContentInput = styled.div`position: relative;`

const Input = styled.input`
    width: 100%;
    padding: 0px 30px;
    border: 1px #D7D7D7 solid;
    min-height: 30px;
    position: relative;
    font-size: 12px;
    outline: 0;
`

const ContentIcon = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
    position: absolute;
    top: 0;
    left: 5px;
`

const ErrorFeedback = styled.span`
    position: absolute;
    color: #C43C4B;
    right: 0;
    font-weight: bold;
    font-size: 10px;
    bottom: -19px;
`

const IconEmail = styled(Email)`
    color: #888888;
    font-size: 17px;
`

const IconPassword = styled(Lock)`
    color: #888888;
    font-size: 17px;
`

const ShowPass = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
    position: absolute;
    top: 0;
    right: 7px;
    cursor: pointer;
`

const Eye = styled(RemoveRedEye)`
    color: #888888;
    font-size: 17px;
`

const Restricciones = styled.div`
    text-align: left;
    margin-top: 7px;
`

const Title = styled.strong`
    color: #000;
`

const FeedBackItem = styled.span`
    color: #C43C4B;
    font-size: 10px;
    display: block;
`

const Loader = styled.div`
  flex-direction: column;
  position: relative;
  width: 100%;
  text-align: center;
`

export default Step3
