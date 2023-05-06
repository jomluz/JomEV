// import { useQuery, gql } from "@apollo/client";

// const GET_CHARGE_POINT_NEARBY = gql`
//   query GetChargePointsNearby(
//     $location: NewLocation!
//     $page: Int!
//     $skip: Int!
//     $maxDistance: Float!
//   ) {
//     chargePointsNearby(
//       location: $location
//       page: $page
//       skip: $skip
//       maxDistance: $maxDistance
//     ) {
//       name
//       physicalAddress
//       clientId
//       location
//     }
//   }
// `;

// function useFetchChargingPointsNearby() {
//   const { loading, error, data, refetch } = useQuery(GET_CHARGE_POINT_NEARBY);
// }
