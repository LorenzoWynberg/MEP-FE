import styled from 'styled-components'
import DatePicker from 'react-datepicker'
export const Th0 = styled.th`
    width: 120px;
    min-width: 100px;
    height: 55px;
    background: #145388;
    color: white;
    border-right: 1px solid #fff;
    text-align: center
`

export const Th = styled.th`
    min-width: 200px;
    max-width: 250px;
    height: 55px;
    max-height: 120px;
    background: #145388;
    color: white;
    border-right: 1px solid #fff;
`

export const Center = styled.div`
    display: flex;
    justify-content: center;
    align-content: center:
    align-items: center;
`

export const Td = styled.td`
    min-width: 100px;
    max-width: 200px;
    height: 55px;

    
`

export const ThFecha = styled.td`
    width: 200px;
    height: 70px;
    background: #145388;
    border-right: 1px solid #fff
`

export const ThSearch = styled.td`
    width: 300px;
    height: 70px;
    background: #145388;
    border-right: 1px solid #fff;
`

export const DatePickerStyle = styled(DatePicker)`

`

export const Inputs = styled.div`
    display:flex;
    flex-direction: row;
    margin: 5%;
`

export const Span = styled.span`
    font-size: 15px;
    color: #fff;
    padding-left: 5%;
`
