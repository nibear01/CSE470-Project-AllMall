import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import "./productitem.css";
import Button from "@mui/material/Button";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineZoomOutMap } from "react-icons/md";

const ProductItem = () => {
  return (
    <div className="productitem !shadow-lg !overflow-hidden">
      <div className="imgwrappper group !h-[250px] !overflow-hidden relative">
        <img
          className="w-full !h-[250px] overflow-hidden "
          src="https://serviceapi.spicezgold.com/download/1742462552741_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-3-202308161432.webp"
          alt=""
        />
         <img
          className="w-full absolute top-0 left-0 transition-all duration-600 opacity-0 group-hover:opacity-100"
          src="https://serviceapi.spicezgold.com/download/1742462552743_siril-georgette-pink-color-saree-with-blouse-piece-product-images-rvrk9p11sk-2-202308161432.webp"
          alt=""
        />
        <span
          className="absolute flex items-center top-[10px] left-[10px] 
        bg-[var(--hover-color)] text-white z-50 !p-1 rounded-3xl"
        >
          10%
        </span>

        <div className="actions absolute z-50 top-[-110px] right-[8px] flex flex-col items-center gap-4 transition-all duration-500 group-hover:top-[10px] ">
          <Button className=" !w-[10px] !min-w-[35px] !h-[35px] !bg-white !rounded-full !text-black hover:!bg-[var(--hover-color)] hover:!text-white group">
            <FaRegHeart className="text-[18px] !text-black group-hover:text-white hover:!text-white" />
          </Button>
          <Button className="!w-[10px] !min-w-[35px] !h-[35px] !rounded-full !bg-white !text-black hover:!bg-[var(--hover-color)] hover:!text-white group">
            <MdOutlineZoomOutMap className="text-[18px] !text-black group-hover:text-white hover:!text-white" />
          </Button>
        </div>
      </div>
      <div className="info !p-3 bg-[rgb(247,247,247)]">
        <h6 className="text-[13px]">
          <Link to="/" className="link transition-all">
            All About you
          </Link>
        </h6>
        <h3 className="text-[15px] title font-[500]">
          <Link to="/" className="link transition-all">
            Embroidered Satin Saree
          </Link>
        </h3>
        <Rating name="size-small" defaultValue={4} size="small" readOnly />

        <div className="pricing flex gap-4">
          <span className="old-price line-through">Tk. 1900</span>
          <span className="old-price text-[var(--hover-color)] font-bold">
            Tk.1200
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
