import React from "react";
import { Logo } from "../helper/ImageHelper";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="w-screen home min-h-screen  py-10 flex-col bg-no-repeat bg-cover bg-center flex items-center justify-start">
      <div className="w-full md:pt-0 pt-[10vh] h-[140px] flex items-center px-10 justify-center sm:justify-between">
        <img src={Logo} alt="" className="w-[70px] h-auto" />
        <div className="sm:block hidden">
          <Link
            to="/signin"
            className="mt-5 relative group hover:bg-transparent border-primary bg-primary border-2 py-1 min-w-[100px] center_div text-white font-Poppins rounded cursor-pointer"
          >
            Log in
          </Link>
        </div>
      </div>
      <div className="lg:pt-[20vh] pt-[10vh] flex flex-col gap-y-4 items-center">
        <h1 className="text-white lg:text-6xl text-2xl font-Poppins capitalize">
          Jai Export Enterprises
        </h1>
        <h1 className="text-white lg:text-4xl text-xl font-Poppins capitalize">
          File Transfer Service
        </h1>
        <p className="text-white lg:text-xl text-sm lg:w-full w-[80%] text-center">
          Easily share and transfer files over the internet with convenience.
          <br />
          Enjoy extensive customization options and robust tracking
          capabilities.
        </p>
        <Link
          to="/signin"
          className="mt-5 relative group border-primary border-2 px-3 py-1 min-w-[150px] center_div text-white font-Poppins rounded-2xl cursor-pointer"
        >
          <p className="z-50 lg:block hidden">Share Now</p>
          <p className="z-50 block lg:hidden">Signin</p>
          <div className="absolute w-0 group-hover:w-full transition-all duration-100 ease-linear left-0 bg-primary rounded-xl h-full"></div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
