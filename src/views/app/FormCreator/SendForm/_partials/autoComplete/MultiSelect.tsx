import React, { useEffect, useState } from 'react'
import { getEmail } from '../../../../../../redux/FormCreatorV2/actions'
import { useActions } from 'Hooks/useActions'
import TagsInput from 'react-tagsinput'
import md5 from 'md5'
import '../../../../../../../src/assets/css/sass/containerStyles/SendForm.scss'
import useNotification from 'Hooks/useNotification'
import { useSelector } from 'react-redux'
import search from 'Utils/search'
import { getListaDifusion } from '../../../../../../redux/ListasDifusion/actions'

const MultiSelect = (props) => {
  const [state, setState] = useState({ selectedEmails: [] })
  const getEmailAction = useActions({ getEmail, getListaDifusion })
  const [options, setOptions] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [open, setOpen] = useState(false)
  const [listaDifusion, setListaDifusion] = useState(false)
  const [allowListaDifusion, setAllowListaDifusion] = useState(false)
  const [snackbarContent, setSnackbarContent] = useState({
    msg: 'welcome',
    variant: 'info'
  })
  const [snackBar, handleSnackBarClick] = useNotification()
  const store = useSelector((store) => {
    return store.listaDifusion
  })
  useEffect(() => {
    if (props.destinatarios) {
      setState({ selectedEmails: props.destinatarios })
    }
  }, [props.destinatarios])

  const snackBarShow = (msg: string, variant: string) => {
    setSnackbarContent({
      variant,
      msg
    })
    handleSnackBarClick()
  }
  const onChange = (selectedEmails) => {
    const regex =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const newArray = new Array()
    const badEmail = new Array()
    selectedEmails.forEach((element) => {
      const emails = element.split(/;| /)
      for (let i = 0; i < emails.length; i++) {
        if (emails[i] && emails[i] !== '') {
          if (regex.test(emails[i])) {
            newArray.push(emails[i])
          } else {
            badEmail.push(emails[i])
          }
        }
      }
      if (badEmail.length > 0) {
        snackBarShow(
          'El correo: ' + badEmail + ' debe tener un formato válido',
          'error'
        )
      }
    })
    setState({
      selectedEmails: newArray || []
    })
    props.setDestinatarios(newArray)
    setInputValue('')
    setOpen(false)
    setListaDifusion(false)
  }

  const loadOptions = async (inputText) => {
    if (listaDifusion || allowListaDifusion) {
      setListaDifusion(false)
      setAllowListaDifusion(false)
    }
    const response = await getEmailAction.getEmail(inputText)
    const valor = []
    response.data?.forEach((i, idx) => {
      if (idx < 9) {
        valor.push({
          label: i.email,
          value: i.email,
          encriptado: md5(i.email)
        })
      }
    })

    setOptions(valor || [])
  }

  const loadListasDifusion = async (inputText) => {
    const valor = []
    search(inputText.replace('@', ''))
      .in(store.listasDifusion, ['alias'])
      .forEach((i, idx) => {
        if (idx < 9) {
          valor.push({ label: i.alias, value: i.alias, id: i.id })
        }
      })
    if (!listaDifusion) {
      setListaDifusion(true)
    }
    setOptions(valor || [])
  }

  return (
    <div style={{ position: 'relative' }}>
      {snackBar(snackbarContent.variant, snackbarContent.msg)}
      <TagsInput
        value={state.selectedEmails}
        onChange={onChange}
        className='email-container'
				// validationRegex={allowListaDifusion ? /^@([0-9]*[a-zA-Z]*)$/ : /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/}
        onlyUnique
        onValidationReject={() => {
				  snackBarShow(
				    'Debe ingresar un correo con formato válido',
				    'error'
				  )
        }}
        inputValue={inputValue}
        onChangeInput={(value) => {
				  if (!open) {
				    setOpen(true)
				  }
				  if (value[0] === '@') {
				    loadListasDifusion(value)
				  } else {
				    loadOptions(value)
				  }
				  setInputValue(value)
        }}
        loadOptions={loadOptions}
        inputProps={{
				  className: 'email-select',
				  placeholder: 'email..'
        }}
      />
      {open && options.length > 0 && (
        <div
          style={{
					  display: 'flex',
					  flexDirection: 'column',
            backgroundColor: 'white',
            position: 'absolute',
            zIndex: 1000,
            border: '1px solid #eaeaea',
            width: '100%',
            borderRadius: '5px',
            padding: '5px'
          }}
        >
          {options.map((el) => {
            return (
              <p
                className='hover-color email-search-item cursor-pointer'
                onClick={async () => {
                  await setAllowListaDifusion(true)
                  
                  if (loadListasDifusion) {
                    const response =
                      await getEmailAction.getListaDifusion(
                        el.id,
                        true
                      )
                  }
                  onChange([
                    ...state.selectedEmails,
                    el.value
                  ])
                }}
              >
                {el.label}
              </p>
            )
          })}
        </div>
      )}
    </div>
  )
}
export default MultiSelect
