import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'

function SearchBox() {
    const [keyword, setKeyword] = useState('')

    let navigate = useNavigate()
    let location = useLocation()

    const submitHandler = (e) => {
        e.preventDefault()
        if(keyword){
          navigate(`/?keyword=${keyword}&page=1`);
        }
        else{
          navigate(location.pathname);
        }
    }
    return (
        <Form onSubmit={submitHandler} className='d-flex'>
            <Form.Control
                type='text'
                name='q'
                onChange={(e) => setKeyword(e.target.value)}
                className='mr-sm-2 ml-sm-5'
                placeholder='Search Product'
            ></Form.Control>

            <Button
                type='submit'
                variant='outline-info'
                className='p-2 mr-2'
            >
                <i class="fa-solid fa-magnifying-glass"></i>
            </Button>
        </Form>
    )
}
export default SearchBox
