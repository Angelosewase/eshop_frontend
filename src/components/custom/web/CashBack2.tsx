import image from "../../../assets/images/cards.png";
const CashbackSection = () => {
  return (
    <div className=" flex bg-white mt-24  justify-between  ">
      <div className=" text-center p-6  text-black px-6">
        <h2 className="text-4xl font-bold mb-2">Get 5% Cash back on $500</h2>
        <p className="mb-4 text-lg">on eshop.com</p>
        <button className="bg-[#373F51] text-white font-semibold px-6 py-2 rounded-lg shadow ">
          Learn More
        </button>
      </div>
      <img src={image} alt="" />
    </div>
  );
};

export default CashbackSection;
