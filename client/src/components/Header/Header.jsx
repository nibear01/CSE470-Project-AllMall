import { Link, NavLink } from "react-router-dom";
import Searchbox from "../Searchbox";
import { FaRegHeart } from "react-icons/fa";
import Tooltip from "@mui/material/Tooltip";

import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Navigation from "/src/components/Header/Navigation/Navigation";
import { useAuth } from "../../Store/Auth";
import ProfileDropdown from "../../pages/ProfiledDropDown";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: "0 4px",
  },
}));

const Header = () => {
  const { name } = useAuth();
  const { isLoggedIn } = useAuth();
  return (
    <>
      <div className="">
        {/* head1 */}
        <div className=" flex items-center justify-center min-w-full h-[40px] text-gray-700 container bg-white">
          <div className="flex justify-between items-center w-[90%] ">
            <p className="text-[12px]">
              Get up to 50% off new season styles, limited time only
            </p>
            <ul className="flex gap-3">
              <NavLink className=" text-[14px] hover:text-[var(--hover-color)] transition-all duration-300" to="/help-center">
                Help Center
              </NavLink>
              <NavLink className=" text-[14px] hover:text-[var(--hover-color)] transition-all duration-300" to="/order-track">
                Order Tracking
              </NavLink>
            </ul>
          </div>
        </div>

        {/* head2 */}
        <div className="border-b-[1px] border-[#ffffff50] bg-white">
          <div className="h-19 flex items-center justify-around p-10">
            <div className="w-[11%]">
              <NavLink to="/">
                <img
                  className="h-14 w-full"
                  src="/src/assets/logo_png.png"
                  alt="AllMall"
                />
              </NavLink>
            </div>
            <div className="max-w-[70%]">
              <Searchbox />
            </div>
            <div className="max-w=[25%]">
              <ul className="flex justify-between items-center gap-3">
                {isLoggedIn ? (
                  <li className="flex items-center justify-between gap-2">
                    <div className="font-[400] text-gray-700">{name}</div>
                    <ProfileDropdown />
                  </li>
                ) : (
                  <>
                    <li>
                      <NavLink className="link" to="/login">
                        Login
                      </NavLink>
                    </li>

                    <li>
                      <NavLink className="link" to="/register">
                        Register
                      </NavLink>
                    </li>
                  </>
                )}

                {/* cart */}
                <li className="">
                  <Link to="/cart-view">
                    <Tooltip title="Cart">
                      <IconButton aria-label="cart">
                        <StyledBadge badgeContent={2} color="primary">
                          <ShoppingCartIcon />
                        </StyledBadge>
                      </IconButton>
                    </Tooltip>
                  </Link>
                </li>

                {/* wishlist */}
                <li>
                  <Tooltip title="Wishlist">
                    <IconButton aria-label="wishlist">
                      <StyledBadge badgeContent={0} color="secondary">
                        <FaRegHeart />
                      </StyledBadge>
                    </IconButton>
                  </Tooltip>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* navigation */}
        <div>
          <Navigation />
        </div>
      </div>
    </>
  );
};

export default Header;
