import React from 'react'
import { useWindowSize } from 'react-use'
import Table from '../../../../../components/table/paginacion'
import { useSelector } from 'react-redux'

const columns = [
  { column: 'nombre', label: 'Nombre Completo' },
  { column: 'tipoIdentificacion', label: 'Tipo de idenficación' },
  { column: 'identificacion', label: 'Número de idenficación' },
  { column: 'nacionalidad', label: 'Nacionalidad', isBadge: true },
  { column: 'periodo', label: 'Enviada' }
]

interface InvitacionesTableProps {
    data: any,
    loading: boolean,
    handlePagination: Function,
    handleSearch: Function,
    handleDeleteInvitation: Function,
    handleDeleteMultipleInvitations: Function,
    handleViewInvitation: Function,
    handleResendInvitation: Function,
    handleResendMultipleInvitation: Function,
    handleCreateInvitationToggle: Function,
    handleModal: Function,
    totalRegistros: number,
    layout: string
};

type IState = {
    selects: any
}

const InvitacionesTable = (props: InvitacionesTableProps) => {
  const { data, loading, handlePagination, handleSearch, totalRegistros, handleModal, layout } = props
  const [invitations, setInvitations] = React.useState<Array<any>>([])
  const { idTypes, nationalities } = useSelector((state: IState) => state.selects)

  const { width } = useWindowSize()

  React.useEffect(() => {
    updateData()
  }, [data])

  const updateData = () => {
    const invitaciones = []
    data.elementos.map((item, i) => {
      invitaciones.push({
        ...item,
        id: item.invitacionId,
        tipoIdentificacion: idTypes.find((identification: any) => identification.id == item.tipoIdentificacionId).nombre,
        nacionalidad: nationalities.find((nacion: any) => nacion.id == item.nacionalidadId).nombre,
        periodo: 'Enviada'
      })
    })
    setInvitations(invitaciones)
  }

  const actions = [
    {
      actionName: 'button.remove',
      actionFunction: (ids: string[]) => { props.handleDeleteMultipleInvitations(ids) }
    },
    {
      actionName: 'Reenviar',
      actionFunction: (ids: string[]) => {
        const emails = []
        invitations.map((item: any, index: number) => {
          if (item.id == ids[index]) {
            emails.push(item.email)
          }
        })
        props.handleResendMultipleInvitation(emails)
      }
    }
  ]

  const actionRow = [
    {
      actionName: 'Eliminar',
      actionFunction: (item) => { props.handleDeleteInvitation(item.id) },
      actionDisplay: () => true
    },
    {
      actionName: 'Visualizar',
      actionFunction: (item) => { props.handleViewInvitation(item) },
      actionDisplay: () => true
    },
    {
      actionName: 'Reenviar',
      actionFunction: (item) => { props.handleResendInvitation(item.email) },
      actionDisplay: () => true
    }
  ]

  return (
    <Table
      layout={layout}
      columns={columns}
      selectDisplayMode='thumblist'
      data={invitations}
      actions={actions}
      isBreadcrumb={false}
      actionRow={actionRow}
            // match={props.match}
      tableName='label.users'
      toggleEditModal={() => {
        props.handleCreateInvitationToggle()
      }}
      toggleModal={handleModal}
      modalOpen={false}
      selectedOrderOption={{ column: 'detalle', label: 'Nombre Completo' }}
      showHeaders={false}
      showHeadersCenter={width > 800}
      editModalOpen={false}
      modalfooter
      loading={loading}
      orderBy={false}
      totalRegistro={totalRegistros}
      labelSearch='Buscador'
      handlePagination={handlePagination}
      handleSearch={handleSearch}
      customThumbList={width > 800}
      handleCardClick={(_: any) => null}
    />
  )
}

export default InvitacionesTable
