import React, { useState } from 'react'
import styled from 'styled-components'
import colors from '../../../../../../assets/js/colors'

import CreateForm from './CreateGrup'
import HTMLTable from 'Components/HTMLTable'
import ConfirmModal from 'Components/Modal/ConfirmModal'
import useNotification from 'Hooks/useNotification'

const columns = [
  { column: 'grupo', label: 'Nombre' },
  { column: 'especialidadNombre', label: 'Especialidad' },
  { column: 'limiteEstudiantes', label: 'Proyección matrícula' },
  // { column: 'reservados', label: 'Reservados' },
  { column: 'estudiantesMatriculados', label: 'Matriculados' }
]

export const GruposNivel = (props) => {
  const [create, setCreate] = React.useState<boolean>(false)
  const [openMsgConfirm, setOpenMsgConfirm] = React.useState<boolean>(false)

  const [currentItem, setCurrentItem] = React.useState<object>({})
  const [loading, setLoading] = React.useState<boolean>(false)
  const [snackbar, handleClick] = useNotification()
  const [snackbarContent, setSnackbarContent] = useState({
    msg: '',
    variant: ''
  })

  const showSnackbar = (msg, variant) => {
    setSnackbarContent({ msg, variant })
    handleClick()
  }

  const actionRow = [
    {
      actionName: 'button.edit',
      actionFunction: (item: any) => {
        setCurrentItem(item)
        setCreate(!create)
      },
      actionDisplay: () => true
    },
    {
      actionName: 'Eliminar',
      actionFunction: (item: any) => {
        setCurrentItem(item)
        setOpenMsgConfirm(true)
      },
      actionDisplay: (item) =>
        item.estado && item.estudiantesMatriculados === 0
    }
  ]
  const handleSearch = () => {}

  const sendGroupData = async (data) => {
    setLoading(true)
    const _data = {
      id: currentItem.grupoId,
      nombre: data.nombre,
      limiteEstudiantes: data.limiteEstudiante,
      nivelOfertaId: props.currentLevel.nivelOfertaId,
      reservados: data.reservados,
      estado: data.estado,
      url: data.imagen
    }
    let response
    if (currentItem.grupoId) {
      response = await props.editGroup(
        _data,
        props.institution.id,
        props.currentLevel.nivelId,
        props.currentYear.id
      )
      if (response.error) {
        showSnackbar('Ha ocurrido un error al editar el grupo', 'error')
      } else {
        showSnackbar('El grupo ha sido editado con éxito', 'success')
      }
    } else {
      response = await props.createGroup(
        _data,
        props.institution.id,
        props.currentLevel.nivelId
      )

      if (response.error) {
        showSnackbar('Ha ocurrido un error al crear el grupo', 'error')
      } else {
        showSnackbar('El grupo ha sido creado con éxito', 'success')
      }
    }
    await props.getGroupsByLevelAnio(
      props.currentLevel.nivelId,
      props.institution.id,
      props.currentYear.id,
      props.currentLevel.especialidadId
    )

    if (!response.error) {
      setCurrentItem({})
      setCreate(!create)
    }

    setLoading(false)
  }

  const deleteGroup = async () => {
    await props.deleteGroup(
      currentItem.grupoId,
      props.institution.id,
      props.currentLevel.nivelId,
      props.currentYear.id
    )
    await props.getGroupsByLevelAnio(
      props.currentLevel.nivelId,
      props.institution.id,
      props.currentYear.id,
      props.currentLevel.especialidadId
    )

    setOpenMsgConfirm(false)
  }

  return (
    <Wrapper>
      <ConfirmModal
        openDialog={openMsgConfirm}
        onClose={() => setOpenMsgConfirm(false)}
        onConfirm={() => deleteGroup()}
        msg='Está seguro que desea eliminar el grupo?'
        title='Eliminar Grupo'
      />
      {snackbar(snackbarContent.variant, snackbarContent.msg)}
      {create
        ? (
          <CreateForm
            handleBack={() => {
					  setCreate(!create)
					  setCurrentItem({})
            }}
            sendItemsData={sendGroupData}
            currentItem={currentItem}
            loading={loading}
          />
          )
        : (
          <>
            <Bluebox>
              <label style={{ fontSize: '18px' }}>
                Año educativo: {props.currentYear.nombre}
              </label>
              <label style={{ fontSize: '12px' }}>
                {props.currentOfferName}
              </label>
              <label>{props.data.nivel}</label>
              <label style={{ fontSize: '12px' }}>
                {props.currentEspecialidadNombre}
              </label>
            </Bluebox>
            <FeeadBack>
              <FeedBackTitle>
                Configurar los grupos por nivel
              </FeedBackTitle>
            </FeeadBack>
            <SectionTable>
              <HTMLTable
                columns={columns}
                data={props.groups}
                isBreadcrumb={false}
                actionRow={actionRow}
                toggleEditModal={(el) => {
							  setCurrentItem(el)
							  setCreate(!create)
                }}
                toggleModal={() => setCreate(!create)}
                modalOpen={false}
                selectedOrderOption={{
							  column: 'detalle',
							  label: 'Nombre Completo'
                }}
                showHeaders
                editModalOpen={false}
                modalfooter
                orderBy={false}
                loading={props.loading}
                totalRegistro={0}
                labelSearch=''
                handlePagination={() => null}
                handleSearch={handleSearch}
                handleCardClick={(_: any) => null}
                hideMultipleOptions
                readOnly={false}
                disableSearch
              />
            </SectionTable>
          </>
          )}
    </Wrapper>
  )
}

const Bluebox = styled.div`
	display: flex;
	flex-direction: column;
	padding: 20px;
	background: ${props => props.theme.primary};
	color: white;
	max-width: 40%;
	border-radius: 20px;
`

const Wrapper = styled.div``

const FeeadBack = styled.div`
	margin-top: 20px;
`

const FeedBackTitle = styled.h4`
	color: #000;
`
const SectionTable = styled.div`
	margin-top: 10px;
`

export default GruposNivel
