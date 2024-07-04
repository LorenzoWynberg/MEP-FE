import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import RedesSociales from './_partials/RedesSociales'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles((theme) => ({
  control: {
    padding: theme.spacing(2)
  }
}))

const formIds = {
  whatsapp:
		'91a9dba4-07e2-3663-8e22-1ded7307dee9_398f5e08-429f-9bee-3c80-dd15d2b5065d_col_whatsapp'
}

const socialNetworks = [
  {
    id: 1,
    name: 'facebook',
    linkBase: 'https://facebook.com/',
    text: ''
  },
  {
    id: 2,
    name: 'instagram',
    linkBase: 'https://instagram.com/',
    text: ''
  },
  {
    id: 3,
    name: 'whatsapp',
    linkBase: 'https://wa.me/506',
    text: ''
  },
  {
    id: 4,
    name: 'twitter',
    linkBase: 'https://twitter.com/',
    text: ''
  }
]

const Redes = (props) => {
  const { t } = useTranslation()

  const classes = useStyles()
  const [redes, setRedes] = useState(socialNetworks)
  const [editable, setEditable] = useState(props.editable)
  const [calledOnce, setCalledOnce] = useState(false)
  useEffect(() => {
    setEditable(props.editable)
  }, [props.editable])
  useEffect(() => {
    setTimeout(() => {
      setRedes([...redes].map(item => {
        if (props.dataForm && props.dataForm[`${props.field.id}_${item.name}`]) {
          return {
            ...item,
            textInput: props.dataForm[`${props.field.id}_${item.name}`] || '',
            text: props.dataForm[`${props.field.id}_${item.name}`] || ''
          }
        }
        return { ...item, textInput: '', text: '' }
      }))
    }, 500)
  }, [props.dataForm, editable])
  const [errorFields, setErrorFields] = useState(
    props.errorFields
  )
  const [errorMessages, setErrorMessages] = useState(
    props.errorMessages
  )

  const updateRedes = (data, action) => {
    const newRedes = [...redes].map((item) => {
      item.text =
				item.id === data.id ? (action ? data.textInput : '') : item.text
      return item
    })

    setRedes(newRedes)
  }

  useEffect(() => {
    setFormState(props.redes)

    const items = [
      {
        id: 1,
        textInput: props.redes.facebook
          ? props.redes.facebook
          : props.dataForm
            ? props.dataForm[`${props.field.id}_facebook`]
            : ''
      },
      {
        id: 2,
        textInput: props.redes.instagram
          ? props.redes.instagram
          : props.dataForm
            ? props.dataForm[`${props.field.id}_instagram`]
            : ''
      },
      {
        id: 3,
        textInput: props.redes.whatsapp
          ? props.redes.whatsapp
          : props.dataForm
            ? props.dataForm[`${props.field.id}_whatsapp`]
            : ''
      },
      {
        id: 4,
        textInput: props.redes.twitter
          ? props.redes.twitter
          : props.dataForm
            ? props.dataForm[`${props.field.id}_twitter`]
            : ''
      }
    ]

    items.forEach((element) => {
      updateRedes(element, true)
    })

    setErrorFields(props.errorFields)
    setErrorMessages(props.errorMessages)
  }, [props.editable])

  const [formState, setFormState] = useState({
    facebook: '',
    twitter: '',
    instagram: '',
    whatsapp: ''
  })

  const onSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      facebook: redes.find((x) => x.id == 1).text,
      instagram: redes.find((x) => x.id == 2).text,
      whatsapp: redes.find((x) => x.id == 3).text,
      twitter: redes.find((x) => x.id == 4).text
    }
  }

  const handleAdd = (data) => {
    if (!data.textInput) {
      return
    }

    if (data.textInput.trim().lenght === 0) {
      return
    }

    updateRedes(data, true)
  }

  const handleDelete = (data) => {
    updateRedes(data, false)
  }

  const handleInputChange = (item, { target }) => {
    let { name, value } = target
    const socialLink = item.linkBase
    if (name === formIds?.whatsapp) {
      value = Number(value.replace('https://wa.me/506', '')) || ''
      value = `https://wa.me/506${value}`
    }
    if (value.length === 1) {
      item.textInput = `${socialLink}${value}`
    } else if (value.search(socialLink) > -1) {
      item.textInput = value
    } else if (value.search('wa.me/') > -1) {
      item.textInput = value
    } else {
      item.textInput = `${socialLink}`
    }

    const newSocials = redes.map((social) =>
      item.id === social.id ? item : social
    )

    setRedes(newSocials)

    // if (editable) {
    //   setFormState({ ...formState, [target.name]: target.value });
    // }
  }

  // if (editable) {
  //   setFormState({ ...formState, [target.name]: target.value });
  // }

  return (
    <Grid container>
      <Grid item xs={12} className={classes.control}>
        <h4>{t('expediente_ce>informacion_general>informacion>redes', 'Redes sociales')}</h4>
        <RedesSociales
          hasEditable={editable}
          field={props.field}
          register={props.register}
          socialNetworks={redes}
          handleAdd={handleAdd}
          handleDelete={handleDelete}
          handleInputChange={handleInputChange}
          watch={props.watch}
        />
      </Grid>
    </Grid>
  )
}

export default Redes
