import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { IconButton } from '@material-ui/core'
import { useDropzone } from 'react-dropzone'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

import { isArray } from 'lodash'

const getColor = (props) => {
  if (props.isDragAccept) {
    return '#00e676'
  }
  if (props.isDragReject) {
    return '#ff1744'
  }
  if (props.isDragActive) {
    return '#2196f3'
  }
  return '#dbdbdb'
}

type FileUploadProps = {
  onConfirm: any
  onDelete?: any
  onRejection?: Function
  type?: any
  isMulti?: boolean
  noClick?: boolean
  maxFiles?: number
  name: string
  label?: string
  span?: string
  value: any
  icon: JSX.Element
}

const FileUpload = (props: FileUploadProps) => {
  const {
    onConfirm,
    value,
    type,
    isMulti,
    name,
    maxFiles,
    onRejection,
    label,
    span,
    noClick,
    icon
  } = props

  const [files, setFiles] = useState<File[]>([])

  const {
    getRootProps,
    getInputProps,
    open,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    noClick,
    accept: type,
    multiple: isMulti,
    maxFiles,
    onDropRejected: (rejectedFiles) => {
      if (rejectedFiles.length) {
        onRejection(rejectedFiles)
      }
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length) {
        onConfirm(acceptedFiles)
      }
    }
  })

  useEffect(() => {
    const _value = isArray(value)
    _value ? setFiles(value) : setFiles([])
  }, [value])

  return (
    <ContainerDiv>
      <CompleteDiv>
        <Container
          {...getRootProps({
            isDragActive,
            isDragAccept,
            isDragReject
          })}
        >
          <ButtonDiv>
            <input name={name} {...getInputProps()} />
            <ContentButtonDiv onClick={noClick && open}>
              {icon}
              {label && <label> {label}</label>}
              {span && <span>(.jpg o .png)</span>}
            </ContentButtonDiv>
          </ButtonDiv>
        </Container>
      </CompleteDiv>
    </ContainerDiv>
  )
}

FileUpload.defaultProps = {
  icon: <CloudUploadIcon fontSize='large' />,
  noClick: false,
  isMulti: false,
  span: null,
  label: 'Subir archivo'
}
const ButtonDiv = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
`

const ContentButtonDiv = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  color: #575757;
  font-weight: 600;

  label {
    margin: 0;
    padding: 0;
    font-size: 15px;
  }
  span {
    margin: 0;
    padding: 0;
    font-size: 12px;
  }
`
const CompleteDiv = styled.div`
  width: 100%;
`
const ContainerDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Container = styled.div`
  flex: 1;
  display: flex;
  background: #efefef;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #6f6b6b;
  outline: none;
  transition: border 0.24s ease-in-out;
  border-radius: 10px;
  border-color: ${(props) => getColor(props)};
  border-width: 2px;
  border-style: solid;
  padding: 40px 10px;
`

const CloseIcon = styled(IconButton)`
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  padding: 5px;
`
const ThumbDiv = styled.div`
  display: flex;
  border: 1px solid rgb(234, 234, 234);
  justify-content: center;
  align-items: center;
  flex-flow: column;
  padding: 0.5em;
  position: relative;
  width: 180px;
  height: 170px;
  margin: 0 5px 2.5px 0;
  overflow: hidden;
  .nameThumb {
    font-size: 14px;
  }
`
const ThumbsDiv = styled.div`
  display: flex;
  border: 1px solid rgb(234, 234, 234);
  justify-content: flex-start;
  align-items: center;
  padding: 0.5em;
  position: relative;
  width: 50%;
  height: 35px;
  margin: 0 5px 2.5px 0;
  overflow: hidden;
  .nameThumb {
    font-size: 11px;
    width: 20em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .closeIcon {
    position: absolute;
    top: 0;
    right: 0;
    padding: 5px;
    cursor: pointer;
  }
`
export default FileUpload
