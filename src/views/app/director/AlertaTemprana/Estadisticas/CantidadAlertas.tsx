import React from 'react'
import styled from 'styled-components'
import colors from '../../../../../assets/js/colors'
import { Line } from 'react-chartjs-2'
import moment from 'moment'
import { makeStyles, createStyles, withStyles } from '@material-ui/core/styles'
import LinearProgress from '@material-ui/core/LinearProgress'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap'
import { downloadReportFile } from '../../../../../redux/alertaTemprana/actions'

type IProps = {
    alerts: Array<any>,
    alertsEnrollment: Array<any>,
    handleChangeYear: Function,
    requesting: boolean
};

const useStyles = makeStyles({
  root: {
    width: '100%',
    borderRadius: 5
  },
  colorPrimary: {
    backgroundColor: colors.primary
  }
})

const BorderLinearProgress = withStyles(() =>
  createStyles({
    root: {
      borderRadius: 5
    },
    colorPrimary: {
      backgroundColor: '#d7d7d7'
    },
    bar: {
      borderRadius: 5,
      backgroundColor: colors.primary
    }
  })
)(LinearProgress)

const CantidadAlertas: React.FC<IProps> = (props) => {
  const [months, setMonths] = React.useState<Array<string>>()
  const [values, setValues] = React.useState<Array<number>>()
  const [visible, setVisible] = React.useState<boolean>(false)
  const years: number[] = [2021, 2020, 2019, 2018, 2017, 2016, 2015]
  const [year, setYear] = React.useState<number>(years[0])

  React.useEffect(() => {
    const parseValues = () => {
      const cmonths = []
      const cdata = []
      props.alerts.map((alert, i) => {
        cmonths.push(moment(alert.fecha).format('MMM'))
        cdata.push(alert.cantidad)
      })
      setMonths(cmonths)
      setValues(cdata)
    }

    parseValues()
  }, [props.alerts])

  const data = {
    labels: months,
    datasets: [
      {
        label: '',
        fill: true,
        lineTension: 0.2,
        backgroundColor: '#e5edf3',
        borderColor: '#00538c',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0,
        borderJoinStyle: 'bevel',
        pointBorderColor: '#fff',
        pointBackgroundColor: '#00538c',
        pointBorderWidth: 2,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 5,
        pointHitRadius: 10,
        data: values
      }
    ]
  }

  const options = {
    legend: {
      display: false
    }
  }

  const handleYear = (currentYear: number) => {
    setYear(currentYear)
    props.handleChangeYear(currentYear)
  }

  const downloadFile = (name: string, url: string) => {
    downloadReportFile(name, url)
  }

  return (
    <Row>
      <Content>
        <Card>
          <CardHead>
            <Title>Cantidad de alertas</Title>
            <Menu isOpen={visible} size='sm' toggle={() => setVisible(!visible)}>
              <ActionToogle color='primary' outline caret>
                {year}
              </ActionToogle>
              <DropdownMenu right>
                {
                                years.map((year, i) => <DropdownItem key={i} onClick={() => handleYear(year)}>{year}</DropdownItem>)
                              }
              </DropdownMenu>
            </Menu>
          </CardHead>
          <Line data={data} options={options} />
          {props.requesting ? <Loading><span className='single-loading' /></Loading> : null}
        </Card>
      </Content>
      <Content>
        <Card>
          <CardHead>
            <Title>Alertas vs Matrícula</Title>
            <Button onClick={() => downloadFile('Reporte_MatriculaVSContexto', 'Regional/MatriculaVsContexto/Reporte')} size='sm' color='primary' outline>Descargar reportes</Button>
          </CardHead>
          <ListItems>
            {
                       props.alertsEnrollment.map((alert, i) => {
                         const percent = (alert.alertas / alert.matriculas) * 100
                         return (
                           <Item key={i}>
                             <ItemHead>
                               <TitleAlert>{alert.regional}</TitleAlert>
                               <ItemCount>
                                 <TitleCount>{alert.alertas} / {alert.matriculas}</TitleCount>
                               </ItemCount>
                             </ItemHead>
                             <BorderLinearProgress variant='determinate' value={percent} />
                           </Item>
                         )
                       })
                     }
          </ListItems>
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
  min-height: 400px;
  position: relative;
  & h3{
      margin: 0;
  }
`

const Loading = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffffb8;
    position: absolute;
    z-index: 1;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
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

const Item = styled.div`
  margin-bottom: 20px;
`

const ItemHead = styled.div`
  display: flex;
  justify-content: space-between;
`

const ItemCount = styled.div`
  display: flex;
  justify-content: flex-start;
`

const TitleAlert = styled.span`
  color: #000;
`

const TitleCount = styled.span`
  color: #000;
`

const Menu = styled(Dropdown)`
    height: 24px;
`

const DownloadLink = styled.a`
  border-radius: 5px;
  padding: 5px 10px;
`

const ActionToogle = styled(DropdownToggle)`
    cursor: pointer;
`

export default CantidadAlertas
