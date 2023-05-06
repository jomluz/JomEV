/* eslint-disable @next/next/no-html-link-for-pages */
import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="p-3 md:p-5">
      <div className="flex items-center justify-between md:grid md:grid-cols-3 md:place-items-center">
        {/* logo */}
        <Link href="/">
          <h1 className="text-white  font-bold text-2xl md:text-5xl cursor-pointer hover:scale-105 transition">
            JomEV
          </h1>
        </Link>

        <div className="hidden md:flex text-white  font-semibold text-xl">
          <Link href="/">
            <div className='mr-3 relative cursor-pointer transition after:transition-[transform] after:content-[""] after:block after:absolute after:w-full after:-bottom-[4px] after:border-b-2 after:border-[#4caf50] after:origin-center after:transform after:scale-x-0 hover:after:scale-x-100 text-xs md:text-base hidden md:block'>
              Dashboard
            </div>
          </Link>

          <a href="/register">
            <div className='ml-3 relative cursor-pointer transition after:transition-[transform] after:content-[""] after:block after:absolute after:w-full after:-bottom-[4px] after:border-b-2 after:border-[#4caf50] after:origin-center after:transform after:scale-x-0 hover:after:scale-x-100 text-xs md:text-base hidden md:block'>
              Registration
            </div>
          </a>
        </div>
        <div className="text-xs md:text-base">
          <ConnectButton showBalance={false} />
        </div>
      </div>
      <div className="mt-5 flex items-center justify-center block md:hidden text-white flex font-semibold text-xl">
        <Link href="/">
          <div className='mr-3 relative cursor-pointer transition after:transition-[transform] after:content-[""] after:block after:absolute after:w-full after:-bottom-[4px] after:border-b-2 after:border-[#4caf50] after:origin-center after:transform after:scale-x-0 hover:after:scale-x-100 text-base md:text-base '>
            Dashboard
          </div>
        </Link>

        <a href="/register">
          <div className='ml-3 relative cursor-pointer transition after:transition-[transform] after:content-[""] after:block after:absolute after:w-full after:-bottom-[4px] after:border-b-2 after:border-[#4caf50] after:origin-center after:transform after:scale-x-0 hover:after:scale-x-100 text-base md:text-base '>
            Registration
          </div>
        </a>
      </div>
    </div>
  );
};

export default Navbar;
