import styled from 'styled-components'
export const Th = styled.th`
    min-width: 80px;
    max-width: 200px;
    height: 120px;
    max-height: 120px;
    background: #145388;
    color: white;
`
export const Td = styled.td`
    min-width: 80px;
    max-width: 200px;
    height: 120px;
    max-height: 120px;
`

export const CenterDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

export const DefButton = styled.button`
    background-color: transparent;
    border: none;
    font-weight: bolder;
    display: flex;
    justify-content: flex-end;
    align-content: flex-end;
    align-items: flex-end;
`

export const BlueButton = styled.button`
    background: #145388;
    color: white;
    border-radius: 50px;
    padding: 15px;
    border: none;
    font-weight: bolder;
    display: flex;
    justify-content: flex-end;
    align-content: flex-end;
    align-items: flex-end;
`

export const TextAreaCelda = styled.textarea`
    width: 100%;
    height: 100%;
    font-size: 0.8rem;
    padding: 0.75rem;
    resize: none;    
`

export const InputColumnName = styled.input`
    width: 90%;
    height: 30%;
    margin: 5%;
    padding: 0.75rem;
    line-height: 1;
    border: 1px solid #d7d7d7;
    font-size: 0.8rem;
    overflow: visible;
`
