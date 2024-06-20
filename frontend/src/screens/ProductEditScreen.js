import React, {useState, useEffect} from 'react'
import {Link, redirect, useParams} from 'react-router-dom'
import axios from 'axios'
import { Form, Button, Row, Col, Container, Image} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listProductDetails, updateProduct } from '../actions/productActions'
import FormContainer from '../components/FormContainer'
import { useLocation, useNavigate } from 'react-router-dom'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'
function ProductEditScreen() {
 
    let params = useParams()
    const productId = params.id

    const  [name, setName] = useState('')
    const  [price, setPrice] = useState(0)
    const  [image, setImage] = useState('')
    const  [brand, setBrand] = useState('')
    const  [category, setCategory] = useState('')
    const  [countInStock, setCountInStock] = useState(0)
    const  [description, setDescription] = useState('')
    const  [uploading, setUploading] = useState(false)

    const productDetails = useSelector(state=> state.productDetails)
    const {error, loading, product} = productDetails

    const productUpdate = useSelector(state=> state.productUpdate)
    const {error: errorUpdate, loading : loadingUpdate, success : successUpdate} = productUpdate

    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const redirect = location.search ? new URLSearchParams(location.search).get("redirect") || '/' : '/'
    useEffect(()=>{
        if(successUpdate){
            dispatch({
                type: PRODUCT_UPDATE_RESET
            })
            navigate('/admin/productlist')
        }
        else{
            if(!product.name || product._id !== Number(productId)){
                dispatch(listProductDetails(productId))
            }
            else{
                setName(product.name)
                setPrice(product.price)
                setImage(product.image)
                setBrand(product.brand)
                setCategory(product.category)
                setCountInStock(product.countInStock)
                setDescription(product.description)
    
            }
        }
    },[dispatch, product, productId, navigate, successUpdate])
    const submitHandler = (e)=>{
        e.preventDefault()
        // update Product

        dispatch(updateProduct({
            _id : productId,
            name, 
            price,
            image,
            brand, 
            category, 
            countInStock,
            description
        }))
    }
    const uploadFileHandler = async (e)=>{
        const file = e.target.files[0]
        const formData = new FormData()

        formData.append('image', file)
        formData.append('product_id', productId)

        setUploading(true)
        try{
            const config = {
                headers:{
                    'Content-Type' : 'multipart/form-data'
                }
            }
            const {data} = await axios.post('/api/products/upload/', formData)
            setImage(data)
            setUploading(false)
        }
        catch(error){
            setUploading(false)
        }
    }
    return (
    <div>
        <Link to='/admin/productlist'>
        Go Back
        </Link>
        <Container>
        <h1>Edit Product</h1>
        {
            loadingUpdate && <Loader/>
        }
        {
            errorUpdate && <Message variant='danger'>{errorUpdate}</Message>
        }
        {
            loading 
                ? 
            <Loader/> 
                : 
            error 
                    ?
                (
                    <Message variant='danger'>{error}</Message>
                )
                    :
                (
                    <Form onSubmit={submitHandler}>
                        <Row>
                            <Col sm={12} md= {6} lg={4}>
                                <Form.Group controlId='name'>
                                    <Form.Label>
                                    Name
                                    </Form.Label>
                                    <Form.Control type='name' placeholder='Enter Name' value={name} onChange={(e)=> setName(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='price'>
                                    <Form.Label>
                                    Price
                                    </Form.Label>
                                    <Form.Control type='number' placeholder='Enter Price' value={price} onChange={(e)=> setPrice(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='brand'>
                                    <Form.Label>
                                    Brand
                                    </Form.Label>
                                    <Form.Control type='text' placeholder='Enter Brand' value={brand} onChange={(e)=> setBrand(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col sm={12} md= {6} lg={4}>
                                
                                <Form.Group controlId='countinstock'>
                                    <Form.Label>
                                    Stock
                                    </Form.Label>
                                    <Form.Control type='number' placeholder='Enter Stock' value={countInStock} onChange={(e)=> setCountInStock(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='description'>
                                    <Form.Label>
                                        Description
                                    </Form.Label>
                                    <Form.Control type='text' as='textarea' rows={4} placeholder='Enter Description' value={description} onChange={(e)=> setDescription(e.target.value)}>
                                    </Form.Control>
                                </Form.Group> 
                            </Col>
                            <Col sm={12} md= {6} lg={4}>
                                <Form.Group controlId='category'>
                                    <Form.Label>
                                    Category
                                    </Form.Label>
                                    <Form.Control type='text' placeholder='Enter Category' value={category} onChange={(e)=> setCategory(e.target.value)}>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId='image'>
                                    <Form.Label>
                                    Image
                                    </Form.Label>
                                    {/* <Form.Control type='text' placeholder='Enter Image' value={image} onChange={(e)=> setImage(e.target.value)}>
                                    </Form.Control> */}
                                    <Form.Control className='mt-2' type="file" onChange={uploadFileHandler}/>
                                    {
                                        uploading 
                                            ? <Loader/>
                                            :
                                            (
                                                <Image className='mt-2 w-50' src={image} alt={image} fluid>
                                                </Image>
                                            )
                                    }
                                </Form.Group> 
                            </Col>
                        </Row>
                        
                        <Button type='submit' className='mt-3' variant='primary'>
                            Update
                        </Button>
                    </Form>
                )
        }
                
        </Container>
    </div>
    )
}

export default ProductEditScreen
