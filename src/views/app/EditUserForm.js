import React, { useState, useEffect } from 'react'
import { Colxx } from 'Components/common/CustomBootstrap'
import IntlMessages from 'Helpers/IntlMessages'
import { injectIntl } from 'react-intl'
import { connect, useSelector } from 'react-redux'
import Select from 'react-select'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import { useForm } from 'react-hook-form'
import useNotification from 'Hooks/useNotification'
import yup from 'Utils/yup'
import InputWrapper from 'Components/wrappers/InputWrapper'
import DatePicker, { registerLocale } from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import es from 'date-fns/locale/es'
import { Row, Input, Label, FormText, Button } from 'reactstrap'
import InputMask from 'react-input-mask'
import moment from 'moment'
import { parseOptions, mapOption } from 'Utils/mapeoCatalogos'
import { catalogsEnumObj } from 'Utils/catalogsEnum'
import { updateIdentity } from '../../redux/identificacion/actions'
import { getCatalogsSet } from '../../redux/selects/actions'
import { withRouter } from 'react-router-dom'
import { getUserData } from '../../redux/auth/actions'

registerLocale('es', es)

const FirstLoginProfile = (props) => {
  const schema = yup.object().shape({
    email: yup.string().email().required(),
    fechaDeNacimiento: yup.date().required(),
    secondEmail: yup.string().email(),
    phoneNumber: yup.string().required().mintel(),
    secondPhoneNumber: yup.string().nullable().notRequired().mintel(),
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    secondLastName: yup.string(),
    idNacional: yup.string().required(),
    nationalityId: yup.object({
      value: yup.number().required()
    }),
    typeId: yup.object({
      value: yup.number().required()
    }),
    sexoId: yup.object({
      value: yup.number().required()
    }),
    civilStatus: yup.object({
      value: yup.number().required()
    })
  })

  const [snackbar, handleClick] = useNotification()
  const {
    register,
    control,
    handleSubmit,
    errors,
    reset,
    watch,
    setValue
  } = useForm({
    validationSchema: schema
  })
  const [startDate, setStartDate] = useState(null)
  const [msg, setMsg] = useState('nbsp')
  const [variant, setVariant] = useState('info')
  const snackBarController = (variant, msg, change = false) => {
    setVariant(variant)
    setMsg(msg)
    handleClick()
  }
  const [picture, setPicture] = useState(
    '/assets/img/EditarPerfilGenerico.jpg'
  )
  const [uploadValue, setUploadValue] = useState(0)
  const [identidadData, setIdentidadData] = useState({})
  const [birthDate, setBirthDate] = useState(null)
  const [loading, setLoading] = useState(false)
  const state = useSelector(store => {
    return {
      ...store.authUser
    }
  })

  useEffect(() => {
    const catalogsArray = [
      catalogsEnumObj.SEXO,
      catalogsEnumObj.GENERO,
      catalogsEnumObj.ESTADOCIVIL
    ]
    const response = props.getCatalogsSet(catalogsArray)
  }, [])
  useEffect(() => {
    const _item = {
      ...state.authObject.userData?.identidad,
      sexo: mapOption(
        state.authObject.userData?.datos,
        props,
        catalogsEnumObj.SEXO.id,
        catalogsEnumObj.SEXO.name
      ),
      nacionalidad: mapOption(
        state.authObject.userData?.datos,
        props,
        catalogsEnumObj.NATIONALITIES.id,
        catalogsEnumObj.NATIONALITIES.name
      ),
      idType: mapOption(
        state.authObject.userData?.datos,
        props,
        catalogsEnumObj.IDENTIFICATION.id,
        catalogsEnumObj.IDENTIFICATION.name
      ),
      genero: mapOption(
        state.authObject.userData?.datos,
        props,
        catalogsEnumObj.GENERO.id,
        catalogsEnumObj.GENERO.name
      ),
      migracionStatus: mapOption(
        state.authObject.userData?.datos,
        props,
        catalogsEnumObj.ESTATUSMIGRATORIO.id,
        catalogsEnumObj.ESTATUSMIGRATORIO.name
      ),
      lenguaIndigena: mapOption(
        state.authObject.userData?.datos,
        props,
        catalogsEnumObj.LENGUASINDIGENAS.id,
        catalogsEnumObj.LENGUASINDIGENAS.name
      ),
      lenguaMaterna: mapOption(
        state.authObject.userData?.datos,
        props,
        catalogsEnumObj.LENGUAMATERNA.id,
        catalogsEnumObj.LENGUAMATERNA.name
      ),
      estadoCivil: mapOption(
        state.authObject.userData?.datos,
        props,
        catalogsEnumObj.ESTADOCIVIL.id,
        catalogsEnumObj.ESTADOCIVIL.name
      ),
      etnia: mapOption(
        state.authObject.userData?.datos,
        props,
        catalogsEnumObj.ETNIAS.id,
        catalogsEnumObj.ETNIAS.name
      ),
      fechaDeNacimiento: moment(
        state.authObject.userData?.fechaNacimiento
      ).format('DD/MM/YYYY'),
      edad: moment().diff(
        state.authObject.userData?.fechaNacimiento,
        'years',
        false
      ),
      facebook: state.authObject.userData?.facebook
        ? state.authObject.userData?.facebook
        : '',
      instagram: state.authObject.userData?.instagram
        ? state.authObject.userData?.instagram
        : '',
      twitter: state.authObject.userData?.twitter
        ? state.authObject.userData?.twitter
        : '',
      whatsapp: state.authObject.userData?.whatsapp
        ? state.authObject.userData?.whatsapp
        : '',
      fotografiaUrl: state.authObject.userData?.fotografiaUrl
        ? state.authObject.userData?.fotografiaUrl
        : ''
    }

    setIdentidadData(_item)
    setBirthDate(state.authObject.userData?.identidad?.fechaNacimiento)
  }, [state.authObject])

  const socialStatus = props.estadosCiviles.map((item) => {
    return { ...item, label: item.nombre, value: item.id, key: item.id }
  })

  const gender = props.sexoTypes.map((item) => {
    return { ...item, label: item.nombre, value: item.id, key: item.id }
  })

  const { nacionalidades } = props

  const idType = props.idTypes

  const { messages } = props.intl
  const customStyles = {
    control: (base, state) => ({
      ...base,
      border: state.selectProps.error && '1px solid #c43d4b!important'
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: state.selectProps.error && '#c43d4b!important'
    })
  }

  let isDisabled = false

  const onSubmit = async (data) => {
    setLoading(true)
    let _institutions = []
    if (data.institutions) {
      _institutions = data.institutions.map((item) => {
        return item.value
      })
    }
    const datos = parseOptions(identidadData, [
      'sexo',
      'estadoCivil',
      'idType'
    ])
    const _data = {
      id: identidadData.id,
      identificacion: identidadData.identificacion,
      nombre: identidadData.nombre,
      primerApellido: identidadData.primerApellido,
      segundoApellido: identidadData.segundoApellido,
      fotografiaUrl: identidadData.fotografiaUrl,
      conocidoComo: identidadData.conocidoComo,
      elementosNoRequiridosIds: datos,
      sexoId: identidadData.sexo ? identidadData.sexo.value : 0,
      nacionalidadId: identidadData.nacionalidad.value,
      telefono: identidadData.telefono,
      telefonoSecundario: identidadData.telefonoSecundario,
      email: identidadData.email,
      emailSecundario: identidadData.emailSecundario,
      tipoIdentificacionId: identidadData.idType.value
    }
    if (_data) {
      const response = await props.updateIdentity(_data)
      if (response && response.data && response.data.error) {
        snackBarController('error', response.data.error)
      } else {
        snackBarController('info', 'El registro se ha guardado')
        props.getUserData(localStorage.getItem('persist:uid'))
      }
    }
    setLoading(false)
  }

  const getTypeIdFromList = (typeId) => {
    let actualIdType
    idType.map((id) => {
      if (id.nombre === typeId) {
        actualIdType = id.id
      }
    })
    return actualIdType
  }

  const getNationalities = () => {
    if (watch('typeId')) {
      let uniqueOption
      if (
        getTypeIdFromList(watch('typeId').label) === getTypeIdFromList('Cedula')
      ) {
        nacionalidades.map((item) => {
          if (item.nombre === 'Costa Rica') {
            uniqueOption = [
              { label: item.nombre, value: item.id, key: item.id }
            ]
            isDisabled = true
          }
        })
        return uniqueOption
      } else {
        const options = []
        nacionalidades.map((item) => {
          if (item.nombre !== 'Costa Rica') {
            isDisabled = false
          }
        })
        return options
      }
    }
  }

  const setCurrentIdData = (data) => {
    if (data.label === 'Cedula') {
      nacionalidades.map((item) => {
        if (item.nombre === 'Costa Rica') {
          setValue('nationalityId', {
            label: item.nombre,
            value: item.id,
            key: item.id
          })
        }
      })
    } else {
      nacionalidades.map((item) => {
        if (item.nombre !== 'Costa Rica') {
          setValue('nationalityId', { label: '', value: '', key: '' })
        }
      })
    }
  }
  const idNationalities = getNationalities()
  const idTypes = idType.map((item) => {
    return { ...item, label: item.nombre, value: item.id, key: item.id }
  })

  const setDate = (date) => {
    setStartDate(date)
    setValue('fechaDeNacimiento', date)
  }

  const handleChange = (type, value) => {
    setIdentidadData({
      ...identidadData,
      [type]: value
    })
  }

  if (!state.authObject) {
    return (
      <h1>No tiene una identidad asociada</h1>
    )
  }
  return (
    <>
      <h1>Actualización de Datos Personales</h1>
      <form onSubmit={handleSubmit(onSubmit)} encType='multipart/form-data'>
        {snackbar(variant, msg)}
        <Row>
          {/* <div className='image-upload'>
                    <input type="file" onChange={handleUpload} className="image-upload__button" name="image" ref={register} />
                    <div className="image-upload__img">
                        <img src={picture} alt="profile_picture" className='image-upload__img' />
                    </div>
                </div>
                <Colxx sm='12' lg='12'>
                    <Separator className="mb-5" />
                </Colxx>
                */}
          <Colxx sm='12' lg='12'>
            <p className='text-blue'>
              Estos datos son privados para uso de la administración y no serán
              expuestos a la comunidad estudiantil
            </p>
            <FormText className='pb-1'>
              <IntlMessages id='label.requiredFields' />
            </FormText>
          </Colxx>

          <Colxx sm='12' lg='6'>
            <Label className='form-group has-top-label required'>
              <Input
                type='text'
                name='firstName'
                value={identidadData.nombre}
                innerRef={register({ required: true })}
                invalid={errors.firstName}
                readOnly
              />
              <IntlMessages id='label.name' />
            </Label>
            <Label className='form-group has-top-label required'>
              <Input
                type='text'
                name='lastName'
                value={identidadData.primerApellido}
                innerRef={register({ required: true })}
                invalid={errors.lastName}
                readOnly
              />
              <IntlMessages id='form.lastName' />
            </Label>
            <Label className='form-group has-top-label'>
              <Input
                type='text'
                name='secondLastName'
                value={identidadData.segundoApellido}
                innerRef={register}
                invalid={errors.secondLastName}
                readOnly
              />
              <IntlMessages id='form.secondLastName' />
            </Label>
            <div className='form-group has-top-label required'>
              <Select
                components={{ Input: CustomSelectInput }}
                className='react-select'
                classNamePrefix='react-select'
                options={idTypes}
                styles={customStyles}
                error={errors.typeId}
                placeholder=''
                value={identidadData.idType}
                isDisabled
              />
              <span className={errors.typeId && 'span-input-danger'}>
                {messages['form.idType']}
              </span>
            </div>
            <div className='form-group has-top-label required'>
              <Select
                components={{ Input: CustomSelectInput }}
                className='react-select'
                classNamePrefix='react-select'
                options={idNationalities}
                styles={customStyles}
                error={errors.nationalityId}
                placeholder=''
                value={identidadData.nacionalidad}
                isDisabled
              />
              <span className={errors.nationalityId && 'span-input-danger'}>
                {messages['form.nationality']}
              </span>
            </div>
            <Label className='form-group has-top-label required'>
              <Input
                type='text'
                name='idNacional'
                disabled
                value={identidadData.identificacion}
                innerRef={register}
                invalid={errors.idNacional}
                readOnly={null}
                isDisabled
              />
              <IntlMessages id='form.idNacional' />
            </Label>
            <Label className='form-group has-top-label required'>
              <DatePicker
                selected={birthDate ? moment(birthDate).toDate() : null}
                dateFormat='dd/MM/yyyy'
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                minDate={new Date(1940, 0, 1)}
                maxDate={new Date(2002, 0, 1)}
                dropdownMode='select'
                placeholderText='Seleccione fecha de nacimiento'
                locale='es'
                className={errors.fechaDeNacimiento ? 'is-invalid' : ''}
                onChange={(date) => setDate(date)}
                disabled
              />
              <IntlMessages id='form.birthDate' />
            </Label>
          </Colxx>
          <Colxx sm='12' lg='6'>
            <Label className='form-group has-top-label required'>
              <Select
                components={{ Input: CustomSelectInput }}
                className='react-select'
                classNamePrefix='react-select'
                onChange={(value) => {
                  handleChange('sexo', value)
                }}
                options={gender}
                styles={customStyles}
                error={errors.sexoId}
                placeholder=''
                value={identidadData.sexo}
              />
              <IntlMessages id='form.gender' />
            </Label>
            <Label className='form-group has-top-label required'>
              <Input
                type='email'
                name='email'
                pattern='[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_-]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{1,5}'
                defaultValue={null}
                innerRef={register({ required: true })}
                value={identidadData.email}
                onChange={(e) => {
                  handleChange('email', e.target.value)
                }}
                invalid={errors.email}
              />
              <IntlMessages id='form.email' />
            </Label>
            <Label className='form-group has-top-label'>
              <Input
                type='email'
                name='secondEmail'
                pattern='[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_-]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{1,5}'
                defaultValue={null}
                innerRef={register}
                value={identidadData.emailSecundario}
                onChange={(e) => {
                  handleChange('emailSecundario', e.target.value)
                }}
                invalid={errors.secondEmail}
              />
              <IntlMessages id='form.secondEmail' />
            </Label>
            <Label className='form-group has-top-label required'>
              <InputMask
                mask='9999-9999'
                value={identidadData.telefono}
                onChange={(e) => {
                  handleChange('telefono', e.target.value)
                }}
              >
                {(inputProps) => (
                  <Input
                    type='text'
                    name='phoneNumber'
                    defaultValue={null}
                    invalid={errors.phoneNumber}
                    innerRef={register}
                  />
                )}
              </InputMask>
              <IntlMessages id='form.phoneNumber' />
            </Label>
            <Label className='form-group has-top-label'>
              <InputMask
                mask='9999-9999'
                value={identidadData.telefonoSecundario}
                onChange={(e) => {
                  handleChange('telefonoSecundario', e.target.value)
                }}
              >
                {(inputProps) => (
                  <Input
                    {...inputProps}
                    name='secondPhoneNumber'
                    type='text'
                    invalid={errors.secondPhoneNumber}
                  />
                )}
              </InputMask>
              <IntlMessages id='form.secondPhoneNumber' />
            </Label>

            <div className='form-group has-top-label required'>
              <Select
                components={{ Input: CustomSelectInput }}
                className='react-select'
                classNamePrefix='react-select'
                name='civilStatus'
                options={socialStatus}
                styles={customStyles}
                error={errors.civilStatus}
                value={identidadData.estadoCivil}
                onChange={(value) => {
                  handleChange('estadoCivil', value)
                }}
                placeholder=''
              />
              <span className={errors.nationalityId && 'span-input-danger'}>
                {messages['form.civilStatus']}
              </span>
            </div>
          </Colxx>
          <Colxx sm='12' lg='12'>
            <InputWrapper>
              <div className='text-zero button-container'>
                <div
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex'
                  }}
                >
                  <div style={{ marginRight: '1rem' }}>
                    <Button
                      type='button'
                      color='secundary'
                      className='btn-shadow'
                      onClick={(e) => {
                        props.history.goBack()
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                  <div style={{ marginLeft: '1rem' }}>
                    {loading && <div className='loading loading-form ml-4' />}
                    {!loading && !props.error && (
                      <Button type='submit' color='primary'>
                        Guardar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </InputWrapper>
          </Colxx>
        </Row>
      </form>
    </>
  )
}

const mapStateToProps = (reducers) => {
  return {
    ...reducers.selects
  }
}

const mapActionsToProps = {
  updateIdentity,
  getCatalogsSet,
  getUserData
}

export default connect(
  mapStateToProps,
  mapActionsToProps
)(injectIntl(withRouter(FirstLoginProfile)))
