import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link className="flex items-center  text-[#373F51]" to={"/"}>
      <ShoppingCart size={28} />
      <p className="text-lg font-bold">#e-shop</p>
    </Link>
  );
}

export default Logo;
