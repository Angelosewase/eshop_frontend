import React from "react";

interface OrdersIconProps {
  size?: number;
  color?: string;
}

function OrdersIcon({ size = 24, color = "white" }: OrdersIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.25 3.75H5.25V21.75H12.75M15.75 3.75H18.75V11.25M14.25 14.25V20.25C14.25 20.7495 15 21.75 18 21.75C21 21.75 21.75 20.5005 21.75 20.25V14.25M14.25 14.25C14.25 13.5 15.75 12.75 18 12.75C20.25 12.75 21.75 13.5 21.75 14.25M14.25 14.25C14.25 14.7495 15 15.75 18 15.75C21 15.75 21.75 14.7495 21.75 14.25M14.25 17.25C14.25 17.7495 15 18.75 18 18.75C21 18.75 21.75 17.7495 21.75 17.25M8.25 2.25H15.75L14.8125 5.25H9.1875L8.25 2.25Z"
        stroke="#696778"
        stroke-linejoin="round"
        // color={color}
        fill={color}
      />
    </svg>
  );
}

export default OrdersIcon;
