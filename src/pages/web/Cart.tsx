import { Link } from "react-router-dom";

const CartProduct = (props:{image:string,name:string,priceCents:number,quantity:number}) => {
  return (
    <>
      <div className="grid grid-cols-4  mt-7 border-b-2 border-gray-50 py-2 px-4 rounded shadow-gray-200 shadow ">
        <div className="flex gap-5  items-center flex-col md:flex-row">
          <img src={props.image} alt="" className="w-10" />
          <p className="text-sm">{props.name}</p>
        </div>
        <div className="flex items-center">
          <p>${props.priceCents / 100}</p>
        </div>
        <div className=" flex items-center pl-1">
          <input
            type="number"
            className="w-14 px-2 py-1 border-2 outline-none border-gray-400 rounded-md"
            min={1}
            defaultValue={props.quantity}
        
          />
        </div>
        <div className="flex items-center">${(props.priceCents / 100) * props.quantity}</div>
      </div>
    </>
  );
};

const Checkoutprocessdetails = (props:{total:number}) => {
  return (
    <>
      <div className="border-2 py-4 px-4 rounded border-black ">
        <h1 className="font-semibold">Cart Total</h1>
        <div className="flex justify-between border-b-2 py-2 mb-2">
          <p className="text-sm">Subtotal:</p>
          <span className="text-sm">${props.total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between border-b-2 py-2 mb-2">
          <p className="text-sm">shipping:</p>
          <span className="text-sm"> free</span>
        </div>
        <div className="flex justify-between  py-2 mb-2">
          <p className="text-sm">Total:</p>
          <span className="text-sm">${props.total.toFixed(2)}</span>
        </div>
        <button className="bg-black text-white rounded py-3 px-5 lg:mx-20">
          <Link to={"/checkout"}> process to checkout</Link>
        </button>
      </div>
    </>
  );
};

const Cart = () => {
  return (
    <>
      <div className=" mb">
        <div className="mt-10">
          <span className="opacity-50">Home</span> /Cart
        </div>

        <div className=" p-1 mt-10  mb-20">
          <div className="mb-10  w-[95%]">
              <div className="grid grid-cols-4 font-semibold shadow-md py-4 px-4 shadow-gray-100 rounded ">
                <p>product</p>
                <p>price</p>
                <p>Quantity</p>
                <p>Subtotal</p>
              </div>

            <CartProduct
              image="https://picsum.photos/200/300"
              name="Product 1"
              priceCents={1000}
              quantity={2}
            />
            <CartProduct
              image="https://picsum.photos/200/301"
              name="Product 2"
              priceCents={2000}
              quantity={1}
            />
          </div>

          <div className="flex  pr-[5%] mt-20 md:gap-[25%] flex-col gap-4 md:flex-row">
            <Checkoutprocessdetails total={3000} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
