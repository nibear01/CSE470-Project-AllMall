import HomeCatSlider from "../components/HomeCatSlider/HomeCatSlider";
import HomeSlider from "../components/HomeSlider/HomeSlider";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ProductSlider from "../components/ProductSlider/ProductSlider";
import Chatbot from "./Chatbot";

const Home = () => {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  const categories = [
    "fashion",
    "electronics",
    "bags",
    "footwear",
    "groceries",
    "beauty",
    "wellness",
    "jewellery",
  ];

  // Reset tab value when component mounts
  useEffect(() => {
    setValue(0);
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(`/category/${categories[newValue]}`);
  };

  return (
    <div className="home-page">
      <HomeSlider />
      <HomeCatSlider />

      <section className="bg-white popular-products-section">
        <div className="popular-products-header">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-3 sm:gap-4 md:gap-6">
            <div className="left-sec w-full md:w-auto flex-1">
              <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-4xl leading-tight text-gray-900">
                Popular Products
              </h2>
              <p className="text-sm sm:text-base text-gray-500 mt-2 sm:mt-3 font-medium">
                Discover trending items loved by our customers
              </p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Limited offers until the end of{" "}
                {new Date().toLocaleString("default", { month: "long" })}.
              </p>
            </div>

            <div className="right-sec w-full md:w-auto overflow-x-auto pb-2 md:pb-0 md:shrink-0">
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                aria-label="product categories"
                sx={{
                  "& .MuiTabs-scrollButtons": {
                    "&.Mui-disabled": { opacity: 0.3 },
                  },
                  "& .MuiTabs-scroller": {
                    overflowX: "auto",
                    scrollBehavior: "smooth",
                  },
                  "& .MuiTabs-indicator": {
                    height: 3,
                    borderRadius: "1px",
                    backgroundColor: "#059669",
                  },
                  "& .MuiTab-root.Mui-selected": {
                    color: "#059669 !important",
                  },
                }}
              >
                <Tab
                  label="Fashion"
                  className="text-xs sm:text-sm md:text-base min-w-fit!"
                />
                <Tab
                  label="Electronics"
                  className="text-xs sm:text-sm md:text-base min-w-fit!"
                />
                <Tab
                  label="Bags"
                  className="text-xs sm:text-sm md:text-base min-w-fit!"
                />
                <Tab
                  label="Footwear"
                  className="text-xs sm:text-sm md:text-base min-w-fit!"
                />
                <Tab
                  label="Groceries"
                  className="text-xs sm:text-sm md:text-base min-w-fit!"
                />
                <Tab
                  label="Beauty"
                  className="text-xs sm:text-sm md:text-base min-w-fit!"
                />
                <Tab
                  label="Wellness"
                  className="text-xs sm:text-sm md:text-base min-w-fit!"
                />
                <Tab
                  label="Jewellery"
                  className="text-xs sm:text-sm md:text-base min-w-fit!"
                />
              </Tabs>
            </div>
          </div>
        </div>

        <div className="popular-products-content">
          <ProductSlider />
        </div>

        <Chatbot />
      </section>
    </div>
  );
};

export default Home;
