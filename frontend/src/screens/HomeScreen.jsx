import { useEffect, useState } from "react";
import {Row, Col} from "react-bootstrap";
import Product from "../components/Product";
import axios from "axios"
import { useGetProductsQuery } from "../slices/productApiSlice";

const HomeScreen = () => {
    /*
    const [products, setProducts] = useState([])

    useEffect(() => {
        
        // using axios
        const fetchProducts = async () => {
            const {data} = await axios.get('http://localhost:5000/api/products');
            setProducts(data);
        };

        // using fetch
        // const fetchProducts = async () => {
        //     try {
        //         const response = await fetch('http://localhost:5000/api/products');
        //         if (!response.ok) {
        //             throw new Error('Failed to fetch products');
        //         }
        //         const data = await response.json();
        //         setProducts(data);
        //     } catch (error) {
        //         console.error('Error fetching products:', error.message);
        //     }
        // };
        fetchProducts();
    },[]);
    */


    // redux toolkit

    const { data: products , isLoading, error } = useGetProductsQuery();

    return (
        <>

            { isLoading ? (
                <h2>Loading ...</h2>
            ) : error ? ( <div> { error?.data?.message || error.error}</div>) : (<> 
            <h1> Latest Products </h1>
            <Row>
                {
                    products.map((product) => (
                        <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                           <Product product={product}/>
                        </Col>
                    )) 
                }
            </Row></>) }
           
           

        
        </>
    )
}
export default HomeScreen