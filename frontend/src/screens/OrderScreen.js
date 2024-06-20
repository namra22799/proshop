import React, {useState, useEffect} from 'react'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {getOrderDetails, payOrder, deliverOrder} from '../actions/orderActions'
import {
    PayPalButton
} from 'react-paypal-button-v2'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants'
function OrderScreen() {

    let params = useParams();
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [sdkReady, setSdkReady] = useState(false)

    const orderId = params.id

    const orderDetails = useSelector(state=> state.orderDetails)
    const { order, error, loading} = orderDetails

    const orderPay = useSelector(state=> state.orderPay)
    const { loading: loadingPay, success : successPay} = orderPay

    const orderDeliver = useSelector(state=> state.orderDeliver)
    const { loading: loadingDeliver, success : successDeliver} = orderDeliver

    const userLogin = useSelector(state=> state.userLogin)
    const { userInfo } = userLogin

    if(!loading && !error){
        order.itemsPrice  = order.orderItems.reduce((acc, item)=> acc + item.price * item.qty, 0).toFixed(2)
    }
    // Client - AQ6nweYINjWKsYHRbHGclg0nCJZsoQxPIIGM-VuwKuBUd_5J-K0epDt4UGJiozaysf8CQKNCkNr3j_3D

    const addPaypalScript = () =>{
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = 'https://www.paypal.com/sdk/js?client-id=AQ6nweYINjWKsYHRbHGclg0nCJZsoQxPIIGM-VuwKuBUd_5J-K0epDt4UGJiozaysf8CQKNCkNr3j_3D'
        script.async = true
        script.onload = () =>{
            setSdkReady(true)
        }
        document.body.appendChild(script)
    }
    useEffect(()=>{
        if(!userInfo){
            navigate('/login')
        }
        if(!order || successPay || order._id !== Number(orderId) || successDeliver){
            dispatch({
                type : ORDER_PAY_RESET
            })
            dispatch({
                type : ORDER_DELIVER_RESET
            })
            dispatch(getOrderDetails(orderId))
        }
        else if(!order.isPaid){
            if(!window.paypal){
                addPaypalScript()
            }
            else{
                setSdkReady(true)
            }
        }
    }, [dispatch, order, orderId, successPay, successDeliver])

    const successPaymentHandler = (paymentResult) =>{
        dispatch(payOrder(orderId, paymentResult))
    }

    const deliverHandler = () =>{
        dispatch(deliverOrder(order))
    }

    return (
        loading 
            ? 
        <Loader/> 
            : 
            error 
                ? 
            <Message variant='danger'> {error} </Message> 
                : 
        <div>
            <h1>Order : {order._id} </h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>
                                Order Detail
                            </h2>
                            <p><strong>Name: </strong>{order.user.name}</p>
                            <p><strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                            <p>
                                <strong>Shipping: </strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city}
                                {'    '}
                                {order.shippingAddress.postalCode}, {'    '}{order.shippingAddress.country}
                            </p>
                            <p>
                                {
                                    order.isDelivered 
                                    ? 
                                    ( <Message variant='success'> <i class="fa-solid fa-truck"></i> Delivered on {order.deliveredAt}</Message> )
                                    :
                                    ( <Message variant='warning'> <i class="fa-solid fa-truck"></i> Not Delivered</Message> )
                                    
                                }
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong>
                                {order.paymentMethod}
                            </p>
                            <p>
                                {
                                    order.isPaid 
                                    ? 
                                    ( <Message variant='success'>Paid on {order.paidAt}</Message> )
                                    :
                                    ( <Message variant='warning'>Not Paid</Message> )
                                    
                                }
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {
                                order.orderItems.length === 0 
                                    ? 
                                <Message variant='info'>Order is empty</Message>
                                    :
                                (
                                    <ListGroup variant='flush'>
                                        {order.orderItems.map((item, index)=>(
                                            <ListGroup.Item key={index}>
                                                <Row>
                                                    <Col md={1}>
                                                        <Image src={item.image} alt={item.name} fluid rounded />
                                                    </Col>
                                                    <Col>
                                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                    </Col>
                                                    <Col md={4}>
                                                        {item.qty} X ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )
                            }
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Item:</Col>
                                    <Col><strong>${order.itemsPrice}</strong></Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col><strong>${order.shippingPrice}</strong></Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax:</Col>
                                    <Col><strong>${order.taxPrice}</strong></Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col><strong>${order.totalPrice} </strong></Col>
                                </Row>
                            </ListGroup.Item>
                            {
                                !order.isPaid && (
                                    <ListGroup.Item>
                                        {
                                            loadingPay && <Loader/>
                                        }
                                        {
                                            !sdkReady ? (
                                                <Loader/>
                                            ):(
                                                <PayPalButton 
                                                    amount={order.totalPrice}
                                                    onSuccess={successPaymentHandler}
                                                />
                                            )
                                        }
                                    </ListGroup.Item>
                                )
                            }
                        </ListGroup>
                        {
                            loadingDeliver && <Loader/>
                        }
                        {
                            userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                <ListGroup.Item className='d-grid gap-2'>
                                    <Button type='button' className='btn btn-block m-1' onClick={deliverHandler}>
                                        Mark As Delivered
                                    </Button>
                                </ListGroup.Item>
                            )
                        }
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default OrderScreen
