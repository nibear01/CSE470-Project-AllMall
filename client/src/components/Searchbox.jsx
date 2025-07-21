import { CiSearch } from "react-icons/ci";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

const Searchbox = () => {
  return (
    <>
      <div className=" searchBox py-10 w-[500px] h-[50px] rounded-[7px] flex justify-center items-center overflow-hidden">
        <input
          className="w-full rounded-l-2xl !p-3 outline-0 text-[14px]"
          type="text"
          placeholder="Search items"
        />
        <Tooltip title="Search">
          <Button className="max-h-20 max-w-20 !text-[#252525a0] searchIcon">
            <CiSearch className="h-10 w-8 " />
          </Button>
        </Tooltip>
      </div>
    </>
  );
};

export default Searchbox;
