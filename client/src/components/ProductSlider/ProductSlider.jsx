/* eslint-disable no-unused-vars */
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import ProductItem from "../ProductItem/ProductItem";
import { Navigation } from "swiper/modules";
import { useEffect, useState } from "react";
import axios from "axios";

// const demoProducts = [
//   {
//     id: 1,
//     type: "Fashion",
//     name: "Demo Saree",
//     image1:
//       "https://serviceapi.spicezgold.com/download/1742462552741_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-3-202308161432.webp",
//     image2:
//       "https://serviceapi.spicezgold.com/download/1742462552743_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-2-202308161432.webp",
//     price: 1200,
//     oldPrice: 1900,
//     rating: 4,
//     stock: 5,
//   },
//   {
//     id: 2,
//     type: "Fashion",
//     name: "Demo Saree",
//     image1:
//       "https://serviceapi.spicezgold.com/download/1742462552741_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-3-202308161432.webp",
//     image2:
//       "https://serviceapi.spicezgold.com/download/1742462552743_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-2-202308161432.webp",
//     price: 1200,
//     oldPrice: 1900,
//     rating: 4,
//     stock: 5,
//   },
//   {
//     id: 3,
//     type: "Fashion",
//     name: "Demo Saree",
//     image1:
//       "https://serviceapi.spicezgold.com/download/1742462552741_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-3-202308161432.webp",
//     image2:
//       "https://serviceapi.spicezgold.com/download/1742462552743_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-2-202308161432.webp",
//     price: 1200,
//     oldPrice: 1900,
//     rating: 4,
//     stock: 5,
//   },
//   {
//     id: 4,
//     type: "Fashion",
//     name: "Demo Saree",
//     image1:
//       "https://serviceapi.spicezgold.com/download/1742462552741_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-3-202308161432.webp",
//     image2:
//       "https://serviceapi.spicezgold.com/download/1742462552743_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-2-202308161432.webp",
//     price: 1200,
//     oldPrice: 1900,
//     rating: 4,
//     stock: 5,
//   },
//   {
//     id: 5,
//     type: "Fashion",
//     name: "Demo Saree",
//     image1:
//       "https://serviceapi.spicezgold.com/download/1742462552741_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-3-202308161432.webp",
//     image2:
//       "https://serviceapi.spicezgold.com/download/1742462552743_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-2-202308161432.webp",
//     price: 1200,
//     oldPrice: 1900,
//     rating: 4,
//     stock: 5,
//   },
//   {
//     id: 6,
//     type: "Fashion",
//     name: "Demo Saree",
//     image1:
//       "https://serviceapi.spicezgold.com/download/1742462552741_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-3-202308161432.webp",
//     image2:
//       "https://serviceapi.spicezgold.com/download/1742462552743_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-2-202308161432.webp",
//     price: 1200,
//     oldPrice: 1900,
//     rating: 4,
//     stock: 5,
//   },
//   {
//     id: 7,
//     type: "Fashion",
//     name: "Demo Saree",
//     image1:
//       "https://serviceapi.spicezgold.com/download/1742462552741_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-3-202308161432.webp",
//     image2:
//       "https://serviceapi.spicezgold.com/download/1742462552743_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-2-202308161432.webp",
//     price: 1200,
//     oldPrice: 1900,
//     rating: 4,
//     stock: 5,
//   },
//   {
//     id: 8,
//     type: "Fashion",
//     name: "Demo Saree",
//     image1:
//       "https://serviceapi.spicezgold.com/download/1742462552741_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-3-202308161432.webp",
//     image2:
//       "https://serviceapi.spicezgold.com/download/1742462552743_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-2-202308161432.webp",
//     price: 1200,
//     oldPrice: 1900,
//     rating: 4,
//     stock: 5,
//   },
//   {
//     id: 9,
//     type: "Fashion",
//     name: "Demo Saree",
//     image1:
//       "https://serviceapi.spicezgold.com/download/1742462552741_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-3-202308161432.webp",
//     image2:
//       "https://serviceapi.spicezgold.com/download/1742462552743_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-2-202308161432.webp",
//     price: 1200,
//     oldPrice: 1900,
//     rating: 4,
//     stock: 5,
//   },

//   // Add more items if needed
// ];

const ProductSlider = (props) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  // console.log(products);

  axios.defaults.baseURL = "http://localhost:5000";

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/products");
      // console.log(response.data);
      setProducts(response.data);
    } catch (error) {
      console.log(`unable to fetched data: ${error}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // console.log(products);

  return (
    <div className="bg-white productSlider !m-auto !py-6">
      <Swiper
        slidesPerView={props.items}
        spaceBetween={10}
        navigation={true}
        modules={[Navigation]}
        className="mySwiper !py-3"
      >
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <ProductItem product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;
