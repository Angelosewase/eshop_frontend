import { Phone, Search, ShoppingCart, User } from "lucide-react";
import Logo from "./Logo";
import { Link, useNavigate } from "react-router-dom";
import { HeaderCategoriesDropDown } from "./modals";
import { useGetCurrentUserQuery } from "../../features/users/userSlice";
import { useAppSelector } from "../../hooks/Reduxhooks";
import { selectCartItemsCount } from "../../features/cart/cartSlice";

function WebHeader() {
  const { data: userData, isLoading } = useGetCurrentUserQuery();
  const cartItemsCount = useAppSelector(selectCartItemsCount);
  const navigate = useNavigate();

  return (
    <div className="w-full ">
      <WebHeaderTop />
      <div className="w-full bg-white flex items-center  py-4 px-14">
        <Logo />
        <div className="text-[#696778] flex text-[17.5px]  items-center  flex-1  justify-center ">
          <div className="flex items-center gap-9 flex-1 justify-end pr-10">
            <HeaderCategoriesDropDown />
            <Link
              className="border-b border-white hover:border-black"
              to={"/deals"}
            >
              Deals
            </Link>
            <Link
              className="border-b border-white hover:border-black"
              to={"/explore"}
            >
              Explore
            </Link>
            <Link
              className="border-b border-white hover:border-black"
              to={"/orders"}
            >
              orders
            </Link>
            <form className="relative border border-gray-200 rounded-full ">
              <input
                type="text"
                placeholder="Search  products"
                className="border-none bg-white rounded-full px-4 py-2 w-80 outline-1 outline-[#373F51] text-sm"
              />
              <button
                type="submit"
                className="absolute right-0.5 top-1/2 p-2 transform -translate-y-1/2 bg-[#373F51] rounded-full  text-white"
              >
                <Search className="size-4" />
              </button>
            </form>
          </div>
          <div className="flex items-center justify-self-end gap-5 ">
            <Link className="flex items-center gap-2 relative" to={"/cart"}>
              <ShoppingCart className="size-6" />
              Cart
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount > 9 ? '9+' : cartItemsCount}
                </span>
              )}
            </Link>

            <Link
              className="bg-primary text-white text-lg px-4 py-1 rounded-lg "
              to={"/contact"}
            >
              contact
            </Link>

            {isLoading ? (
              <div className="py-1 px-3 flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
              </div>
            ) : userData ? (
              <button
                onClick={() => navigate('/profile')}
                className="py-1 flex items-center gap-2 px-3 hover:bg-gray-100 rounded-lg"
              >
                <User className="size-5" />
                <span>{userData.firstName}</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/auth/login')}
                className="py-1 flex items-center gap-2 px-3 hover:bg-gray-100 rounded-lg"
              >
                <User className="size-5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const WebHeaderTop = () => {
  return (
    <div className="w-full  text-sm  bg-[#373F51] flex items-center justify-between py-2 px-14 text-white/90">
      <div className="flex items-center gap-2">
        <Phone size={18} />
        +250 788 888 888
      </div>
      <div>Get off 50% discount| selected items</div>
      <div className="flex items-center gap-4">
        <select className="bg-[#373F51] text-sm text-white/70">
          <option value="USA">USA</option>
          <option value="Canada">Canada</option>
          <option value="UK">UK</option>
          <option value="Australia">Australia</option>
        </select>
        <select className="bg-[#373F51] text-sm text-white/70">
          <option value="English">English</option>
          <option value="French">French</option>
          <option value="Spanish">Spanish</option>
          <option value="Arabic">Arabic</option>
        </select>
      </div>
    </div>
  );
};

export default WebHeader;
