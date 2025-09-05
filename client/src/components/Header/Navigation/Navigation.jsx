import { NavLink } from "react-router-dom";
import Button from "@mui/material/Button";
import { RiMenuFold2Fill } from "react-icons/ri";
import { FaAngleDown } from "react-icons/fa6";
import CategoryPanel from "./CategoryPanel";
import { useState } from "react";

const Navigation = () => {
  const [isOpenCategory, setIsOpenCategory] = useState(false);

  const openCategoryPanel = () => {
    setIsOpenCategory(!isOpenCategory);
  };

  return (
    <>
      <nav className="!bg-white">
        <div className="!flex !flex-col md:!flex-row !justify-around !m-auto !items-center !min-w-full !container !p-2 lg:!p-1">
          {/* Categories Button - Responsive */}
          <div className="!w-full text-center md:!w-[20%] !mb-2 md:!mb-0">
            <Button
              className="!gap-2 !text-xs sm:!text-sm md:!text-[10px] lg:!text-[14px] !normal-case !p-1 md:!p-2"
              onClick={openCategoryPanel}
            >
              <RiMenuFold2Fill className="!h-5 !w-5" />
              <span className="!hidden sm:!inline">Show Item Categories</span>
              <span className="!inline sm:!hidden">Categories</span>
              <FaAngleDown className="!h-4 !w-4" />
            </Button>
          </div>

          {/* Navigation Links - Responsive */}
          <div className="!w-full md:!w-[70%] !overflow-x-auto">
            <ul className="!flex !items-center justify-around !gap-1 sm:!gap-1 md:!gap-2 !py-1">
              {[
                { name: "Home", path: "/" },
                { name: "Fashion", path: "/category/fashion" },
                { name: "Electronics", path: "/category/electronics" },
                { name: "Bags", path: "/category/bags" },
                { name: "Footwear", path: "/category/footwear" },
                { name: "Groceries", path: "/category/groceries" },
                { name: "Beauty", path: "/category/beauty" },
                { name: "Wellness", path: "/category/wellness" },
                { name: "Jewellery", path: "/category/jewellery" },
              ].map((item) => (
                <li key={item.name} className="!list-none !flex-shrink-0">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `links link !text-xs sm:!text-sm md:!text-[10px] lg:!text-[14px] ${
                        isActive
                          ? "!text-[var(--hover-color)]"
                          : "!text-gray-600"
                      }`
                    }
                  >{item.name}
                    {/* <Button className="!min-w-0 !p-1 md:!p-2"> */}
                      {/* {item.name} */}
                    {/* </Button> */}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <CategoryPanel
        isOpenCategory={isOpenCategory}
        openCategoryPanel={openCategoryPanel}
        setIsOpenCategory={setIsOpenCategory}
      />
    </>
  );
};

export default Navigation;
