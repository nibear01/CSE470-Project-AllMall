import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import ProductItem from "../ProductItem/ProductItem";
import { Navigation } from "swiper/modules";

const demoProducts = [
  {
    id: 1,
    type: "Fashion",
    name: "Demo Saree",
    image1:
      "https://serviceapi.spicezgold.com/download/1742462552741_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-3-202308161432.webp",
    image2:
      "https://serviceapi.spicezgold.com/download/1742462552743_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-2-202308161432.webp",
    price: 1200,
    oldPrice: 1900,
    rating: 4,
    stock: 5,
  },
  {
    id: 1,
    type: "Fashion",
    name: "Demo Saree",
    image1:
      "https://serviceapi.spicezgold.com/download/1742462552741_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-3-202308161432.webp",
    image2:
      "https://serviceapi.spicezgold.com/download/1742462552743_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-2-202308161432.webp",
    price: 1200,
    oldPrice: 1900,
    rating: 4,
    stock: 5,
  },
  {
    id: 1,
    type: "Fashion",
    name: "Demo Saree",
    image1:
      "https://serviceapi.spicezgold.com/download/1742462552741_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-3-202308161432.webp",
    image2:
      "https://serviceapi.spicezgold.com/download/1742462552743_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-2-202308161432.webp",
    price: 1200,
    oldPrice: 1900,
    rating: 4,
    stock: 5,
  },
  {
    id: 1,
    type: "Fashion",
    name: "Demo Saree",
    image1:
      "https://serviceapi.spicezgold.com/download/1742462552741_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-3-202308161432.webp",
    image2:
      "https://serviceapi.spicezgold.com/download/1742462552743_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-2-202308161432.webp",
    price: 1200,
    oldPrice: 1900,
    rating: 4,
    stock: 5,
  },
  {
    id: 1,
    type: "Fashion",
    name: "Demo Saree",
    image1:
      "https://serviceapi.spicezgold.com/download/1742462552741_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-3-202308161432.webp",
    image2:
      "https://serviceapi.spicezgold.com/download/1742462552743_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-2-202308161432.webp",
    price: 1200,
    oldPrice: 1900,
    rating: 4,
    stock: 5,
  },
  {
    id: 1,
    type: "Fashion",
    name: "Demo Saree",
    image1:
      "https://serviceapi.spicezgold.com/download/1742462552741_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-3-202308161432.webp",
    image2:
      "https://serviceapi.spicezgold.com/download/1742462552743_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-2-202308161432.webp",
    price: 1200,
    oldPrice: 1900,
    rating: 4,
    stock: 5,
  },
  {
    id: 1,
    type: "Fashion",
    name: "Demo Saree",
    image1:
      "https://serviceapi.spicezgold.com/download/1742462552741_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-3-202308161432.webp",
    image2:
      "https://serviceapi.spicezgold.com/download/1742462552743_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-2-202308161432.webp",
    price: 1200,
    oldPrice: 1900,
    rating: 4,
    stock: 5,
  },
  {
    id: 1,
    type: "Fashion",
    name: "Demo Saree",
    image1:
      "https://serviceapi.spicezgold.com/download/1742462552741_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-3-202308161432.webp",
    image2:
      "https://serviceapi.spicezgold.com/download/1742462552743_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-2-202308161432.webp",
    price: 1200,
    oldPrice: 1900,
    rating: 4,
    stock: 5,
  },
  {
    id: 1,
    type: "Fashion",
    name: "Demo Saree",
    image1:
      "https://serviceapi.spicezgold.com/download/1742462552741_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-3-202308161432.webp",
    image2:
      "https://serviceapi.spicezgold.com/download/1742462552743_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-2-202308161432.webp",
    price: 1200,
    oldPrice: 1900,
    rating: 4,
    stock: 5,
  },
  
  // Add more items if needed
];

const ProductSlider = (props) => {
  return (
    <div className="bg-white productSlider w-[90%] !m-auto !py-4">
      <Swiper
        slidesPerView={props.items}
        spaceBetween={10}
        navigation={true}
        modules={[Navigation]}
        className="mySwiper !py-3"
      >
        {demoProducts.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductItem product={product} />
          </SwiperSlide>
        ))}

        {/* <SwiperSlide>
          <ProductItem />
        </SwiperSlide> */}

      </Swiper>
    </div>
  );
};

export default ProductSlider;
