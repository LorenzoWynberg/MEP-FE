import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Container, Row, Col } from 'reactstrap'
import HTMLTable from 'Components/HTMLTable'
import axios from 'axios'
import { envVariables } from 'Constants/enviroment'
import { format, parseISO } from 'date-fns'
import colors from 'Assets/js/colors'
import PrintIcon from '@material-ui/icons/Print'
import styled from 'styled-components'

const getNameAndId = (string) => {
  return string.split('|')
}

const AllStudentsPrint = (props) => {
  const [data, setData] = useState([])
  const { grupo, institucion, ofertaNivel } = props.match.params

  const [grupoNombre, grupoId] = getNameAndId(grupo)
  const [institucionNombre, institucionId] = getNameAndId(institucion)
  const [ofertaNivelNombre, ofertaNivelId] = getNameAndId(ofertaNivel)

  const columns = [
    {
      column: 'identificacion',
      label: 'Identificación'
    },
    {
      column: 'nombreCompleto',
      label: 'Nombre completo'
    },
    {
      column: 'fechaNacimientoP',
      label: 'Fecha nacimiento'
    },
    {
      column: 'nacionalidad',
      label: 'Nacionalidad'
    },
    {
      column: 'condicion',
      label: 'Condición',
      isBadge: true,
      color: (el) => {
        switch (el.condicionId) {
          case 1:
            return 'success'
          case 2:
            return 'danger'
          case 3:
            return 'warning'
          default:
            return 'warning'
        }
      }
    }
  ]

  useEffect(() => {
    const loadData = async () => {
      const response = await axios.get(`${envVariables.BACKEND_URL}/api/GestionGrupo/GetStudents?InstitucionId=${institucionId}&NivelId=${ofertaNivelId}&GrupoId=${grupoId}`)
      setData(response.data.map(el => {
        const parsedNationalities = JSON.parse(`{"item":${el.nacionalidades}}`)
        const foo = parsedNationalities.item[0]
        return { ...el, id: el.matriculaId, image: el.img, fechaNacimientoP: format(parseISO(el.fechaNacimiento), 'dd/MM/yyyy'), nacionalidad: parsedNationalities.item[0].Nacionalidad }
      }))
    }
    loadData()
  }, [])

  return (
    <div style={{ postion: 'relative' }}>
      <StyledPrintButton onClick={() => {
        window.print()
      }}
      >
        <PrintIcon />
      </StyledPrintButton>
      <Container>
        <Row>
          <Col xs='12' style={{ textAlign: 'center', marginTop: '2rem' }}>
            <h6 style={{ fontWeight: 'bold', color: colors.primary }}>
              {format(new Date(), 'MM/dd/yyyy')}
            </h6>
            <h4>
              Centro educativo: {institucionNombre}
            </h4>
            <h5>
              Oferta: {ofertaNivelNombre}
            </h5>
            <h5>
              Grupo: {grupoNombre}
            </h5>
          </Col>
          <Col xs='12'>
            <HTMLTable
              columns={columns}
              data={data}
              isBreadcrumb={false}
              match={props.match}
              tableName='label.printMembers'
              toggleModal={() => null}
              toggleEditModal={() => null}
              modalOpen={false}
              editModalOpen={false}
              showHeaders
              actionRow={false}
              readOnly
              hideMultipleOptions
              disableSelectAll
              modalfooter
              loading={false}
              orderBy={false}
              labelSearch={false}
              pageSize={data.length}
              customThumbList={false}
              listPageHeading={false}
              handleCardClick={() => null}
              disableSearch
            />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

const StyledPrintButton = styled.div`
    position: fixed;
    right: 15px;
    top: 15px;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    background-color: ${colors.primary};
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
`

export default withRouter(AllStudentsPrint)
