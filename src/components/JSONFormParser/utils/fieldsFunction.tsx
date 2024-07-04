import React, { useEffect, useMemo } from 'react'
import ImageInput from '../InputTypes/ImageInput'
import LocationSelector from '../InputTypes/AdvancedTypes/LocationSelector'
import LocationExact from '../InputTypes/AdvancedTypes/LocationExact'
import TextArea from '../InputTypes/TextArea'
import DropDown from '../InputTypes/Dropdown'
import CoordinatesMap from '../InputTypes/AdvancedTypes/CoordinatesMap'
import RadioInput from '../InputTypes/Radio'
import TextInput from '../InputTypes/TextInput'
import Date from '../InputTypes/Date'
import Stepper from '../InputTypes/Stepper'
import StepperContainer from '../InputTypes/StepperContainer'
import List from '../InputTypes/List'
import SwitchInput from '../InputTypes/Switch'
import UploadFiles from '../InputTypes/UploadFiles'
import Checklist from '../InputTypes/Checklist'
import MultiSelect from '../InputTypes/MultiSelect'
import Container from '../InputTypes/Container'
import CRUDTable from '../InputTypes/AdvancedTypes/CRUDTable'
import CustomReactTable from '../InputTypes/AdvancedTypes/CustomReactTable'
import Redes from '../InputTypes/Redes'
import IconTextrea from '../InputTypes/IconTextarea'
import DateYear from '../InputTypes/DateYear'
import { TableReactImplementation } from 'Components/TableReactImplementation'
import GoogleMapsField from '../InputTypes/AdvancedTypes/GoogleMapsField'
import Tooltip from '@mui/material/Tooltip'
import { IconButton } from '@material-ui/core'
import TouchAppIcon from '@material-ui/icons/TouchApp'
import CustomInput from 'Views/user/Registration/Steps/CustomInput'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import colors from 'Assets/js/colors'

