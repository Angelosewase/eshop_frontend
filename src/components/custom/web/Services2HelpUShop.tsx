function Services2HelpUShop() {
  return (
    <div className="my-14 ">
      <p className="text-xl font-bold mb-4 "> services to help you shop</p>
      <section className="flex flex-nowrap overflow-auto gap-10 ">
        {services.map((service) => (
          <Services2HelpUShopItem key={service.id} {...service} />
        ))}
      </section>
    </div>
  );
}

export default Services2HelpUShop;

const Services2HelpUShopItem = ({
  name,
  description,
  imgUrl,
}: {
  name: string;
  description: string;
  imgUrl: string;
}) => {
  return (
    <div
      className=" flex flex-col justify-between flex-1   h-[350px] 
         border-gray-300  bg-[#D9D9D912]/20 "
    >
      <div className="px-8 mt-4 ">
        <p className="text-2xl font-bold text-[#373F51]">{name}</p>
        <p className="text-md  mt-2 text-[#5D6E8B]">{description}</p>
      </div>
      <div>
        <img
          src={imgUrl}
          alt=""
          className="w-full h-[180px] object-cover "
        />
      </div>
    </div>
  );
};

const services = [
  {
    id: 1,
    name: "Frequently Asked Questions",
    description:
      "Find answers to common questions about our products and services.",
    imgUrl: "https://picsum.photos/1018/192",
  },
  {
    id: 2,
    name: "online payment Process",
    description: "Learn how to make online payments securely and easily.",
    imgUrl: "https://picsum.photos/1018/192",
  },
  {
    id: 3,
    name: "Shipping and Delivery",
    description: "Learn how to make online payments securely and easily.",
    imgUrl: "https://picsum.photos/1018/192",
  },
];
