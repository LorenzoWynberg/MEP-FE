import React from 'react'
import { ModalBody, Modal } from 'reactstrap'
import styled from 'styled-components'
import { useActions } from '../../../../../../hooks/useActions'
import { getAllUsuarioCatalogosByRolId } from '../../../../../../redux/UsuarioCatalogos/actions'
import { buscarDirectores } from '../../../../../../redux/configuracion/actions'
import colors from '../../../../../../assets/js/colors'
import HTMLTable from 'Components/HTMLTable'
import { maxLengthString } from '../../../../../../utils/maxLengthString'
import useModalUsuario from './useModalUsuario'
import { useTranslation } from 'react-i18next'

export enum TIPO_USUARIO {
	SUPERVISOR_CIRCUITAL = 5,
	DIRECTOR_REGIONAL = 6,
	ADMIN = 1,
	DIRECTOR = 2
}

type ModalProps = {
	visible: boolean
	title?: string
	usuarios: Array<any>
	handleSelection: any
	handleCancel: any
	tipoUsuario: TIPO_USUARIO
}

const ModalUsuarios: React.FC<ModalProps> = (props) => {
  const { t } = useTranslation()
  const actions = useActions({
    buscarDirectores,
    getAllUsuarioCatalogosByRolId
  })
  const [data, setData] = React.useState<Array<any>>([])
  const { loading, RealizarBusquedaPaginada, listadoUsuarios } =
		useModalUsuario()
  const [paginationData, setPaginationData] = React.useState({
    pagina: 1,
    cantidad: 5
  })
  const state = {
    loading,
    usuarios: listadoUsuarios
  }
  const columns = [
    { column: 'identificacion', label: t('selec_director>id', 'Identificación') },
    { column: 'nombreUsuario', label: t('selec_director>user', 'Usuario') },
    { column: 'fullName', label: t('selec_director>nombre', 'Nombre') },
    { column: 'email', label: t('selec_director>correo', 'Correo electrónico') }
  ]

  React.useEffect(() => {
    RealizarBusquedaPaginada(props.tipoUsuario)
  }, [])

  React.useEffect(() => {
    setData(
      state.usuarios?.map((item: any) => {
        return {
          ...item,
          id: item.usuarioId,
          fullName: maxLengthString(item.nombreCompleto, 15)
        }
      }) || []
    )
  }, [state.usuarios])

  const actionRow = [
    {
      actionName: t('general>seleccionar', 'Seleccionar'),
      actionFunction: (item) => {
        props.handleSelection(item)
      },
      actionDisplay: () => true
    }
  ]

  const handleSearch = async (
    filterText: string,
    selectedColumn: string,
    cantidadPagina: number,
    pagina: number
  ) => {
    setPaginationData({ pagina, cantidad: cantidadPagina })
    RealizarBusquedaPaginada(
      props.tipoUsuario,
      pagina,
      cantidadPagina,
      filterText
    )
  }

  const handlePagination = async (pagina: number, cantidadPagina: number) => {
    setPaginationData({ pagina, cantidad: cantidadPagina })
    RealizarBusquedaPaginada(props.tipoUsuario, pagina, cantidadPagina)
  }

  return (
    <CustomModal
      isOpen={props.visible}
      centered
      size='lg'
      backdrop
    >
      <StyledModalBody>
        <Title>
          {props.title ? props.title : t('selec_director>titulo', 'Seleccionar Director')}
        </Title>
        <HTMLTable
          columns={columns}
          selectDisplayMode='thumblist'
          data={data}
          isBreadcrumb={false}
          actionRow={actionRow}
          tableName='label.users'
          toggleModal={() => null}
          modalOpen={false}
          selectedOrderOption={{
					  column: 'detalle',
					  label: 'Nombre Completo'
          }}
          showHeaders
          editModalOpen={false}
          modalfooter
          loading={state.loading}
          orderBy={false}
          totalRegistro={state.usuarios?.totalCount}
          toggleEditModal={(el) => {
					  props.handleSelection(el)
          }}
          rollBackLabel={t('selec_director>no_found', 'El director que busca no cuenta con usuario')}
          labelSearch=''
          handlePagination={handlePagination}
          handleSearch={handleSearch}
          backendPaginated
          handleResource={false}
          handleCardClick={(item) => null}
          hideMultipleOptions
          readOnly
          esBuscador={false}
        />
        <Cancel onClick={props.handleCancel}>{t('general>cancelar', 'Cancelar')}</Cancel>
      </StyledModalBody>
    </CustomModal>
  )
}

const CustomModal = styled(Modal)`
	box-shadow: none;

	.search-sm:before {
		cursor: initial;
	}

	& .modal-content {
		border-radius: 10px;
	}
`

const StyledModalBody = styled(ModalBody)`
	padding: 20px 30px !important;
	border-radius: 5px !important;
`

const Title = styled.h4`
	text-align: left;
	font-weight: bold;
	margin-top: 10px;
	margin-bottom: 20px;
`

const Cancel = styled.button`
	background: transparent;
	border: 1px ${colors.secondary} solid;
	color: ${colors.secondary};
	min-height: 43px;
	padding: 0 20px;
	border-radius: 25px;
	cursor: pointer;
`

export default ModalUsuarios
