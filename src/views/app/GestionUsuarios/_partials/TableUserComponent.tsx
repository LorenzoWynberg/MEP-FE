import React, { useMemo } from 'react'
import moment from 'moment'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { Button } from 'reactstrap'
import { useTranslation } from 'react-i18next'

interface IProps {
	isTabTodos?: boolean
	data: []
	paginationObject: {
		totalCount: number
		page: number
	}
	handleSearch: (
		searchValue: string,
		filterColumn: string | undefined | null,
		pageSize: number,
		page: number,
		column: string,
		order: string
	) => void | any
	btnAgregarEvent: Function
}
const TableUserComponent: React.FC<IProps> = (props) => {
  const { t } = useTranslation()

  const DEFAULT_COLUMNS_GENERAL = [
    {
      label: '',
      column: 'identificacion',
      accessor: 'identificacion',
      Header: t('gestion_usuario>usuarios>id_tablecolumn', 'Identificación')
      // order?: boolean
      // filterColumn?: string
      // show?: boolean
      // Cell?: any
    },
    {
      label: '',
      column: 'nombre',
      accessor: 'nombreCompleto',
      Header: t('gestion_usuario>usuarios>name_tablecolumn', 'Nombre Completo')
    },
    {
      label: '',
      column: 'correo',
      accessor: 'emailusuario',
      Header: t('gestion_usuario>usuarios>email_tablecolumn', 'Correo')
    },
    {
      label: '',
      column: 'sesion',
      accessor: 'ultimoInicioSesion',
      Header: t('gestion_usuario>usuarios>last_login_tablecolumn', 'Último inicio de sesión'),
      Cell: ({ _, row, data }) => {
        const fullRow = data[row.index]
        return <>{convertDate(fullRow.ultimoInicioSesion)}</>
      }
      //	show: false
    },
    {
      label: '',
      column: 'rol',
      accessor: 'roles',
      Header: t('gestion_usuario>usuarios>role_tablecolumn', 'Rol(es)')
    },
    {
      label: '',
      column: 'variable',
      accessor: 'variable',
      Header: t('gestion_usuario>usuarios>department_tablecolumn', 'Centro educativo, Circuito, Regional, Departamento asociado')
    },
    {
      label: '',
      column: 'activo',
      accessor: 'activo',
      Header: t('gestion_usuario>usuarios>condition_tablecolumn', 'Estado')
    },
    {
      label: '',
      column: 'acciones',
      accessor: 'acciones',
      Header: t('gestion_usuario>usuarios>actions_tablecolumn', 'Acciones')
    }
  ]

  const convertDate = (str) => {
    if (str == null || str == '0001-01-01T00:00:00') { return t('gestion_usuario>usuarios>no_ha_iniciado_sesion', 'No ha iniciado sesión') } else return moment(str).format('DD/MM/YYYY h:mm:ss a')
  }

  const DEFAULT_COLUMNS_TODOS = DEFAULT_COLUMNS_GENERAL.filter(
    (_, index) => index != 5
  )

  const TableMetadata = useMemo(() => {
    const data = props.data || []
    const columns =
			props.isTabTodos == true
			  ? DEFAULT_COLUMNS_TODOS
			  : DEFAULT_COLUMNS_GENERAL

    return {
      columns,
      data
    }
  }, [props.data, props.isTabTodos, t])

  return (
    <div className='mt-3 mb-5'>
      <div
        style={
					props.isTabTodos == true
					  ? { display: 'none' }
					  : { textAlign: 'right' }
				}
      >
        <Button color='primary' onClick={props.btnAgregarEvent}>
          {t('gestion_usuario>usuarios>btn_agregar_usuario', '+ Agregar usuario')}
        </Button>
      </div>
      <div id='table'>
        <TableReactImplementation
          pageSize={10}
          paginationObject={props.paginationObject}
          backendPaginated
          handleGetData={props.handleSearch}
          backendSearch
          columns={TableMetadata.columns}
          data={TableMetadata.data}
        />
      </div>
    </div>
  )
}

export default TableUserComponent
