import React, { useEffect, useState } from 'react';
import { Table, Form, Button, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';

import { toast } from 'react-toastify';
import { useProfileMutation } from '../slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { setCredentials } from '../slices/authSlice';


const ProfileScreen = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber , setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { userInfo } = useSelector((state) => state.auth);

    const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
    const { data: orders, isLoading, error } = useGetMyOrdersQuery();

    useEffect(() => {
        setName(userInfo.name);
        setEmail(userInfo.email);
      }, [userInfo, userInfo.email, userInfo.name]);


    const dispatch = useDispatch();
    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
          toast.error('Passwords do not match');
        } else {
          try {
            const res = await updateProfile({
              name,
              phoneNumber,
              email,
              password,
            }).unwrap();
            dispatch(setCredentials({ ...res }));
            toast.success('Profile updated successfully');
          } catch (err) {
            toast.error(err?.data?.message || err.error);
          }
        }
    };


    return (
        <Row>
            <Col md={3}>
            <h2>User Profile</h2>
            <Form onSubmit={submitHandler}>
                <Form.Group className='my-2' controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group controlId='phoneNumber' className='my-3'>
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control 
                        type='number'
                        placeholder='Enter phone no'
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>
                <Form.Group className='my-2' controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                        type='email'
                        placeholder='Enter email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group className='my-2' controlId='password'>
                <Form.Label>Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Enter password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    ></Form.Control>
            </Form.Group>
            <Form.Group className='my-2' controlId='confirmPassword'>
                <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Confirm password'
                        value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                    ></Form.Control>
          </Form.Group>
          <Button type='submit' variant='primary'>
            Update
          </Button>
          {loadingUpdateProfile && <h6 style={{ color: 'green' }}>Loading ... </h6>}

            </Form>
            </Col>
            <Col md={9}>
        <h2>My Orders</h2>
        {isLoading ? (
          <h6 style={{ color: 'green' }}>Loading ... </h6>
        ) : error ? (
            <h6 style={{ color: 'green' }}>  {error?.data?.message || error.error} </h6>
        ) : (
          <Table striped hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <FaTimes style={{ color: 'red' }} />
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <FaTimes style={{ color: 'red' }} />
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className='btn-sm' variant='light'>
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        </Col>
        </Row>
    )
}
export default ProfileScreen;