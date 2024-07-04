import React from 'react'
import { Colxx } from '../../../../components/common/CustomBootstrap'
import Breadcrumb from '../../../../containers/navs/Breadcrumb'

import styled from 'styled-components'

type HeadingProps = {
    title: string,
    subtitle?: string;
    description?: string;
    match?: any
}

const Heading: React.FC<HeadingProps> = (props) => {
  return (
    <Colxx xxs='12'>
      <BreadWithSubTitle>
        <Breadcrumb heading={props.title} match={props.match} hidePath />
        <Subtitle>{props.subtitle}</Subtitle>
      </BreadWithSubTitle>
      <HeadingDescription>{props.description}</HeadingDescription>
    </Colxx>
  )
}

const BreadWithSubTitle = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    & h1{
        margin: 0;
    }
`

const Subtitle = styled.span`
    color: #61606c;
    padding-left: 10px;
`

const HeadingDescription = styled.p`
    color: #000;
    font-size: 14px;
    width: 80%;
    margin-bottom: 40px;
`

export default Heading
