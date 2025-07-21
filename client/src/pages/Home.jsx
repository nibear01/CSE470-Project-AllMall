import AdsBannerSlider from "../components/AdsBannerSlider/Ads";
import HomeCatSlider from "../components/HomeCatSlider/HomeCatSlider";
import HomeSlider from "../components/HomeSlider/HomeSlider";
import { useState } from "react";
import './Home.css'

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import ProductSlider from "../components/ProductSlider/ProductSlider";

const Home = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <HomeSlider />
      <HomeCatSlider />

      <section className="bg-white">
        <div className="!py-8 bg-white">
          <div className="flex justify-between items-center w-[90%] !m-auto">
            <div className="left-sec">
              <h2 className="font-[500] text-[22px]">Popular Products</h2>
              <h4>
                Do not miss the current offers until the end of september.
              </h4>
            </div>

            <div className="right-sec ">
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
              >
                <Tab label="Fashion" />
                <Tab label="Electronics" />
                <Tab label="Bags" />
                <Tab label="Footwear" />
                <Tab label="Groceries" />
                <Tab label="Beauty" />
                <Tab label="Wellness" />
                <Tab label="Jewellery" />
              </Tabs>
            </div>
          </div>
        </div>

        <ProductSlider items={6}/>
      </section>

      <section>
        <div className="!py-16 bg-white">
          <div className="">
            <AdsBannerSlider />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
