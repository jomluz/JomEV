/* eslint-disable react/no-children-prop */
import Head from "next/head";
import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  InputGroup,
  Input,
  InputRightAddon,
  Image,
} from "@chakra-ui/react";
import useChargePoint from "../services/jom/useFetchChargePoint";
import truncateEthAddress from "truncate-eth-address";
// import useFetchChargePointAvailability from "../services/jom/useFetchChargePointAvailability";

import { useContractRead, useNetwork } from "wagmi";
import { getContractAddress, getScanUrlPrefix } from "../contracts/constants";
import JomAbi from "../contracts/abis/index.json";
import { useEnsName } from "wagmi";

// fetch charge points availability
const useChargePoints = (chargePointId) => {
  const { chain } = useNetwork();
  useEffect(() => console.log("test chain: ", chain), [chain]);
  const { data, isError, isLoading } = useContractRead({
    addressOrName: getContractAddress(chain?.id),
    contractInterface: JomAbi,
    functionName: "", // TODO
  });
  // TODO: parse and return in format of dummyData
};

// TODO: calculate fee
const useCalculateFee = () => {
  const fee = useMemo(() => "$25,125", []);
  return fee;
};

const dummyData = [
  {
    id: 1,
    chargingRate: 1,
    chargingRateUnits: "USD/min",
    chargePointModel: "Mitsubishi 2kW",
  },
  {
    id: 2,
    chargingRate: 0.77,
    chargingRateUnits: "USD/min",
    chargePointModel: "Mitsubishi 1kW",
  },
  {
    id: 3,
    chargingRate: 0.66,
    chargingRateUnits: "USD/min",
    chargePointModel: "Mitsubishi 0.5kW",
  },
];

