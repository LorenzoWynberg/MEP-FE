import { useWindowSize } from 'react-use'
import {
    Input,
    Row,
    Col,
    FormGroup,
    Card,
    CardBody,
    CardTitle,
    Container
} from 'reactstrap'

const FormOrientacion = () => {

    const { width } = useWindowSize()

    return (
        <Card className='pt-1r'>
            <CardBody
                style={
                    width < 900 ? { paddingLeft: 0, paddingRight: 0 } : {}
                }
            >
                <Container>
                    <Row>
                        <Col xs='12' md='3'>
                            <FormGroup>
                                <Input
                                    type='text'
                                    disabled

                                />
                            </FormGroup>
                        </Col>
                        <Col xs='12' md='3'>
                            <FormGroup>
                                <Input
                                    type='text'
                                    disabled

                                />
                            </FormGroup>
                        </Col>
                        <Col xs='12' md='3'>
                            <FormGroup>
                                <Input
                                    type='text'
                                    disabled

                                />
                            </FormGroup>
                        </Col>
                        <Col xs='12' md='3'>
                            <FormGroup>
                                <Input
                                    type='text'
                                    disabled

                                />
                            </FormGroup>
                        </Col>
                    </Row>
                </Container>

            </CardBody>
        </Card>
    )
}

export default FormOrientacion