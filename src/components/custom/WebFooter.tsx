import Logo from "./Logo";
import paymentImage from "../../assets/images/payments.png";

const FooterLinks = [
  {
    title: "About",
    links: [
      {
        name: "About Us",
        link: "/about",
      },
      {
        name: "Contact Us",
        link: "/contact",
      },
      {
        name: "Careers",
        link: "/careers",
      },
      {
        name: "Press",
        link: "/press",
      },
    ],
  },
  {
    title: "Categories",
    links: [
      {
        name: "Category 1",
        link: "/category1",
      },
      {
        name: "Category 2",
        link: "/category2",
      },
      {
        name: "Category 3",
        link: "/category3",
      },
      {
        name: "Category 4",
        link: "/category4",
      },
    ],
  },
  {
    title: "services",
    links: [
      {
        name: "service 1",
        link: "/service1",
      },
      {
        name: "service 2",
        link: "/service2",
      },
      {
        name: "service 3",
        link: "/service3",
      },
      {
        name: "service 4",
        link: "/service4",
      },
    ],
  },
  {
    title: "help",
    links: [
      {
        name: "help 1",
        link: "/help1",
      },
      {
        name: "help 2",
        link: "/help2",
      },
      {
        name: "help 3",
        link: "/help3",
      },
      {
        name: "help 4",
        link: "/help4",
      },
    ],
  },
];

function WebFooter() {
  return (
    <div className="px-14 flex flex-col py-4">
      <div className="flex-1 w-full">
        <hr className="w-full bg-gray-500 h-[2px]" />
        <div className="h-[380px] flex py-10">
          <div className=" w-[28%] mr-20">
            <Logo />
            <p className="text-sm text-gray-600 mt-5">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatibus quam laboriosam, laudantium mollitia eum officia
              dolores enim rem reiciendis. Mollitia cupiditate magni sed
              expedita minus voluptas beatae tempora, quod veniam!
            </p>
            <div className="mt-5">
              <h1 className="text-lg font-semibold">Accepted payments</h1>
              <div>
                <img src={paymentImage} alt="payment methods" />
                <img src={paymentImage} alt="payment methods" />
              </div>
            </div>
          </div>
          {
            FooterLinks.map((footerLink, index) => (
              <FooterLinkDivs key={index} header={footerLink.title} links={footerLink.links} />
            ))  
          }
        </div>
        <hr className="w-full bg-gray-500 h-[2px]" />
      </div>

      <div className="my-5 text-sm text-center text-gray-600 flex justify-between t">
        © {new Date().getFullYear()} Your Company. All rights reserved.
        <div>
          <a href="/privacy-policy" className="ml-4 over:underline">
            Privacy Policy
          </a>
          <a href="/terms" className="ml-4  hover:underline">
            Terms and Conditions
          </a>
          <a href="/user-agreement" className="ml-4  hover:underline">
            User Agreement
          </a>
          <a href="/license" className="ml-4  hover:underline">
            License
          </a>
        </div>
      </div>
    </div>
  );
}

const FooterLinkDivs = ({
  header,
  links,
}: {
  header: string;
  links: { name: string; link: string }[];
}) => {
  return (
    <div className="w-[13%] ">
      <h2 className="text-lg font-semibold">{header}</h2>
      <ul className="mt-2">
        {links.map((linkItem, index) => (
          <li key={index} className="">
            <a href={linkItem.link} className="text-[#696778] hover:underline text-sm -mt-0.5">
              {linkItem.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WebFooter;