const Booking = ({ bookId }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCharge, setSelectedCharger] = useState();
  const [selectedStartingBookingTime, setSelectedStartingBookingTime] =
    useState();
  const [selectedChargingDuration, setSelectedChargingDuration] = useState();
  const [isChargerAvailable, setIsChargerAvailable] = useState(true);

  const { chain } = useNetwork();
  const { data: chargePoint } = useChargePoint(bookId);
  console.log("test charge point data: ", chargePoint);
  // const { data: chargePointAvailability } = useFetchChargePointAvailability();

  const t = useChargePoints();

  const {
    data: ensName,
    isError,
    isLoading,
    refetch: refetchEnsName,
  } = useEnsName({
    // address: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
    address: chargePoint?.address,
  });

  const checkChargerAvailable = () => {
    // TODO: call bookStation()
    // refetchChargerAvailable({
    //   id: bookId,
    //   from: new Date(selectedStartingBookingTime).getTime(),
    //   to: new Date(selectedEndingBookingTime).getTime(),
    // });
  };

  const fee = useMemo(() => {
    if (selectedCharge && selectedChargingDuration) {
      const amount = selectedCharge.chargingRate * selectedChargingDuration;
      return `${amount.toFixed(2)} ${selectedCharge.chargingRateUnits.replace(
        "/min",
        ""
      )}`;
    } else return "-";
  }, [selectedChargingDuration, selectedCharge]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="mt-10 pb-10 w-full flex justify-center">
      <Head>
        <title>Booking</title>
      </Head>
      <div className="text-white w-[80%]">
        <div>
          <h2 className="text-4xl font-bold">Booking</h2>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="w-full mt-5 bg-[#1D1D1D] p-4 rounded-lg">
            <div className="bg-[#4caf50] rounded-lg py-2 px-5 flex items-center justify-between">
              <div>
                <div className="text-sm mb-2">Fee</div>
                <div className="font-bold text-3xl">{fee}</div>
              </div>
              <div>
                <img src="/static/price.png" alt="" />
              </div>
            </div>
            <div className="ml-3 mt-5 flex items-center">
              <img
                src="/static/locationCharger.png"
                alt=""
                className="w-[40px]"
              />
              <div className="ml-2">
                <div className="font-semibold text-xl">Service Provider</div>
                <p className="text-gray-300">
                  {`${chargePoint?.name} (${chargePoint?.provider})` || "-"}
                </p>
                <p className="text-gray-300">
                  {`Amount Staked: ${chargePoint?.amountStaked}` || "-"}
                </p>
                <p className="text-gray-300 underline">
                  <a
                    href={`${getScanUrlPrefix(chain?.id)}/address/${
                      chargePoint?.tokenAddress
                    }`}
                  >
                    {chargePoint?.tokenAddress
                      ? `${truncateEthAddress(chargePoint.tokenAddress)}`
                      : "-"}
                  </a>
                </p>
                {isLoaded && ensName && (
                  <div className="text-gray-300">
                    <div>
                      Ens Name: <span>{ensName}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="ml-3 mt-5 flex items-center">
              <img
                src="/static/locationCharger.png"
                alt=""
                className="w-[40px]"
              />
              <div className="ml-2">
                <div className="font-semibold text-xl">Location</div>
                <p className="text-gray-300">
                  {chargePoint?.physicalAddress || "-"}
                </p>
              </div>
            </div>
            <div className="ml-3 mt-5 flex items-center">
              <img src="/static/specs.png" alt="" className="w-[40px]" />
              <div className="ml-2">
                <div className="font-semibold text-xl">Charger Specs</div>
                <p className="text-gray-300">
                  {selectedCharge
                    ? selectedCharge.chargePointModel
                    : "Select a charger, here will show the spec"}
                </p>
              </div>
            </div>
            <div className="ml-3 mt-5 flex items-center">
              <img src="/static/rate.png" alt="" className="w-[40px]" />
              <div className="ml-2">
                <div className="font-semibold text-xl">Charger Fee Rate</div>
                <p className="text-gray-300">
                  {" "}
                  {selectedCharge
                    ? `${selectedCharge.chargingRate} ${selectedCharge.chargingRateUnits}`
                    : "Select a charger, here will show the rate"}
                </p>
              </div>
            </div>
            <div className="ml-3 mt-5 flex items-center">
              <img
                src="/static/locationCharger.png"
                alt=""
                className="w-[40px]"
              />
              <div className="ml-2">
                <div className="font-semibold text-xl">Station Map</div>
                {chargePoint?.images.map((url, idx) => (
                  <Image key={idx} src={url} />
                ))}
              </div>
            </div>
          </div>
          {/* <div className="h-[400px] mt-5 overflow-y-auto w-full md:w-[30%] bg-[#1D1D1D] p-3 rounded-lg">
            <h3 className="font-bold text-2xl">Upcoming booking</h3>
            <div className="mt-5">
              <div>
                <div className="text-lg font-semibold">Address1</div>
                <div>Date of that user booking</div>
              </div>
            </div>
            <div className="mt-5">
              <div>
                <div className="text-lg font-semibold">Address1</div>
                <div>Date of that user booking</div>
              </div>
            </div>
            <div className="mt-5">
              <div>
                <div className="text-lg font-semibold">Address1</div>
                <div>Date of that user booking</div>
              </div>
            </div>
            <div className="mt-5">
              <div>
                <div className="text-lg font-semibold">Address1</div>
                <div>Date of that user booking</div>
              </div>
            </div>
            <div className="mt-5">
              <div>
                <div className="text-lg font-semibold">Address1</div>
                <div>Date of that user booking</div>
              </div>
            </div>
          </div> */}
        </div>
        <div className="mt-8">
          <div className="">
            {/* <h3 className="font-bold text-2xl">Available Slot</h3> */}
            <div className="text-lg text-xl text-white font-semibold">
              Make a Booking
            </div>
            <div className="mt-5 flex items-center">
              <div>Start time:</div>
              <Input
                onChange={(e) => setSelectedStartingBookingTime(e.target.value)}
                type="datetime-local"
                name=""
                id=""
                // className="text-black ml-2 form-control border border-[#479C4C] block px-3 py-1.5 text-base font-normal bg-white bg-clip-padding border border-solid border-[#4caf50] rounded transition ease-in-out m-0 focus:outline-none"
              />
            </div>
            <div className="mt-5 flex  items-center">
              <div>Charging Duration:</div>
              <InputGroup>
                <Input
                  onChange={(e) =>
                    setSelectedChargingDuration(parseInt(e.target.value))
                  }
                  type="number"
                  name=""
                  id=""
                  // className="text-black ml-2 form-control border border-[#479C4C] block px-3 py-1.5 text-base font-normal bg-white bg-clip-padding border border-solid border-[#4caf50] rounded transition ease-in-out m-0 focus:outline-none"
                />
                <InputRightAddon children="/min" background={"transparent"} />
              </InputGroup>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-x-6 gap-y-6">
            {dummyData.map((item, index) => {
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedCharger(item)}
                  className={`hover:cursor-pointer flex justify-between items-center bg-[#1D1D1D] py-2 px-3 rounded-lg ${
                    selectedCharge?.id == item.id
                      ? "border border-[#4caf50]"
                      : ""
                  }`}
                >
                  <img src="/static/charger.png" alt="" className="w-[40px]" />
                  <div className="mx-1">
                    <div>Charger {index + 1}</div>
                  </div>
                  <div className="mx-1 flex items-center justify-end">
                    <img src="/static/line.png" alt="" className="w-[40px]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div
          onClick={() => checkChargerAvailable()}
          className="flex justify-center md:block"
        >
          <Button bg={"#1d1d1d"} mt={10} size="lg">
            Book Now
          </Button>
          {/* <div className="text-lg font-semibold mt-14 bg-[#4caf50] w-fit rounded-lg py-2 px-8 hover:scale-105 transition cursor-pointer">
            Book Now
          </div> */}
        </div>
        {!isChargerAvailable && (
          <div className="text-red-200">
            Charger is not available during selected time!
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
