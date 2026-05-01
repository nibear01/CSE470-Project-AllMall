import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import ProductItem from "../ProductItem/ProductItem";
import { Navigation } from "swiper/modules";
import { useAuth } from "../../Store/Auth";
import "./ProductSlider.css";

const ProductSlider = () => {
  const { products } = useAuth();

  // Responsive breakpoints for different screen sizes with smooth transitions
  const breakpoints = {
    320: {
      slidesPerView: 1.05,
      spaceBetween: 12,
    },
    480: {
      slidesPerView: 1.25,
      spaceBetween: 14,
    },
    640: {
      slidesPerView: 1.75,
      spaceBetween: 14,
    },
    768: {
      slidesPerView: 2.25,
      spaceBetween: 16,
    },
    1024: {
      slidesPerView: 3.15,
      spaceBetween: 18,
    },
    1280: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
    1536: {
      slidesPerView: 5,
      spaceBetween: 20,
    },
  };

  return (
    <div className="product-slider-container">
      <div className="slider-wrapper">
        <Swiper
          breakpoints={breakpoints}
          spaceBetween={12}
          navigation={true}
          modules={[Navigation]}
          className="product-swiper"
          loop={products.length > 5}
          grabCursor={true}
          slideToClickedSlide={true}
          centeredSlides={false}
          watchOverflow={true}
        >
          {products.map((product) => (
            <SwiperSlide key={product._id} className="product-slide-wrapper">
              <div className="product-slide-inner">
                <ProductItem product={product} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductSlider;
