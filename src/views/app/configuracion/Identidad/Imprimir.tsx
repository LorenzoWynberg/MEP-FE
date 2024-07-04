import React from 'react'
import { Input, Button } from 'reactstrap'
import styled from 'styled-components'
import {
  getIdentificacionPersona,
  cleanStudent
} from '../../../../redux/identidad/actions'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import useNotification from 'Hooks/useNotification'
import swal from 'sweetalert'
import { useTranslation } from 'react-i18next'

type IProps = {
  handlePrint: Function
}

type IState = {
  identidad: any
}

type SnackbarConfig = {
  variant: string
  msg: string
}

const Imprimir: React.FC<IProps> = (props) => {
  const {t} = useTranslation()

  const [search, setSearch] = React.useState<string>('')
  const [fullName, setFullName] = React.useState<string>('')
  const [printer, setPrinter] = React.useState<boolean>(false)
  const [snackbar, handleClick] = useNotification()
  const [snackBarContent, setSnackbarContent] = React.useState<SnackbarConfig>({
    variant: '',
    msg: ''
  })
  const actions = useActions({ getIdentificacionPersona })

  const state = useSelector((store: IState) => {
    return {
      user: store.identidad.data
    }
  })

  React.useEffect(() => {
    if (Object.keys(state.user).length !== 0) {
      setFullName(
        `${state.user.nombre} ${state.user.primerApellido} ${state.user.segundoApellido}`
      )
    }
  }, [state.user])

  const showNotification = (variant: string, msg: string) => {
    setSnackbarContent({ variant, msg })
    handleClick()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const handleInputSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    if (search == '') {
      showNotification('error', t('general>error_id_no_found', 'Oops! Por favor ingrese una identidad'))
      return
    }

    const res = await actions.getIdentificacionPersona(search)

    if (res.data == '') {
      swal({
        title: t('general>error>siento', '¡Lo siento!'),
        text: t('general>error>no_register', 'Esta persona no se encuentra registrada'),
        icon: 'warning',
        buttons: {
          ok: {
            text: 'Ok',
            value: true
          }
        }
      })
      setFullName('')
      cleanStudent()
    }
  }

  const handlePrint = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setPrinter(true)
    props.handlePrint(state.user)
  }

  return (
    <Wrapper>
      {snackbar(snackBarContent.variant, snackBarContent.msg)}
      <Title>{t('estudiantes>indentidad_per>imp_doc>titulo', 'Re-Imprimir documento de identidad')}</Title>
      <Feedback>
        {t('estudiantes>indentidad_per>imp_doc>mensaje', 'Esta sección permite re-imprimir los datos de una persona registrada.')}
      </Feedback>
      <Form>
        <FormRow>
          <FormInline>
            <Label>{t('estudiantes>indentidad_per>historico_camb>num_id', 'Número de identificación')}</Label>
            <Input type='text' value={search} onChange={handleChange} />
          </FormInline>
          <Search>
            <Button color='primary' onClick={handleInputSearch}>
              {t('general>buscar', 'Buscar')}
            </Button>
          </Search>
        </FormRow>
        <FormGroup>
          <Label>{t('estudiantes>indentidad_per>aplicar_camb>camb_id>nom_completo', 'Nombre completo')}</Label>
          <Input type='text' value={fullName} readOnly />
        </FormGroup>
        <FormGroup>
          <Label>{t('estudiantes>indentidad_per>aplicar_camb>conocido', 'Conocido como')}</Label>
          <Input
            type='text'
            value={state.user.conocidoComo || ''}
            readOnly
          />
        </FormGroup>
        <FormAction>
          <Button
            id='print_btn'
            color='primary'
            disabled={Object.keys(state.user).length === 0}
            onClick={handlePrint}
          >
            {t('estudiantes>indentidad_per>imp_doc>imprimir', 'Imprimir')}
          </Button>
        </FormAction>
      </Form>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin-top: 20px;

  & #print_page {
    display: block;
  }

  @media print {
    #print_btn {
      display: none;
    }
    #print_page {
      display: block;
    }
  }
`

const Print = styled.div`
  color: #000;
`

const PrintItem = styled.strong`
  color: #000;
`

const Title = styled.h4`
  color: #000;
`

const Feedback = styled.p`
  color: #000;
  font-size: 13px;
`

const Form = styled.form`
  margin-top: 30px;
  width: 40%;
`

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 50% 30%;
  align-items: flex-end;
  grid-column-gap: 10px;
  margin-bottom: 13px;
`

const FormGroup = styled.div`
  margin-bottom: 13px;
`

const FormAction = styled.div`
  margin-top: 13px;
  text-align: center;
`

const FormInline = styled.div`
  flex-direction: column;
`

const Label = styled.label`
  color: #000;
  display: block;
`

const Search = styled.div``

export default Imprimir
