import React from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

interface BadgeProps {
  count: number;
  color: string;
}

interface NavLinkProps {
  children: React.ReactNode;
  text: string;
  to?: string;
  active?: boolean;
  collapsed?: boolean;
  badge?: BadgeProps | null;
}

function Navlink({
  children,
  text,
  active,
  collapsed = false,
  badge = null,
  to = "#",
}: NavLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-4 py-3 px-3 rounded-md transition-all duration-200 relative group",
        active
          ? "bg-gradient-to-r from-blue-600/80 to-blue-700/80 text-white font-medium"
          : "hover:bg-gray-800/60 text-gray-400 hover:text-gray-200",
        collapsed ? "justify-center" : "",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center",
          active ? "text-white" : "text-gray-400 group-hover:text-gray-200",
        )}
      >
        {children}
      </div>

      {!collapsed && (
        <span
          className={cn(
            "transition-colors duration-200 text-sm",
            active ? "text-white" : "text-gray-400 group-hover:text-gray-200",
          )}
        >
          {text}
        </span>
      )}

      {badge && badge.count > 0 && (
        <div
          className={cn(
            "absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center",
            collapsed ? "right-1 top-1 translate-y-0" : "",
          )}
        >
          <span
            className={cn(
              "flex items-center justify-center text-xs font-medium text-white rounded-full min-w-[18px] h-4 px-1",
              badge.color,
            )}
          >
            {badge.count}
          </span>
        </div>
      )}
    </Link>
  );
}

export default Navlink;
