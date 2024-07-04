import React, { useState } from 'react'
import styled from 'styled-components'
import { useActions } from '../../../../../../../hooks/useActions'
import { useSelector } from 'react-redux'
import useNotification from '../../../../../../../hooks/useNotification'
import swal from 'sweetalert'

import {
  createMember,
  updateMember,
  setMember,
  getAuxOrganizationByInstitution,
  updateAuxOrganization,
  createAuxOrganization,
  activarInactivarMiembro
  , GetInstitucion
} from '../../../../../../../redux/institucion/actions'

import { getCatalogs } from '../../../../../../../redux/selects/actions'

import { catalogsEnumObj } from '../../../../../../../utils/catalogsEnum'

import JuntaEducation from '../../../../ExpedienteCentroEducativo/_partials/organizacionAuxiliar/JuntaEducation'
import WizardRegisterIdentityModal from 'Views/app/configuracion/Identidad/_partials/wizardRegisterIdentityModal'
import SimpleModal from 'Components/Modal/simple'
import { getCatalogsByCode } from 'Redux/selects/actions'

type IProps = {
	handleAllDelete: any
	handleDelete: any
	handleView: any
	match: any
}

type SnackbarConfig = {
	variant: string
	msg: string
}

const JuntasEducacion: React.FC<IProps> = (props) => {
  const [data, setData] = React.useState({})
  const [editableOrganizacion, setEditableOrganizacion] =
		React.useState<boolean>(false)
  const [openCreateItem, setOpenCreateItem] = React.useState<boolean>(false)
  const [editableMiembro, setEditableMiembro] = React.useState<boolean>(true)
  const [loadingOrganization, setLoadingOrganization] =
		React.useState<boolean>(false)
  const [loadingMiembro, setLoadingMiembro] = React.useState<boolean>(false)
  const [snackBarContent, setSnackbarContent] =
		React.useState<SnackbarConfig>({ variant: '', msg: '' })
  const [snackbar, handleClick] = useNotification()
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  const state = useSelector((store) => {
    return {
      currentInstitution: store.configuracion.currentInstitution,
      institutionWithAditionalData: store.institucion.currentInstitution,
      currentMember: store.institucion.currentMember,
      currentAuxOrganization: store.institucion.currentAuxOrganization,
      members: store.institucion.members,
      selects: store.selects
    }
  })

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
    getCatalogsByCode
  })

  React.useEffect(() => {
    actions.getCatalogsByCode(
      catalogsEnumObj?.ESTADOSORGANIZACIONAUXILIAR?.type
    )
  }, [])
  React.useEffect(() => {
    const loadData = async () => {
      await actions.getCatalogs(catalogsEnumObj.IDENTIFICATION.id)
      await actions.getCatalogs(catalogsEnumObj.PUESTOS.id)
    }
    loadData()
  }, [])

  React.useEffect(() => {
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

  React.useEffect(() => {
    const loadData = async () => {
      await actions.GetInstitucion(state.currentInstitution.id)
      await actions.getAuxOrganizationByInstitution(
        state.currentInstitution.id,
        true
      )
    }
    loadData()
  }, [state.currentInstitution.id])

  const showsnackBar = (variant, msg) => {
    setSnackbarContent({ variant, msg })
    handleClick()
  }

  const handleDataChange = (e) => {
    const { name, value } = e.target
    setData({ ...data, [name]: value })
  }

  const sendData = async (dataSend: any) => {
    setLoadingOrganization(true)

    const { id } = data
    dataSend = { ...dataSend, id }
    let response: object
    if (dataSend.id) {
      response = await actions.updateAuxOrganization(dataSend, false)
      if (response.error) {
        showsnackBar('error', 'El teléfono oficial es inválido')
        setLoadingOrganization(false)
        return
      }
    } else {
      response = await actions.createAuxOrganization(
        dataSend,
        state.currentInstitution.id,
        false
      )
    }
    console.log(response, 'RESPONSE')
    if (response.error) {
      showsnackBar('error', response?.errors?.Telefono)
    } else {
      showsnackBar('success', 'Se actualizó correctamente')
      setEditableOrganizacion(false)
    }
    handleClick()
    setLoadingOrganization(false)
  }

  const sendMemberData = async (dataSend: any) => {
    const { id, identidadId } = state.currentMember
    const body = {
      ...dataSend,
      id,
      puestoId: dataSend.puestoId?.id,
      estadoMiembroId: dataSend.estadoMiembro?.id,
      IdentidadId: identidadId,
      esPrivado: false
    }

    setLoadingMiembro(true)

    let response: object
    if (body.id) {
      response = await actions.updateMember({
        id,
        identidadId,
        // "organizacionAuxiliarId": dataSend?.organizacionAuxiliarId,
        puestoId: dataSend.puestoId?.id,
        estadoMiembroId: dataSend.estadoMiembro?.id,
        rige: dataSend?.rige,
        vence: dataSend?.vence,
        esPrivado: dataSend?.esPrivado
      })
    } else {
      body.organizacionAuxiliarId = state.currentAuxOrganization.id
      if (!state.currentAuxOrganization.id) {
        setSnackbarContent({
          variant: 'error',
          msg: 'Por favor, complete la información de la sección Juntas de educación para poder ingresar un miembro de la junta'
        })
        handleClick()
        setLoadingMiembro(false)
        return
      }

      response = await actions.createMember(body)
    }
    if (response?.errors?.identificacion) {
      showsnackBar('error', response?.errors?.identificacio[0])
    } else if (response.error) {
      showsnackBar('error', response.message)
    } else {
      showsnackBar(
        'success',
        id ? 'Se actualizó correctamente' : 'Se ha creado correctamente'
      )
      toggleAddNewModal()
      setEditableMiembro(false)
    }

    setLoadingMiembro(false)
  }

  const cambiarEstadoMiembro = async (ids, accion, esprivado) => {
    swal({
      title: 'Deshabilitar/Habilitar',
      text: '¿Está seguro de habilitar/deshabilitar a este Miembro de la Junta?',
      icon: 'warning',
      className: 'text-alert-modal',
      buttons: {
        cancel: 'Cancelar',
        ok: {
          text: 'Aceptar',
          value: true
        }
      }
    }).then(async (res) => {
      if (res) {
        const selects =
					state.selects[
					  catalogsEnumObj.ESTADOSORGANIZACIONAUXILIAR.name
					]
        const element = selects?.find((el) => el?.nombre === accion)
        const response = await actions.activarInactivarMiembro(
          ids,
          element?.id,
          esprivado
        )
        await actions.getAuxOrganizationByInstitution(
          state.currentInstitution.id,
          true
        )
        if (response.error) {
          showsnackBar('error', response.errors.Ids[0])
        }
      }
    })
  }

  const toggleAddNewModal = (editable = true) => {
    setOpenCreateItem(!openCreateItem)
    setEditableMiembro(editable)
  }

  return (
    <Wrapper>
      {snackbar(snackBarContent.variant, snackBarContent.msg)}
      <SimpleModal
        openDialog={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onConfirm={() => {}}
        actions={false}
        title='Registrar persona'
        stylesContent={{
				  minWidth: '30rem'
        }}
      >
        <WizardRegisterIdentityModal
          onConfirm={(dataIdentidad) => {
					  sendData(dataIdentidad)
          }}
        />
      </SimpleModal>
      <SectionJunta>
        <JuntaEducation
          {...props}
          handleDataChange={handleDataChange}
          data={data}
          members={state.members}
          setMemberData={props.setMemberData}
          sendData={sendData}
          activarInactivarMiembro={cambiarEstadoMiembro}
          setMember={actions.setMember}
          sendMemberData={sendMemberData}
          openCreateItem={openCreateItem}
          toggleAddNewModal={toggleAddNewModal}
          loadingOrganization={loadingOrganization}
          loadingMiembro={loadingMiembro}
          setEditableOrganizacion={setEditableOrganizacion}
          editableOrganizacion={editableOrganizacion}
          editableMiembro={editableMiembro}
          buscador
          configuracion
          setEditableMiembro={(value) => {
					  setOpenCreateItem(value)
					  setEditableMiembro(value)
          }}
          onlyView={false}
        />
      </SectionJunta>
    </Wrapper>
  )
}

const Wrapper = styled.div`
	background: transparent;
`

const SectionJunta = styled.div`
	margin-top: 10px;
`

export default JuntasEducacion
