import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import { Col, Row, Container } from 'reactstrap'
import AppLayout from 'Layout/AppLayout'
import directorItems from 'Constants/directorMenu'
import IdentidadWizard from './IdentidadWizard'
import { useForm } from 'react-hook-form'
import useNotification from 'Hooks/useNotification'
import styled from 'styled-components'
import { catalogsEnumObj } from 'Utils/catalogsEnum'

import {
  setIdentidadWizardPasos,
  setIdentidadWizard,
  setIdentidadWizardDatos,
  crearIdentidad
} from '../../../../redux/identidad/actions'

import { getCatalogs } from '../../../../redux/selects/actions'

import { map } from 'lodash'

const ContenedorPrincipal = (props) => {
  const [loading, setLoading] = useState(true)
  const [snackbarContent, setSnackbarContent] = useState({
    variant: 'error',
    msg: 'hubo un error'
  })
  const [snackbar, handleClick, handleClose] = useNotification()
  const [validationErrors, setValidationErrors] = useState({
    migracionStatus: false,
    lenguaMaterna: false,
    estadoCivil: false,
    longitud: false,
    latitud: false,
    longitudTemp: false,
    latitudTemp: false
  })

  const form = useForm()
  const {
    handleSubmit,
    register,
    setValue,
    getValues,
    errors,
    watch,
    setError,
    clearErrors,
    control
  } = form

  const [currentStep, setCurrentStep] = useState('step1')

  const state = useSelector((store) => {
    return {
      selects: store.selects,
      identidad: store.identidad
    }
  })

  const actions = useActions({
    setIdentidadWizardPasos,
    setIdentidadWizard,
    setIdentidadWizardDatos,
    getCatalogs,
    crearIdentidad
  })

  // Navegacion del wizar y validaciones
  const onClickNext = async (goToNext, steps, step) => {
    step.isDone = true
    if (steps.length - 1 <= steps.indexOf(step)) {
      return
    }

    const valid = await form.trigger()
    // Valores del formulario, del paso actual
    const formValues = form.getValues()

    if (valid) {
      if (step.id !== 'step4') {
        if (step.id == 'step2') {
          setValidationErrors({
            ...validationErrors,
            migracionStatus: isNaN(parseInt(formValues.migracionStatus.id)),
            lenguaMaterna: isNaN(parseInt(formValues.lenguaMaterna.id)),
            estadoCivil: isNaN(parseInt(formValues.estadoCivil.id))
          })
          if (
            isNaN(parseInt(formValues.migracionStatus.id)) ||
            isNaN(parseInt(formValues.lenguaMaterna.id)) ||
            isNaN(parseInt(formValues.estadoCivil.id))
          ) {
            setSnackbarContent({
              variant: 'error',
              msg: 'Debe completar los datos obligatorios para poder continuar'
            })
            handleClick()
            return
          }
        } else if (step.id == 'step3') {
          const isTemp = formValues.requiereInformacionTemp
          setValidationErrors({
            ...validationErrors,
            longitud: formValues.longitud == 'No seleccionado',
            latitud: formValues.latitud == 'No seleccionado',
            longitudTemp:
              isTemp && formValues.longitudTemp == 'No seleccionado',
            latitudTemp: isTemp && formValues.latitudTemp == 'No seleccionado'
          })

          if (
            formValues.longitud == 'No seleccionado' ||
            formValues.latitud == 'No seleccionado' ||
            (isTemp && formValues.longitudTemp == 'No seleccionado') ||
            (isTemp && formValues.latitudTemp == 'No seleccionado')
          ) {
            setSnackbarContent({
              variant: 'error',
              msg: 'Debe completar los datos obligatorios para poder continuar'
            })
            handleClick()
            return
          }
        }

        if (step.id != 'step3') {
          setCurrentStep('step' + (parseInt(step.id.slice(-1)) + 1))

          goToNext()
        }
      }
    } else {
      setSnackbarContent({
        variant: 'error',
        msg: 'Debe completar los datos obligatorios para poder continuar'
      })
      handleClick()
      return
    }
    switch (step.id) {
      case 'step1':
        const _dataId = {
          identificacion: formValues.identificacion,
          nombre: formValues.nombre,
          primerApellido: formValues.primerApellido,
          segundoApellido: formValues.segundoApellido,
          conocidoComo: formValues.conocidoComo,
          edad: formValues.edad,
          profilePic: formValues.profilePic
        }

        const datos = [
          {
            id: 0,
            elementoId: parseInt(formValues.idType),
            codigoCatalogo: catalogsEnumObj.IDENTIFICATION.id,
            catalogoId: catalogsEnumObj.IDENTIFICATION.id,
            nombreCatalogo: 'Tipo de Identificación'
          },
          {
            id: 0,
            elementoId: parseInt(formValues.nationality),
            codigoCatalogo: catalogsEnumObj.NATIONALITIES.id,
            catalogoId: catalogsEnumObj.NATIONALITIES.id,
            nombreCatalogo: 'Nacionalidad'
          },
          {
            id: 0,
            elementoId: parseInt(formValues.sexo),
            codigoCatalogo: catalogsEnumObj.SEXO.id,
            catalogoId: catalogsEnumObj.SEXO.id,
            nombreCatalogo: 'Sexo'
          },
          {
            id: 0,
            elementoId: parseInt(formValues.genero),
            codigoCatalogo: catalogsEnumObj.GENERO.id,
            catalogoId: catalogsEnumObj.GENERO.id,
            nombreCatalogo: 'Genero'
          }
        ]
        actions.setIdentidadWizard(_dataId)
        actions.setIdentidadWizardDatos(datos)

        break
      case 'step2':
        /// Actualizar estado para otros datos
        var _dataStep1 = {
          lesco: formValues.lesco,
          telefono: formValues.telefono,
          telefonoSecundario: formValues.telefonoSecundario,
          email: formValues.email,
          emailSecundario: formValues.emailSecundario
        }

        var _datosStep1 = [
          {
            id: 0,
            elementoId: parseInt(formValues.migracionStatus.id),
            codigoCatalogo: catalogsEnumObj.ESTATUSMIGRATORIO.id,
            catalogoId: catalogsEnumObj.ESTATUSMIGRATORIO.id,
            nombreCatalogo: 'Estatus Migratorio'
          },
          {
            id: 0,
            elementoId: parseInt(formValues.etnia.id),
            codigoCatalogo: catalogsEnumObj.ETNIAS.id,
            catalogoId: catalogsEnumObj.ETNIAS.id,
            nombreCatalogo: 'Grupo Etnico'
          },
          {
            id: 0,
            elementoId: parseInt(formValues.lenguaIndigena.id),
            codigoCatalogo: catalogsEnumObj.LENGUASINDIGENAS.id,
            catalogoId: catalogsEnumObj.LENGUASINDIGENAS.id,
            nombreCatalogo: 'Lengua Indigena'
          },
          {
            id: 0,
            elementoId: parseInt(formValues.lenguaMaterna.id),
            codigoCatalogo: catalogsEnumObj.LENGUAMATERNA.id,
            catalogoId: catalogsEnumObj.LENGUAMATERNA.id,
            nombreCatalogo: 'Lengua Materna'
          },
          {
            id: 0,
            elementoId: parseInt(formValues.estadoCivil.id),
            codigoCatalogo: catalogsEnumObj.ESTADOCIVIL.id,
            catalogoId: catalogsEnumObj.ESTADOCIVIL.id,
            nombreCatalogo: 'Estado Civil'
          }
        ]
        actions.setIdentidadWizardPasos(_dataStep1, 1)
        actions.setIdentidadWizardDatos(_datosStep1)
        break

      case 'step3':
        /// Actualizar estado para Informacion de Residencia
        const isTemp = formValues.requiereInformacionTemp
        const _datastep2 = []
        const _direcion = {
          direccionExacta: formValues.dirExacta,
          latitud: formValues.latitud,
          longitud: formValues.longitud,
          pobladoId: formValues.poblado.value,
          razon: '',
          temporal: false,
          territorioIndigenaId: formValues.indigena.id
        }
        _datastep2.push(_direcion)
        if (isTemp) {
          const _direcion = {
            direccionExacta: formValues.dirExactaTemp,
            latitud: formValues.latitudTemp,
            longitud: formValues.longitudTemp,
            pobladoId: formValues.pobladoTemp.value,
            razon: formValues.razon,
            temporal: true,
            territorioIndigenaId: formValues.indigenaTemp.id
          }
          _datastep2.push(_direcion)
        }
        await actions.setIdentidadWizardPasos(_datastep2, 2)
        onSave(_datastep2, goToNext, step)
        break

      default:
        break
    }
  }

  const onClickPrev = (goToPrev, steps, step) => {
    // Se limpian los errores al regresar
    form.clearErrors(['provincia', 'canton', 'distrito', 'poblado'])
    form.unregister(['provincia', 'canton', 'distrito', 'poblado'])

    if (steps.indexOf(step) <= 0) {
      return
    }
    setCurrentStep('step' + (parseInt(step.id.slice(-1)) - 1))
    goToPrev()
  }

  const topNavClick = (stepItem, push) => {
    push(stepItem.id)
  }

  const onSave = async (direcciones, goToNext, step) => {
    const response = await actions.crearIdentidad({
      ...state.identidad.data,
      direcciones,
      ElementosNoRequiridosIds: map(state.identidad.data.datos, 'elementoId')
    })

    if (response.data.error) {
      setSnackbarContent({
        variant: 'error',
        msg: 'Algo salio mal'
      })
    } else {
      setSnackbarContent({
        variant: 'success',
        msg: '¡Excelente!, Identidad creada con éxito'
      })

      setCurrentStep('step' + (parseInt(step.id.slice(-1)) + 1))

      goToNext()
    }
    handleClick()
  }

  return (
    <AppLayout items={directorItems}>
      <div className='dashboard-wrapper'>
        {snackbar(snackbarContent.variant, snackbarContent.msg)}
        <Container>
          <Row>
            <Col xs={12}>
              <br />
              <br />
              <br />
            </Col>
            <Col xs={12}>
              <IdentidadWizard
                {...props}
                state={state}
                loading={loading}
                watch={watch}
                register={register}
                setValue={setValue}
                getValues={getValues}
                control={control}
                data={state.identidad.data}
                errors={errors}
                setError={setError}
                onClickNext={onClickNext}
                onClickPrev={onClickPrev}
                topNavClick={topNavClick}
                currentStep={currentStep}
                validationErrors={validationErrors}
              />
            </Col>
          </Row>
        </Container>
      </div>
    </AppLayout>
  )
}

const CenteredRow = styled(Col)`
  display: flex;
  justify-content: center;
  align-items: center;
`

export default ContenedorPrincipal