// function that displays the specific Field
export const DisplayField = (props: any): JSX.Element => {
	const {
		control,
		field,
		register,
		setValue,
		watch,
		currentItem,
		errors,
		pageData,
		getValues,
		sendStepperData,
		setOpenLayout,
		handleSubmit,
		active,
		handleFilesChange,
		files,
		handleFilesDelete,
		multiSelects,
		setMultiSelects,
		editable,
		handleMultiSelectsOptions,
		children,
		handleTableDataChange,
		editing,
		tablesData,
		dataForm,
		readOnlyFields,
		setValidationArray,
		setRequiredMultipleSelects,
		requiredMultipleSelects,
		validationArray,
		using,
		isTemporal
	} = props
  

	const [newColumns, setNewColumns] = React.useState(props.field?.config?.columns)

	useEffect(() => {
		setNewColumns(props.field?.config?.columns)
	}, [props.field?.config?.columns, props.field?.config?.columnsLength])
	const reactTableData = useMemo(() => {
		if (props.field?.config?.data) {
			return props.field?.config?.data
		} else {
			return [
				{
					accessor1: '',
					accessor2: '',
					accessor3: '',
					actions: true
				}
			]
		}
	}, [props.field?.config?.data])
	const reactTableColumns = useMemo(() => {
		let columnsActions = newColumns
		if (props?.field?.config?.columns?.filter(el => el?.accessor === 'actions')?.length > 0) {
			columnsActions = [...props?.field?.config?.columns]
			const index = columnsActions.findIndex(el => el.accessor === 'actions')
			if (props?.field?.config?.select && !props?.field?.config?.checkbox && index !== -1) {
				columnsActions[index] = {
					...columnsActions[index],
					Cell: ({ row }) => {
						return (
							<div className='d-flex justify-content-center align-items-center'>
								<button
									style={{
										border: 'none',
										background: 'transparent',
										cursor: 'pointer',
										color: 'grey'
									}}
									onClick={() => {}}
								>
									<IconButton>
										<TouchAppIcon style={{ fontSize: 30 }} />
									</IconButton>
								</button>
							</div>
						)
					}
				}
			} else if (
				props?.field?.config?.edit &&
				props?.field?.config?.delete &&
				props?.field?.config?.checkbox &&
				index !== -1
			) {
				columnsActions[index] = {
					...columnsActions[index],
					Cell: ({ row }) => {
						return (
							<div className='d-flex justify-content-center align-items-center'>
								<input
									checked={row.original.selected}
									className='custom-checkbox mb-0 d-inline-block mr-3'
									type='checkbox'
									onClick={() => {
										props.field.config?.onSelect(row.original)
									}}
								/>
								<Tooltip title='Editar' className='mr-3'>
									<EditIcon
										style={{
											color: colors.darkGray,
											cursor: 'pointer'
										}}
										onClick={() => {
											props.field.config?.onEdit(row.original)
										}}
									/>
								</Tooltip>
								<Tooltip title='Eliminar'>
									<DeleteIcon
										style={{
											color: colors.darkGray,
											cursor: 'pointer'
										}}
										onClick={() => {
											props.field.config?.onDelete(row.original)
										}}
									/>
								</Tooltip>
							</div>
						)
					}
				}
			} else if (!props?.field?.config?.select && props?.field?.config?.checkbox && index !== -1) {
				columnsActions[index] = {
					...columnsActions[index],
					Cell: (
						<div className='d-flex justify-content-center align-items-center'>
							<input
								checked
								className='custom-checkbox mb-0 d-inline-block'
								type='checkbox'
								onClick={e => {}}
							/>
						</div>
					)
				}
			} else if (props?.field?.config?.select && props?.field?.config?.checkbox && index !== -1) {
				columnsActions[index] = {
					...columnsActions[index],
					Cell: (
						<div className='d-flex justify-content-center align-items-center'>
							<div className='ml-3'>
								<button
									style={{
										border: 'none',
										background: 'transparent',
										cursor: 'pointer',
										color: 'grey'
									}}
									onClick={() => {}}
								>
									<IconButton>
										<TouchAppIcon style={{ fontSize: 30 }} />
									</IconButton>
								</button>
							</div>
							<div>
								<input
									checked
									className='custom-checkbox mb-0 d-inline-block'
									type='checkbox'
									onClick={e => {}}
								/>
							</div>
						</div>
					)
				}
			}
		}
		return columnsActions
	}, [reactTableData, tablesData])
	if (!field) return null
	const getDropDown = () => (
		<DropDown
			register={register}
			active={active}
			editable={editable}
			field={field}
			setValue={setValue}
			errors={errors}
			getValues={getValues}
			dataForm={dataForm}
			control={control}
			watch={watch}
			readOnlyFields={readOnlyFields}
		/>
	)

	switch (field.type) {
		case 'list':
			return (
				<List
					field={field}
					active={active}
					direction={field.position}
					register={register}
					setValue={setValue}
					watch={watch}
					errors={errors}
					currentItem={currentItem}
					pageData={pageData}
					editable={editable}
					getValues={getValues}
					readOnlyFields={readOnlyFields}
				/>
			)
		case 'container':
			return (
				<Container
					field={field}
					fields={field.fields}
					active={active}
					direction={field.position}
					register={register}
					setValue={setValue}
					watch={watch}
					errors={errors}
					currentItem={currentItem}
					pageData={pageData}
					getValues={getValues}
					editable={editable}
					readOnlyFields={readOnlyFields}
					sendStepperData={sendStepperData}
					setOpenLayout={setOpenLayout}
					handleSubmit={handleSubmit}
					handleFilesChange={handleFilesChange}
					files={files}
					handleFilesDelete={handleFilesDelete}
					multiSelects={multiSelects}
					setMultiSelects={setMultiSelects}
					handleMultiSelectsOptions={handleMultiSelectsOptions}
					children={children}
					handleTableDataChange={handleTableDataChange}
					editing={editing}
					tablesData={tablesData}
					dataForm={dataForm}
				>
					{children}
				</Container>
			)
		case 'stepContainer':
			return (
				<StepperContainer
					fields={field.fields}
					active={active}
					direction={field.position}
					register={register}
					setValue={setValue}
					watch={watch}
					errors={errors}
					currentItem={currentItem}
					pageData={pageData}
					getValues={getValues}
					editable={editable}
					readOnlyFields={readOnlyFields}
					sendStepperData={sendStepperData}
					setOpenLayout={setOpenLayout}
					handleSubmit={handleSubmit}
					handleFilesChange={handleFilesChange}
					files={files}
					handleFilesDelete={handleFilesDelete}
					multiSelects={multiSelects}
					setMultiSelects={setMultiSelects}
					handleMultiSelectsOptions={handleMultiSelectsOptions}
					children={children}
					handleTableDataChange={handleTableDataChange}
					editing={editing}
					tablesData={tablesData}
					dataForm={dataForm}
				/>
			)
		case 'stepper':
			return (
				<Stepper
					field={field}
					fields={field.fields}
					active={active}
					direction={field.position}
					register={register}
					setValue={setValue}
					watch={watch}
					errors={errors}
					currentItem={currentItem}
					pageData={pageData}
					getValues={getValues}
					editable={editable}
					readOnlyFields={readOnlyFields}
					sendStepperData={sendStepperData}
					setOpenLayout={setOpenLayout}
					handleSubmit={handleSubmit}
					handleFilesChange={handleFilesChange}
					files={files}
					handleFilesDelete={handleFilesDelete}
					multiSelects={multiSelects}
					setMultiSelects={setMultiSelects}
					handleMultiSelectsOptions={handleMultiSelectsOptions}
					children={children}
					handleTableDataChange={handleTableDataChange}
					editing={editing}
					tablesData={tablesData}
					dataForm={dataForm}
				/>
			)

		case 'image':
			return (
				<ImageInput
					field={field}
					active={active}
					register={register}
					setValue={setValue}
					errors={errors}
					editable={editable}
					watch={watch}
					currentItem={currentItem}
					getValues={getValues}
					readOnlyFields={readOnlyFields}
					handleFilesDelete={handleFilesDelete}
				/>
			)
		case 'location':
			return (
				<LocationSelector
					editable={editable}
					errors={errors}
					active={active}
					field={field}
					register={register}
					watch={watch}
					setValue={setValue}
					currentItem={currentItem}
					getValues={getValues}
					dataForm={dataForm}
					readOnlyFields={readOnlyFields}
					control={control}
					isTemporal={isTemporal}
				/>
			)
		case 'locationExact':
			return (
				<LocationExact
					editable={editable}
					errors={errors}
					active={active}
					field={field}
					register={register}
					watch={watch}
					setValue={setValue}
					currentItem={currentItem}
					getValues={getValues}
					control={control}
					dataForm={dataForm}
					readOnlyFields={readOnlyFields}
					isTemporal={isTemporal}
				/>
			)
		case 'textArea':
			return (
				<TextArea
					register={register}
					editable={editable}
					active={active}
					setValue={setValue}
					field={field}
					errors={errors}
					getValues={getValues}
					readOnlyFields={readOnlyFields}
				/>
			)
		case 'dropDown':
			return getDropDown()
		case 'unic':
			return getDropDown()

		case 'coordinates':
			return (
				<CoordinatesMap
					register={register}
					editable={editable}
					active={active}
					setValue={setValue}
					field={field}
					errors={errors}
					getValues={getValues}
					readOnlyFields={readOnlyFields}
				/>
			)
		case 'radio':
			return (
				<RadioInput
					register={register}
					active={active}
					editable={editable}
					setValue={setValue}
					field={field}
					errors={errors}
					getValues={getValues}
					readOnlyFields={readOnlyFields}
				/>
			)
		case 'checklist':
			return (
				<Checklist
					register={register}
					editable={editable}
					active={active}
					field={field}
					errors={errors}
					setValue={setValue}
					getValues={getValues}
					readOnlyFields={readOnlyFields}
				/>
			)
		case 'text':
			return (
				<TextInput
					control={control}
					editable={editable}
					register={register}
					active={active}
					setValue={setValue}
					field={field}
					errors={errors}
					getValues={getValues}
					readOnlyFields={readOnlyFields}
				/>
			)
		case 'date':
			return (
				<Date
					register={register}
					editable={editable}
					active={active}
					field={field}
					errors={errors}
					setValue={setValue}
					getValues={getValues}
					readOnlyFields={readOnlyFields}
				/>
			)
		case 'dateYear':
			return (
				<DateYear
					register={register}
					editable={editable}
					active={active}
					field={field}
					errors={errors}
					setValue={setValue}
					getValues={getValues}
					readOnlyFields={readOnlyFields}
				/>
			)
		case 'switch':
			return (
				<SwitchInput
					register={register}
					active={active}
					field={field}
					errors={errors}
					editable={editable}
					getValues={getValues}
					setValue={setValue}
					readOnlyFields={readOnlyFields}
				/>
			)
		case 'uploadFile':
			return (
				<UploadFiles
					register={register}
					active={active}
					editable={editable}
					field={field}
					errors={errors}
					getValues={getValues}
					handleFilesChange={handleFilesChange}
					files={files}
					handleFilesDelete={handleFilesDelete}
					setValue={setValue}
					readOnlyFields={readOnlyFields}
					setValidationArray={setValidationArray}
					validationArray={validationArray}
					requiredMultipleSelects={requiredMultipleSelects}
					setRequiredMultipleSelects={setRequiredMultipleSelects}
				/>
			)
		case 'multiple':
			return (
				<MultiSelect
					setValidationArray={setValidationArray}
					validationArray={validationArray}
					requiredMultipleSelects={requiredMultipleSelects}
					setRequiredMultipleSelects={setRequiredMultipleSelects}
					multiSelects={multiSelects}
					setMultiSelects={setMultiSelects}
					editable={editable}
					field={field}
					setValue={setValue}
					using={using}
					handleMultiSelectsOptions={handleMultiSelectsOptions}
					readOnlyFields={readOnlyFields}
				/>
			)
		case 'crudTable':
			return (
				<CRUDTable
					register={register}
					active={active}
					editable={editable}
					setValue={setValue}
					field={field}
					errors={errors}
					getValues={getValues}
					files={files}
					handleFilesDelete={handleFilesDelete}
					tablesData={tablesData}
					handleTableDataChange={handleTableDataChange}
					readOnlyFields={readOnlyFields}
				/>
			)
		case 'reactTable':
			const filterColumns = {}
			reactTableColumns.forEach(el => {
				if (el?.accessor && !filterColumns[el?.accessor]) {
					filterColumns[el?.accessor] = el
				}
			})
			return (
				<>
					<CustomReactTable
						field={props.field}
						columns={Object.values(filterColumns) || []}
						data={reactTableData || []}
						editable={props.editable}
						handleTableDataChange={handleTableDataChange}
						tablesData={tablesData}
					/>
				</>
			)
		case 'redes':
			return (
				<Redes
					register={register}
					active={active}
					editable={editable}
					field={field}
					errors={errors}
					setValue={setValue}
					handleFilesDelete={handleFilesDelete}
					readOnlyFields={readOnlyFields}
					redes={{ facebook: '', instagram: '', whatsapp: '', twitter: '' }}
					watch={watch}
					dataForm={dataForm}
				/>
			)
		case 'iconTextarea':
			return (
				<IconTextrea
					register={register}
					editable={editable}
					active={active}
					field={field}
					errors={errors}
					setValue={setValue}
					getValues={getValues}
					readOnlyFields={readOnlyFields}
				/>
			)
		default:
			return null
	}
}
