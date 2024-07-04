import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap'
import { MdFindInPage } from 'react-icons/md'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import './general.css'
import useLecciones from './Lecciones/useLecciones.hook'
import LeccionesOtraInstitucion from './Lecciones/LeccionesOtraInstitucion'
import NombramientosIntegra from './Lecciones/NombramientosIntegra'
import { useTranslation } from 'react-i18next'
import { createProfessorLesson, getProfessorLessons, deleteProfessorLesson } from 'Redux/NombramientosProfesor/actions'
import { useActions } from 'Hooks/useActions'
import useNotification from 'Hooks/useNotification'
import { useSelector } from 'react-redux'
import { IState } from 'Redux/NombramientosProfesor/reducer'

interface ILocaleState {
	nombramientosProfesor: IState
}

const Lecciones = ({ funcionarioData }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const { t } = useTranslation()
  const {
    lecciones,
    leccionesAAsignar,
    leccionesAsignadas,
    leccionesDisponibles
  } = useLecciones({ idProfesor: funcionarioData.id })
  const { lessons } = useSelector((state: ILocaleState) => state.nombramientosProfesor)
  const [showLecOtraInst, setShowLecOtraInst] = useState(false)
  const [showNombIntegra, setShowNombIntegra] = useState(false)

  const [snackbar, handleClick] = useNotification()
  const [snackbarContent, setSnackbarContent] = useState({
    variant: '',
    msg: ''
  })

  const [inputValues, setInputValues] = useState({
    quantity: null
  })

  const actions: any = useActions({
    createProfessorLesson,
    getProfessorLessons,
    deleteProfessorLesson
  })

  useEffect(() => {
    actions.getProfessorLessons(funcionarioData.id, 1, 10)
  }, [])

  const buildLeccionresRow = (leccionesArray) => {
    return leccionesArray.map((item, index) => {
      return (
        <tr key={index}>
          <td>{item.asignaturaNombre}</td>
          <td style={{ textAlign: 'center' }}>{item.grupoNombre}</td>
          <td style={{ textAlign: 'center' }}>
            {item.leccionesCantidad}
          </td>
        </tr>
      )
    })
  }

  const toggle = () => {
    setModalOpen(!modalOpen)
  }

  return (
    <>
      {snackbar(snackbarContent?.variant, snackbarContent?.msg)}
      <LeccionesOtraInstitucion
        visible={showLecOtraInst}
        setVisible={setShowLecOtraInst}
      />
      <NombramientosIntegra
        visible={showNombIntegra}
        setVisible={setShowNombIntegra}
      />
      <Box style={{ overflowX: 'scroll' }}>
        <div className='div-column-lecciones'>
          <div>
            <h4>{funcionarioData?.nombreCompleto}</h4>
            <p style={{ margin: '0' }}>
              {t('configuracion>centro_educativo>ver_centro_educativo>asignar_director>editar>rol', 'Rol')}: {funcionarioData?.rol}
            </p>
            <p style={{ margin: '0' }}>{t('expediente_ce>recurso_humano>fun_ce>lecciones>empleador', 'Empleador')}: MEP</p>
          </div>
          <div className='margen'>
            <BoxMini>
              <Circle>
                <Span>{lessons ? lessons[0]?.cantidadLecciones || 0 : 0}</Span>
              </Circle>
              <div>
                <p style={{ margin: '0', marginLeft: '5px' }}>
                  {t('expediente_ce>recurso_humano>fun_ce>lecciones>lecciones_asignar', 'Lecciones a asignar')}
                </p>
                <button className='editar' onClick={toggle}>
                  {t('general>editar', 'Editar')}
                </button>
              </div>
            </BoxMini>
          </div>
          <div className='margen'>
            <BoxMini>
              <Circle>
                <Span>{leccionesAsignadas}</Span>
              </Circle>
              <p style={{ margin: '0', marginLeft: '5px' }}>
                {t('expediente_ce>recurso_humano>fun_ce>lecciones>lecciones_asignadas', 'Lecciones asignadas')}
              </p>
            </BoxMini>
          </div>
          <div className='margen'>
            <BoxMini>
              <Circle>
                <Span>{lessons ? lessons[0]?.cantidadLecciones || 0 : 0}</Span>
              </Circle>
              <p style={{ margin: '0', marginLeft: '5px' }}>
                {t('expediente_ce>recurso_humano>fun_ce>lecciones>lecciones_disponibles', 'Lecciones disponibles')}
              </p>
            </BoxMini>
          </div>
          <div>
            <div style={{ marginLeft: '5px' }}>
              {/* <Button
                color='primary'
                className='btnleccion'
                onClick={() => setShowNombIntegra(true)}
              >
                <AssignmentIndIcon
                  className='icon'
                  style={{ fontSize: '17px' }}
                />{' '}
                {t('expediente_ce>recurso_humano>fun_ce>lecciones>nombramiento_integra', 'Ver nombramiento en INTEGRA')}
              </Button> */}
              <Button
                color='primary'
                className='btnleccion'
                onClick={() => setShowLecOtraInst(true)}
              >
                <MdFindInPage className='icon' /> {t('expediente_ce>recurso_humano>fun_ce>lecciones>ver_lecciones_otros_centros', 'Ver lecciones en otras Centros educativos')}
              </Button>
            </div>
          </div>
        </div>
        <div style={{ margin: '20px' }}>
          <Table>
            <thead>
              <th style={{ width: '40%' }}>{t('expediente_ce>recurso_humano>fun_ce>lecciones>asignatura', 'Asignatura')}</th>
              <th style={{ width: '30%', textAlign: 'center' }}>
                {t('expediente_ce>recurso_humano>fun_ce>lecciones>grupo', 'Grupo')}
              </th>
              <th style={{ width: '30%', textAlign: 'center' }}>
                {t('expediente_ce>recurso_humano>fun_ce>lecciones>cantidad_lecciones_semanales', 'Cantidad de lecciones semanales')}
              </th>
            </thead>
            <tbody>{buildLeccionresRow(lecciones)}</tbody>
          </Table>
        </div>
        <Modal isOpen={modalOpen} toggle={toggle}>
          <ModalHeader toggle={toggle}>
            {t('expediente_ce>recurso_humano>fun_ce>lecciones>cantidad_lecciones_asignar', 'Cantidad de lecciones a asignar')}
          </ModalHeader>
          <ModalBody>
            <div>
              <p style={{ margin: '0' }}>
                {t('expediente_ce>recurso_humano>fun_ce>lecciones>cantidad_lecciones_semanales', 'Cantidad de lecciones semanales')}
              </p>
              <Input
                type='number'
                required
                name='quantity'
                value={inputValues?.quantity}
                onChange={(e) => {
								  setInputValues({
								    ...inputValues,
								    [e.target.name]: e.target.value
								  })
                }}
              />
              <p>
                *{t('expediente_ce>recurso_humano>fun_ce>lecciones>cantidad_msj', 'La cantidad máxima de lecciones semanales es de 48')}
              </p>
            </div>
          </ModalBody>
          <ModalFooter
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Button onClick={toggle} color='primary' outline>
              {t('general>cancelar', 'Cancelar')}
            </Button>
            <Button
              onClick={async () => {
							  if (!inputValues?.quantity) {
							    setSnackbarContent({
							      variant: 'error',
							      msg: 'La cantidad de lecciones es requerida.'
							    })
							    handleClick()
							    return
							  }
							  if (lessons?.length > 0) {
							    await actions.deleteProfessorLesson(lessons[0]?.id || 0)
							  }
							  const res = await actions.createProfessorLesson({
							    cantidadLecciones: Number(inputValues?.quantity),
							    rige: new Date(),
							    vence: new Date(),
							    profesoresInstitucion_Id: funcionarioData.id
                })

							  await actions.getProfessorLessons(funcionarioData.id, 1, 10)

							  if (res.error) {
							    setSnackbarContent({
							      variant: 'error',
							      msg: 'Ha ocurrido un error'
                  })
							    handleClick()
							  } else {
							    setSnackbarContent({
							      variant: 'success',
							      msg: 'Se han asignado las lecciones correctamente.'
                  })
							    handleClick()
							  }
							  toggle()
              }}
              color='primary'
            >
              {t('general>agregar', 'Agregar')}
            </Button>
          </ModalFooter>
        </Modal>
      </Box>
    </>
  )
}

