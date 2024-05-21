import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import CheckoutSteps from "../components/CheckoutSteps";
import { useGetOrderDetailsQuery, useVerifySignatureMutation, useInitiateRazorpayPaymentMutation, usePayOrderMutation, useDeliverOrderMutation } from "../slices/ordersApiSlice"
import cartSlice, { clearCartItems } from "../slices/cartSlice";


const OrderScreen = () => {

    const { id:orderId } = useParams();
    const { data : order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);

    const [isPaymentInitiated, setIsPaymentInitiated] = useState(false);
    const [initiatePayment, { isLoading: loadingInitiatePayment }] = useInitiateRazorpayPaymentMutation();
    const [verifySignature, { isLoading: loadingVerifySignature }] = useVerifySignatureMutation();
    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

    const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();

    const { userInfo } = useSelector((state) => state.auth);

    const initiateVerifySignature = async (payload) => {
      try {
          // Send payload to server for signature verification
          const response = await verifySignature(payload);
          console.log(response)
          //debugger
          if (response.data.signatureIsValid) {
            
              // Signature verification successful, update payment status
              setIsPaymentInitiated(true);
              const data = {
                id: payload.razorpay_payment_id, // Replace 'payment_id_here' with the actual payment ID received from the payment provider
                status: 'paid', // Replace 'paid' with the actual payment status
                update_time: new Date().toISOString(), // Replace with the current time
                payer: {
                  email_address: order.user.email // Replace with the payer's email address
                }
              };
              alert(data.id)
              alert(data.payer.email_address);
              debugger
              const payResponse = await payOrder({ orderId, data });
              debugger
              if (payResponse) {
                toast.success('Payment successful');
                
                // Refetch order data to reflect changes
                refetch();
            } else {
                toast.error('Failed to update order status');
            }
          } else {
              // Signature verification failed
              toast.error('Payment failed signature does not match');
          }
      } catch (error) {
          console.error('Error verifying signature:', error);
          toast.error('Error verifying signature');
      }
  };

     const initiateRazorpayPayment = async () => {
        try {
            const response = await initiatePayment({ orderId, amount: order.totalPrice });
            const { razorpayOrderId, razorpayKey } = response.data;
            const options = {
                key: razorpayKey,
                amount: order.totalPrice * 100, // amount in paisa
                currency: 'INR',
                name: 'Proshop',
                description: 'Order Payment',
                order_id: razorpayOrderId,
              
                handler: function (response) {
                  
                  // Verify the signature here
                  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
                  const payload = {
                      razorpay_order_id,
                      razorpay_payment_id,
                      razorpay_signature
                  };
                  alert(razorpay_order_id)
                 
                  alert(razorpay_payment_id)
                  
                  alert(razorpay_signature)
                 
                  initiateVerifySignature(payload);
                },
               
                prefill: {
                    name: order.user.name,
                    email: order.user.email,
                },
                theme: {
                    color: '#3399cc',
                },
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Error initiating Razorpay payment:', error);
            toast.error('Error initiating Razorpay payment');
        }
    };
    const deliverHandler = async () => {
      try {
        await deliverOrder(orderId);
        refetch();
        toast.success('Order Delivered')

      } catch (error) {
        toast.success(error?.data?.message || error.message);
      }
     
    };
    

    

    useEffect(() => {
      const addRazorpayScript = async () => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.async = true;
          script.onload = () => {
              console.log('Razorpay script loaded');
          };
          document.body.appendChild(script);
      };
      addRazorpayScript();
  }, []);


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
                
                <h6 style={{ color: 'green' }}>Delivered on {order.deliveredAt}</h6> 
               
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
                <h6 style={{ color: 'green' }}>Paid on {order.paidAt}</h6>
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
                         {!order.isPaid && (
                                <ListGroup.Item>
                                    {loadingInitiatePayment ? (
                                         <h6 style={{ color: 'red' }}>Loading ....</h6>
                                    ) : (
                                        <Button
                                            type='button'
                                            className='btn btn-block'
                                            onClick={initiateRazorpayPayment}
                                            disabled={isPaymentInitiated}
                                        >
                                            {isPaymentInitiated ? 'Payment Initiated' : 'Pay with Razorpay'}
                                        </Button>
                                    )}
                                </ListGroup.Item>
                            )}
                            {loadingDeliver &&  <h6 style={{ color: 'red' }}>Loading ... </h6>}

                            {userInfo &&
                              userInfo.isAdmin &&
                                order.isPaid &&
                                !order.isDelivered && (
                              <ListGroup.Item>
                                <Button type='button' className='btn btn-block' onClick={deliverHandler}>
                                    Mark As Delivered
                                </Button>
                              </ListGroup.Item>
                            )}

                    </ListGroup>
                </Card>
            </Col>
        </Row>
        </>
    )


}
export default OrderScreen;