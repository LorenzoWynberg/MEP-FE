import React from 'react'
import styled from 'styled-components'
import { Doughnut, Bar } from 'react-chartjs-2'
import { Button } from 'reactstrap'
import { downloadReportFile } from '../../../../../redux/alertaTemprana/actions'

type IProps = {
    alertsPercent: Array<any>,
    incidents: Array<any>
};

const AlertasDimensiones: React.FC<IProps> = (props) => {
  const [names, setNames] = React.useState<Array<string>>()
  const [values, setValues] = React.useState<Array<number>>()
  const [nameIncidents, setNameIncidents] = React.useState<Array<string>>()
  const [valueIncidents, setValueIncidents] = React.useState<Array<number>>()

  React.useEffect(() => {
    const parseValues = () => {
      const cnames = []
      const cvalues = []

      const inames = []
      const ivalues = []

      props.alertsPercent.map((alert, i) => {
        cnames.push(alert.nombre)
        cvalues.push(alert.valor)
      })

      props.incidents.splice(0, 5).map((alert, i) => {
        inames.push(alert.nombre)
        ivalues.push(alert.valor)
      })

      setNames(cnames)
      setValues(cvalues)
      setNameIncidents(inames)
      setValueIncidents(ivalues)
    }

    parseValues()
  }, [props.alertsPercent, props.incidents])

  const data = {
    labels: names,
    datasets: [
      {
        label: '',
        data: values,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }
    ],
    options: {
      elements: {
        center: {
          text: '',
          color: '#FF6384', // Default is #000000
          fontStyle: 'Arial', // Default is Arial
          sidePadding: 20, // Default is 20 (as a percentage)
          minFontSize: 25, // Default is 20 (in px), set to false and text will not wrap.
          lineHeight: 25 // Default is 25 (in px), used for when text wraps
        }
      }
    }
  }

  const incidents = {
    labels: nameIncidents,
    datasets: [
      {
        label: '',
        data: valueIncidents,
        backgroundColor: '#e5edf3',
        borderColor: '#00538c',
        borderWidth: 2
      }
    ]
  }

  const optionsIncidents = {
    responsive: true,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        ticks: {
          callback: function (value) {
            if (value.length > 10) {
              return value.substr(0, 10) + '...'
            } else {
              return value
            }
          }
        }
      }],
      yAxes: [{}]
    }
  }

  const downloadFile = (name: string, url: string) => {
    downloadReportFile(name, url)
  }

  return (
    <Row>
      <Content>
        <Card>
          <CardHead>
            <Title>Porcentaje de alertas por dimensión</Title>
            <Button onClick={() => downloadFile('Reporte_Porcentaje_Dimension', 'Dimensiones/Porcentaje/Reporte')} size='sm' color='primary' outline>Descargar reportes</Button>
          </CardHead>
          <Doughnut data={data} />
        </Card>
      </Content>
      <Content>
        <Card>
          <CardHead>
            <Title>Alertas de mayor incidencia</Title>
            <Button onClick={() => downloadFile('Reporte_Mayor_Incidencia', 'Max/Incidencias/Reporte')} size='sm' color='primary' outline>Descargar reportes</Button>
          </CardHead>
          <Bar data={incidents} options={optionsIncidents} />
        </Card>
      </Content>
    </Row>
  )
}

const Row = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 48%);
    justify-content: space-between;
    align-items: flex-start;
`

const Content = styled.div`
    flex-direction: column;
`

const Title = styled.h3`
    color: #000;
    font-size: 17px;
`

const Card = styled.div`
  background: #fff;
  margin-top: 30px;
  border-radius: calc(0.85rem - 1px);
  box-shadow: 0 1px 15px rgba(0, 0, 0, 0.04), 0 1px 6px rgba(0, 0, 0, 0.04);
  padding: 15px 15px;
  & h3{
      margin: 0;
  }
`

const CardHead = styled.div`
  display: flex;
  padding: 10px 0px 30px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

const ListItems = styled.div`
  flex-direction: column;
`

export default AlertasDimensiones
