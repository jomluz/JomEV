import { useMemo } from "react";
import { useQuery, gql } from "@apollo/client";

const GET_CHARGE_POINT = gql`
  query GetChargePoint($clientId: String!) {
    chargePoint(clientId: $clientId) {
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
const useChargePoint = (clientId) => {
  const { loading, error, data, refetch } = useQuery(GET_CHARGE_POINT, {
    variables: {
      clientId: clientId,
    },
    context: {
      clientName: "endpoint1",
    },
  });

  const formattedData = useMemo(() => data?.chargePoint, [data]);
  return { loading, error, data: formattedData, refetch };
};

export default useChargePoint;