export default Lecciones

const Td = styled.td`
	width: 30rem;
	height: 3rem;
	color: #fff;
	background: #145388;
`

const Box = styled.div`
	width: 100%;
	min-height: 30rem;
	height: 100%;
	background: #fff;
	border-radius: 10px;
	box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.2);
	margin-top: 1%;
`

const BoxMini = styled.div`
	width: 13rem;
	height: 5.5rem;
	border-radius: 5px;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	align-content: center;
	box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.2);
`

const Circle = styled.div`
	margin-left: 2%;
	display: flex;
	justify-content: center;
	align-items: center;
	align-content: center;
	background: #145388;
	color: #fff;
	width: 4rem;
	height: 4rem;
	border-radius: 50px;
`

const Span = styled.span`
	font-size: 20px;
	font-weight: bolder;
`

const Table = styled.table`
  width: 100%; 
  border-collapse: separate;
  border-spacing: 0px;

  thead th {
    padding: .5rem;
    background-color #145388;
    border: 1px solid #cdcdcd;
    color: #fff;
	&:last-child {
		border:1px solid #cdcdcd;
		border-radius:0 10px 0 0;
		/*border-top-right-radius: 10px;
		border-right: 1px solid #cdcdcd;*/
		border-radius:0 10px 0 0;
	}
	&:first-child {
		border:1px solid #cdcdcd;
		border-radius:10px 0 0 0;
		/*border-top-left-radius: 10px;
		border-left: 1px solid #cdcdcd;*/
	}
  }

  tbody tr {
	color: #909090;
	border:'1px solid #cdcdcd';
    &:nth-child(odd) {
      background-color: 'white';
    }
	&:nth-child(even) {
		background-color: #f2f2f2;
	}
	&:last-child td:first-child { border-bottom-left-radius: 10px; }
	&:last-child td:last-child { border-bottom-right-radius: 10px; }
    td {
      padding: .5rem;
      border-right: 1px solid #cdcdcd;
      border-left: 1px solid #cdcdcd;
	  border-bottom: 1px solid #cdcdcd;
    }
  }
`
