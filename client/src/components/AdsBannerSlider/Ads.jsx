import { Swiper, SwiperSlide } from "swiper/react";
import "./Ads.css";
import "swiper/css";
import "swiper/css/navigation";

import { Navigation, Autoplay } from "swiper/modules";

const AdsBannerSlider = () => {
  return (
    <div>
      <Swiper
        spaceBetween={30}
        navigation={true}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
        modules={[Navigation, Autoplay]}
        className="mySwiper max-h-[70vh] max-w-[90%] "
      />

      <SwiperSlide>
        
      </SwiperSlide>
    </div>
  );
};

export default AdsBannerSlider;
