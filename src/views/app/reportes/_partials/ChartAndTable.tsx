import React from 'react'
import { CardTitle, Card, CardBody } from 'reactstrap'
import ReactFC from 'react-froalacharts'
import FroalaCharts from 'froalacharts'
import FroalaTheme from 'froalacharts/themes/froalacharts.theme.froala'
import DataTable from './DataTable'

ReactFC.fcRoot(FroalaCharts, FroalaTheme)

interface IProps {
    data: any[],
    chartLabel: string,
    chartType: string
    columns: any[]
}

const ChartAndTable : React.FC<IProps> = (props) => {
  const columnDataSource = {
    chart: {
      showvalues: '0',
      theme: 'froala'
    },
    categories: [{
      category: props.data
    }],
    dataset: [{
      data: props.data
    }]
  }

  const pieDataSource = {
    chart: {
      use3DLighting: '0',
      showPercentValues: '1',
      decimals: '1',
      useDataPlotColorForLabels: '1',
      exportEnabled: '1',
      theme: 'froala'
    },
    data: [{ value: props.data.reduce((acc, cur) => cur.hombres + acc, 0), label: 'Hombres' }, { value: props.data.reduce((acc, cur) => cur.mujeres + acc, 0), label: 'Mujeres' }]
  }

  const chartConfigs = {
    type: props.chartType,
    width: 400,
    height: 300,
    dataFormat: 'json',
    dataSource: props.chartType == 'column' ? columnDataSource : pieDataSource
  }

  return (
    <Card>
      <CardBody>
        <CardTitle>
          {props.chartLabel}
        </CardTitle>
        <div className='fchartsOverlay' style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <ReactFC {...chartConfigs} />
          <DataTable columns={props.columns} data={props.data} reportName={props.chartLabel} />
        </div>
      </CardBody>
    </Card>
  )
}

export default ChartAndTable
