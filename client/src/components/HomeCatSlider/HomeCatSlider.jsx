import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import "swiper/css";
import { Navigation } from "swiper/modules";
import "./styles.css";

const HomeCatSlider = () => {
  return (
    <div className="homecatslider !py-4 sm:!py-6 lg:!py-8 w-[95%] sm:w-[90%] lg:w-[85%] !m-auto">
      <div className="">
        <Swiper
          slidesPerView={6}  // Mobile first
          spaceBetween={10}
          navigation={true}
          modules={[Navigation]}
          breakpoints={{
            640: {
              slidesPerView: 3,
              spaceBetween: 15
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 15
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 20
            },
            1280: {
              slidesPerView: 7,
              spaceBetween: 20
            }
          }}
          className="sliderhome flex justify-center items-center"
        >
          {categories.map((category) => (
            <SwiperSlide key={category.name}>
              <Link to={`/category/${category.name.toLowerCase()}`}>
                <div className="item bg-white rounded-sm flex justify-center items-center flex-col p-2 sm:p-3 hover:shadow-md transition-shadow duration-300">
                  <img
                    src={category.icon}
                    alt={category.name}
                    className="h-[40px] w-[40px] sm:h-[50px] sm:w-[50px] md:h-[60px] md:w-[60px] hover-effect"
                  />
                  <h3 className="!py-2 sm:!py-3 text-xs sm:text-sm md:text-base font-[500] text-center">{category.name}</h3>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

// Category data for cleaner code
const categories = [
  { name: "Fashion", icon: "/slider/wardrobe.png" },
  { name: "Electronics", icon: "/slider/gadgets.png" },
  { name: "Bags", icon: "/slider/bags.png" },
  { name: "Footwear", icon: "/slider/shoes.png" },
  { name: "Groceries", icon: "/slider/groceries.png" },
  { name: "Beauty", icon: "/slider/beauty.png" },
  { name: "Wellness", icon: "/slider/wellness.png" },
  { name: "Jewellery", icon: "/slider/jewellery.png" }
];

export default HomeCatSlider;