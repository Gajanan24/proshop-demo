import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import FormContainer from '../components/FormContainer';

const RequestResetPassword = () => {
    const [email, setEmail] = useState('');

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/users/request-reset-password', { email });
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <FormContainer>
        <Form onSubmit={submitHandler}>
            <Form.Group controlId='email'  className='my-3'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                    type='email'
                    placeholder='Enter email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
            </Form.Group>
            <Button type='submit' variant='primary'>
                Request Password Reset
            </Button>
        </Form>
        </FormContainer>
    );
};

export default RequestResetPassword;
