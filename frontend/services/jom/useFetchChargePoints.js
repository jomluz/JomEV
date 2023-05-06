import { useMemo } from "react";
import { useQuery, gql } from "@apollo/client";

const GET_USER_CHARGE_POINTS = gql`
  query GetUserChargePoints($tokenAddress: String!) {
    userChargePoints(tokenAddress: $tokenAddress) {
      id
      clientId
      tokenAddress
      physicalAddress
      location {
        coordinates
      }
      name
      provider
      chargingRate
      amountStaked
      stakingTxnHash
      chargePointModel
      chargePointVendor
      chargePointAvailibility
      chargePointStatus
      chargingRateUnits
      chargePointConnectors {
        connectorId
        connectorStatus
      }
      isOnline
      images
      createdAt
      updatedAt
    }
  }
`;
const useUserChargePoints = (tokenAddress) => {
  const { loading, error, data, refetch } = useQuery(GET_USER_CHARGE_POINTS, {
    variables: {
      tokenAddress: tokenAddress,
    },
    context: {
      clientName: "endpoint1",
    },
  });
  // console.log(data);

  // const formattedData = useMemo(() => data?.chargePoint, [data]);
  return { loading, error, data, refetch };
};

export default useUserChargePoints;
