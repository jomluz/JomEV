/* eslint-disable react/jsx-key */
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { Input, Link } from "@chakra-ui/react";
import { useQuery, gql, useLazyQuery } from "@apollo/client";
import { useAccount } from "wagmi";
import useUserChargePoints from "../services/jom/useFetchChargePoints";

const DynamicMap = dynamic((data) => import("../components/Map"), {
  ssr: false,
});

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

const GET_FUTURE_BOOKING = gql`
  query GetChargePointsNearby($user: String!, $time: String!) {
    bookings(first: 10, where: { user_starts_with: $user, time_gt: $time }) {
      id
      StationIndex
      ConnectorIndex
      dayOfTheWeek
      time
      user
      cost
      __typename
    }
  }
`;

const Dashboard = () => {
  let date = new Date();
  date.setHours(date.getHours() - 1);
  const [distance, setDistance] = useState(0);
  const [dateNow, setDateNow] = useState(Number(date.getTime()).toFixed(0));
  const [chargePointsNearby, setChargePointsNearby] = useState([]);
  const { address } = useAccount();
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

  const {
    loading: BookingLoading,
    error: BookingError,
    data: BookingData,
    refetch: BookingRefetch,
  } = useQuery(GET_FUTURE_BOOKING, {
    variables: {
      user: address,
      time: dateNow,
    },
    context: {
      clientName: "endpoint2",
    },
  });

  const { data: ProviderStationsData, refetch: ProviderStationsRefetch } =
    useUserChargePoints(address);
  // const ProviderStationsData = {
  //   userChargePoints: [
  //     {
  //       name: "my station",
  //       address: "physicalAddress",
  //       amountStaked: "300 JEV",
  //       chargingRate: "100w",
  //       numberOfConnectors: "6",
  //     },
  //   ],
  // };
  console.log(BookingData);
  console.log(ProviderStationsData);

  useEffect(() => {
    findNearbyCharger();
    // getUserBooking();
    // console.log(BookingData);
    BookingRefetch({
      user: address,
      time: dateNow,
    });
    ProviderStationsRefetch({ tokenAddress: address });
    // console.log(ProviderStationsData);
  }, [address]);

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

  // const getUserBooking = () => {
  //   let userDate = new Date();
  //   userDate.setHours(userDate.getHours() - 1);
  //   // console.log(userDate.getTime());
  //   getBooking({
  //     variables: {
  //       user: address,
  //       time: Number(userDate.getTime()).toFixed(0),
  //     },
  //   });
  //   console.log(BookingData);
  // };

  // const getUserBooking = () => {
  //   BookingRefetch({
  //     user: address,
  //     time: Number(userDate.getTime()).toFixed(0),
  //   });
  // };

  return (
    <div className="pb-5">
      <div className="flex flex-col items-center justify-center relative">
        <div className="flex w-[85%] rounded-lg overflow-hidden justify-center">
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
      </div>
      <div className="flex justify-center text-white mt-14">
        <div className="w-[80%] flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-[45%]">
            <div className="mt-5 text-3xl font-semibold">Booking History</div>
            {/* loop render history and ongoing book */}
            <div className="mt-3 bg-[#1D1D1D] p-5 rounded-lg">
              {/* <div className="text-xl font-semibold">Upcoming 27 May</div> */}
              <div className="overflow-y-auto h-[220px]">
                {BookingData?.bookings.length >= 1 ? (
                  BookingData?.bookings.length.map((item, index) => {
                    return (
                      <div key={item.id}>
                        <div className="relative mt-4 flex items-center">
                          <div
                            className={`ml-4 before:content-[''] before:w-[4px] before:h-full ${
                              true
                                ? "before:bg-green-400"
                                : "before:bg-pink-700"
                            } before:absolute before:left-0 before:rounded-full`}
                          >
                            <div className="font-semibold text-lg">
                              Station {item.StationIndex}
                            </div>
                            <div className="text-sm text-gray-40">
                              Connector {item.ConnectorIndex}
                            </div>
                            <div className="text-sm text-gray-40">
                              Price {item.cost}
                            </div>
                            <div className="text-sm text-gray-40">
                              {item.dayOfTheWeek}/{date.getMonth()} &nbsp;{" "}
                              {item.time}
                            </div>
                          </div>
                          <div className="ml-6 bg-[#4caf50] rounded-full p-6 py-1">
                            activate
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-xl">No booking yet~</div>
                )}
                {/* <div>
                  <div className="relative mt-4 flex items-center">
                    <div className="ml-4 before:content-[''] before:w-[4px] before:h-full before:bg-pink-700 before:absolute before:left-0 before:rounded-full">
                      <div className="font-semibold text-lg">Station XXX</div>
                      <div className="text-sm text-gray-40">Price ...</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="relative mt-4 flex items-center">
                    <div className="ml-4 before:content-[''] before:w-[4px] before:h-full before:bg-pink-700 before:absolute before:left-0 before:rounded-full">
                      <div className="font-semibold text-lg">Station XXX</div>
                      <div className="text-sm text-gray-40">Price ...</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="relative mt-4 flex items-center">
                    <div className="ml-4 before:content-[''] before:w-[4px] before:h-full before:bg-pink-700 before:absolute before:left-0 before:rounded-full">
                      <div className="font-semibold text-lg">Station XXX</div>
                      <div className="text-sm text-gray-40">Price ...</div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          <div className="mt-5 w-full md:w-[50%]">
            <div className="text-3xl font-semibold">Provider</div>
            <div className="mt-3 bg-[#1D1D1D] py-5 rounded-lg">
              {/* <div className="flex justify-between items-center bg-[#4caf50] rounded-lg py-3 px-5">
                <div>
                  <div className="text-gray-300 text-sm">total hours book</div>
                  <div className="text-3xl font-semibold">22Hours</div>
                </div>
                <img src="/static/priceProvider.png" />
              </div> */}
              <div className="h-[220px]">
                <div className="text-gray-200 text-xl px-5">Your stations</div>
                {/* loop your stations here */}
                {ProviderStationsData?.userChargePoints.length >= 1 ? (
                  ProviderStationsData?.userChargePoints.map((item, index) => {
                    return (
                      <Link
                        href={`/book/${item.clientId}`}
                        style={{ textDecoration: "none" }}
                      >
                        <div
                          key={item.clientId}
                          className="no-underline hover:bg-[#813e1c4d] mt-3 transition cursor-pointer py-3 px-5 flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <img
                              src="/static/locationCharger.png"
                              alt=""
                              className="w-[60px] self-start"
                            />
                            <div className="flex flex-col">
                              <div className="no-underline">{item.name}</div>
                              <div className="text-sm">
                                Amount Staked: {item.amountStaked}
                              </div>
                              <div className="text-sm text-gray-300">
                                {item.address}
                              </div>

                              <div>
                                <div className="mt-1">
                                  <div className="flex items-center text-xs">
                                    <img
                                      src="/static/rate.png"
                                      className="w-[30px] mr-1"
                                    />
                                    Charging rate: {item.chargingRate}
                                  </div>
                                </div>
                                <div className="mt-1">
                                  <div className="flex items-center text-xs">
                                    <img
                                      src="/static/specs.png"
                                      className="w-[30px] mr-1"
                                    />
                                    Number of connectors:{" "}
                                    {item.numberOfConnectors}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="px-5">You have no station yet~</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
