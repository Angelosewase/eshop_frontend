import { Mail, PhoneIcon } from "lucide-react";

function Contact() {
  return (
      <div className=" py-10 pb-20 px-20">
        <h3 className="text-3xl text-black font-semibold mb-4">
          Contact us
        </h3>
        <div className="flex gap-10 ">
          {/* Contact Information Card */}
          <div className="flex flex-col justify-evenly w-1/3 p-6 border-2 border-slate-50 shadow rounded">
            {/* Phone Section */}
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-black rounded-full">
                  <PhoneIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold opacity-90">Call status</h3>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-sm">We are available 24/7, 7 days a week</p>
                <p className="text-sm">Phone: +250725542535</p>
                <hr className="border-black w-full my-4" />
              </div>
            </div>

            {/* Email Section */}
            <div className="">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-black rounded-full">
                  <Mail  className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold opacity-90">Write To us</h3>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-sm">
                  Fill out our form and we will contact you within 24 hours
                </p>
                <p className="text-sm">Email: customer@softsol.com</p>
                <p className="text-sm">Email: customer@softsol.com</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="flex-1 p-6 border-slate-50 shadow rounded">
            <form className="flex flex-col gap-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Your name"
                  className="flex-1 h-10 p-3 rounded bg-slate-100 placeholder:text-slate-500"
                />
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 h-10 p-3 rounded bg-slate-100 placeholder:text-slate-500"
                />
                <input
                  type="tel"
                  placeholder="Your phone(optional)"
                  className="flex-1 h-10 p-3 rounded bg-slate-100 placeholder:text-slate-500"
                />
              </div>
              <textarea
                placeholder="Your message"
                className="h-56 p-3 rounded bg-slate-100 placeholder:text-slate-500"
              />
              <div className="flex justify-end mt-4">
                <button className="px-6 py-3 bg-black text-white rounded-md  transition-colors">
                  Send message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
}

export default Contact;