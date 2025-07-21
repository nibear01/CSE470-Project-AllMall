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
            className="mySwiper max-h-[70vh] max-w-[90%] "
          >
            <SwiperSlide>
              <div className="rounded-[20px]">
                <img
                  className="custom-height "
                  src="https://serviceapi.spicezgold.com/download/1751685164864_NewProject(10).jpg"
                  alt=""
                />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="rounded-[20px] ">
                <img
                  className="custom-height"
                  src="https://serviceapi.spicezgold.com/download/1748955932914_NewProject(1).jpg"
                  alt=""
                />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="rounded-[20px]">
                <img
                  className="custom-height"
                  src="https://serviceapi.spicezgold.com/download/1751685183248_NewProject(6).jpg"
                  alt=""
                />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="rounded-[20px] ">
                <img
                  className="custom-height"
                  src="https://serviceapi.spicezgold.com/download/1751685144346_NewProject(11).jpg"
                  alt=""
                />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="rounded-[20px] ">
                <img
                  className="custom-height"
                  src="https://serviceapi.spicezgold.com/download/1751685130717_NewProject(8).jpg"
                  alt=""
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
