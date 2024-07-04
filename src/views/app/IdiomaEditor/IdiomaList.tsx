import React from 'react'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import { MdEdit } from 'react-icons/md'
import { FaTrashAlt } from 'react-icons/fa'
import styled from 'styled-components'
import { Button } from 'Components/CommonComponents'
import { IoIosCopy } from 'react-icons/io'
import SimpleModal from 'Components/Modal/simple'
import { useTranslation } from 'react-i18next'

interface IProps {
    rows: any[],
    onEdit?: (row) => void,
    onDelete?: (row) => void,
    onAdd?:(id, nombre)=>void
	onCopy?:(row, id, nombre)=>void
	/* setState: Function
	state:any */
}

const IdiomaList:React.FC<IProps> = (props) => {
  const { rows, onEdit, onDelete, onCopy, onAdd } = props
  const [modalState, setModalState] = React.useState<{show:boolean, data: object, txtid?:string, txtnombre?:string}>({ show: false, txtid: '', data: null, txtnombre: '' })
  const [modalNewlang, setModalNewlang] = React.useState<{show:boolean, data: object, txtid?:string, txtnombre?:string}>({ show: false, txtid: '', data: null, txtnombre: '' })
  const [modalDelete, setModalDelete] = React.useState<{show:boolean, data: any}>({ show: false, data: null })

  const [sandInput, setSandInput] = React.useState()
  const { t } = useTranslation()
  const TableMetadata = React.useMemo(() => {
    const columns = [
      {
        accessor: 'id',
        Header: 'ID'
      },
      {
        accessor: 'nombre',
        Header: t(" dir_regionales>col_nombre", "Nombre")
        // Cell: ({ cell, row, data })=>{
        //     const _row = data[row.index]
        //     return <AccionesDiv>
        //         {_row.nombre}
        //     </AccionesDiv>
        // }
      },
      {
        accessor: 'acciones',
        Header: t("general>acciones", "Acciones"),
        width: '1',
        Cell: ({ cell, row, data }) => {
          const _row = data[row.index]
          return (
            <AccionesDiv>
              <MdEdit onClick={(e) => onEdit ? onEdit(_row) : null} />
              <FaTrashAlt onClick={(e) => onDelete ? setModalDelete({ show: true, data: _row }) : null} />
              <IoIosCopy onClick={(e) => onCopy ? setModalState({ show: true, data: _row }) : null} />
            </AccionesDiv>
          )
        }
      }
    ]
    const data = rows || []

    return {
      columns,
      data
    }
  }, [rows, t])
  const onChangeSandInput = (e) => {
    setSandInput(e.target.value)
  }
  return (
    <div>
      {/* <TopBar><Button onClick={onAdd? ()=>setModalNewlang({...modalNewlang, show:true}) : null }>Agregar</Button></TopBar> */}
      <TableReactImplementation
        showAddButton
        msjButton
        onSubmitAddButton={onAdd ? () => setModalNewlang({ ...modalNewlang, show: true }) : null}
        columns={TableMetadata.columns}
        data={TableMetadata.data}
      />
      <div>
        <table>
          <thead>
            <th>{t("idiomaEditor>etiqueta", "Etiqueta")}</th>
            <th>{t("idiomaEditor>valor", "Valor")}</th>
          </thead>
          <tbody>
            <tr>
              <td><Input onBlur={onChangeSandInput} /></td>
              <td><label>{t(sandInput)}</label></td>
            </tr>
          </tbody>
        </table>
      </div>
      <SimpleModal
        openDialog={modalState.show}
        onClose={() => setModalState({ data: null, show: false, txtid: '', txtnombre: '' })}
        onConfirm={() => {
				  onCopy(modalState.data, modalState.txtid, modalState.txtnombre)
				  setModalState({ data: null, show: false, txtid: '', txtnombre: '' })
        }}
        btnCancel
        txtBtnCancel={t("boton>general>cancelar", "Cancelar")}
        txtBtn={t("configuracion>anio_educativo>columna_acciones>hover>duplicar", "Duplicar")}
        title='Duplicar Diccionario de Idioma'
      >
        <Input
          placeholder='Código de Idioma' onChange={(e) => {
				  setModalState({ ...modalState, txtid: e.target.value })
          }} value={modalState.txtid}
        />
        <Input
          placeholder='Nombre de Idioma' onChange={(e) => {
				  setModalState({ ...modalState, txtnombre: e.target.value })
          }} value={modalState.txtnombre}
        />
      </SimpleModal>
      <SimpleModal
        openDialog={modalNewlang.show}
        onClose={() => setModalNewlang({ data: null, show: false, txtid: '', txtnombre: '' })}
        onConfirm={() => {
				  
				  onAdd(modalNewlang.txtid, modalNewlang.txtnombre)
				  // setState({...state, langKey: modalNewlang.txtnombre,showForm:true})
				  setModalNewlang({ data: null, show: false, txtid: '', txtnombre: '' })
        }}
        btnCancel
        txtBtnCancel={t("boton>general>cancelar", "Cancelar")}
        txtBtn={t("general>boton>crear", "Crear")}
        title='Crear nuevo Idioma'
      >
        <Input
          placeholder='Código de Idioma' onChange={(e) => {
				  setModalNewlang({ ...modalNewlang, txtid: e.target.value })
          }} value={modalNewlang.txtid}
        />
        <Input
          placeholder='Nombre de Idioma' onChange={(e) => {
				  setModalNewlang({ ...modalNewlang, txtnombre: e.target.value })
          }} value={modalNewlang.txtnombre}
        />
      </SimpleModal>
      <SimpleModal
        openDialog={modalDelete.show}
        onClose={() => setModalDelete({ data: null, show: false })}
        onConfirm={() => {
				  
				  onDelete(modalDelete.data.id)
				  setModalDelete({ data: null, show: false })
        }}
        btnCancel
        txtBtnCancel={t("boton>general>cancelar", "Cancelar")}
        txtBtn={t("boton>general>eliminar", "Eliminar")}
        title='Eliminar Idioma'
      />
    </div>
  )
}
const TopBar = styled.div`
	display: flex;
	width:100%;
	justify-content: flex-end;
`
const AccionesDiv = styled.div`
    display: grid;
    justify-items: center;
    font-size: 1.1rem;
    grid-template-columns: 1fr 1fr 1fr;
    width: 100%;
`
const Input = styled.input`
	outline: initial;
	border: 0;
	border-radius: 10px;
	background: #fff;
	box-shadow: 0 0 2px 1px rgb(0 0 0 / 20%);
	padding: 0.25rem 0.75rem 0.25rem 0.75rem;
	font-size: 0.76rem;
	line-height: 1.3;
	height: 40px;	
	width: 100%;
	margin: 1rem 0 0 0;
`
export default IdiomaList
