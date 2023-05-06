import { ethers } from "ethers";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Input, Button, useToast, Text, Link } from "@chakra-ui/react";
import ReCAPTCHA from "react-google-recaptcha";
import ChargingStationRegisterPopUpModel from "./ChargingStationRegisterPopUpModel";
import ImageUploader from "../ImgUploader";
import useFetchChargePoint from "../../services/jom/useFetchChargePoint";
import { getContractAddress, getScanUrlPrefix, getTokenBySymbol } from "../../contracts/constants";
import { useNetwork, usePrepareContractWrite, useContractWrite } from "wagmi";
import JomAbis from "../../contracts/abis/index.json";
import { useSigner } from "wagmi";
import useStakeChargePoint from "../../services/jom/useStakeChargePoint";

// data structure for form submission
// {
//   tokenAddress: String!
//     physicalAddress: String!
//     location: NewLocation!
//     name: String!
//     provider: String!
//     chargingRate: Float!
//     amountStaked: Float!
//     stakingTxnHash: String!
//     images: [String!]!
// }

// tokenAddress: String!
// physicalAddress: String!
// location: NewLocation!
// name: String!
// provider: String!
// chargingRate: Float!
// amountStaked: Float!
// stakingTxnHash: String!
// images: [String!]!

// function addChargingPoint(
//   string calldata chargingPointID,
//   uint256 _pricePerHour,
//   string calldata cid,
//   address tokenAddr,
//   uint256 nConnectors
// )

// const useAddChargingPointToChain = async (...args) => {
//   const { chain } = useNetwork();
//   console.log('test contract: ', chain?.id)
//   // const { config: addChargingPoint } = usePrepareContractWrite({
//   //   addressOrName: getContractAddress(chain?.id),
//   //   contractInterface: JomAbis,
//   //   functionName: 'addChargingPoint',
//   //   args
//   // })
//   // const { data, isLoading, isSuccess, write } = useContractWrite(addChargingPoint)
//   const { data, isLoading, isSuccess, write } = useContractWrite({
//     addressOrName: getContractAddress(chain?.id),
//     contractInterface: JomAbis,
//     functionName: 'addChargingPoint',
//     args
//   })
//   useEffect(() =>{
//     console.log('test write: ',  write, args)
//     // write()
//   }
//     , [write, args])

//   useEffect(() => {
//     if (data)
//       console.log('transaction data: ', data)
//   }, [data])

//   return { write }
// }



