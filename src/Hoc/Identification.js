import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Input, Form, FormGroup, FormFeedback, Label } from 'reactstrap'
import { getIdentification } from '../redux/identificacion/actions'
import PropTypes from 'prop-types'
import Select from 'react-select'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import { useActions } from '../hooks/useActions'
import { getNacionalidades } from 'Redux/nacionalidades/actions'
import styled from 'styled-components'
import { envVariables } from 'Constants/enviroment'
import axios from 'axios'
import Loader from '../components/Loader'
import RequiredLabel from '../components/common/RequeredLabel'
import SimpleModal from 'Components/Modal/simple'
import { useTranslation } from 'react-i18next'
import {
  clearWizardDataStore,
  clearWizardNavDataStore
} from 'Redux/identidad/actions'
import { clearCurrentDiscapacidades } from 'Redux/matricula/apoyos/actions'
import WizardRegisterIdentityModal from 'Views/app/configuracion/Identidad/_partials/wizardRegisterIdentityModal'

export const withIdentification = (Component) => {
  return (props) => {
    const state = useSelector((store) => {
      return {
        identification: store.identification,
        selects: store.selects,
        idTypes: store.idTypes
      }
    })

    const actions = useActions({
      getIdentification,
      getNacionalidades
    })
    return <Component {...state} {...actions} {...props} />
  }
}

