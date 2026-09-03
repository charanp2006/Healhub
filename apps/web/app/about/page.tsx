// @ts-nocheck
"use client";

import { assets } from "@/src/assets/assets";

const About = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-text-secondaryLight">
        <p>
          ABOUT{" "}
          <span className="text-text-primaryLight font-semibold">US</span>
        </p>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.about_image.src}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-text-secondaryLight">
          <p>
            Welcome to Healhub, your comprehensive hospital and clinic
            management and healthcare booking platform. At Healhub, we simplify
            how patients connect with hospitals, clinics, doctors, and
            healthcare services — all in one place.
          </p>
          <p>
            Healhub brings together a network of registered hospitals and clinics
            with verified doctors, enabling seamless appointment scheduling,
            real-time availability tracking, analytics, and health blog
            resources. Whether you&apos;re a patient seeking care, a doctor
            managing your practice, or a hospital/clinic optimizing operations
            — Healhub is built for you.
          </p>
          <b className="text-text-primaryLight">Our Vision</b>
          <p>
            Our vision at Healhub is to create a unified healthcare ecosystem
            where patients, doctors, and hospitals collaborate effortlessly. We
            aim to bridge the gap between healthcare providers and the
            communities they serve, making quality care accessible and
            transparent for everyone.
          </p>
        </div>
      </div>
      <div className="text-xl my-4">
        <p>
          WHY{" "}
          <span className="text-text-primaryLight font-semibold">
            CHOOSE US
          </span>
        </p>
      </div>
      <div className="flex flex-col md:flex-row mb-20">
        <div className="border border-border-light px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-text-secondaryLight cursor-pointer">
          <b>HOSPITALS & CLINICS NETWORK:</b>
          <p>
            Access a network of registered hospitals and clinics with verified
            doctors, real-time bed availability, and specialized departments.
          </p>
        </div>
        <div className="border border-border-light px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-text-secondaryLight cursor-pointer">
          <b>SMART SCHEDULING:</b>
          <p>
            Book appointments based on doctor availability, weekly schedules,
            and real-time slot management — no more waiting.
          </p>
        </div>
        <div className="border border-border-light px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-text-secondaryLight cursor-pointer">
          <b>HEALTH INSIGHTS:</b>
          <p>
            Stay informed with curated health blogs from verified doctors and
            hospitals/clinics, plus analytics-driven care recommendations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
