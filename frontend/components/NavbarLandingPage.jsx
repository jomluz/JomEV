import { ConnectButton } from "@rainbow-me/rainbowkit";
const Navbar = () => {
  return (
    <div className="w-full flex items-center justify-between md:justify-end">
      <ConnectButton />
      <div className="bg-[#4caf50] ml-5 w-fit py-2 px-4 rounded text-white font-bold cursor-pointer hover:scale-105 transition">
        Launch App
      </div>
    </div>
  );
};

export default Navbar;
