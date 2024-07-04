import React, { useState, useEffect } from 'react'
import CentroPrivado from './_partials/organizacionAuxiliar/CentroPrivado'
import JuntaEducation from './_partials/organizacionAuxiliar/JuntaEducation'
import { useSelector } from 'react-redux'
import { GetInstitucion, getMemberData } from 'Redux/institucion/actions'
import { useActions } from 'Hooks/useActions'
import { getCatalogs, getCatalogsByCode } from 'Redux/selects/actions'
import { catalogsEnumObj } from '../../../../utils/catalogsEnum'
import swal from 'sweetalert'

import {
  createMember,
  updateMember,
  setMember,
  getAuxOrganizationByInstitution,
  updateAuxOrganization,
  createAuxOrganization,
  setMemberData,
  activarInactivarMiembro
} from '../../../../redux/institucion/actions'

import useNotification from 'Hooks/useNotification'
import { Helmet } from 'react-helmet'
import WizardRegisterIdentityModal from 'Views/app/configuracion/Identidad/_partials/wizardRegisterIdentityModal'
import SimpleModal from 'Components/Modal/simple'

import { useTranslation } from 'react-i18next'

const OrganizacionAuxiliar = (props) => {
  const { t } = useTranslation()
  const [data, setData] = useState({})
  const [loadingOrganization, setLoadingOrganization] = useState(false)
  const [loadingMiembro, setLoadingMiembro] = useState(false)
  const [snackbarMsg, setSnackbarMsg] = useState(
    'Ha ocurrido un error al intentar realizar esta operación'
  )
  const [snackbarVariant, setSnackbarVariant] = useState('error')
  const [sanackBar, handleClick] = useNotification()
  const [incluyeInactivos, setIncluyeInactivos] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  const [editableOrganizacion, setEditableOrganizacion] = useState(false)
  const [editableMiembro, setEditableMiembro] = useState(true)
  const [backupData, setBackupData] = useState(null)
  const [triggerData, setTriggerData] = useState(false)
  const currentMember = useSelector(
    (store) => store.institucion.currentMember
  )

  const state = useSelector((store) => {
    return {
      currentInstitution: store.authUser.currentInstitution,
      institutionWithAditionalData: store.institucion.currentInstitution,
      currentMember: store.institucion.currentMember,
      currentAuxOrganization: store.institucion.currentAuxOrganization,
      members: store.institucion.members,
      selects: store.selects
    }
  })

  const [openCreateItem, setOpenCreateItem] = useState(false)

  const toggleAddNewModal = (editable = true) => {
    setOpenCreateItem(!openCreateItem)
    setEditableMiembro(editable)
  }

  const actions = useActions({
    GetInstitucion,
    getCatalogs,
    createMember,
    updateMember,
    setMember,
    getAuxOrganizationByInstitution,
    createAuxOrganization,
    updateAuxOrganization,
    activarInactivarMiembro,
    getMemberData,
    setMemberData,
    getCatalogsByCode
  })

  useEffect(() => {
    if (triggerData && currentMember?.identidadId) {
      sendMemberData({
        ...backupData,
        identidadId: currentMember?.identidadId,
        identificacion: currentMember?.identificacion,
        nombre: currentMember?.nombre,
        primerApellido: currentMember?.primerApellido,
        segundoApellido: currentMember?.segundoApellido
      })
    }
  }, [triggerData, currentMember])

  useEffect(() => {
    const loadData = async () => {
      await actions.getCatalogs(catalogsEnumObj.IDENTIFICATION.id)
      await actions.getCatalogs(catalogsEnumObj.PUESTOS.id)
    }
    loadData()
  }, [])
  useEffect(() => {
    actions.getCatalogsByCode(
      catalogsEnumObj?.ESTADOSORGANIZACIONAUXILIAR?.type
    )
  }, [])
  useEffect(() => {
    if (state.currentAuxOrganization) {
      setData(state.currentAuxOrganization)
    } else {
      setData({
        email: '',
        esPrivado: state.currentInstitution.esPrivado,
        id: null,
        institucionId: null,
        miembros: [],
        personeriaJuridica: '',
        razonSocial: '',
        telefono: ''
      })
    }
  }, [state.currentAuxOrganization, editableOrganizacion])

  const sendData = async (dataSend) => {
    setLoadingOrganization(true)
    const { id } = data
    dataSend = {
      ...dataSend,
      id
    }
    let response: object
    if (dataSend.id) {
      response = await actions.updateAuxOrganization(dataSend)
    } else {
      response = await actions.createAuxOrganization(dataSend)
    }

    if (response.error) {
      setSnackbarVariant('error')
      setSnackbarMsg(response.message)
    } else {
      setSnackbarVariant('success')
      setSnackbarMsg('Se actualizó correctamente')
      setEditableOrganizacion()
    }
    handleClick()
    setLoadingOrganization(false)
    setBackupData(null)
  }

  const sendMemberData = async (dataSend) => {
    const { id, identidadId } = state.currentMember

    dataSend = {
      ...dataSend,
      id,
      identidadId,
      tipoIdentificacionId: dataSend.tipoIdentificacionId?.id,
      nacionalidadId: dataSend.nacionalidadId?.id,
      puestoId: dataSend.puestoId?.id,
      esPrivado: state.currentInstitution.esPrivado,
      estadoMiembro: dataSend.estadoMiembro?.nombre,
      estadoMiembroId: dataSend.estadoMiembro?.id
    }

    setLoadingMiembro(true)

    let response: object
    if (dataSend.id) {
      response = await actions.updateMember({
        ...dataSend,
        organizacionAuxiliarId: state.currentAuxOrganization.id
      })
    } else {
      dataSend = {
        ...dataSend,
        organizacionAuxiliarId: state.currentAuxOrganization.id
      }
      response = await actions.createMember(dataSend)
    }
    if (response.error) {
      setSnackbarVariant('error')
      setSnackbarMsg(response.message || 'Ha ocurrido un error')
    } else {
      setSnackbarVariant('success')
      setSnackbarMsg('Se actualizó correctamente')
      toggleAddNewModal()
      setEditableMiembro(false)
    }

    handleClick()
    setLoadingMiembro(false)
    setBackupData(null)
    setTriggerData(false)
    setShowRegisterModal(false)
  }

  const cambiarEstadoMiembro = async (ids, accion) => {
    const element = state.selects[
      catalogsEnumObj.ESTADOSORGANIZACIONAUXILIAR.name
    ]?.find((el) => el?.nombre === accion)
    const response = await actions.activarInactivarMiembro(ids, element?.id)

    setData({
      ...data,
      miembros: state.members?.map((item) => {
        if (ids.includes(item.id)) {
          item.miembroActivo = element?.nombre
          item.estadoMiembro = element?.nombre

          return item
        }

        return item
      })
    })
  }

  const handleDataChange = (e) => {
    const { name, value } = e.target

    setData({ ...data, [name]: value })
  }

  useEffect(() => {
    const loadData = async () => {
      await actions.GetInstitucion(state.currentInstitution.id)
      await actions.getAuxOrganizationByInstitution(
        state.currentInstitution.id,
        true
      )
    }
    loadData()
  }, [state.currentInstitution.id])

  useEffect(() => {
    const loadData = async () => {
      await actions.getAuxOrganizationByInstitution(
        state.currentInstitution.id,
        true
      )
    }
    loadData()
  }, [incluyeInactivos])

  return (
    <>
      <Helmet>
        <title>Organización auxiliar</title>
      </Helmet>
      <h4>
        {!state.currentInstitution.esPrivado
				  ? t('expediente_ce>nav>organizacion_auxiliar', 'Organización auxiliar')
				  : t('expediente_ce>nav>info_auxiliar', 'Información auxiliar')}
      </h4>

      {sanackBar(snackbarVariant, snackbarMsg)}
      <br />
      {!state.currentInstitution.esPrivado
        ? (
          <JuntaEducation
            {...props}
            onlyView
            handleDataChange={handleDataChange}
            data={data}
            members={state.members}
            sendData={sendData}
            activarInactivarMiembro={cambiarEstadoMiembro}
            setMember={actions.setMember}
            sendMemberData={sendMemberData}
            openCreateItem={openCreateItem}
            toggleAddNewModal={toggleAddNewModal}
            loadingOrganization={loadingOrganization}
            loadingMiembro={loadingMiembro}
            incluyeInactivos={incluyeInactivos}
            setIncluyeInactivos={(checked) => {
					  setIncluyeInactivos(checked)
            }}
            setEditable={setEditableMiembro}
            setEditableMiembro={(value) => {
					  setOpenCreateItem(value)
					  setEditableMiembro(value)
            }}
          />
          )
        : (
          <CentroPrivado
            {...props}
            onlyView
            handleDataChange={handleDataChange}
            data={data}
            members={state.members}
            sendData={sendData}
            activarInactivarMiembro={cambiarEstadoMiembro}
            setMember={actions.setMember}
            sendMemberData={sendMemberData}
            openCreateItem={openCreateItem}
            toggleAddNewModal={toggleAddNewModal}
            loadingOrganization={loadingOrganization}
            loadingMiembro={loadingMiembro}
            incluyeInactivos={incluyeInactivos}
            setIncluyeInactivos={(checked) => {
					  setIncluyeInactivos(checked)
            }}
            setEditableMiembro={(value) => {
					  setOpenCreateItem(value)
					  setEditableMiembro(value)
            }}
          />
          )}
    </>
  )
}

export default OrganizacionAuxiliar
