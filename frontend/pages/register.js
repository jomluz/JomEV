import Head from "next/head";
import React, { useState } from "react";
import Layout from "../components/Layout";
import RegisterChargingStationForm from "../components/Registrations/RegisterChargingStationForm";
import RegisterProviderForm from "../components/Registrations/RegisterProviderForm";
import ConnectStationGuide from "../components/Registrations/ConnectStationGuide";
import RegistrationSuccessful from "../components/Registrations/RegistrationSuccessful";

const Register = () => {
  const [isProvider, setIsProvider] = useState(false);  // TODO: for demo purpose we only allow registratrion of station, not provider
  const [stage, setStage] = useState("connectStation")  // connectStation, stakeStation, staked
  return (
    <Layout>
      {" "}
      <div className="w-full flex justify-center items-center">
        <div className="bg-[#1d1d1d54] mt-1 md:mt-10  mx-3 w-full md:w-[50%] py-8 px-3 register-form-border border-[#4caf50] rounded-[25px] pb-[100px]">
          <Head>
            <title>Registration</title>
          </Head>
          {stage == "connectStation" ? <ConnectStationGuide setStage={setStage} />
          : stage == "stakeStation" ?  <RegisterChargingStationForm setStage={setStage} />
          : <RegistrationSuccessful />
          }
        </div>
      </div>
    </Layout>
  );
};

export default Register;
