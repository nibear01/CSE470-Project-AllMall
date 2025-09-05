import { Swiper, SwiperSlide } from "swiper/react";
import "./HomeSlider.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Navigation, Autoplay } from "swiper/modules";

const HomeSlider = () => {
  return (
    <>
      <div className="HomeSlider !py-5">
        <div className="">
          <Swiper
            spaceBetween={30}
            navigation={true}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
            }}
            modules={[Navigation, Autoplay]}
            className="mySwiper !max-h-[50vh] md:!max-h-[60vh] lg:!max-h-[70vh] !w-[90%] sm:!w-[90%] lg:!w-[80%]"
          >
            <SwiperSlide className="max-h-100 rounded-2xl overflow-hidden">
              <div className="rounded-[20px]">
                <img
                  className="custom-height w-full h-full object-fill"
                  src="/banner/banner2.png"
                  alt="Advertisement Banner"
                />
              </div>
            </SwiperSlide>
            <SwiperSlide className="max-h-100 rounded-2xl overflow-hidden">
              <div className="rounded-[20px]">
                <img
                  className="custom-height w-full h-full object-fill"
                  src="/banner/banner3.png"
                  alt="Advertisement Banner"
                />
              </div>
            </SwiperSlide>
            <SwiperSlide className="max-h-100 rounded-2xl overflow-hidden">
              <div className="rounded-[20px]">
                <img
                  className="custom-height w-full h-full object-fill"
                  src="/banner/banner1.png"
                  alt="Advertisement Banner"
                />
              </div>
            </SwiperSlide>
            <SwiperSlide className="max-h-100 rounded-2xl overflow-hidden">
              <div className="rounded-[20px]">
                <img
                  className="custom-height w-full h-full object-fill"
                  src="/banner/banner4.png"
                  alt="Advertisement Banner"
                />
              </div>
            </SwiperSlide>
            <SwiperSlide className="max-h-100 rounded-2xl overflow-hidden">
              <div className="rounded-[20px]">
                <img
                  className="custom-height w-full h-full object-fill"
                  src="/banner/banner5.png"
                  alt="Advertisement Banner"
                />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default HomeSlider;