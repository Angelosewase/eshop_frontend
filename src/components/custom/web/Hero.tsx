
function Hero() {
  const imageNumber = 5;
  return (
    <div className="mt-4">
      <div className="relative w-full h-[450px] bg-gray-200 rounded-lg">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={`https://picsum.photos/1410/450`}
            alt="hero image"
            className=" rounded-lg"
          />
        </div>
           
      </div>
        <div className="w-full item-center flex justify-center mt-2 z-20 bottom-0 bg-white">
           {Array.from({ length: imageNumber }, (_, i) => (
            <div key={i} className="border-2 border-gray-600  bg-gray-100 w-3 h-3 rounded-full mx-0.5"/> 
           ))} 
        </div>
   
    </div>
  )
}

export default Hero