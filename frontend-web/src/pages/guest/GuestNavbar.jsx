import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GuestNavbar = () => {
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    setIsScrolled(scrollTop > 15);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <nav
      className={`navbar sticky top-3 w-[95%] mx-auto z-30 bg-base-100 lg:py-5 lg:px-20 rounded-full transition duration-500 ease-in-out ${
        isScrolled ? "drop-shadow-card" : ""
      }`}
    >
      <div className="navbar-start w-full">
        <span className="font-bold ml-4 lg:ml-0 text-2xl md:text-3xl text-primary font-newsreader">
          Pen & Paper
        </span>
      </div>

      <div className="navbar-end hidden lg:flex">
        <ul className="flex gap-4 list-none">
          <li>
            <button
              className="px-8 py-3 text-white font-semibold bg-primary rounded-lg"
              onClick={() => navigate("sign-in")}
            >
              Join the community
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default GuestNavbar;
