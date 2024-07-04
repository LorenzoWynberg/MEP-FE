import React, { useState, useEffect, useRef } from 'react'
import Modal from 'Components/Modal/simple'
import { Input, Label, Button } from 'reactstrap'
import styled from 'styled-components'
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto'
import Select from 'react-select'
import CustomSelectInput from 'Components/common/CustomSelectInput'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import { useSelector } from 'react-redux'
import { useActions } from 'Hooks/useActions'
import { getTipoRoles, getById } from 'Redux/roles/actions'
import { ChromePicker } from 'react-color'
import colors from 'Assets/js/colors'
import Loader from 'Components/LoaderContainer'
import { getBase64Promise } from 'Utils/getBase64'

const ModalAddRole = (props) => {
  const { openDialog, setOpenDialog, save, edit, rol, close } = props

  const [name, setName] = useState<string>('')
  const [file, setFile] = useState<File>(null)
  const [preview, setPreview] = useState<string>('')
  const [color, setColor] = useState<string>(colors.primary)
  const [displayColorPicker, setDisplayColorPicker] = useState<boolean>(false)
  const [tipoRol, setTipoRol] = useState<any>(null)
  const inputFile = useRef(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<any>({})
  const [role, setRole] = useState<any>({})

  const actions = useActions({
    getTipoRoles,
    getById
  })

  const state = useSelector((store: any) => {
    return {
      rol: store.roles.rol,
      roles: store.roles,
      tipoRoles: store.roles.tipoRoles
    }
  })
  const clear = () => {
    setError({})
    setFile(null)
    setName('')
    setPreview('')
    setColor(colors.primary)
    setTipoRol(null)
  }

  useEffect(() => {
    const fetch = async () => {
      await actions.getTipoRoles()
    }
    fetch()
  }, [])

  useEffect(() => {
    return () => {
      clear()
      close()
    }
  }, [])

  useEffect(() => {
    if (rol?.id) {
      setData()
    }
  }, [rol])

  const setData = async () => {
    const _tipo = state.tipoRoles.find((tipo) => tipo.id === rol.sB_TipoRolId)
    setName(rol.nombre)
    setPreview(rol.urlimg)
    setColor(rol.color)
    setTipoRol(_tipo)
  }

  const handleClickUpload = () => {
    inputFile.current.click()
  }

  const onUploadFile = (e) => {
    const _file = e.target.files[0]
    if (_file) {
      const _preview = URL.createObjectURL(_file)
      setPreview(_preview)
      setFile(_file)
    }
  }

  const onSave = async () => {
    const _error: any = {}
    try {
      if (!name) {
        _error.name = 'El nombre es requerido'
      }
      if (!tipoRol) {
        _error.tipoRol = 'El tipo de rol es requerido'
      }
      setError(_error)

      let srcBase64 = ''
      if (file) {
        srcBase64 = await getBase64Promise(file)
      }

      if (Object.keys(_error).length === 0) {
        const data = {
          RoleId: rol?.id,
          removeImage: !preview,
          Nombre: name.toUpperCase(),
          SB_TipoRoles_id: tipoRol.id,
          color,
          IconoRol: file
            ? {
                nombreArchivo: 'ICONO-ROl' + name,
                archivoBase64: srcBase64
						  }
            : null
        }

        let _response = {}
        setLoading(true)
        if (rol?.id) {
          _response = await edit(data)
        } else {
          _response = await save(data)
        }
        clear()
        close()
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
    }
  }

  const handleClearImage = () => {
    setFile(null)
    setPreview(null)
  }
  const onCloseModal = () => {
    clear()
    close()
    setOpenDialog(false)
  }

  const onChangeColor = (value) => {
    rol ? setColor(value.hex) : setColor('#145388')
    setColor(value.hex)
  }
  useEffect(() => {
    if (!rol) return setColor('#145388')
  }, [rol])
  return (
    <Modal
      title={`${rol ? 'Editar' : 'Crear'} rol`}
      openDialog={openDialog}
      txtBtn='Guardar'
      txtBtnCancel='Cancelar'
      onClose={() => {
			  onCloseModal()
      }}
      onConfirm={() => onSave()}
    >
      <Form>
        {loading && <Loader />}
        <Label>Nombre del rol</Label>
        <InputStyled
          name='name-Rol'
          className='mb-2'
          value={rol ? name : null}
          onChange={(e) => setName(e.target.value.toUpperCase())}
        />
        {error.name && <Error>{error.name}</Error>}
        <Label>Tipo de rol</Label>
        <SelectStyled
          components={{ Input: CustomSelectInput }}
          menuPortalTarget={document.body}
          styles={{
					  menuPortal: (provided, state) => ({
					    ...provided,
					    zIndex: 9999
					  })
          }}
          className='react-select mb-2'
          classNamePrefix='react-select'
          options={state.tipoRoles}
          noOptionsMessage={() => 'Sin opciones '}
          getOptionLabel={(option: any) => option.nombre}
          getOptionValue={(option: any) => option.id}
          placeholder=''
          value={rol ? tipoRol : undefined}
          onChange={(e) => setTipoRol(e)}
        />
        {error.tipoRol && <Error>{error.tipoRol}</Error>}
        <Label>Seleccione el color</Label>
        <Swatch onClick={() => setDisplayColorPicker(true)}>
          <Color color={color} />
        </Swatch>
        {displayColorPicker
          ? (
            <Popover>
              <Cover onClick={() => setDisplayColorPicker(false)} />
              <ChromePicker
                color={color}
                onChange={(value) => {
							  onChangeColor(value)
                }}
              />
            </Popover>
            )
          : null}

        {!preview
          ? (
            <Upload>
              <Label>Imagen del rol</Label>

              <ButtonStyled
                className='d-flex align-items-center justify-content-center'
                size='lg'
                color='primary'
                onClick={() => handleClickUpload()}
              >
                <AddAPhotoIcon />
                Subir imagen
              </ButtonStyled>
              <input
                accept='pdf/*'
                id='profile-rol'
                type='file'
                name='picRol'
                ref={inputFile}
                onChange={(e) => onUploadFile(e)}
                style={{ display: 'none' }}
              />
            </Upload>
            )
          : (
            <Viewer>
              <Img>
                <img src={`${preview}`} alt='Upload' />
              </Img>
              <IconButtonStyled
                aria-label='more'
                id='menu-button'
                aria-haspopup='true'
                onClick={() => handleClearImage()}
              >
                <CloseIcon fontSize='small' />
              </IconButtonStyled>
            </Viewer>
            )}
      </Form>
    </Modal>
  )
}
const Form = styled.div`
	min-width: 600px;
`
const Viewer = styled.div`
	margin-top: 20px;
	margin-bottom: 20px;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 5px;
`
const Upload = styled.div`
	margin-top: 20px;
	margin-bottom: 20px;
`
const Img = styled.div`
	width: 200px;
	position: relative;
	height: auto;
	img {
		width: 100%;
	}
`

const Swatch = styled.div`
	padding: 5px;
	background: #fff;
	border-radius: 1px;
	box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
	cursor: pointer;
	width: 50px;
`

const Color = styled.div<{ color: string }>`
	width: 40px;
	height: 20px;
	background: ${(props) => props.color};
`
const Popover = styled.div`
	position: absolute;
	z-index: 2;
`
const Cover = styled.div`
	position: fixed;
	top: 0px;
	right: 0px;
	bottom: 0px;
	left: 0px;
`
const ButtonStyled = styled(Button)`
	gap: 5px;
`
const IconButtonStyled = styled(IconButton)`
	background: ${colors.primary};
	color: #fff;
`
const Error = styled.div`
	color: ${colors.error};
	font-size: 12px;
	margin-bottom: 5px;
`
const InputStyled = styled(Input)`
	text-transform: uppercase;
`
const SelectStyled = styled(Select)`
	text-transform: uppercase;
`

export default ModalAddRole
