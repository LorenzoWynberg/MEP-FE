import React from 'react'
import SimpleModal from 'Components/Modal/simple'
import styled from 'styled-components'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { useTranslation } from 'react-i18next'

interface IProps {
  show?: boolean
  fullRowData?: any
  onClose?: () => void
}
const RolInfoModal: React.FC<IProps> = (props) => {
  const { t } = useTranslation()
  const { fullRowData } = props

  const tipoRol = () => {
    if (fullRowData && fullRowData.roles) {
      const roles = JSON.parse(fullRowData.roles)
      if (roles.length === 0) return ''
      const rol = roles.pop()
      if (rol.tipoRolId == 6) {
        return t('gestion_usuario>usuarios>circuito_rol_modal', 'Circuito')
      }
      if (rol.tipoRolId == 5) {
        return t('gestion_usuario>usuarios>regional_rol_modal', 'Regional')
      } else {
        return t('gestion_usuario>usuarios>centro_educativo_rol_modal', 'Centro educativo')
      }
    } else {
      return ''
    }
  }

  const TableMetadata = React.useMemo(() => {
    const columns = [
      {
        label: '',
        column: 'rol',
        accessor: 'rol',
        Header: t('gestion_usuario>usuarios>rol', 'Rol')
      },
      {
        label: '',
        column: 'alcance',
        accessor: 'alcance',
        Header: tipoRol()
      }
    ]
    const getArrItem = (arr, index) => {
      if (arr.length >= index + 1) {
        return `${arr[index]?.codigo ? arr[index]?.codigo + ' - ' : ''}${
          arr[index]?.nombre
        }`
      } else {
        return t('gestion_usuario>usuarios>no_definido_item', 'No Definido')
      }
    }
    const addRow = (arr, rol, alcance) => {
      arr.push({
        rol: rol.nombre,
        alcance
      })
    }

    const rows = []
    if (fullRowData && fullRowData.roles) {
      const roles = JSON.parse(fullRowData.roles)
      const circuitos = JSON.parse(fullRowData.circuitos)
      const regionales = JSON.parse(fullRowData.regionales)
      const instituciones = JSON.parse(fullRowData.instituciones)
      roles.forEach((rol, index) => {
        if (regionales.length > 0) {
          addRow(rows, rol, getArrItem(regionales, index))
        } else if (circuitos.length > 0) {
          addRow(rows, rol, getArrItem(circuitos, index))
        } else if (instituciones.length > 0) {
          addRow(rows, rol, getArrItem(instituciones, index))
        }
      })
    }

    return {
      rows,
      columns
    }
  }, [props.fullRowData, t])

  return (
    <SimpleModal
      btnCancel={false}
      onConfirm={props.onClose}
      txtBtn={t('gestion_usuario>usuarios>btn_cerrar', 'Cerrar')}
      onClose={props.onClose}
      openDialog={props.show}
      title={t('gestion_usuario>usuarios>title_informacion_de_rol', 'Información de Rol')}
    >
      <BasicInfoContainer>
        <TagInfo>
          <label>{t('gestion_usuario>usuarios>name_info', 'NOMBRE')}</label>
          <span>{props.fullRowData?.nombreCompleto}</span>
        </TagInfo>
        <TagInfo>
          <label>{t('gestion_usuario>usuarios>email_info', 'CORREO ELECTRÓNICO')}</label>
          <span>{props.fullRowData?.emailusuario}</span>
        </TagInfo>
      </BasicInfoContainer>
      <TableContainer>
        <TableReactImplementation
          avoidSearch
          columns={TableMetadata.columns}
          data={TableMetadata.rows}
        />
      </TableContainer>
    </SimpleModal>
  )
}

const BasicInfoContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  gap: 2rem;
`
const TableContainer = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
`

const TagInfo = styled.div`
  display: flex;
  flex-direction: column;
  & > label {
    font-size: 10px;
  }
  & > span {
    font-size: 1rem;
    font-weight: bold;
  }
`

export default RolInfoModal
