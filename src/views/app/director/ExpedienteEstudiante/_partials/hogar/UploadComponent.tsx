import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import colors from "../../../../../../assets/js/colors"
import { Button } from "reactstrap"
const UploadComponent = (props) => {
    const {t} = useTranslation()
	return (<>
		<ButtonsContainer>
			<DownloadIconContainer>
				<i className={'simple-icon-cloud-upload'} />
			</DownloadIconContainer>
			<div style={{ paddingTop: '0.4rem' }}>
				
				<input
					onChange={(e) => {
						props.addImage(e)
					}}
					style={{display:"none"}}
					id={`file-${props.id || 'upload'}`}
					type="file"
					name="filesEncargado"
					accept="image/*,.pdf"
				/>
			
				<label htmlFor={`file-${props.id || 'upload'}`}>
					<FileLabel
						
						/*disabled={!props.editable}*/
						/*onClick={() => {
							// if(!props.memberData.idMiembro) {
							//props.toggleAlertModal()
							// }
						}}*/
					>
						{t('general>subir_archivo', 'Subir Archivo')}
					</FileLabel>
				</label>
			</div>
			{/*{props.memberData.recursosIdsEncargado &&
				props.memberData.recursosIdsEncargado.length > 0 && ( */}
					{/* <Button
						color="primary"
						onClick={() => {
							// props.handleOpenFiles(
							// 	props.memberData.recursosIdsEncargado
							// )
							// props.setDisplayingModalFiles('encargado')
						}}
					>
						{t('general>subir_archivo', 'Subir Archivo')}
						{`(${'0'} archivos)`}
					</Button> */}
				{/* )} */}
		</ButtonsContainer>
		<div>
			<ul>
				{props.files && props.files.map(f=>{
					return <li><a href={f.src} download={f.nombre} target="_blank"> {f.nombre} </a> <span style={{cursor:'pointer'}} onClick={()=>props.removeElement(f)}>X</span></li>
				})}
			</ul>
		</div>
	</>)
}

const ButtonsContainer = styled.div`
    display: flex;
    margin-top: 1rem;
    justify-content: space-around;
    align-items: center;
`
const DownloadIconContainer = styled.span`
    font-size: 35px;
`
const FileLabel = styled.div`
    background-color: white;
    color: ${props => props.disabled ? "#636363" : colors.primary};;
    border: 1.5px solid ${props => props.disabled ? "#636363" : colors.primary};;
    width: 7rem;
    height: 2.7rem;
    text-align: center;
    justify-content: center;
    align-items: center;
    display: flex;
    border-radius: 26px;
    &:hover {
        background-color: ${props => props.disabled ? "" : colors.primary};
        color: ${props => props.disabled ? "" : "white"};
    }
`

export default UploadComponent
