
import React, { useMemo } from 'react'
import { ModalBody, Modal, Button, InputGroupAddon } from 'reactstrap'
import styled from 'styled-components'
import { useActions } from '../../../../../../hooks/useActions'
import { getAllUsuarioCatalogosByRolId } from '../../../../../../redux/UsuarioCatalogos/actions'
import { buscarDirectores } from '../../../../../../redux/configuracion/actions'
import HTMLTable from 'Components/HTMLTable'
import { maxLengthString } from '../../../../../../utils/maxLengthString'
import useModalUsuario from './useModalUsuario'
import { useTranslation } from 'react-i18next'
import { TableReactImplementation } from 'Components/TableReactImplementation'

import TouchAppIcon from '@material-ui/icons/TouchApp'
import colors from 'Assets/js/colors'
import Tooltip from '@mui/material/Tooltip'

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
	handleInputSearch: () => void
	setSearch
	search: string
}

const ModalUsuarios: React.FC<ModalProps> = (props) => {
  const { t } = useTranslation()
  const actions = useActions({
    buscarDirectores,
    getAllUsuarioCatalogosByRolId
  })

  const { handleInputSearch, setSearch, search, handleSelection } = props
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
  const columns = useMemo(() => [
    {
      column: 'identificacion',
      label: t('selec_director>id', 'Identificación'),
      accessor: 'identificacion',
      Header: t('selec_director>id', 'Identificación')
    },
    {
      column: 'nombreUsuario',
      label: t('selec_director>user', 'Usuario'),
      accessor: 'nombreUsuario',
      Header: t('selec_director>user', 'Usuario')
    },
    {
      column: 'nombre',
      label: t('selec_director>nombre', 'Nombre'),
      accessor: 'nombre',
      Header: t('selec_director>nombre', 'Nombre'),
      Cell: ({ row }) => (
        <>
          {`${row.original?.nombre} ${row.original?.apellido} ${row.original?.segundoApellido}`}
        </>
      )
    },
    {
      column: 'emailUsuario',
      label: t('selec_director>correo', 'Correo electrónico'),
      accessor: 'emailUsuario',
      Header: t('selec_director>correo', 'Correo electrónico')
    },
    {
      accessor: 'actions',
      column: 'actions',
      Header: 'Acciones',
      label: 'Acciones',
      Cell: ({ row }) => (
        <div className='d-flex justify-content-center align-items-center'>
          <Tooltip title='Seleccionar'>
            <TouchAppIcon
              style={{
                fontSize: 30,
                cursor: 'pointer',
                color: colors.darkGray
              }}
              onClick={() => {
                handleSelection(row.original)
              }}
            />
          </Tooltip>
        </div>
      )
    }
  ], [data])

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

  const onSearch = async () => {
    const results = await handleInputSearch()
    setData(results as any)
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
        <div
          className='search-sm--rounded'
          style={{
					  width: '40rem'
          }}
        >
          <input
            type='text'
            name='keyword'
            id='search'
            onKeyDown={(e) => {
							  if (e.key === 'Enter' || e.keyCode === 13) {
							    onSearch()
							  }
            }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('general>buscar', 'Buscar')}
          />

          <StyledInputGroupAddon
            style={{ zIndex: 2 }}
            addonType='append'
          >
            <Button
              color='primary'
              className='buscador-table-btn-search'
              onClick={onSearch}
              id='buttonSearchTable'
            >
              {t('general>buscar', 'Buscar')}
            </Button>
          </StyledInputGroupAddon>
        </div>
        <TableReactImplementation
          avoidSearch
          columns={columns}
          data={data}
        />
        <div className='my-3'>
          <Cancel onClick={props.handleCancel}>{t('general>cancelar', 'Cancelar')}</Cancel>
        </div>
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

const StyledInputGroupAddon = styled(InputGroupAddon)`
	top: 0;
	right: 0;
	position: absolute;
	height: 100%;
	display: flex;
	align-items: center;
`

export default ModalUsuarios
