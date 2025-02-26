import { Phone, Search, ShoppingCart, User } from "lucide-react";
import Logo from "./Logo";
import { Link } from "react-router-dom";
import { HeaderCategoriesDropDown } from "./modals";

function WebHeader() {
  return (
    <div className="w-full">
      <WebHeaderTop />
      <div className="w-full bg-white flex items-center  py-4 px-14">
        <Logo />
        <div className="text-[#696778] flex text-lg items-center  flex-1 font-normal justify-end  gap-7 ">
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

          <Link className="flex items-center gap-2" to={"/cart"}>
            <ShoppingCart className="size-6" />
            Cart
          </Link>

          <Link
            className="bg-[#373F51] text-white text-lg px-4 py-1 rounded-lg "
            to={"/contact"}
          >
            contact
          </Link>

          <button className="py-1">
            <User />
          </button>
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
