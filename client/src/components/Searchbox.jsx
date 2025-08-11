import { CiSearch } from "react-icons/ci";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

const Searchbox = () => {
  return (
    <div className="!relative !w-full !max-w-[500px]">
      <div className="!flex !items-center !h-[50px] !bg-[#dfdfdf9c] !rounded-lg !overflow-hidden !shadow-sm !transition-all !duration-300 hover:!shadow-md focus-within:!shadow-lg focus-within:!ring-2 focus-within:!ring-[var(--hover-color)]">
        <input
          className="!flex-1 !h-full !px-4 !py-2 !text-sm sm:!text-base !text-gray-800 !bg-transparent !outline-none !border-none !placeholder-gray-500 !transition-all !duration-200 focus:!placeholder-transparent"
          type="text"
          placeholder="Search items..."
          aria-label="Search items"
        />
        <Tooltip title="Search" arrow>
          <Button 
            className="!min-w-0 !h-full !px-4 !bg-[#cececea0] !text-[#252525a0] hover:!bg-[#b5b5b5a0] !transition-colors !duration-200 !rounded-none"
            aria-label="Search button"
          >
            <CiSearch className="!h-5 !w-5 sm:!h-6 sm:!w-6 !transition-transform !duration-200 hover:!scale-110" />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default Searchbox;