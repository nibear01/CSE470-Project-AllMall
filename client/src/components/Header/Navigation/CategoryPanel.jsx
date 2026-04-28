import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { useState } from "react";
import "./CategoryPanel.css";

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

  const categories = [
    {
      name: "Fashion",
      path: "/category/fashion",
      subcategories: ["Men", "Women"],
    },
    {
      name: "Electronics",
      path: "/category/electronics",
      subcategories: ["Mobiles", "Laptops", "Smart Watch"],
    },
    {
      name: "Bags",
      path: "/category/bags",
      subcategories: ["Men Bags", "Women Bags"],
    },
    {
      name: "Footwear",
      path: "/category/footwear",
      subcategories: ["Men Footwears", "Women Footwears"],
    },
    {
      name: "Groceries",
      path: "/category/groceries",
      subcategories: [],
    },
    {
      name: "Beauty",
      path: "/category/beauty",
      subcategories: [],
    },
    {
      name: "Wellness",
      path: "/category/wellness",
      subcategories: [],
    },
    {
      name: "Jewellery",
      path: "/category/jewellery",
      subcategories: [],
    },
  ];

  const DrawerList = (
    <Box sx={{ width: 280 }} role="presentation" className="category-drawer">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-emerald-100 bg-white">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span>🛍️</span> Categories
        </h3>
        <button
          onClick={toggleDrawer(false)}
          className="p-1 hover:bg-emerald-50 rounded-lg transition-colors"
        >
          <IoClose className="w-6 h-6 text-gray-800" />
        </button>
      </div>

      {/* Categories List */}
      <div className="p-3 space-y-2">
        {categories.map((category, idx) => (
          <div key={idx} className="category-item">
            {/* Main Category */}
            <div className="flex items-center justify-between">
              <Link
                to={category.path}
                className="flex-1"
                onClick={() => toggleDrawer(false)}
              >
                <Button className="w-full justify-start text-left text-gray-800 font-medium text-sm p-2 rounded-lg hover:bg-white hover:text-gray-800 transition-all">
                  {category.name}
                </Button>
              </Link>

              {/* Expand/Collapse Button */}
              {category.subcategories.length > 0 && (
                <button
                  onClick={() => openSubmenu(idx)}
                  className="p-2 hover:bg-emerald-50 rounded-lg transition-all mr-2"
                >
                  {isSubMenu === idx ? (
                    <MdExpandLess className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <MdExpandMore className="w-5 h-5 text-gray-700" />
                  )}
                </button>
              )}
            </div>

            {/* Subcategories */}
            {isSubMenu === idx && category.subcategories.length > 0 && (
              <div className="subcategories pl-4 space-y-1 mt-1 border-l-2 border-emerald-200">
                {category.subcategories.map((subcat, subIdx) => (
                  <Link
                    key={subIdx}
                    to={category.path}
                    onClick={() => toggleDrawer(false)}
                  >
                    <Button className="w-full justify-start text-left text-gray-800 text-sm p-1.5 rounded-lg hover:bg-white hover:text-gray-800 transition-all">
                      {subcat}
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Box>
  );

  // Mobile view - render drawer
  if (props.mobile) {
    return (
      <div>
        <Drawer
          anchor="left"
          open={props.isOpenCategory}
          onClose={toggleDrawer(false)}
          sx={{
            "& .MuiDrawer-paper": {
              backgroundColor: "#ffffff",
              color: "#1f2937",
              boxShadow: "-4px 0 12px rgba(16, 185, 129, 0.08)",
            },
          }}
        >
          {DrawerList}
        </Drawer>
      </div>
    );
  }

  // Desktop view - render inline with styling
  return (
    <div>
      <Drawer
        open={props.isOpenCategory}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          },
          "& .MuiDrawer-paper": {
            backgroundColor: "#ffffff",
            color: "#1f2937",
            boxShadow: "0 10px 25px rgba(16, 185, 129, 0.08)",
            borderRadius: "12px",
          },
        }}
      >
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default CategoryPanel;
