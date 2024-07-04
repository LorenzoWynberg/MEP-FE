import React from 'react'
import { setSelectedActiveYear, getActiveYears } from 'Redux/actions'
import { useDispatch, useSelector } from 'react-redux'
import OutlinedSelect from '../OutlinedSelect'

const AnioEducativoSelect = () => {
  const dispatch = useDispatch()
  const activeYears = useSelector((store:any) => store.authUser.activeYears)
  const selectedActiveYear = useSelector((store:any) => store.authUser.selectedActiveYear)
  const setLocalStorage = (strYear) => {
    try {
      // const item = JSON.parse(strYear)
      if(typeof !strYear == 'string') 
        localStorage.setItem('anioEducativo', strYear)
      else {
        localStorage.setItem('anioEducativo', JSON.stringify(strYear))
      }
    } catch (_) {

    }
  }
  const getLocalStorage = () => {
    try {
      const obj = localStorage.getItem('anioEducativo')
      const item = JSON.parse(obj)
      return item
    } catch (_) {

    }
  }
  React.useEffect(() => {
    dispatch(getActiveYears())

    const anio = getLocalStorage()
    if (anio) {
      /* dispatch(setSelectedActiveYear(anio)) */
      onChange(anio)
    }

  }, [])
  React.useEffect(() => {
    const anio = getLocalStorage()
    if (!anio && activeYears.length > 0) {
      //dispatch(setSelectedActiveYear(activeYears[0]))
      onChange(activeYears[0])
    }
  }, [activeYears])

  const onChange = (e) => {
    if(!e) return 
    let obj = null
    if(typeof e == 'object') obj = e
    else {
      obj = JSON.parse(e)
    }

    //const item = JSON.parse(obj)
    setLocalStorage(obj)
    dispatch(setSelectedActiveYear(obj))
  }
  if (activeYears.length == 0 && !selectedActiveYear?.id) return <></>

  return (
    <OutlinedSelect
      isSearchable={false}
      onChange={onChange}
      options={activeYears}
      value={selectedActiveYear}
    >
      {/* <option>Año educativo {selectedActiveYear.nombre}</option> */}
      {/* {activeYears?.map((year) => {
			  const isSelectedYear = year.id == selectedActiveYear.id
			  return (
  <option key={year.id} selected={isSelectedYear} value={JSON.stringify(year)}>
    {`Año educativo ${year.nombre}`}
  </option>
			  )
      })} */}
    </OutlinedSelect>
  )
}

export default AnioEducativoSelect
