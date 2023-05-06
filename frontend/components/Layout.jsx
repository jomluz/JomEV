import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Navbar from "./Navbar";
const Layout = ({ children }) => {
  return (
    <div className="bg-[url('/static/bg.png')]  bg-cover min-h-screen">
      <Navbar />
      <div className="py-5">{children}</div>
    </div>
  );
};

export default Layout;
