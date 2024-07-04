import React, { useState, useEffect, useMemo } from 'react'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import ContextualMenu from './ContextualMenu'
import { getYearsOld } from 'Utils/years'
import { Colxx } from 'Components/common/CustomBootstrap'
import { format, parseISO } from 'date-fns'
import Button from '@mui/material/Button'
import styled from 'styled-components'
import search from 'Utils/search'
import { InputGroupAddon } from 'reactstrap'

import temaObj from 'Assets/js/colors'


const colors =  temaObj.color

interface IProps {
	data: Array<any>
	states: Array<any>
	onConfirm: Function
	hasEditAccess: boolean
	closeContextualMenu?: boolean
	
}

const TableStudents: React.FC<IProps> = (props) => {
	const {
		data,
		states,
		hasEditAccess = true,
		onConfirm,
		closeContextualMenu = false,
		
	} = props

	const [students, setStudents] = useState([])
	const [items, setItems] = useState([])

	useEffect(() => {
		let _data = data.map(mapper)
		setStudents(_data)
	}, [data])

	useEffect(() => {
		setItems(students)
	}, [students])

	const onSearch = (searchValue) => {
		setItems(search(searchValue).in(students, Object.keys(students[0])))
	}

	const mapper = (el) => {
		return {
			...el,
			id: el.matriculaId,
			image: el.img,
			edad: getYearsOld(el.fechaNacimiento),
			fechaNacimientoP: format(
				parseISO(el.fechaNacimiento),
				'dd/MM/yyyy'
			),
			nacionalidad: Array.isArray(el.nacionalidades)
				? el.nacionalidades[0].nacionalidad
				: '',
			genero: Array.isArray(el.genero) ? el.genero[0].nombre : '',
			cuentaCorreoOffice: el.cuentaCorreoOffice ? 'Sí' : 'No',
			condicionPropuesta: ''
		}
	}

	const columns = useMemo(() => {
		return [
			{
				Header: 'Identificación',
				accessor: 'identificacion',
				label: '',
				column: ''
			},
			{
				Header: 'Nombre completo',
				accessor: 'nombreCompleto',
				label: '',
				column: ''
			},
			{
				Header: 'Fecha de nacimiento',
				accessor: 'fechaNacimientoP',
				label: '',
				column: ''
			},
			{
				Header: 'Edad cumplida',
				accessor: 'edad',
				label: '',
				column: ''
			},
			{
				Header: 'Identidad de género',
				accessor: 'genero',
				label: '',
				column: ''
			},
			{
				Header: 'Condición matrícula',
				accessor: 'estadoNombre',
				label: '',
				column: '',
				Cell: ({ cell, row, data }) => {
					const _row = data[row.index]

					return (
						<p
              className='d-flex justify-content-center align-items-center m-0'
              style={{
							  background: colors.darkGray,
							  color: '#fff',
							  textAlign: 'center',
							  borderRadius: '15px',
							  padding: '5px 0'
              }}
						>
							{_row.estadoNombre}
						</p>
					)
				}
			},
			{
				Header: 'Condición final',
				accessor: 'condicionFinal',
				label: '',
				column: '',
				Cell: ({ cell, row, data }) => {
					const _row = data[row.index]

					return (
						<p
              className='d-flex justify-content-center align-items-center m-0'
              style={{
							  background: colors.darkGray,
							  color: '#fff',
							  textAlign: 'center',
							  borderRadius: '15px',
							  padding: '5px 0'
              }}
						>
							{_row.condicionFinal}
						</p>
					)
				}
			},
			
			/* {
				Header: 'Condición final',
				accessor: 'condicionFinal',
				label: '',
				column: '',
				Cell: ({ cell, row, data }) => {
					const fullRow = data[row.index]
					
          let _options = [
            {
              id: 5,
              name: 'Aprobado', // 1
              action: (_row) => onConfirm(fullRow, 5),
              estadoCensoId:fullRow.estadoCensoId
            },
            {
              id: 6,
              name: 'Reprobado', // 3
              action: (_row) => onConfirm(fullRow, 6),
              estadoCensoId:fullRow.estadoCensoId
            },
            {
			 id: 7,
			 name: 'Aplazado', // 4
			 action: (_row) => onConfirm(fullRow, 7),
              estadoCensoId:fullRow.estadoCensoId
							}
						]
					_options = _options.filter(
						(e) => e.id !== fullRow.estadoCensoId
          )


        let color =colors.darkGray;

		if (fullRow.estadoId === 5 || fullRow.estadoId === 6) {
			_options = _options.filter((e: any) => e.id == 7)
		}


					return (
						<div
							key={row.index}
							className='d-flex justify-content-center align-items-center'
            >
             
							<ContextualMenu
								options={_options}
								row={fullRow}
								close={closeContextualMenu}
							/>

						</div>
					)
				}
			} */

		]
	}, 
	[items, closeContextualMenu])
	
	

	return (
		<Colxx className="mt-3 mb-5" sm="12">
			<h4>Estudiantes matriculados</h4>

			<TableReactImplementation
				orderOptions={[]}
				columns={columns}
				data={students}
				autoResetPage={false}
			/>
		</Colxx>
	)
}
const ButtonStyled = styled(Button)<{ colors: string }>`
	background: ${(props) => props.colors}!important;
	width: 100% !important;
	font-size: 12px !important;
`

const StyledInputGroupAddon = styled(InputGroupAddon)`
	top: 0;
	right: 0;
	position: absolute;
	height: 100%;
	display: flex;
	align-items: center;
`
const SearchContainer = styled.div`
	width: 32vw;
`

export default TableStudents
