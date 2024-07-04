import React, { useState, useEffect } from 'react'
import { Button, Input } from 'reactstrap'
import {
  getDestinatariosFilter,
  getUserRolesTypes
} from '../../../../redux/comunicados/actions'
import colors from '../../../../assets/js/colors'
import { useActions } from 'Hooks/useActions'
import { useSelector } from 'react-redux'
import ClearIcon from '@material-ui/icons/Clear'
import { useTranslation } from 'react-i18next'

const Destinatarios = (props) => {
  const [currentList, setCurrentList] = useState(null)
  const [searchValue, setSearchValue] = useState('')
  const [staggedList, setStaggedList] = useState([])
  const actions = useActions({ getDestinatariosFilter, getUserRolesTypes })
  const state = useSelector((store) => store.comunicados)
  const { t } = useTranslation()

  useEffect(() => {
    actions.getUserRolesTypes()
  }, [])

  useEffect(() => {
    setStaggedList(props.value.map((el) => ({ usuarioEmail: el })))
  }, [props.open])

  const onSearch = async (value = false, tipo = false) => {
    
    const resp = await actions.getDestinatariosFilter(
      value || searchValue,
      tipo || currentList
    )

    if (resp.error && props?.snackBarShow) {
      props?.snackBarShow(resp.error, 'warning')
    }
  }

  const addValue = (item) => {
    if (
      staggedList
        .map((item) => item.usuarioEmail)
        .includes(item.usuarioEmail)
    ) {
      setStaggedList(
        staggedList.filter(
          (el) => el.usuarioEmail !== item.usuarioEmail
        )
      )
    } else {
      setStaggedList([
        ...staggedList,
        { ...item, value: item.usuarioEmail }
      ])
    }
  }

  const save = () => {
    props.onChange(staggedList.map((el) => el.usuarioEmail))
    props.setOpen(
      false,
      staggedList.map((el) => el.usuarioEmail)
    )
    setStaggedList([])
  }

  if (props.open) {
    return (
      <div className='customModalBackground'>
        <div
          style={{
            pointerEvents: 'auto',
            position: 'absolute',
            width: '80vw',
            height: 'auto',
            border: '1px solid #eaeaea',
            padding: '1rem',
            backgroundColor: 'white',
            boxShadow: '0px -10px 15px 0px rgba(0, 0, 0, 0.04);'
          }}
        >
          <h1>{t('comunicados>destinatarios>agregar_destinatarios', 'Agregar destinatarios')}</h1>
          <p>
            {t('comunicados>destinatarios>seleccionar_destinatarios', 'Selecciona los destinatarios para agregar de su centro educativo')}
          </p>
          <div
            style={{
              display: 'flex',
              width: '100%',
              height: '55vh',
              marginBottom: '5px'
            }}
          >
            <div
              style={{
                backgroundColor: '#F2F2F2',
                width: '35%',
                paddingTop: '1rem'
              }}
            >
              {state.userRoleTypes.map((el) => {
                return (
                  <div
                    className='hoverColor'
                    style={{
                      cursor: 'pointer',
                      paddingLeft: '10px',
                      backgroundColor:
                        el.id === currentList
                          ? colors.primary
                          : '',
                      color:
                        el.id === currentList
                          ? 'white'
                          : ''
                    }}
                    onClick={() => {
                      
                      setCurrentList(el.id)
                      onSearch(false, el.id)
                    }}
                  >
                    <h5>{el.nombre}</h5>
                  </div>
                )
              })}
            </div>
            <div
              style={{
                backgroundColor: '#EDEBE9',
                width: '35%',
                padding: '5px',
                overflowY: 'auto'
              }}
            >
              <Input
                type='text'
                value={searchValue}
                style={{ marginBottom: '5px' }}
                placeholder='Buscar destinatarios'
                onChange={(e) => {
								  setSearchValue(e.target.value)
								  onSearch(e.target.value)
                }}
              />
              <span
                style={{
								  cursor: 'pointer',
								  color: colors.primary
                }}
                onClick={() => {
                  setStaggedList(
                    state.searchUsers.map((el) => ({
                      ...el,
                      value: el.usuarioEmail
                    }))
                  )
                }}
              >
                {t('comunicados>destinatarios>seleccionar_todos', 'Seleccionar todos')}
              </span>

              {state.searchUsers.map((el) => {
                return (
                  <div
                    className='mail-Item hoverColor'
                    style={{ display: 'flex' }}
                  >
                    <Input
                      type='checkbox'
                      checked={staggedList
                        .map(
                          (item) => item.usuarioEmail
                        )
                        .includes(el.usuarioEmail)}
                      style={{
                        marginLeft: '0',
                        position: 'unset'
                      }}
                      onClick={() => {
                        addValue(el)
                      }}
                    />
                    {el.fotografiaUrl && (
                      <img
                        src={el.fotografiaUrl}
                        style={{
                          height: '4rem',
                          width: '4rem',
                          borderRadius: '50%'
                        }}
                      />
                    )}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        color: '#838181',
                        fontSize: '11px'
                      }}
                    >
                      <span style={{ fontSize: '16px' }}>
                        {el.nombre
                          ? el.nombre
                          : el.usuario}
                      </span>
                      <span>{el.institucion}</span>
                      <span>
                        {el.regional
                          ? el.regional
                          : 'cargo'}
                      </span>
                      <span>{el.usuarioEmail}</span>
                    </div>
                  </div>
                )
              })}
            </div>
            <div
              style={{
                width: '35%',
                backgroundColor: 'white',
                padding: '5px',
                display: 'flex',
                flexWrap: 'wrap',
                border: '1px solid #eaeaea'
              }}
            >
              {staggedList?.map((el) => {
                return (
                  <span
                    style={{
                      border: '1px solid grey',
                      backgroundColor: colors.primary,
                      color: 'white',
                      borderRadius: '15px',
                      height: '1.5rem'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      {el.usuarioEmail}{' '}
                      <ClearIcon
                        onClick={() => {
                          addValue(el)
                        }}
                      />
                    </span>
                  </span>
                )
              })}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              height: '5vh',
              width: '100%',
              justifyContent: 'flex-end',
              paddingLeft: '5px'
            }}
          >
            <Button
              style={{ height: '3rem' }}
              color='primary'
              outline
              onClick={() => {
                setStaggedList([])
                props.setOpen(false, null)
              }}
            >
              {props.cancelName ? props.cancelName : t('comunicados>etiquetas>cancelar' ,'Cancelar')}
            </Button>
            <Button
              style={{ marginLeft: '10px', height: '3rem' }}
              color='primary'
              onClick={save}
            >
              Guardar
            </Button>
          </div>
        </div>
      </div>
    )
  } else {
    return null
  }
}

Destinatarios.defaultProps = {
  value: [],
  onChange: () => { }
}

export default Destinatarios
