// import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import { FaRegSquarePlus } from "react-icons/fa6";
import { FiMinusSquare } from "react-icons/fi";
import { useState } from "react";

const CategoryPanel = (props) => {
  const [isSubMenu, setIsSubmenu] = useState(null);
  const toggleDrawer = (newOpen) => () => {
    props.setIsOpenCategory(newOpen);
  };

  const openSubmenu = (idx) => {
    if (isSubMenu === idx) {
      setIsSubmenu(null);
    } else {
      setIsSubmenu(idx);
    }
  };

  const DrawerList = (
    <Box sx={{ width: 270 }} role="presentation">
      <h3 className="!p-5 flex items-center justify-between text-[18px] font-[500]">
        Categories{" "}
        <IoClose
          className="cursor-pointer h-5 w-5"
          onClick={toggleDrawer(false)}
        />
      </h3>

      <div className="!p-2">
        {/* #1 */}
        <ul className="flex-col items-center !pl-3 !pr-5">
          <li className="flex items-center justify-between">
            <Link to="/category/fashion" className="w-full">
              <Button className=" !justify-start"> Fashion</Button>
            </Link>
            {isSubMenu === 0 ? (
              <FiMinusSquare
                className="cursor-pointer cat"
                onClick={() => openSubmenu(0)}
              />
            ) : (
              <FaRegSquarePlus
                className="cursor-pointer "
                onClick={() => openSubmenu(0)}
              />
            )}
          </li>

          {isSubMenu === 0 && (
            <ul className="flex-col items-center justify-start !pl-3 !pr-10 !h-auto w-full">
              <li className="w-full">
                <Link to="/category/fashion" className="w-full">
                  <Button className="!text-left !justify-start">Men</Button>
                </Link>
              </li>

              <li className="w-full">
                <Link to="/category/fashion" className="w-full">
                  <Button className="!text-left !justify-start"> Women</Button>
                </Link>
              </li>
            </ul>
          )}
        </ul>

        {/* 2 */}
        <ul className="flex-col items-center !pl-3 !pr-5">
          <li className="flex items-center justify-between">
            <Link to="/category/electronics" className="w-full">
              <Button className=" !justify-start"> Electronics</Button>
            </Link>
            {isSubMenu === 1 ? (
              <FiMinusSquare
                className="cursor-pointer cat"
                onClick={() => openSubmenu(1)}
              />
            ) : (
              <FaRegSquarePlus
                className="cursor-pointer"
                onClick={() => openSubmenu(1)}
              />
            )}
          </li>

          {isSubMenu === 1 && (
            <ul className="flex-col items-center justify-start !pl-3 !pr-10 !h-auto w-full">
              <li className="w-full">
                <Link to="/category/electronics" className="w-full">
                  <Button className="!text-left !justify-start">Mobiles</Button>
                </Link>
              </li>

              <li className="w-full">
                <Link to="/category/electronics" className="w-full">
                  <Button className="!text-left !justify-start">
                    {" "}
                    Laptops
                  </Button>
                </Link>
              </li>

              <li className="w-full">
                <Link to="/category/electronics" className="w-full">
                  <Button className="!text-left !justify-start">
                    {" "}
                    Smart Watch
                  </Button>
                </Link>
              </li>
            </ul>
          )}
        </ul>

        {/* 3 */}
        <ul className="flex-col items-center !pl-3 !pr-5">
          <li className="flex items-center justify-between">
            <Link to="/category/bags" className="w-full">
              <Button className=" !justify-start"> Bags</Button>
            </Link>
            {isSubMenu === 2 ? (
              <FiMinusSquare
                className="cursor-pointer cat"
                onClick={() => openSubmenu(2)}
              />
            ) : (
              <FaRegSquarePlus
                className="cursor-pointer"
                onClick={() => openSubmenu(2)}
              />
            )}
          </li>

          {isSubMenu === 2 && (
            <ul className="flex-col items-center justify-start !pl-3 !pr-10 !h-auto w-full">
              <li className="w-full">
                <Link to="/category/bags" className="w-full">
                  <Button className="!text-left !justify-start">
                    Men Bags
                  </Button>
                </Link>
              </li>

              <li className="w-full">
                <Link to="/category/bags" className="w-full">
                  <Button className="!text-left !justify-start">
                    {" "}
                    Women Bags
                  </Button>
                </Link>
              </li>
            </ul>
          )}
        </ul>

        {/* 4 */}
        <ul className="flex-col items-center !pl-3 !pr-5">
          <li className="flex items-center justify-between">
            <Link to="/category/footwear" className="w-full">
              <Button className=" !justify-start"> Footwear</Button>
            </Link>
            {isSubMenu === 3 ? (
              <FiMinusSquare
                className="cursor-pointer cat"
                onClick={() => openSubmenu(3)}
              />
            ) : (
              <FaRegSquarePlus
                className="cursor-pointer"
                onClick={() => openSubmenu(3)}
              />
            )}
          </li>

          {isSubMenu === 3 && (
            <ul className="flex-col items-center justify-start !pl-3 !pr-10 !h-auto w-full">
              <li className="w-full">
                <Link to="/category/footwear" className="w-full">
                  <Button className="!text-left !justify-start">
                    Men Footwears
                  </Button>
                </Link>
              </li>

              <li className="w-full">
                <Link to="/category/footwear" className="w-full">
                  <Button className="!text-left !justify-start">
                    {" "}
                    Women Footwears
                  </Button>
                </Link>
              </li>
            </ul>
          )}
        </ul>

        {/* 5 */}
        <ul className="flex-col items-center !pl-3 !pr-5">
          <li className="flex items-center justify-between">
            <Link to="/category/groceries" className="w-full">
              <Button className=" !justify-start"> Groceries</Button>
            </Link>
          </li>
        </ul>

        {/* 6 */}
        <ul className="flex-col items-center !pl-3 !pr-5">
          <li className="flex items-center justify-between">
            <Link to="/category/beauty" className="w-full">
              <Button className=" !justify-start"> Beauty</Button>
            </Link>
          </li>
        </ul>

        {/* 7 */}
        <ul className="flex-col items-center !pl-3 !pr-5">
          <li className="flex items-center justify-between">
            <Link to="/category/wellness" className="w-full">
              <Button className=" !justify-start"> Wellness</Button>
            </Link>
          </li>
        </ul>

        {/* 8 */}
        <ul className="flex-col items-center !pl-3 !pr-5">
          <li className="flex items-center justify-between">
            <Link to="/category/jewellery" className="w-full">
              <Button className=" !justify-start"> Jewellery</Button>
            </Link>
          </li>
        </ul>
      </div>
    </Box>
  );

  return (
    <div className="absolute top-0">
      <Button onClick={toggleDrawer(true)}></Button>
      <Drawer open={props.isOpenCategory} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default CategoryPanel;
