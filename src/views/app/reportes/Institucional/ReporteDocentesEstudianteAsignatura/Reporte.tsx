import React from 'react'
import styled from 'styled-components'
import IconMEP from 'Assets/icons/IconMEP'
import IconSABER from 'Assets/icons/IconSABER'
import useFiltroReportes from '../../_partials/useFiltroReportes'
const Reporte = ({ reportData, reportParameters, innerRef }) => {
  const { grupoId, personaId } = reportParameters
  const { getAllInstitucionInfo, institucionId } = useFiltroReportes()
  const [institucionInfo, setInstitucionInfo] = React.useState<any>({})
  React.useEffect(() => {
    getAllInstitucionInfo(institucionId).then(info => {
      setInstitucionInfo(info)
    })
  }, [])
  const tableMetadata = React.useMemo(() => {
    const mapear = (item) => {
      return {
        asignatura: item.asignatura,
        docente: item.docente,
        correoElectronico: item.docenteEmail
      }
    }
    const data = reportData ? reportData.map(mapear) : []
    return { data }
  }, [])

  return (
    <div ref={innerRef}>
      <HeaderContainer>
        <IconLeft className='LR'>
          <IconMEP />
        </IconLeft>
        <RegionalRow className='REG'>
          <p>Ministerio de Educación pública</p>
          <p>{institucionInfo.regionNombre}</p>
          <p>{institucionInfo.circuitoNombre}</p>
        </RegionalRow>
        <InstitutionRow className='INST'>
          <PUppercase style={{ fontWeight: 600 }}>
            {institucionInfo.institucionNombre}
          </PUppercase>
          <p>Teléfonos: 2222-2222</p>
          <p>Correo institucional: info@mep.go.cr</p>
        </InstitutionRow>
        <IconRight className='LL'>
          <IconSABER />
        </IconRight>
      </HeaderContainer>
      <Card>
        <h3>REPORTE DOCENTE POR ESTUDIANTE POR ASIGNATURA</h3>
        <p>AÑO EDUCATIVO: 2021</p>
        <p>GRUPO: {grupoId.label}</p>
        <p>PERSONA ESTUDIANTE: {personaId.label}</p>

        <Table>
          <colgroup>
            <col style={{ marginLeft: '1rem', width: '30%' }} />
            <col />
            <col style={{ width: '30%', textAlign: 'right' }} />
          </colgroup>
          <thead>
            <tr>
              <th>Asignatura</th>
              <th>Docente</th>
              <th>Correo electrónico del docente</th>
            </tr>
          </thead>
          <tbody>
            {tableMetadata?.data.map((item) => {
						  return (
  <tr>
    <td>{item.asignatura}</td>
    <td>{item.docente}</td>
    <td>{item.correoElectronico}</td>
  </tr>
						  )
            })}
          </tbody>
        </Table>
      </Card>
    </div>
  )
}

const Card = styled.div`
	border-radius: 15px;
	min-width: 100%;
	min-height: 100%;
	border-color: gray;
	background: white;
	padding: 15px;
`

const Table = styled.table`
	margin-top: 2rem;
	border-collapse: collapse;
	width: 100%;
	text-align: center;
	& td:first-child,
	th:first-child {
		text-align: left;
	}
	& tr {
		border-bottom: 1pt solid black;
		border-top: 1pt solid black;
	}
	& th,
	td {
		padding-top: 10px;
		padding-bottom: 10px;
	}
`
const HeaderContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0px;
  grid-template-areas:
    'LL REG LR'
    'LL INST LR';
  border: 1px solid;
`
const IconLeft = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid;
  grid-area: LL;
`
const IconRight = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-left: 1px solid;
  grid-area: LR;
`
const InstitutionRow = styled.div`
  grid-area: INST;
  padding: 1% 2%;
  p {
    margin: 0;
    font-weight: 600;
    font-size: 14px;
  }
`
const PUppercase = styled.div`
  text-transform: uppercase;
  margin: 0;
`
const RegionalRow = styled.div`
  border-bottom: 1px solid;
  padding: 1% 2%;
  grid-area: REG;
  text-transform: uppercase;

  p {
    margin: 0;
    font-weight: 600;
    font-size: 14px;
  }
`

export default Reporte
