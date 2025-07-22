import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import "./productitem.css";
import Button from "@mui/material/Button";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineZoomOutMap } from "react-icons/md";

const ProductItem = (props) => {
  return (
    <div className="productitem !shadow-lg !overflow-hidden">
      
      <div className="imgwrappper group !h-[220px] !overflow-hidden relative">
        <img
          className="w-full h-[250px] overflow-hidden "
          src={props.product.image1}
          alt=""
        />
        <img
          className="w-full absolute top-0 left-0 transition-all duration-600 opacity-0 group-hover:opacity-100"
          src={props.product.image2}
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


      <div className="info !p-3 bg-[rgb(247,247,247)] ">
        <h6 className="text-[13px]">
          <Link to="/" className="link transition-all">
            All About you
          </Link>
        </h6>
        <h3 className="text-[15px] title font-[500]">
          <Link to="/" className="link transition-all">
            {props.product.name}
          </Link>
        </h3>
        <Rating name="size-small" defaultValue={4} size="small" readOnly />

        <div className="pricing flex gap-4 !mb-5">
          <span className="old-price line-through text-red-400">
            Tk {props.product.oldPrice}
          </span>
          <span className="old-price text-[var(--hover-color)] font-bold">
            Tk {props.product.price}
          </span>
        </div>

        <div className="w-full h-10 rounded-[3px] border border-[var(--hover-color)]  transition-all duration-300 ease-in-out hover:bg-[var(--hover-color)] hover:shadow-md">
          <Button className="w-full h-full !text-[var(--hover-color)] font-semibold tracking-wide hover:!text-white transition-all duration-300 ease-in-out">
            <Link
              to="/"
              className="w-full h-full flex items-center justify-center"
            >
              Add To Cart
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
