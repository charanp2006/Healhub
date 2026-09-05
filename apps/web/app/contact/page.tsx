// @ts-nocheck
"use client";

import { assets } from "@/src/assets/assets";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-text-secondary">
        <p>
          CONTACT{" "}
          <span className="text-text-primary font-semibold">US</span>
        </p>
      </div>
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.contact_image.src}
          alt=""
        />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-lg text-text-secondary">
            OUR OFFICE
          </p>
          <p className="text-text-secondary">
            Healhub Healthcare Solutions <br /> Bangalore, India
          </p>
          <p className="text-text-secondary">
            Tel: +91 98765 43210 <br /> Email: support@healhub.com
          </p>
          <p className="font-semibold text-lg text-text-secondary">
            CAREERS AT HEALHUB
          </p>
          <p className="text-text-secondary">
            Learn more about our teams and job openings.
          </p>
          <button className="border border-primary px-8 py-4 text-sm hover:bg-primary hover:text-white transition-all duration-500">
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
