import React, { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import ProviderRegisterPopUpModel from "./ProviderRegisterPopUpModel";

const RegisterForm = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [isAmountEnough, setIsAmountEnough] = useState(true);
  const [stakeAmount, setStakeAmount] = useState(0);
  const [isNameValid, setIsNameValid] = useState(true);
  const [username, setUsername] = useState("");

  const [recaptchaToken, setRecaptchaToken] = useState("");
  const captchaRef = useRef(null);

  // the function handling the click event of the submit
  // button under the recaptcha
  const handleSubmit = () => {
    const nameReg = /^[a-zA-Z\s]+$/;
    if (stakeAmount <= 100) {
      setIsAmountEnough(false);
    } else {
      setIsAmountEnough(true);
    }
    if (!nameReg.test(username)) {
      setIsNameValid(false);
    } else {
      setIsNameValid(true);
    }
    if (stakeAmount >= 100 && nameReg.test(username) && recaptchaToken) {
      setIsSubmit(true);
      captchaRef.current.reset();
      setRecaptchaToken("");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="text-center text-3xl text-white font-bold mb-8 ">
        Register as JomEV Provider
      </h3>
      <form className="w-full max-w-sm ">
        <div className="md:flex md:flex-col md:justify-center md:items-start mb-6">
          <div className="w-full">
            <label
              className="block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4"
              htmlFor="inline-full-name"
            >
              Full Name
            </label>
          </div>
          <div className="w-full">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-[#4caf50]"
              id="inline-full-name"
              type="text"
              placeholder="Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          {!isNameValid && (
            <div className="text-red-400">
              Name should not contain symbols or numbers!
            </div>
          )}
        </div>
        <div className="md:flex md:flex-col md:justify-center md:items-start mb-6">
          <div className="w-full">
            <label
              className="block text-gray-500 font-bold md:text-left mb-1 md:mb-0 pr-4"
              htmlFor="inline-full-name"
            >
              Staking Amount
            </label>
          </div>
          <div className="w-full relative">
            <input
              className="relative bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-[#4caf50]"
              id="inline-full-name"
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
            />
            <div className="absolute inset-y-0 right-10 flex items-center">
              <div>JEV</div>
            </div>
          </div>
          <div className="text-white">$00.00</div>
          {!isAmountEnough && (
            <div className="text-red-400">
              Staking amount should not less than 100 JEV!
            </div>
          )}
        </div>
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
          <div className="w-[75%]">
            <button
              onClick={() => handleSubmit()}
              className="w-full shadow bg-[#4caf50] focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded hover:scale-105 transition disabled:cursor-not-allowed disabled:bg-gray-400"
              disabled={recaptchaToken ? false : true}
              type="button"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
      <ProviderRegisterPopUpModel
        isSubmit={isSubmit}
        setIsSubmit={setIsSubmit}
        username={username}
        stakeAmount={stakeAmount}
      />
    </div>
  );
};

export default RegisterForm;
