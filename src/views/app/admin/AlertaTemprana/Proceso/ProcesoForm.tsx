import React from 'react'
import styled from 'styled-components'
import { Table, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import IconMore from '@material-ui/icons/MoreVert'

type IProps = {
    steps: Array<any>,
    handleSelectItem: Function,
    visibleMenu: boolean,
    handleMenu: Function,
    handleEditItem: Function,
    handleDeleteItem: Function
};

const ActionsMenu = (props) => {
  const [visible, setVisible] = React.useState<boolean>(false)
  return (
    <Menu isOpen={visible} toggle={() => setVisible(!visible)}>
      <ActionToogle tag='span'>
        <IconMore />
      </ActionToogle>
      <DropdownMenu right>
        <DropdownItem onClick={() => props.handleEditItem(props.index)}>Editar</DropdownItem>
        <DropdownItem onClick={() => props.handleDeleteItem(props.index)}>Eliminar</DropdownItem>
      </DropdownMenu>
    </Menu>
  )
}

const ProcesoForm: React.FC<IProps> = (props) => {
  return (
    <Wrapper>
      <Table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Orden</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {
                        props.steps.map((step, i) => (
                          <Normativa key={i} color={step.selected ? '#ededed' : '#fff'}>
                            <th>{step.nombre}</th>
                            <td>{step.numeroPaso}</td>
                            <td className='text-right'>
                              <Actions>
                                <input type='checkbox' checked={step.selected} onClick={() => props.handleSelectItem(i)} />
                                <ActionsMenu
                                  index={i}
                                  handleEditItem={props.handleEditItem}
                                  handleDeleteItem={props.handleDeleteItem}
                                />
                              </Actions>
                            </td>
                          </Normativa>
                        ))
                    }
        </tbody>
      </Table>
    </Wrapper>
  )
}

const Wrapper = styled.div``

const Actions = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
`

const ActionToogle = styled(DropdownToggle)`
    cursor: pointer;
`

const Normativa = styled.tr`
    background: ${props => props.color};
`

const Menu = styled(Dropdown)`
    height: 24px;
`

export default ProcesoForm
