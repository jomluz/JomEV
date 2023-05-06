import { Box, Heading, Text, IconButton } from "@chakra-ui/react";
import { CalendarIcon } from "@chakra-ui/icons";
import { GrConnect } from "react-icons/gr";

export default function ConnectStationGuide({ setStage }) {
  return (
    <Box textAlign="center" py={10} px={6}>
      <CalendarIcon boxSize={"50px"} color={"orange.300"} />
      <Heading as="h2" size="xl" mt={6} mb={2} color="white">
        How to Connect? ⛽
      </Heading>
      <Text color={"gray.500"}>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua.
      </Text>
      <IconButton
        mt={10}
        padding="0 3rem"
        // bgColor='orange.300'
        aria-label="Connect station to server"
        size="lg"
        icon={<GrConnect />}
        onClick={() => setStage("stakeStation")}
      />
    </Box>
  );
}
