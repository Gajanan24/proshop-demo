import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import FormContainer from '../components/FormContainer';

const ResetpasswordScreen = () => {
    const { resetToken } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            const res = await axios.post(`http://localhost:5000/api/users/reset-password/${resetToken}`, { password });
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <FormContainer>
        <Form onSubmit={submitHandler}>
            <Form.Group controlId='password'  className='my-3'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type='password'
                    placeholder='Enter new password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
            </Form.Group>
            <Form.Group controlId='confirmPassword'  className='my-3'>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                    type='password'
                    placeholder='Confirm new password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                ></Form.Control>
            </Form.Group >
            <Button type='submit' variant='primary'>
                Reset Password
            </Button>
        </Form>
        </FormContainer>
    );
};

export default ResetpasswordScreen;