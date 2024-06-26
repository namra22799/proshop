import React, { useEffect} from 'react'
import {Row, Col} from 'react-bootstrap'
import { useDispatch, useSelector} from 'react-redux'
import Product from '../components/Product'
import { listProducts } from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import {useLocation} from 'react-router-dom'
import ProductCarousel from '../components/ProductCarousel'


function HomeScreen() {
  const dispatch = useDispatch()
  const productList = useSelector(state => state.productList)
  const { error, loading, products, page, pages} = productList
  const location = useLocation();
  let keyword = location.search;
  useEffect(()=>{
    dispatch(listProducts(keyword))
  }, [dispatch, keyword])
  return (
    <div>
        {!keyword && <ProductCarousel/>}
        <h1>Latest Products</h1>
        {
          loading 
            ?
              <Loader/>
            : 
              error 
            ? 
              <Message variant='danger'>{error}</Message> 
            : 
              <div>
                <Row>
                    {products.map(product=>(
                        <Col key={product._id}   md={6} lg={4} xl={3}>
                            <Product product={product}/>
                        </Col>
                    ))}
                </Row>
                <Paginate page={pages} pages={pages} keyword={keyword}/> 
              </div>
        }
    </div>
  )
}

export default HomeScreen
