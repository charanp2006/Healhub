import Link from "next/link";
import { specialityData } from "@/src/assets/assets";

const SpecialityMenu = () => {
  return (
    <div
      id="speciality"
      className="flex flex-col items-center gap-4 py-16 text-text-primaryLight"
    >
      <h1 className="text-3xl font-medium md:text-3xl text-left md:text-center w-full px-1 md:px-0">
        Find by Speciality
      </h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors, schedule
        your appointment hassle-free.
      </p>
      <div className="flex sm:justify-center gap-4 pt-5 w-full overflow-scroll snap-row">
        {specialityData.map((item, index) => (
          <Link
            onClick={() => scrollTo(0, 0)}
            className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500 md:last:mr-0 last:mr-8 touch-none-outline"
            key={index}
            href={`/doctors/${item.speciality}`}
          >
            <span className="w-[72px] h-[72px] md:w-auto md:h-auto rounded-2xl md:rounded-none bg-white md:bg-transparent border border-[#edeff2] md:border-0 shadow-sm md:shadow-none flex items-center justify-center">
              <img
                className="w-12 md:w-24 mb-0 md:mb-2"
                src={item.image.src}
                alt=""
              />
            </span>
            <p className="mt-2 md:mt-0">{item.speciality}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;
