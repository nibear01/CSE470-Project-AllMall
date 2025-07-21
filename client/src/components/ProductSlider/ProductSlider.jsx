import { Swiper, SwiperSlide} from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import ProductItem from "../ProductItem/ProductItem";

import { Navigation } from "swiper/modules";

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

      <SwiperSlide>
        <ProductItem/>
      </SwiperSlide> 

      <SwiperSlide>
        <ProductItem/>
      </SwiperSlide>

      <SwiperSlide>
        <ProductItem/>
      </SwiperSlide>

      <SwiperSlide>
        <ProductItem/>
      </SwiperSlide>

      <SwiperSlide>
        <ProductItem/>
      </SwiperSlide>
      <SwiperSlide>
        <ProductItem/>
      </SwiperSlide>
      <SwiperSlide>
        <ProductItem/>
      </SwiperSlide>
      <SwiperSlide>
        <ProductItem/>
      </SwiperSlide> 
       <SwiperSlide>
        <ProductItem/>
      </SwiperSlide>
       <SwiperSlide>
        <ProductItem/>
      </SwiperSlide>
       <SwiperSlide>
        <ProductItem/>
      </SwiperSlide>
      
       </Swiper>
      

    </div>
  );
};

export default ProductSlider;
