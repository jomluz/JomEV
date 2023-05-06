import { useEffect, useMemo } from "react";
import { useMutation, gql } from "@apollo/client";

const STAKE_CHARGE_POINT = gql`
    mutation StakeChargePoint($chargePointId: ObjectID!, $input: NewChargePoint!) {
      stakeChargePoint(id: $chargePointId, input: $input) {
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
const useStakeChargePoint = () => {
    const [mutate, { loading, error, data, refetch }] = useMutation(STAKE_CHARGE_POINT);

    useEffect(() => console.log('test mutate: ', mutate), [mutate])

    const formattedData = useMemo(() => data?.chargePoint, [data]);
    return { mutate, loading, error, data: formattedData, refetch }
}

export default useStakeChargePoint