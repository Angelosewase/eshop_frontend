const TopCategoryItem = ({
  name,
  imgUrl,
}: {
  name: string;
  imgUrl: string;
}) => {
  return (
    <div className="mr-7 relative  min-w-[20%] mb-5 h-[320px] rounded-lg">
      <img src={imgUrl} alt={name} className="h-full w-full rounded-lg" />
      <p className="absolute top-5 left-5 text-xl capitalize text-white z-30">
        {name}
      </p>
      <div className="absolute rounded-lg top-0 left-0 w-full h-full bg-black opacity-50 z-10  hover:opacity-0">
        {" "}
        hello
      </div>
    </div>
  );
};

function TopCategory() {
  const topCategories: Array<{ name: string; imgUrl: string }> = [
    {
      name: "pure cotton",
      imgUrl: "https://images.unsplash.com/photo-1557683316-973673baf926",
    },
    {
      name: "Thread made",
      imgUrl: "https://images.unsplash.com/photo-1557683316-973673baf926",
    },
    {
      name: "sport wear",
      imgUrl: "https://images.unsplash.com/photo-1557683316-973673baf926",
    },
    {
      name: "casual wear",
      imgUrl: "https://images.unsplash.com/photo-1557683316-973673baf926",
    },
    {
      name: "warm wear",
      imgUrl: "https://images.unsplash.com/photo-1557683316-973673baf926",
    },
  ];
  return (
    <div className="mt-8 ">
      <p className="text-xl font-bold mb-4 ">Shop our top category</p>
      <section className="flex flex-nowrap overflow-auto">
        <style>
          {`
            section::-webkit-scrollbar {
              width: 0.1rem;
              height: 0.1rem;
            }
            section::-webkit-scrollbar-track {
              background: #f1f1f1;
            }
            section::-webkit-scrollbar-thumb {
              background: #888;
              border-radius: 10px;
            }
            section::-webkit-scrollbar-thumb:hover {
              background: #555;
            }
          `}
        </style>
        {topCategories.map((category, index) => (
          <TopCategoryItem key={index} {...category} />
        ))}
      </section>
    </div>
  );
}

export default TopCategory;
