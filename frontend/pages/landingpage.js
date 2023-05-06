import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect, useState } from "react";
import { FaSearchLocation } from "react-icons/fa";
import NavbarLandingPage from "../components/NavbarLandingPage";
const DynamicMap = dynamic((data) => import("../components/Map"), {
  ssr: false,
});
import { useQuery, gql, useLazyQuery } from "@apollo/client";
import { useAccount } from "wagmi";
import { Input, Link } from "@chakra-ui/react";

const GET_CHARGE_POINT_NEARBY = gql`
  query GetChargePointsNearby(
    $location: NewLocation!
    $page: Int!
    $skip: Int!
    $maxDistance: Float!
  ) {
    chargePointsNearby(
      location: $location
      page: $page
      skip: $skip
      maxDistance: $maxDistance
    ) {
      name
      physicalAddress
      clientId
      location {
        coordinates
      }
    }
  }
`;

export default function Home() {
  const [chargePointsNearby, setChargePointsNearby] = useState([]);
  const [distance, setDistance] = useState(0);
  const [
    getNearbyCharingPoints,
    {
      loading: NearbyChargerLoading,
      error: NearbyChargerError,
      data: NearbyChargerData,
    },
  ] = useLazyQuery(GET_CHARGE_POINT_NEARBY, {
    context: {
      clientName: "endpoint1",
    },
  });
  const { address } = useAccount();

  const findNearbyCharger = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((location) => {
        // getUserBooking();
        // console.log(location);
        getNearbyCharingPoints({
          variables: {
            location: {
              type: "Point",
              coordinates: [
                location.coords.longitude,
                location.coords.latitude,
              ],
            },
            page: 0,
            skip: 0,
            maxDistance: distance >= 0 ? distance : 1000,
          },
        });
        setChargePointsNearby(
          NearbyChargerData ? NearbyChargerData.chargePointsNearby : []
        );
        // console.log("testing");
      });
      // console.log(data);
      // setChargePointsNearby(data?.chargePointsNearby);
    }
  };

  useEffect(() => {
    findNearbyCharger();
  }, [address]);
  return (
    <div className="bg-[#212121] p-5 flex flex-col min-h-screen justify-center items-center">
      <Head>
        <title>Eth Bogota JomEV (JEV)</title>
      </Head>
      <NavbarLandingPage />
      <h1 className="mt-6 text-white text-center text-5xl md:text-6xl font-bold text-[#4caf50]">
        Eth Bogota JomEV (JEV)
      </h1>
      <div className="relative mt-10 flex w-[85%] rounded-lg justify-center">
        <DynamicMap data={chargePointsNearby} />
        <div className="flex flex-col mt-3 bg-[#1D1D1D] p-5 absolute rounded-3xl justify-center m-auto flex z-[1000] w-[65%] -bottom-[3rem]">
          <div className="select-none text-4xl text-white font-bold mb-5 text-center">
            Find a nearby station ⛽
          </div>
          <div className="flex justify-center items-center">
            <Input
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="Enter a desire distance you hope to see your nearby chargers (meter as unit)"
              w={"70%"}
              alignSelf="center"
              color="white"
            />
            <div
              onClick={() => findNearbyCharger()}
              className="select-none text-white text-lg bg-[#4caf50] px-5 py-1 ml-2 rounded-lg cursor-pointer font-bold hover:opacity-90 transition"
            >
              Find
            </div>
          </div>
          {/* <input
                className="self-center bg-gray-200 appearance-none border-2 border-gray-200 rounded w-[70%] py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-[#4caf50]"
                id="inline-full-name"
                type="text"
              // value={stakeAmount}
              // onChange={(e) => setStakeAmount(e.target.value)}
              /> */}
        </div>
      </div>
      <div className="mt-[60px] md:mt-10 w-full md:w-[50%] md:ml-10 flex flex-col md:flex-row justify-between items-center">
        <h2 className=" text-white text-xl md:text-2xl text-center mt-3 text-gray-300 align-middle">
          A decentralized market for EV Charging Stations, providing a better
          experience for EV owners
        </h2>
        <img src="/static/robot.png" className="w-[20%] align-middle" />
        <div>
          <div>
            <div className="flex justify-between">
              {" "}
              <div></div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-col md:flex-row flex-wrap">
        <div className="my-2 md:my-0 md:mx-2 w-[250px] h-[100px] bg-blue-300 rounded p-2">
          Sponsor
        </div>
        <div className="my-2 md:my-0 md:mx-2 w-[250px] h-[100px] bg-blue-300 rounded p-2">
          Sponsor
        </div>
        <div className="my-2 md:my-0 md:mx-2 w-[250px] h-[100px] bg-blue-300 rounded p-2">
          Sponsor
        </div>
      </div>
    </div>
  );
}
