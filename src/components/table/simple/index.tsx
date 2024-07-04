import React from 'react'
import styled from 'styled-components'
import Checkbox from '@material-ui/core/Checkbox'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@mui/material/Tooltip'
import colors from 'Assets/js/colors'
import { useTranslation } from 'react-i18next'

interface IProps {
  columns: any[]
  minWidth?: string
  actionsRow: any[]
  rows: any[]
  selectable: boolean
}
const SimpleTable: React.FC<IProps> = (props) => {
  const { t } = useTranslation()
  const { columns, rows, selectable, actionsRow, minWidth } = props

  return (
    <TableStyled minWidth={minWidth}>
      <TheadStyled color={colors.primary}>
        <tr>
          {selectable && <ThCheckBoxStyled />}
          {columns.map((item, index) => {
            return (
              <ThStyled key={index} align={item.align}>
                {item.label}
              </ThStyled>
            )
          })}
          {!!actionsRow.length && (
            <ThStyled align='center'>Acciones</ThStyled>
          )}
        </tr>
      </TheadStyled>
      <tbody>
        {rows.length
          ? (
              rows.map((row, index) => {
                return (
                  <tr key={index}>
                    {selectable && (
                      <TdCheckBoxStyled>
                        <Checkbox
                          color='primary'
                          checked
                          onChange={() => {}}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      </TdCheckBoxStyled>
                    )}
                    {columns.map((item, index) => {
                      return (
                        <TdStyled
                          key={index}
                          align={item.align}
                          onClick={
                        item.actionCell
                          ? () => item.actionCell(row)
                          : () => {}
                      }
                          action={Boolean(item.actionCell)}
                        >
                          {row[item.column]}
                        </TdStyled>
                      )
                    })}
                    {!!actionsRow.length && (
                      <TdActions>
                        {actionsRow.map((item, index) => {
                          if (item.actionDisplay(row)) {
                            return (
                              <Tooltip title={item.actionName} placement='bottom'>
                                <IconButton
                              key={index}
                              onClick={() => item.actionFunction(row)}
                              component='span'
                            >
                              {item.icon}
                            </IconButton>
                              </Tooltip>
                            )
                          } else {
                            return <></>
                          }
                        })}
                      </TdActions>
                    )}
                  </tr>
                )
              })
            )
          : (
            <NoRecords>
              <td
                colSpan={
                Number(columns.length) +
                Number(actionsRow.length ? 1 : 0) +
                Number(selectable ? 1 : 0)
              }
              >
                <h3>{t('common>no_se_encontraron_registros', 'No se encontraron registros')}</h3>
              </td>
            </NoRecords>
            )}
      </tbody>
    </TableStyled>
  )
}

SimpleTable.defaultProps = {
  selectable: true,
  columns: [],
  actionsRow: [],
  minWidth: '300px',
  rows: []
}

const TableStyled = styled.table<{ minWidth: string }>`
  position: relative;
  float: left;
  width: 100%;
  tr:nth-child(even) {
    background-color: #dddddd;
  }
  th,
  td {
    padding: 10px;
  }
  tbody {
    display: block;
    height: ${(props) => props.minWidth};
    padding-bottom: 15px;
    overflow: auto;
  }
  thead,
  tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
  }
`
const TheadStyled = styled.thead<{ color: string }>`
  padding: 5px;
  height: 40px;
  position: relative;
  background: ${(props) => props.color};
  color: #fff;
`
const ThStyled = styled.th<{ align?: string }>`
  text-align: ${(props) => (props.align ? props.align : 'left')};
`
const ThCheckBoxStyled = styled.th`
  width: 45px;
`
const TdCheckBoxStyled = styled.td`
  width: 45px;
  span {
    padding: 0;
  }
`
const NoRecords = styled.tr`
  text-align: center;
`
const TdStyled = styled.td<{ align?: string; action?: boolean }>`
  text-align: ${(props) => (props.align ? props.align : 'left')};
  ${(props) =>
    props.action &&
    `
    color: ${colors.primary};
    text-decoration: underline;
    cursor:pointer; &:hover {
      font-weight: 700;
    }
  `}
`
const TdActions = styled.td`
  display: flex;
  align-items: center;
  flex-flow: row;
  justify-content: center;
`

export default SimpleTable
