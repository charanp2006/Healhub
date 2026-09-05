import { BRAND_LOGO, LOGO_ALT } from "@healhub/ui/images";

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* ----Left section---- */}
        <div>
          <img
            className="w=50 h-25 object-contain mb-5"
            src={BRAND_LOGO}
            alt={LOGO_ALT}
          />
          <p className="w-full md:w-2/3 text-text-secondary leading-6">
            Healhub is your comprehensive healthcare platform connecting patients
            with registered hospitals and verified doctors. Book appointments,
            explore hospital profiles, and access health insights — all in one
            place.
          </p>
        </div>

        {/* ----center section---- */}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-text-secondary">
            <li>Home</li>
            <li>About us</li>
            <li>Contact us</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        {/* ----right section---- */}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-text-secondary">
            <li>+1-234-567-8910</li>
            <li>User@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* ------Copyright----- */}
      <div>
        <hr />
        <p className="py-5 text-sm text-center">
          Copyright 2025 @ Healhub - All Rights Reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
