import React, { useState } from "react";

const ChargingStationRegisterPopUpModel = ({
  setIsSubmit,
  isSubmit,
  stationName,
  longitude,
  latitude,
  stationWallet,
  numberOfConnectors,
  chargeRate,
  currencySelected,
  stakeAmountFetched,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // the function handling the click event of the approve
  // button in the pop up model
  const handleApprove = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsApproved(true);
    }, 1000);
  };

  const handleConfirmSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };
  return (
    <div
      className={`relative ${isSubmit ? "z-10" : "z-[-10]"}`}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${
          isSubmit
            ? "ease-out duration-300 opacity-100"
            : "ease-in duration-200 opacity-0"
        }`}
      ></div>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div
            className={`"relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg ${
              isSubmit
                ? "opacity-100 translate-y-0 sm:scale-100"
                : "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            }`}
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    className="text-xl font-medium leading-6 text-gray-900"
                    id="modal-title"
                  >
                    Confirmation
                  </h3>
                  <div className="mt-2">
                    <div>
                      <div>Station Name: {stationName}</div>
                    </div>
                    <div>
                      <div>Longitude: {longitude}</div>
                    </div>
                    <div>
                      <div>Latitude : {latitude}</div>
                    </div>
                    <div>
                      <div>Station Wallet: {stationWallet}</div>
                    </div>
                    <div>
                      <div>Number of connectors: {numberOfConnectors}</div>
                    </div>
                    <div>
                      <div>
                        Charge Rate: {chargeRate}{" "}
                        {currencySelected == "jev" ? "JEV/10min" : "$/10min"}
                      </div>
                    </div>
                    <div>
                      <div>
                        Amount needed to stake: {stakeAmountFetched} JEV
                      </div>
                    </div>
                    {isSubmitted && (
                      <div>
                        <div>Transaction Hash: xxxxx</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              {isApproved ? (
                <div>
                  <button
                    onClick={handleConfirmSubmit}
                    type="button"
                    className={`inline-flex w-full justify-center rounded-md border border-transparent bg-[#4caf50] hover:opacity-85 transition px-4 py-2 text-base font-medium text-white shadow-sm  focus:outline-none focus:ring-2 focus:ring-indigo-500  focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                      isSubmitted && "hidden"
                    }`}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin "></div>
                    ) : (
                      <div>Confirm</div>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleApprove}
                  type="button"
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-[#4caf50] hover:opacity-85 transition px-4 py-2 text-base font-medium text-white shadow-sm  focus:outline-none focus:ring-2 focus:ring-indigo-500  focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin "></div>
                  ) : (
                    <div>Approve</div>
                  )}
                </button>
              )}
              <button
                onClick={() => {
                  setIsSubmit(false);
                  setIsApproved(false);
                  setIsSubmitted(false);
                }}
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChargingStationRegisterPopUpModel;
