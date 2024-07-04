import React, { useState } from 'react'
import {
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Col
} from 'reactstrap'
import FolderIcon from '@material-ui/icons/Folder'
import '../../../../../../assets/css/sass/containerStyles/Carpetas.scss'
import swal from 'sweetalert'
import styled from 'styled-components'

const Carpeta = (props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleCategory = (value) => {
    props.parentTest(value, true)
    props.estado(true)
  }

  /* return(
            <Button className="btnFolder" size="lg" style={{padding: "0.75rem"}}>
                <Row>
                    <Col xs="1" className= "iconoCarpetaEstilo">
                    <FolderIcon  className="iconCarpeta" /> <div className = "divTitulo"></div>
                    </Col>
                    <Col xs="8" onClick={() => handleCategory(props.categoria)}><p className ="nombreFolder" >{props.categoria.nombre}</p></Col>
                    <Col sm="2">
                    <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
                        <DropdownToggle className= "btnDropDown">
                                <div className = "tresPuntos" style={{color: "#1a1c1f"}}>፧</div>
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem onClick={()=> props.edit(props.categoria.id)}>Editar</DropdownItem>
                            <DropdownItem onClick = {()=>
                                    swal({
                                        title: '¿Está seguro que quiere eliminar esta carpeta?',
                                        icon: 'warning',
                                        buttons: {
                                            ok: {
                                                text: 'Aceptar',
                                                value: true,
                                            },
                                            cancel: 'Cancelar'
                                        },
                                    }).then((result) => {
                                        if (result) {
                                            props.delete(props.categoria.id)
                                        }
                                    })}>Eliminar</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    </Col>
                </Row>
            </Button>
        ) */
  return (
    <StyledButton optionMenu>
      <FolderIcon className='iconCarpeta' />
      <Label onClick={() => handleCategory(props.categoria)}>
        {props.categoria.nombre}
      </Label>
      <StyledDropdown
        isOpen={dropdownOpen}
        toggle={() => setDropdownOpen(!dropdownOpen)}
      >
        <StyledDropdownToggle>
          <div style={{ width: '35.24px', color: '#1a1c1f' }}>፧</div>
        </StyledDropdownToggle>
        <DropdownMenu>
          <DropdownItem
            onClick={() => props.edit(props.categoria.id)}
          >
            Editar
          </DropdownItem>
          <DropdownItem
            onClick={() =>
						  swal({
						    title: '¿Está seguro que quiere eliminar esta carpeta?',
						    icon: 'warning',
						    buttons: {
						      ok: {
						        text: 'Aceptar',
						        value: true
						      },
						      cancel: 'Cancelar'
						    }
						  }).then((result) => {
						    if (result) {
						      props.delete(props.categoria.id)
						    }
						  })}
          >
            Eliminar
          </DropdownItem>
        </DropdownMenu>
      </StyledDropdown>
    </StyledButton>
  )
}

const StyledButton = styled.button<{ optionMenu? }>`
	display: grid;
	grid-template-columns: 0.5fr 1fr 0.5fr;
	align-items: center;
	text-align: left;
	&:first-child {
		text-align: left;
	}
	/*&:last-child {
		text-align: right;
        align-items: right;
	}*/
	color: #423e3e;

	margin: 14px;
	background-color: #fff;
	border-radius: 40px;
	border: 1px solid #1a1c1f;
	max-width: 300px;
	min-height: 67px;

	line-height: 1.5;
	font-weight: 700;
	letter-spacing: 0.05rem;
	padding: 0.5rem 1rem;
`
const Label = styled.label`
    margin:0px;
`
const StyledDropdown = styled(Dropdown)`
    width: fit-content;
`
const StyledDropdownToggle = styled(DropdownToggle)`
    
    background: transparent;
    border:none;
    border-radius: 50px;
    font-size: 2rem;
    padding: 0px;
    &:hover{
        background: transparent;
    }
    &:active{
        background: transparent;
        background-color: transparent;
        border-color: transparent;
    }
    &.btn-secondary:not(:disabled):not(.disabled):active, .btn-secondary:not(:disabled):not(.disabled).active, .show > .btn-secondary.dropdown-toggle{
        background: transparent;
        background-color: transparent;
        border-color: transparent;
    }
    
`
export default Carpeta
