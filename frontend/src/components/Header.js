import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {LinkContainer} from 'react-router-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import { NavDropdown } from 'react-bootstrap';
import {logout} from '../actions/userActions'
import SearchBox from './SearchBox'
function Header() {
  const userLogin = useSelector(state=>state.userLogin)
  const {userInfo} = userLogin
  const dispatch = useDispatch()
  const logoutHandler = () =>{
    dispatch(logout())
  }
  return (
    <div>
      <header>
        <Navbar expand="lg" className='py-2'>
          <Container>
            <LinkContainer to='/'> 
              <Navbar.Brand className='fw-bold fs-3' >Pro Shop</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll" className='justify-content-md-end'>
              <SearchBox/>
              <Nav
                className="mr-auto my-2 my-lg-0"
                style={{ maxHeight: '100px' }}
                navbarScroll
              >
                <LinkContainer className='ml-2' to='/cart'> 
                  <Nav.Link><i className='fas fa-shopping-cart'></i> Cart</Nav.Link>
                </LinkContainer>
                {
                  userInfo && userInfo.isAdmin && (
                    <NavDropdown title='Admin' id='adminmenu'>
                      <LinkContainer to='/admin/userlist'>
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to='/admin/productList'>
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to='/admin/orderlist'>
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )
                }
                {
                  userInfo
                    ?
                    <NavDropdown title={userInfo.name} id='username'>
                      <LinkContainer to='/profile'>
                        <NavDropdown.Item>Profile</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                    </NavDropdown>
                    :
                    (
                      <LinkContainer to='/login'> 
                        <Nav.Link><i className='fas fa-user'></i> Log in</Nav.Link>
                      </LinkContainer>
                    )
                }
              </Nav>
        
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    </div>
  )
}

export default Header
