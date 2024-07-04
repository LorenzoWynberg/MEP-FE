import React from 'react'
import styled from 'styled-components'
import { Separator } from 'Components/common/CustomBootstrap'

interface IProps {
	title: string
	subHeader?: string
	className?: any
}

const TitlePage: React.FC<IProps> = (props) => {
  const { title, className, subHeader } = props
  return (
    <Container>
      <h2 className={className.title}>{title}</h2>
      {subHeader && <p className={className.subHeader}>{subHeader}</p>}
      <Separator className={className.separator} />
    </Container>
  )
}

TitlePage.defaultProps = {
  title: '',
  className: { separator: 'mb-4', title: 'mb-2' }
}
const Container = styled.div``
export default TitlePage
