import HomeCatSlider from "../components/HomeCatSlider/HomeCatSlider";
import HomeSlider from "../components/HomeSlider/HomeSlider";
import { useState } from "react";
import "./Home.css";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ProductSlider from "../components/ProductSlider/ProductSlider";
import Chatbot from "./Chatbot";

const Home = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="home-page">
      <HomeSlider />
      <HomeCatSlider />

      <section className="bg-white">
        <div className="!py-4 sm:!py-6 lg:!py-8 bg-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-[95%] sm:w-[90%] lg:w-[85%] !mx-auto !px-4 sm:!px-0">
            <div className="left-sec mb-4 md:mb-0">
              <h2 className="font-[500] text-lg sm:text-xl lg:text-2xl">
                Popular Products
              </h2>
              <h4 className="text-sm sm:text-base text-gray-600">
                Do not miss the current offers until the end of September.
              </h4>
            </div>

            <div className="right-sec w-full md:w-auto">
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                aria-label="scrollable auto tabs example"
                sx={{
                  "& .MuiTabs-scrollButtons": {
                    "&.Mui-disabled": { opacity: 0.3 },
                  },
                }}
              >
                <Tab label="Fashion" className="!text-xs sm:!text-sm" />
                <Tab label="Electronics" className="!text-xs sm:!text-sm" />
                <Tab label="Bags" className="!text-xs sm:!text-sm" />
                <Tab label="Footwear" className="!text-xs sm:!text-sm" />
                <Tab label="Groceries" className="!text-xs sm:!text-sm" />
                <Tab label="Beauty" className="!text-xs sm:!text-sm" />
                <Tab label="Wellness" className="!text-xs sm:!text-sm" />
                <Tab label="Jewellery" className="!text-xs sm:!text-sm" />
              </Tabs>
            </div>
          </div>
        </div>

        <div className="w-[95%] sm:w-[90%] lg:w-[85%] !mx-auto !px-4 sm:!px-0">
          <ProductSlider items={6} />
        </div>

        <Chatbot />
      </section>
    </div>
  );
};

export default Home;
