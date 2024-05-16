import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, Row, Col, ListGroup, Image, Card, ListGroupItem } from "react-bootstrap";
import { toast } from "react-toastify";
import CheckoutSteps from "../components/CheckoutSteps";
import { useGetOrderDetailsQuery } from "../slices/ordersApiSlice"
import cartSlice, { clearCartItems } from "../slices/cartSlice";


const OrderScreen = () => {

    const { id:orderId } = useParams();
    const { data : order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);

    console.log(order);


    return isLoading ? (
        <h3>Loading ... </h3>
        ) : error ? (
            <h3>Error</h3>
        ) : (
        <>
        <h1> Order {order._id} </h1>
        <Row>
            <Col md={8}>
            <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{' '}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                
                <h6 style={{ color: 'red' }}>Delivered on {order.deliveredAt}</h6> 
               
              ) : (
                <h6 style={{ color: 'red' }}>Not Delivered</h6>

              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <h6 style={{ color: 'red' }}>Paid on {order.paidAt}</h6>
              ) : (
                <h6 style={{ color: 'red' }}>Not Paid</h6>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
               <h6 style={{ color: 'red' }}>Order is empty</h6>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
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
                                <Col>Items</Col>
                                <Col>${order.itemsPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <Row>
                             <Col>Shipping</Col>
                             <Col>${order.shippingPrice}</Col>
                          </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <Row>
                            <Col>Tax</Col>
                            <Col>${order.taxPrice}</Col>
                         </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Total</Col>
                                <Col>${order.totalPrice}</Col>
                            </Row>
                        </ListGroup.Item>

                    </ListGroup>
                </Card>
            </Col>
        </Row>
        </>
    )


}
export default OrderScreen;