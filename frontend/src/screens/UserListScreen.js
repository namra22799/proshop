import React, {useState, useEffect} from 'react'
import {LinkContainer} from 'react-router-bootstrap'
import { Form, Button, Table } from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useLocation, useNavigate } from 'react-router-dom'
import {listUsers, deleteUser} from '../actions/userActions'
function UserListScreen() {
    const dispatch = useDispatch();
    const userList = useSelector(state => state.userList)
    const { loading, error, users} = userList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo} = userLogin

    const userDelete = useSelector(state => state.userDelete)
    const {success : successDelete} = userDelete
    const navigate = useNavigate()
    useEffect(()=>{
        if(userInfo && userInfo.isAdmin){
            dispatch(listUsers())
        }
        else{
            navigate('/login')
        }
    },[dispatch, navigate, successDelete, userInfo])

    const deleteHandler = (id)=>{
        if(window.confirm('Are you sure, you want to delete this user?'))
        {
            dispatch(deleteUser(id))
        }
    }
  return (
    <div>
      <h1>Users</h1>
      {
        loading 
            ? 
            (<Loader/>) 
            :
             error 
                ?
                <Message variant='danger'>{error}</Message> 
                : 
                (
                    <Table striped hover bordered responsive className='table-sm table-dark'>
                        <thead className='text-center'>
                            <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>ADMIN</th>
                            <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                users.map(user =>(
                                    <tr key={user._id} className='text-center'>
                                        <td>{user._id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{
                                                user.isAdmin
                                                ? 
                                                <i className='fas fa-check' style={{color: 'green'}}></i>
                                                :
                                                <i className='fas fa-check' style={{color: 'red'}}></i>
                                            }</td>
                                        <td>
                                            <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                                <Button variant='light' className='btn-sm'>
                                                    <i className='fas fa-edit'></i>
                                                </Button>
                                            </LinkContainer>&nbsp;
                                            <Button variant='dark' className='btn-sm' onClick={()=> deleteHandler(user._id)}>
                                                <i className='fas fa-trash' style={{color:'red'}}></i>
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                )
      }
    </div>
  )
}

export default UserListScreen