export const IdentificationInputs = (props) => {
  const { t } = useTranslation()

  const [nationalitiesOptions, setNationalitiesOptions] = useState([])
  const [orderedNationalitiesOptions, setOrderedNationalitiesOptions] =
		useState([])
  const actions = useActions({
    clearWizardDataStore,
    clearWizardNavDataStore,
    clearCurrentDiscapacidades
  })
  const [typingTimeout, setTypingTimeout] = useState()
  const [showError, setShowError] = useState(false)
  const [idDisabled, setIdDisabled] = useState(false)
  const [disabledFields, setDisabledFields] = useState(false)
  const [noEncontradoModal, setNoEncontradoModal] = useState(false)
  const [registrarModal, setRegistrarModal] = useState(false)
  const [loadingRegistrarModal, setLoadingRegistrarModal] = useState(false)
  const [errorFields, setErrorFields] = useState(
    props.identification.errorFields
  )
  const closeModalNoEncontrado = () => {
    setShowError(false)
  }
  useEffect(() => {
    setDisabledFields(props.disableFields)
  }, [props.disableFields])

  useEffect(() => {
    if (props.selects.nationalities[0]) {
      const nationalities = props.selects.nationalities.map((item) => {
        return { ...item, value: item.id, label: item.nombre }
      })
      setNationalitiesOptions(nationalities)
      setOrderedNationalitiesOptions(nationalities)
    }
  }, [props.selects.nationalities])

  const closeRegistrarPersona = async () => {
    await actions.clearWizardDataStore()
    await actions.clearWizardNavDataStore()
    await actions.clearCurrentDiscapacidades()
    props.storeAction(null)
    // setRegistrarModal(false)
  }
  const guardarNuevaPersona = async (_student) => {
    await actions.clearWizardDataStore()
    await actions.clearWizardNavDataStore()
    props.storeAction(_student)
    setRegistrarModal(false)
    setLoadingRegistrarModal(false)
  }

  const handleId = async (e) => {
    clearTimeout(typingTimeout)
    showError && setShowError(false)
    if (props.idType && props.idType.codigo == '01') {
      const length = e.target.value.length
      const valid = parseInt(e.target.value[length - 1])
      if (length === 1 && e.target.value !== '0' && !isNaN(valid)) {
        props.handleChange(e)
      } else if (length !== 1 && length <= 9 && !isNaN(valid)) {
        props.handleChange(e)
        if (length === 9) {
          props.setLoading(true)
          const response = await axios.get(
						`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Identidad/GetByIdentification/${e.target.value}`
          )

          props.setLoading(false)
          if (response.status !== 204) {
            props.storeAction(response.data)
            setShowError(false)
            props.setDisableFields && props.setDisableFields(true)
          } else {
            setShowError(true)
          }
        }
      } else if (e.target.value.length === 0) {
        props.handleChange(e)
      }
    } else {
      const { value } = e.target
      if (value !== '') {
        setTypingTimeout(
          setTimeout(() => {
            props.setLoading(true)
            axios
              .get(
								`${envVariables.BACKEND_URL}/api/ExpedienteEstudiante/Identidad/GetByIdentification/${value}`
              )
              .then((response) => {
                if (response.status !== 204) {
                  props.storeAction(response.data)
                  setShowError(false)
                } else {
                  setShowError(true)
                }
                props.setLoading(false)
              })
          }, 800)
        )
      }
      props.handleChange(e)
    }
  }

  const handleIdPaste = (e) => {
    let _value = e.target.value
    _value = _value.split('.').join('')
    props.handleChange({
      target: { value: _value, name: 'identificacion' }
    })
  }

  return (
    <Form>
      <FormGroup>
        {props.label
          ? (
            <Label>{t('estudiantes>expediente>info_gen>info_gen>tipo_id', 'Tipo de identificación')}</Label>
            )
          : (
            <RequiredLabel>{t('estudiantes>expediente>info_gen>info_gen>tipo_id', 'Tipo de identificación')}</RequiredLabel>
            )}
        <Select
          components={{ Input: CustomSelectInput }}
          className='react-select'
          classNamePrefix='react-select'
          options={props.selects.idTypes.map((item) => {
					  return { ...item, label: item.nombre, value: item.id }
          })}
          value={props.idType}
          placeholder=''
          isDisabled={
						!props.editable ||
						props.avoidSearch ||
						props.disableFields
					}
          onChange={(data) => {
					  setShowError(false)
					  props.clearErrors && props.clearErrors()

					  if (data.codigo == '04') {
					    setIdDisabled(true)
					    const notCostaRica = nationalitiesOptions.filter(
					      (item) => item.codigo !== '15'
					    )
					    setOrderedNationalitiesOptions(notCostaRica)
					    props.handleChange([{}, data], 'idType')
					  } else if (data.codigo == '01') {
					    setIdDisabled(false)
					    const _costaRica = nationalitiesOptions.filter(
					      (item) => item.codigo == '15'
					    )
					    setOrderedNationalitiesOptions(_costaRica)
					    props.handleChange([_costaRica[0], data], 'idType')
					  } else {
					    setIdDisabled(false)
					    const notCostaRica = nationalitiesOptions.filter(
					      (item) => item.codigo !== '15'
					    )
					    setOrderedNationalitiesOptions(notCostaRica)
					    props.handleChange([{}, data], 'idType')
					  }
          }}
        />
        <FormFeedbackSpan>
          {props.errors.tipoIdentificacionId ||
						props.errors.TipoIdentificacionId}
        </FormFeedbackSpan>
      </FormGroup>
      <FormGroup>
        {props.label
          ? (
            <Label>{t('estudiantes>expediente>info_gen>info_gen>nacionalidad', 'Nacionalidad')}</Label>
            )
          : (
            <RequiredLabel>{t('estudiantes>expediente>info_gen>info_gen>nacionalidad', 'Nacionalidad')}</RequiredLabel>
            )}
        <Select
          components={{
					  Input: CustomSelectInput
          }}
          className='react-select'
          classNamePrefix='react-select'
          options={orderedNationalitiesOptions}
          placeholder=''
          value={props.nacionalidad}
          isDisabled={
						!props.editable || disabledFields || props.avoidSearch
					}
          onChange={(nationality) => {
					  props.handleChange(nationality, 'nationalityId')
          }}
        />
        <FormFeedbackSpan>
          {props.errors.nacionalidadId || props.errors.NacionalidadId}
        </FormFeedbackSpan>
      </FormGroup>
      <FormGroup>
        {props.label
          ? (
            <Label>{t('estudiantes>expediente>info_gen>info_gen>num_id', 'Número de identificación')}</Label>
            )
          : (
            <RequiredLabel
              optional={props.idType && props.idType.codigo === '04'}
            >
              {t('estudiantes>expediente>info_gen>info_gen>num_id', 'Número de identificación')}
            </RequiredLabel>
            )}
        <InputContainer>
          <Input
            type='text'
            name='identificacion'
            value={props.identificacion}
            disabled={
							!props.editable ||
							idDisabled ||
							disabledFields ||
							props.avoidSearch
						}
            onPaste={handleIdPaste}
            onChange={handleId}
            invalid={props.errors.identificacion || showError}
          />
          {props.loading && (
            <Loader
              formLoader
              styles={{ width: '36px', height: '33px' }}
            />
          )}
        </InputContainer>
      </FormGroup>
      <SimpleModal
        openDialog={showError}
        onClose={closeModalNoEncontrado}
        onConfirm={() => {
				  closeModalNoEncontrado()
				  setRegistrarModal(true)
        }}
        txtBtn='Registrar'
        title='Persona no encontrada'
      >
        <>
          <p>
            {t('estudiantes>registro_matricula>matricula_estudian>buscar>persona_no_encontrada>texto', 'No se ha encontrado una persona con el número de identificación ingresado')}
          </p>
          <p>{t('estudiantes>registro_matricula>matricula_estudian>buscar>persona_no_encontrada>texto2', 'Puede registrarlo haciendo click en "Registrar"')}</p>
        </>
      </SimpleModal>
      <SimpleModal
        openDialog={registrarModal}
        onClose={() => closeRegistrarPersona()}
        actions={false}
        title='Registrar persona'
      >
        <>
          <WizardRegisterIdentityModal
            onConfirm={guardarNuevaPersona}
          />
          {loadingRegistrarModal && <Loader />}
        </>
      </SimpleModal>
    </Form>
  )
}

const InputContainer = styled.div`
	display: flex;
`

const FormFeedbackSpan = styled.span`
	color: red;
`

IdentificationInputs.propTypes = {
  findById: PropTypes.bool,
  idValue: PropTypes.string,
  nationalityValue: PropTypes.string,
  typeIdValue: PropTypes.string,
  avoidSearch: PropTypes.bool,
  selects: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  storeAction: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired
}
