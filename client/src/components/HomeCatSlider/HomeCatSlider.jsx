import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import "swiper/css";
import { Navigation } from "swiper/modules";
import "./styles.css";

const HomeCatSlider = () => {
  return (
    <div className="homecatslider !py-8 w-[90%] !m-auto">
      <div className="">
        <Swiper
          slidesPerView={7}
          spaceBetween={10}
          navigation={true}
          modules={[Navigation]}
          className="sliderhome flex justify-center items-center"
        >
          <SwiperSlide>
            <Link to="">
              <div className="item bg-white rounded-sm flex justify-center items-center flex-col">
                <img
                  src="/src/assets/slider/wardrobe.png"
                  alt=""
                  className="h-[60px] w-[60px]"
                />
                <h3 className="!py-3 font-[500]">Fashion</h3>
              </div>
            </Link>
          </SwiperSlide>

          <SwiperSlide>
            <Link to="">
              <div className="item bg-white rounded-sm flex justify-center items-center flex-col">
                <img
                  src="/src/assets/slider/gadgets.png"
                  alt=""
                  className="h-[60px] w-[60px]"
                />
                <h3 className="!py-3 font-[500]">Electronics</h3>
              </div>
            </Link>
          </SwiperSlide>

          <SwiperSlide>
            <Link to="">
              <div className="item bg-white rounded-sm flex justify-center items-center flex-col">
                <img
                  src="/src/assets/slider/bags.png"
                  alt=""
                  className="h-[60px] w-[60px]"
                />
                <h3 className="!py-3 font-[500]">Bags</h3>
              </div>
            </Link>
          </SwiperSlide>

          <SwiperSlide>
            <Link to="">
              <div className="item bg-white rounded-sm flex justify-center items-center flex-col">
                <img
                  src="/src/assets/slider/shoes.png"
                  alt=""
                  className="h-[60px] w-[60px]"
                />
                <h3 className="!py-3 font-[500]">Footwear</h3>
              </div>
            </Link>
          </SwiperSlide>

          <SwiperSlide>
            <Link to="">
              <div className="item bg-white rounded-sm flex justify-center items-center flex-col">
                <img
                  src="/src/assets/slider/groceries.png"
                  alt=""
                  className="h-[60px] w-[60px]"
                />
                <h3 className="!py-3 font-[500]">Groceries</h3>
              </div>
            </Link>
          </SwiperSlide>

          <SwiperSlide>
            <Link to="">
              <div className="item bg-white rounded-sm flex justify-center items-center flex-col">
                <img
                  src="/src/assets/slider/beauty.png"
                  alt=""
                  className="h-[60px] w-[60px]"
                />
                <h3 className="!py-3 font-[500]">Beauty</h3>
              </div>
            </Link>
          </SwiperSlide>

          <SwiperSlide>
            <Link to="">
              <div className="item bg-white rounded-sm flex justify-center items-center flex-col">
                <img
                  src="/src/assets/slider/wellness.png"
                  alt=""
                  className="h-[60px] w-[60px]"
                />
                <h3 className="!py-3 font-[500]">Wellness</h3>
              </div>
            </Link>
          </SwiperSlide>

          <SwiperSlide>
            <Link to="">
              <div className="item bg-white rounded-sm flex justify-center items-center flex-col">
                <img
                  src="/src/assets/slider/jewellery.png"
                  alt=""
                  className="h-[60px] w-[60px]"
                />
                <h3 className="!py-3 font-[500]">Jewellery</h3>
              </div>
            </Link>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default HomeCatSlider;
