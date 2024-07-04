import React, { useRef, useState, useTransition } from 'react'
import { Button } from 'reactstrap'
import BackupIcon from '@material-ui/icons/Backup'
import axios from 'axios'
import { envVariables } from '../../../../constants/enviroment'
import { IPropsViewQuestion } from '../Types/types'
import styled from 'styled-components'
import useNotification from 'Hooks/useNotification'
import DeleteIcon from '@material-ui/icons/Delete'
import { useTranslation } from 'react-i18next'

const SubirArchivo: React.FC<IPropsViewQuestion> = (props) => {
  const [files, setFile] = useState<any>({})
  const fileToUploadRef = useRef(null)
  const [uploading, setUploading] = React.useState<boolean>(false)
  const [snackBar, handleSnackBarClick] = useNotification()
  const { t } = useTranslation()
  const [snackbarContent, setSnacbarContent] = useState({
    msg: 'welcome',
    variant: 'info'
  })

  const [error, setError] = useState('')
  const [valueFile, setValueFile] = useState({})

  const handleSubmit = async (e) => {
    setError('')
    const data = new FormData()
    data.append('file', e.target.files[0])

    const MBSize = parseFloat(((e.target.files[0]?.size / 1024) / 1024).toFixed(4))
    e.preventDefault()

    const maxSize = props.question.config.maxSize ? parseInt(props.question.config.maxSize) : 10
    const maxFiles = props.question.config.max ? parseInt(props.question.config.max) : false
    if (maxFiles && maxFiles == props.value?.length) {
      setError(t('formularios>formulario_respuestas>error_limite_archivos', 'Límite de archivos alcanzado.'))
      return handleSnackBarShow(t('formularios>formulario_respuestas>error_limite_archivos', 'Límite de archivos alcanzado.'), 'error')
    }

    if (MBSize <= maxSize) {
      try {
        setUploading(true)
        const res = await axios.post(`${envVariables.BACKEND_URL}/api/GestorFormulario/${props.form.id}/Recurso`, data, {
          onUploadProgress: (event) => {
            const percentCompleted = Math.round((event.loaded * 100) / event.total)
          }
        })
        setFile(res)
        setUploading(false)

        props.handleOnChangeValue(
          !props.value
            ? [res.data.link]
            : [...props.value, res.data.link + '|' + res.data.fileName + '|' + `${MBSize}MB`]
        )
        props.handleOnChangeValue(
          !props.value
            ? [res.data.link]
            : [...props.value, res.data.link + '|' + res.data.fileName + '|' + `${MBSize}MB`]
        )
        handleSnackBarShow(t('formularios>formulario_respuestas>archivo_cargado_correctamente', 'Archivo cargado correctamente'), 'success')
      } catch (error) {
        setUploading(false)
        handleSnackBarShow(t('formularios>formulario_respuestas>error_subir_archivo', 'Error al subir el archivo'), 'error')
        setError(t('formularios>formulario_respuestas>error_subir_archivo', 'Error al subir el archivo.'))
      }
    } else {
      handleSnackBarShow(`${(t('formularios>formulario_respuestas>size_archivo', 'El tamaño del archivo no puede ser mayor a'))} ${props.question.config.maxSize ? props.question.config.maxSize : 10}MB (${t('formularios>formulario_respuestas>actual','actual')}: ${MBSize.toFixed(2)}MB)`, 'error')
      setError(
           `${(t('formularios>formulario_respuestas>size_archivo', 'El tamaño del archivo no puede ser mayor a'))} ${
             props.question.config.maxSize ? props.question.config.maxSize : 10
           }MB (${t('formularios>formulario_respuestas>actual','actual')}: ${MBSize.toFixed(2)})`
      )
    }

    setValueFile({ value: '' })
  }

  const handleDelete = async (link) => {
    setError('')
    setUploading(true)
    try {
      const res = await axios.delete(`${props.deleteResourceUrl}`, { url: link })
    } catch (e) {

    }
    setUploading(false)
    props.handleOnChangeValue(props.value.filter(el => {
      return el != link
    }))

    handleSnackBarShow(t('formularios>formulario_respuestas>archivo_eliminado', 'Archivo eliminado correctamente'), 'success')
  }

  const handleSnackBarShow = (msg: string, variant: string) => {
    setSnacbarContent({
      variant,
      msg
    })
    handleSnackBarClick()
  }

  return (
    <div>
      {snackBar(snackbarContent.variant, snackbarContent.msg)}
      <div>
        {error && (
          <div className='row'>
            <div className='col-md-12'>
              <span className='span-error'><p>{error}</p></span>
            </div>
          </div>
        )}

        {!props.disabled && <p>
          {props.question.config.min !== undefined
            ? `- ${t('formularios>formulario_respuestas>requiere_minimo', 'Se requiere como mínimo')} ` +
                props.question.config.min +
                ` ${t('formularios>formulario_respuestas>archivos', 'archivos')}.`
            : ''}

          {props.question.config.min !== undefined ? <br /> : ''}

          {props.question.config.max !== undefined
            ? `- ${t('formularios>formulario_respuestas>puede_subi', 'Puede subir hasta')} ` +
                props.question.config.max +
                ` ${t('formularios>formulario_respuestas>archivos', 'archivos')}.`
            : ''}

          {props.question.config.max !== undefined ? <br /> : ''}

          {props.question.config.maxSize != undefined
            ? `- ${t('formularios>formulario_respuestas>archivos_max_size', 'Archivos con tamaño no mayor a')}  ` +
                props.question.config.maxSize +
                ' MB.'
            : ''}
        </p>}

        {!props.disabled && <Button
          className='btnFileClass'
          size='lg'
          onClick={() => {
            fileToUploadRef.current.click()
          }}
          disabled={props.disabled}
                            >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#423e3e',
              margin: '-1px'
            }}
          >
            <BackupIcon className='iconSube' /> {t('formularios>formulario_respuestas>subir_archivo', 'Subir archivo')}
          </div>
        </Button>}

        <input
          ref={fileToUploadRef}
          type='file'
          accept={
              props.question.config.fileTypes &&
              props.question.config.fileTypes.length > 0
                ? props.question.config.fileTypes
                : '*'
            }
          style={{
            opacity: 0,
            display: 'none'
          }}
          onChange={(e) => handleSubmit(e)}
          {...valueFile}
        />
        {uploading
          ? (
            <Loading>
              <div className='single-loading' />
            </Loading>
            )
          : null}
        {props.value &&
            props.value.map((el) => {
              const _aParts = el.split ? el.split('|') : []
              return (
                <div style={{ display: 'flex' }}>
                  <a href={_aParts[0]} target='_blank' rel='noreferrer'>
                    <b>
                      {_aParts[1]}{' '}
                      {props.question.config.showSize && _aParts[2]}
                    </b>
                  </a>
                  {!props.disabled && <DeleteIcon
                    className='cursor-pointer'
                    onClick={(e) => {
                      e.preventDefault()
                      handleDelete(el)
                    }}
                                      />}
                </div>
              )
            })}
      </div>
    </div>
  )
}

const Loading = styled.div`
    position: absolute;
    background: rgba(255, 255, 255, 0.7);
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`

export default SubirArchivo
