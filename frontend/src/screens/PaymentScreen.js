import React, {useState, useEffect} from 'react'
import { redirect} from 'react-router-dom'
import { Form, Button, Col, Row, FormGroup } from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { useLocation, useNavigate } from 'react-router-dom'
import {savePaymentMethod} from '../actions/cartActions'


function PaymentScreen() {
    const cart = useSelector(state => state.cart)
  const {shippingAddress} = cart

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [paymentMethod, setPaymentMethod] = useState('PayPal')
  
  if(!shippingAddress.address)
    {
        navigate("/shipping")
    }

    const submitHandler =(e) =>{
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/placeorder')
    }

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <Form onSubmit={submitHandler}>
        <Form.Group>
            <Form.Label as='legend'>
                Select Method
            </Form.Label>
            <Row className='m-2 '>
                <Col>
                    <Form.Check type='radio' label='Paypal or Credit Card' id='paypal' name='paymentMethod' checked onChange={(e)=>{setPaymentMethod(e.target.value)}}/>
                </Col>
            </Row>
        </Form.Group>
        <Button type='submit' variant='primary'>Continue</Button>
      </Form>   
    </FormContainer>
  )
}

export default PaymentScreen
