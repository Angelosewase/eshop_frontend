interface InventoryIconProps {
  size?: number;
  color?: string;
}

function InventoryIcon({ size = 24, color = "white" }: InventoryIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0 2.6C0 1.91044 0.273928 1.24912 0.761522 0.761522C1.24912 0.273928 1.91044 0 2.6 0H21.4C22.0896 0 22.7509 0.273928 23.2385 0.761522C23.7261 1.24912 24 1.91044 24 2.6V3.4C24 4.08956 23.7261 4.75088 23.2385 5.23848C22.7509 5.72607 22.0896 6 21.4 6H21V16.6C21 17.93 19.93 19 18.6 19H5.4C4.07 19 3 17.93 3 16.6V6H2.6C1.91044 6 1.24912 5.72607 0.761522 5.23848C0.273928 4.75088 0 4.08956 0 3.4L0 2.6ZM2.6 2C2.44087 2 2.28826 2.06321 2.17574 2.17574C2.06321 2.28826 2 2.44087 2 2.6V3.4C2 3.55913 2.06321 3.71174 2.17574 3.82426C2.28826 3.93679 2.44087 4 2.6 4H21.4C21.5591 4 21.7117 3.93679 21.8243 3.82426C21.9368 3.71174 22 3.55913 22 3.4V2.6C22 2.44087 21.9368 2.28826 21.8243 2.17574C21.7117 2.06321 21.5591 2 21.4 2H2.6ZM8 8C7.73478 8 7.48043 8.10536 7.29289 8.29289C7.10536 8.48043 7 8.73478 7 9C7 9.26522 7.10536 9.51957 7.29289 9.70711C7.48043 9.89464 7.73478 10 8 10H16C16.2652 10 16.5196 9.89464 16.7071 9.70711C16.8946 9.51957 17 9.26522 17 9C17 8.73478 16.8946 8.48043 16.7071 8.29289C16.5196 8.10536 16.2652 8 16 8H8Z"
        fill={color}
      />
    </svg>
  );
}

export default InventoryIcon;
