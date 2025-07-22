import { Link, NavLink } from "react-router-dom";
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
      <nav>
        <div className="flex justify-end items-center min-w-full container p-3 bg-white">
          <div className="col1 w-[20%]">
            <Button className="gap-2" onClick={openCategoryPanel}>
              <RiMenuFold2Fill className="h-5 w-5" />
              Show Item Categories
              <FaAngleDown />
            </Button>
          </div>
          <div className="col2 w-[70%]">
            <ul className="flex items-center max-h-full  gap-3">
              <li className="list-none">
                <Button>
                  <NavLink to="/" className="links link">
                    Home
                  </NavLink>
                </Button>
              </li>
              <li className="list-none relative">
                <Button>
                  <NavLink to="/category/fashion" className="links link">
                    Fashion
                  </NavLink>
                </Button>
              </li>
              <li className="list-none">
                <Button>
                  <NavLink to="/category/electronics" className="links link">
                    Electronics
                  </NavLink>
                </Button>
              </li>
              <li className="list-none">
                <Button>
                  <NavLink to="/category/bags" className="links link">
                    Bags
                  </NavLink>
                </Button>
              </li>
              <li className="list-none">
                <Button>
                  <NavLink to="/category/footwear" className="links link">
                    Footwear
                  </NavLink>
                </Button>
              </li>
              <li className="list-none">
                <Button>
                  <NavLink to="/category/groceries" className="links link">
                    Groceries
                  </NavLink>
                </Button>
              </li>
              <li className="list-none">
                <Button>
                  <NavLink to="/category/beauty" className="links link">
                    Beauty
                  </NavLink>
                </Button>
              </li>
              <li className="list-none">
                <Button>
                  <NavLink to="/category/wellness" className="links link">
                    Wellness
                  </NavLink>
                </Button>
              </li>
              <li className="list-none">
                <Button>
                  <NavLink to="/category/jewellery" className="links link">
                    Jewellery
                  </NavLink>
                </Button>
              </li>
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