const RegisterChargingStationForm = ({ setStage }) => {
  const interval = 400;
  let typingTimer;
  const [isSubmit, setIsSubmit] = useState(false);

  const [chargingPointId, setChargingPointId] = useState("")
  const [stationName, setStationName] = useState("");
  const [stationAddress, setStationAddress] = useState("");
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();
  const [stationWallet, setStationWallet] = useState("");
  const [numberOfConnectors, setNumberOfConnectors] = useState();
  const [chargeRate, setChargeRate] = useState();
  const [currencySelected, setCurrencySelected] = useState("jev");
  const stakeAmount = useMemo(() => {
    if (chargeRate && numberOfConnectors)
      return (chargeRate * 24 * 7 * numberOfConnectors).toFixed(3)
    return 0
  }, [chargeRate, numberOfConnectors])
  // TODO: check if the station is connected to our server
  const { data: chargePoint } = useFetchChargePoint(chargingPointId);
  const isChargingPointConnected = useMemo(() => chargePoint?.isOnline, [chargePoint]);

  const [isStationNameValid, setIsStationNameValid] = useState(true);
  const [isLongitudeValid, setIsLongitudeValid] = useState(true);
  const [isLatitudeValid, setIsLatitudeValid] = useState(true);
  const [isStationWalletValid, setIsStationWalletValid] = useState(true);

  const [recaptchaToken, setRecaptchaToken] = useState("");
  const captchaRef = useRef(null);

  // mutation handling
  const { mutate: updateJomServerChargePoint } = useStakeChargePoint()
  // contract handling
  const toast = useToast();
  const { chain } = useNetwork();
  const chainId = useMemo(() => chain?.id, [chain]);
  const { data: signer } = useSigner();

  const addChargingPointToChain = async (pricePerHour, cid, tokenAddr, nConnectors) => {
    const contract = new ethers.Contract(
      getContractAddress(chainId),
      JomAbis,
      signer
    )

    pricePerHour = ethers.utils.parseUnits(pricePerHour, 18);
    const tx = await contract.addChargingPoint(pricePerHour, cid, tokenAddr, nConnectors)
    const receipt = await tx.wait();
    return receipt
  }

  // the function handling the click event of the submit
  // button under the recaptcha
  const handleSubmit = async () => {
    const stationNameReg = /^[0-9a-zA-Z\s]+$/;
    if (!stationNameReg.test(stationName)) {
      setIsStationNameValid(false);
    } else {
      setIsStationNameValid(true);
    }
    if (longitude < -180 || longitude > 180) {
      setIsLongitudeValid(false);
    } else {
      setIsLongitudeValid(true);
    }
    if (latitude < -90 || latitude > 90) {
      setIsLatitudeValid(false);
    } else {
      setIsLatitudeValid(true);
    }
    if (!ethers.utils.isAddress(stationWallet)) {
      setIsStationWalletValid(false);
    } else {
      setIsStationWalletValid(true);
    }
    if (
      stationNameReg.test(stationName) &&
      (longitude >= -180 || longitude <= 180) &&
      (latitude >= -90 || latitude <= 90) &&
      ethers.utils.isAddress(stationWallet)
    ) {
      console.log("invoked");
      // setIsSubmit(true);
      // captchaRef.current.reset();
      setRecaptchaToken("");
    }

    try {
      const payTokenAddress = getTokenBySymbol(chainId, 'USDT').address
      // // call smart contract
      // const receipt = await addChargingPointToChain(
      //   // TODO: solidity need to change, need to add chargingPointId as 1st param
      //   chargeRate, "https://cdn.corporate.walmart.com/dims4/WMT/dcd5723/2147483647/strip/true/crop/1656x1080+107+0/resize/920x600!/quality/90/?url=https%3A%2F%2Fcdn.corporate.walmart.com%2Fb0%2F63%2F54aa9b6f471e8821f2812daa4fb5%2Fevpstation-banner.jpg", payTokenAddress, 1
      // )
      // console.log('tx receipt: ', receipt)
      // toast({
      //   title: `Transaction Submitted`,
      //   position: 'top-right',
      //   isClosable: true,
      //   description: <Text>Check your transaction <Link target='_blank' href={`${getScanUrlPrefix(chainId)}/tx/${receipt.transactionHash}`}>here</Link>.</Text>,
      //   status: 'success',
      //   duration: 5000
      // })

      // TODO: write to Jom server
      await updateJomServerChargePoint({
        variables: {
          chargePointId: chargePoint.id,
          input: {
            tokenAddress: payTokenAddress,
            physicalAddress: stationAddress,
            location: { type: "Point", coordinates: [longitude, latitude] },
            name: stationName,
            provider: stationName + ' Inc.',
            chargingRate: chargeRate,
            amountStaked: stakeAmount,
            stakingTxnHash: "0x123",  // TODO: replace with receipt.transactionHash
            images: []
          }
        },
        context: {
          clientName: "endpoint1",
        }
      })
      console.log('updated database')

    } catch (e) {
      console.warn(e)
    }

    // setStage("staked");
  };

  const handleKeyUp = (e) => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      // request needed stake amount
      // setStakeAmountFetched()
      if (currencySelected == "jev") {
      } else {
      }
      // setStakeAmountFetched()
    }, interval);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="text-center text-3xl text-white font-bold mb-8 ">
        Stake Your Station ⛽
      </h3>
      <form className="w-full max-w-sm ">
        <div className="md:flex md:flex-col md:justify-center md:items-start mb-6">
          <div className="w-full">
            <Input
              color={"white"}
              id="inline-full-name"
              type="text"
              placeholder="Charging Point ID "
              value={chargingPointId}
              onChange={(e) => {
                setChargingPointId(e.target.value);
              }}
            />
          </div>
          {chargingPointId ? (
            isChargingPointConnected ? <div className="text-green-400">Your station is online.</div>
              : <div className="text-red-400">Invalid Charging Station ID. This field should be a string from your station manufacturer. Your station might not be connected to our server.</div>
          )
            : null
          }
        </div>
        <div className="md:flex md:flex-col md:justify-center md:items-start mb-6">
          <div className="w-full">
            <Input
              color={"white"}
              id="inline-full-name"
              type="text"
              placeholder="Address"
              value={stationAddress}
              onChange={(e) => setStationAddress(e.target.value)}
            />
          </div>
          {/* {!isStationNameValid && (
            <div className="text-red-400">
              Station name should not contain symbols!
            </div>
          )} */}
        </div>
        <div className="md:flex md:flex-col md:justify-center md:items-start mb-6">
          <div className="w-full">
            <Input
              color={"white"}
              id="inline-full-name"
              type="text"
              placeholder="Station Name"
              value={stationName}
              onChange={(e) => setStationName(e.target.value)}
            />
          </div>
          {!isStationNameValid && (
            <div className="text-red-400">
              Station name should not contain symbols!
            </div>
          )}
        </div>
        <div className="md:flex md:flex-col md:justify-center md:items-start mb-6">
          <div className="w-full">
            <Input
              color={"white"}
              id="inline-longitude"
              type="number"
              placeholder="Longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </div>
          {!isLongitudeValid && (
            <div className="text-red-400">-180 to 180 for longitude!</div>
          )}
        </div>
        <div className="md:flex md:flex-col md:justify-center md:items-start mb-6">
          <div className="w-full">
            <Input
              color={"white"}
              id="inline-latitude"
              type="number"
              placeholder="Latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
          </div>
          {!isLatitudeValid && (
            <div className="text-red-400">-90 to 90 for latitude!</div>
          )}
        </div>
        <div className="md:flex md:flex-col md:justify-center md:items-start mb-6">
          <div className="w-full">
            <Input
              color={"white"}
              id="inline-full-name"
              type="text"
              placeholder="Station Wallet"
              value={stationWallet}
              onChange={(e) => {
                setStationWallet(e.target.value);
              }}
            />
          </div>
          {!isStationWalletValid && (
            <div className="text-red-400">Invalid address</div>
          )}
        </div>
        <div className="md:flex md:flex-col md:justify-center md:items-start mb-6">
          <div className="w-full relative">
            <Input
              color={"white"}
              id="inline-full-name"
              type="number"
              placeholder="Number of Connectors"
              value={numberOfConnectors}
              min="1"
              onChange={(e) => setNumberOfConnectors(parseInt(e.target.value))}
            />
          </div>
        </div>
        <div className="md:flex md:flex-col md:justify-center md:items-start mb-6">
          <div className="w-full relative">
            <Input
              color={"white"}
              id="inline-full-name"
              type="number"
              placeholder="Charging Fee Rate"
              value={chargeRate}
              min="0"
              onKeyUp={(e) => {
                handleKeyUp(e);
              }}
              onChange={(e) => {
                setChargeRate(parseFloat(e.target.value));
              }}
            />
            <div className="text-gray-500 absolute inset-y-0 right-10 flex items-center">
              <select
                value={currencySelected}
                onChange={(e) => setCurrencySelected(e.target.value)}
                className="outline-none bg-transparent cursor-pointer rounded-lg"
              >
                <option className="text-black" name="" id="" value="jev">
                  USDT/10min
                </option>
                <option name="" id="" value="usd">
                  $/10min
                </option>
              </select>
            </div>
          </div>
        </div>
        <div className="md:flex md:flex-col md:justify-center md:items-start mb-6">
          <div className="w-full relative">
            <Input
              disabled
              id="inline-full-name"
              type="text"
              placeholder="Stake Amount"
              value={stakeAmount}
            />
            <div className="text-white absolute inset-y-0 right-10 flex items-center">
              <div>USDT</div>
            </div>
          </div>
        </div>
        <ImageUploader />
        <div className="flex items-center justify-center mt-5 flex-col md:items-center md:justify-center">
          <div className="mb-5">
            {/* <ReCAPTCHA
              id="recaptcha"
              ref={captchaRef}
              onChange={(e) => {
                setRecaptchaToken(e);
              }}
              onExpired={(e) => {
                setRecaptchaToken(e);
              }}
              size="normal"
              className="g-recaptcha"
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            /> */}
          </div>
          <div className="flex justify-center w-[75%]">
            {/* <button
              onClick={() => handleSubmit()}
              className="w-full shadow bg-[#4caf50] focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded hover:scale-105 transition disabled:cursor-not-allowed disabled:bg-gray-400"
              disabled={recaptchaToken ? false : true}
              type="button"
            >
              Submit
            </button> */}

            <Button onClick={() => handleSubmit()}>Submit</Button>
          </div>
        </div>
      </form>
      {/* <ChargingStationRegisterPopUpModel
        isSubmit={isSubmit}
        setIsSubmit={setIsSubmit}
        stationName={stationName}
        longitude={longitude}
        latitude={latitude}
        stationWallet={stationWallet}
        numberOfConnectors={numberOfConnectors}
        chargeRate={chargeRate}
        currencySelected={currencySelected}
        stakeAmountFetched={stakeAmountFetched}
      /> */}
    </div>
  );
};

export default RegisterChargingStationForm;
