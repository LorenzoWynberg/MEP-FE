import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import AppLayout from '../../../layout/AppLayout'
import directorMenu from 'Constants/directorMenu'
import { setTemaValue } from 'Redux/tema/actions'
const ThemeEditor = () => {
  const tema = useSelector((store: any) => store.tema)
  const dispatch = useDispatch()

  const onChangeColor = (e, key) => {
    const newState = { ...tema, [key]: e.target.value }

    dispatch(setTemaValue(newState))
  }
  return (
    <AppLayout items={directorMenu}>
      <DivContainer>
        {Object.keys(tema).map((key) => {
				  return (
  <>
    <label style={{ textAlign: 'right' }}><b>{key}</b></label>
    <input onChange={e => onChangeColor(e, key)} value={tema[key]} type='color' />
  </>
				  )
        })}
      </DivContainer>
      <textarea style={{ marginTop: '50px', width: '100%' }} rows={50} cols={50} value={JSON.stringify(tema, null, 4)} />
    </AppLayout>
  )
}

const DivContainer = styled.div`
	display: grid;
	grid-template-columns: repeat(10,1fr);
	width: 100%;
	gap: 10px;
`

export default ThemeEditor
