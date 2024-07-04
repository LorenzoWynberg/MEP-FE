import styled from 'styled-components'

export const StyledTr = styled.tr`
  margin: 1rem;

  th {
    @media (max-width: 768px) {
      display: none;
    }
  }
  td {
    padding: 15px;
    @media (max-width: 768px) {
      display: flex !important;
      flex-direction: column !important;
      margin: 0;
      text-align: center;
    }
  }
`
