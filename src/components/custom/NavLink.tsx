import React from "react";
import { Link } from "react-router-dom";

interface navLinkPropsInterface {
  children: React.ReactNode;
  text: string;
  to?: string;
  active?: boolean;
}

function Navlink({ children, text, active, to = "#" }: navLinkPropsInterface) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 py-2 my-1 px-3 rounded-md hover:bg-zinc-800 ${
        active && "bg-[#373F51]"
      }`}
    >
      {children}
      <span className={`${active ? "text-white":"text-gray-400"}`}>{text}</span>
    </Link>
  );
}

export default Navlink;
