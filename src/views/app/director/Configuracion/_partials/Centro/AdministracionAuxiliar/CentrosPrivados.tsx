import React, { useState } from 'react'
import styled from 'styled-components'
import useNotification from '../../../../../../../hooks/useNotification'
import swal from 'sweetalert'
import { useActions } from '../../../../../../../hooks/useActions'
import { useSelector } from 'react-redux'
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

import CentroPrivado from '../../../../ExpedienteCentroEducativo/_partials/organizacionAuxiliar/CentroPrivado'
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

const CentrosPrivados: React.FC<IProps> = (props) => {
  const [data, setData] = React.useState({})
  const [editableOrganizacion, setEditableOrganizacion] =
		React.useState<boolean>(false)
  const [openCreateItem, setOpenCreateItem] = React.useState<boolean>(false)
  const [editableMiembro, setEditableMiembro] = React.useState<boolean>(true)
  const [loadingOrganization, setLoadingOrganization] =
		React.useState<boolean>(false)
  const [loadingMiembro, setLoadingMiembro] = React.useState<boolean>(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [snackBarContent, setSnackbarContent] =
		React.useState<SnackbarConfig>({
		  variant: '',
		  msg: ''
		})
  const [snackbar, handleClick] = useNotification()

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
    const loadData = async () => {
      await actions.getCatalogs(catalogsEnumObj.IDENTIFICATION.id)
      await actions.getCatalogs(catalogsEnumObj.PUESTOS.id)
    }
    loadData()
  }, [])
  React.useEffect(() => {
    actions.getCatalogsByCode(
      catalogsEnumObj?.ESTADOSORGANIZACIONAUXILIAR?.type
    )
  }, [])
  React.useEffect(() => {
    if (state.currentAuxOrganization) {
      setData(state.currentAuxOrganization)
    } else {
      setData({
        email: '',
        esPrivado: true,
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
    } else {
      response = await actions.createAuxOrganization(
        dataSend,
        state.currentInstitution.id,
        false
      )
    }

    if (response.error) {
      showsnackBar('error', response.message)
    } else {
      showsnackBar('success', 'Se actualizó correctamente')
      setEditableOrganizacion(false)
    }
    setLoadingOrganization(false)
  }

  const sendMemberData = async (dataSend: any) => {
    const { id, identidadId } = state.currentMember
    dataSend = {
      ...dataSend,
      id,
      identidadId,
      esPrivado: true,
      estadoMiembroId: dataSend.estadoMiembro.id
    }

    if (!identidadId) {
      swal({
        title: 'La Identidad no existe',
        text: 'Es necesario que crees la identidad de este miembro, para hacerlo haz click en Agregar!',
        icon: 'warning',
        buttons: {
          cancel: 'Cancelar',
          ok: {
            text: 'Agregar',
            value: true
          }
        }
      }).then((agregarIdentidad) => {
        if (agregarIdentidad) {
          // Mandar a agregar identidad
          setShowRegisterModal(true)
        }
      })
      return
    }

    setLoadingMiembro(true)

    let response: object
    if (dataSend.id) {
      response = await actions.updateMember(dataSend)
    } else {
      if (!state.currentAuxOrganization.id) {
        setSnackbarContent({
          variant: 'error',
          msg: 'Por favor, complete la información de la sección de centros educativos privados para poder agregar un representante legal'
        })
        handleClick()
        setLoadingMiembro(false)
        return
      }
      dataSend = {
        ...dataSend,
        organizacionAuxiliarId: state.currentAuxOrganization.id
      }
      response = await actions.createMember(dataSend)
    }

    if (response.error) {
      showsnackBar('error', response.message)
    } else {
      showsnackBar(
        'success',
        dataSend.id
          ? 'Se actualizó correctamente'
          : 'Se ha creado correctamente'
      )
      toggleAddNewModal()
      setEditableMiembro(false)
    }

    setLoadingMiembro(false)
  }

  const cambiarEstadoMiembro = async (ids, accion, esprivado) => {
    swal({
      title: 'Deshabilitar/Habilitar',
      text: '¿Está seguro de habilitar/deshabilitar a este Representante Legal?',
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
        await actions.activarInactivarMiembro(ids, element?.id, true)
        await actions.getAuxOrganizationByInstitution(
          state.currentInstitution.id,
          true
        )
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
      <CentroPrivado
        {...props}
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
        setEditableOrganizacion={setEditableOrganizacion}
        setEditableMiembro={setEditableMiembro}
        editableOrganizacion={editableOrganizacion}
        editableMiembro={editableMiembro}
        onlyView={false}
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
	background: transparent;
`

export default CentrosPrivados
