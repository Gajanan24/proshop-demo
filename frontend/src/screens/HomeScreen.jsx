import { useParams } from 'react-router-dom';
import {Row, Col} from "react-bootstrap";
import Product from "../components/Product";
import Paginate from "../components/Paginate";
import { Link } from 'react-router-dom';

import { useGetProductsQuery } from "../slices/productApiSlice";
import ProductCarousel from '../components/ProductCarousel';

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

    const { pageNumber, keyword } = useParams();

    // redux toolkit

    const { data , isLoading, error } = useGetProductsQuery({ keyword, pageNumber });

    return (
        <>
       {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to='/' className='btn btn-light mb-4'>
          Go Back
        </Link>
      )}

            { isLoading ? (
                <h2>Loading ...</h2>
            ) : error ? ( <div> { error?.data?.message || error.error}</div>) : (<> 
            <h1> Latest Products </h1>
            <Row>
                {
                    data.products.map((product) => (
                        <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                           <Product product={product}/>
                        </Col>
                    )) 
                }
            </Row>
            <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ''}
          />
            </>
        ) }
           
           

        
        </>
    )
}
export default HomeScreen