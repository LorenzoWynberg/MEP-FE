import React, { useMemo } from 'react'
import { Modal, ModalHeader, ModalBody, Row, Container, Col, CustomInput, Button } from 'reactstrap'
import { makeStyles } from '@material-ui/core/styles'
import styled from 'styled-components'
import { TooltipSimple } from '../../utils/tooltip'
import { maxLengthString } from '../../utils/maxLengthString'
import { CenteredCol } from './styles'
import colors from '../../assets/js/colors'
import { TableReactImplementation } from 'Components/TableReactImplementation'

const useStyles = makeStyles((theme) => ({
  inputTags: {
    border: '1px solid #d7d7d7;',
    padding: '0.35rem',
    color: 'white',
    marginBottom: '0.5rem'
  },
  input: {
    display: 'none'
  }
}))
const StyledMultiSelect = (props) => {
  const classes = useStyles()
  const data = useMemo(() => {
    return props.options
  }, [props.options])

  const columns = useMemo(() => {
    return [
      {
        Header: 'Acciones',
        label: 'Acciones',
        column: 'actions',
        accessor: 'actions',
        Cell: ({ row }) => {
          return (
            <div>
              <CustomInput
                type={!props.singleSelection ? 'checkbox' : 'radio'}
                inline
                style={{
                  cursor: 'pointer'
                }}
                onClick={() => props.handleChangeItem(row.original)}
                checked={props.stagedOptions.includes(row.original?.id)}
              />
            </div>
          )
        }
      },
      {
        Header: 'Nombre',
        label: 'Nombre',
        column: 'nombre',
        accessor: 'nombre'
      },
      {
        Header: 'Descripción',
        label: 'Descripción',
        column: 'descripcion',
        accessor: 'descripcion',
        Cell: ({ row }) => {
          return (
            <div>
              {row.original?.descripcion || 'No tiene descripción'}
            </div>
          )
        }
      }
    ]
  }, [data, props.stagedOptions, props.selectedOptions])
  return (
    <>
      <StyledSelect
        className={`${classes.inputTags} ${props.className} ${props.editable ? 'enabled' : 'disabled'}`}
        disabled={!props.editable}
        height={props.height}
        {...props}
        onClick={(e) => {
          if (props.editable) {
            props.toggle(e)
          }
        }}
      >
        {props.selectedOptions.map((option) => {
          const selectedOption = props.options.find(item => item.id == option)
          return <SelectItem item={selectedOption} length={props.length} />
        })}
      </StyledSelect>
      <Modal isOpen={props.isOpen && props.editable} toggle={props.toggle} size='xl'>
        <ModalHeader toggle={props.toggle}>
          {!props.singleSelection ? 'Seleccione las opciones que apliquen' : 'Seleccione la opción que aplique'}
        </ModalHeader>
        <ModalBody>
          <Container className='modal-detalle-subsidio'>
            <Row>
              <Col xs={12}>
                <TableReactImplementation
                  data={data}
                  columns={columns}
                />
                {/* {props.options && props.options.map((item) => {
                            return (
                                <Row className="bottomSeparator">
                                <Col xs={props.noDescription ? 12 : 5} className="modal-detalle-subsidio-col">
                                    <div>
                                    <CustomInput
                                        type={!props.singleSelection ? "checkbox" : "radio"}
                                        label={<NameLong name={item.nombre} length={25}></NameLong>}
                                        inline
                                        onClick={() => props.handleChangeItem(item)}
                                        checked={props.stagedOptions.includes(item.id)}
                                    />
                                    </div>
                                </Col>
                                {!props.noDescription && <Col xs={7} className="modal-detalle-subsidio-col">
                                    <div>
                                    <p>
                                        {item.descripcion
                                        ? <NameLong name={item.descripcion} length={25}/>
                                        : item.detalle ? <NameLong name={item.detalle} length={25}/> :  "Elemento sin detalle actualmente"}
                                    </p>
                                    </div>
                                </Col>}
                                </Row>
                            );
                            })} */}
              </Col>
            </Row>
            <Row>
              <CenteredCol xs='12'>
                <Button
                  onClick={(e) => {
                    props.toggle(e)
                  }}
                  color='primary'
                  outline
                >
                  Cancelar
                </Button>
                <Button
                  color='primary'
                  onClick={(e) => {
                    props.toggle(e, true)
                  }}
                >
                  Guardar
                </Button>

              </CenteredCol>
            </Row>
          </Container>
        </ModalBody>
      </Modal>
    </>
  )
}
const SelectItem = (props) => {
  if (props.item) {
    return (
      <TooltipSimple
        element={<ItemSpan>{maxLengthString(props.item.nombre, props.length || 25)}</ItemSpan>}
        title={props.item.nombre}
      />
    )
  } else {
    return null
  }
}

const NameLong = (props) => {
  if (props.name && props.length) {
    if (props.name.length > props.length) {
      return (
        <TooltipSimple
          element={maxLengthString(props.name, props.length)}
          title={props.name}
        />
      )
    } else {
      return (props.name)
    }
  } else {
    return null
  }
}

const ItemSpan = styled.span`
    background-color: ${colors.primary};
    padding-left: 8px;
    padding-right: 8px;
    border-radius: 15px;
    /*height: 1.45rem;*/
    display: flex;
    /*width: 40%;*/
    align-items: center;
    margin: 7px 0;
    
`
const StyledSelect = styled.div`
    ${props => (props.columns && props.columns > 1) || !props.columns ? 'display: grid' : ''};
    ${props => (props.columns && props.columns > 1) || !props.columns ? `grid-template-columns: repeat( ${props.columns || 5}, 1fr)` : ''};
    justify-content: flex-start;
    position: relative;
    min-height: ${props => props.height ? props.height : '10rem'};

    .enabled::after {
        content: "+";
        color: white;
        position: absolute;
        right: 10px;
        top: 30%;
        background-color: ${colors.primary};
        border-radius: 50%;
        height: 1.5rem;
        width: 1.5rem;
        font-weight: bold;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 21px;
    }
    &[disabled] {
        background-color: #eaeaea;
    }
`

export default StyledMultiSelect
