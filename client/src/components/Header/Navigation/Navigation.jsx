import { Link } from "react-router-dom";
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
                  <Link to="/" className="links">
                    Home
                  </Link>
                </Button>
              </li>
              <li className="list-none relative">
                <Button>
                  <Link to="/" className="links">
                    Fashion
                  </Link>
                </Button>
                {/* <ul className="absolute !min-w-[260%] top-[101%] bg-white flex-col items-center !p-3 font-[500]">
                    <li><Link>Men</Link></li>
                    <li><Link>Women</Link></li>
                </ul> */}
              </li>
              <li className="list-none">
                <Button>
                  <Link to="/" className="links">
                    Electronics
                  </Link>
                </Button>
              </li>
              <li className="list-none">
                <Button>
                  <Link to="/" className="links">
                    Bags
                  </Link>
                </Button>
              </li>
              <li className="list-none">
                <Button>
                  <Link to="/" className="links">
                    Footwear
                  </Link>
                </Button>
              </li>
              <li className="list-none">
                <Button>
                  <Link to="/" className="links">
                    Groceries
                  </Link>
                </Button>
              </li>
              <li className="list-none">
                <Button>
                  <Link to="/" className="links">
                    Beauty
                  </Link>
                </Button>
              </li>
              <li className="list-none">
                <Button>
                  <Link to="/" className="links">
                    Wellness
                  </Link>
                </Button>
              </li>
              <li className="list-none">
                <Button>
                  <Link to="/" className="links">
                    Jewellery
                  </Link>
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <CategoryPanel  isOpenCategory = {isOpenCategory} openCategoryPanel = {openCategoryPanel} setIsOpenCategory={setIsOpenCategory} />
    </>
  );
};

export default Navigation;
