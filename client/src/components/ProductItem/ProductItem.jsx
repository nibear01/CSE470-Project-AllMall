import { useState } from "react";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { FaRegHeart } from "react-icons/fa";
import { MdOutlineZoomOutMap } from "react-icons/md";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./productitem.css";

const ProductItem = (props) => {
  // console.log(props.product);

  const [openDialog, setOpenDialog] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: "50%", y: "50%" });
  const [isZooming, setIsZooming] = useState(false);

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x: `${x}%`, y: `${y}%` });
  };

  const handleMouseEnter = () => setIsZooming(true);
  const handleMouseLeave = () => setIsZooming(false);

  return (
    <>
      <div className="productitem !shadow-lg !overflow-hidden">
        <div className="imgwrappper group !h-[220px] !overflow-hidden relative">
          <img
            className="w-full h-[250px] overflow-hidden "
            src={`http://localhost:5000${props.product.imageUrl}`}
            alt=""
          />
          {/* <img
            className="w-full absolute top-0 left-0 transition-all duration-600 opacity-0 group-hover:opacity-100"
            src={props.product.imageUrl}
            alt=""
          /> */}
          <span
            className="absolute flex items-center top-[10px] left-[10px] 
            bg-[var(--hover-color)] text-white z-50 !p-1 rounded-3xl"
          >
            10%
          </span>

          <div className="actions absolute z-50 top-[-110px] right-[8px] flex flex-col items-center gap-4 transition-all duration-500 group-hover:top-[10px] ">
            <Button className="!w-[10px] !min-w-[35px] !h-[35px] !bg-white !rounded-full !text-black hover:!bg-[var(--hover-color)] hover:!text-white group">
              <FaRegHeart className="text-[18px] !text-black group-hover:text-white hover:!text-white" />
            </Button>
            <Button
              onClick={handleDialogOpen}
              className="!w-[10px] !min-w-[35px] !h-[35px] !rounded-full !bg-white !text-black hover:!bg-[var(--hover-color)] hover:!text-white group"
            >
              <MdOutlineZoomOutMap className="text-[18px] !text-black group-hover:text-white hover:!text-white" />
            </Button>
          </div>
        </div>

        <div className="info !p-3 bg-[rgb(247,247,247)] ">
          {/* <h6 className="text-[13px]">
            <Link to="/" className="link transition-all">
              All About you
            </Link>
          </h6> */}
          <h3 className="text-[15px] title font-[500]">
            <Link to="/" className="link transition-all">
              {props.product.name.length > 30 ? `${props.product.name.slice(0,15)}....` : props.product.name }
            </Link>
          </h3>
          <Rating name="size-small" defaultValue={4} size="small" readOnly />

          <div className="pricing flex gap-4 !mb-5">
            {/* <span className="old-price line-through text-red-400">
              Tk {props.product.price}
            </span> */}
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

      {/* ======= Dialog Code ======= */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {props.product.name}
          <IconButton
            aria-label="close"
            onClick={handleDialogClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <div
            className="relative overflow-hidden w-full h-[300px] rounded border border-gray-300"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={`http://localhost:5000${props.product.imageUrl}`}
              alt={props.product.name}
              className="w-full h-full object-contain transition-transform duration-300 ease-in-out"
              style={{
                transform: isZooming ? "scale(2)" : "scale(1)",
                transformOrigin: `${zoomPosition.x} ${zoomPosition.y}`,
              }}
            />
          </div>

          <div className="!mt-4">
            <p className="!text-sm !text-gray-700 !mb-2">
              <strong>Price:</strong> Tk {props.product.price}
            </p>
            <p className="!text-sm !text-gray-600">
              <strong>Description:</strong>{" "}
              {props.product.description || "No description available."}
            </p>
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductItem;
