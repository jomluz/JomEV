import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import Link from "next/link";

export default function RegistrationSuccessful() {
  return (
    <Box textAlign="center" py={10} px={6}>
      <CheckCircleIcon boxSize={"50px"} color={"green.500"} />
      <Heading as="h2" size="xl" mt={6} mb={2} color="white">
        Your registration is successful!
      </Heading>
      <Text color={"gray.500"}>
        Information regarding your station is recorded on chain and on our
        server.
        <br />
        Our team is gradually migrating the data to a fully decentralized
        storage.
      </Text>

      <Button mt="10" variant="ghost" size="lg">
        <Link href="/">Back to Home</Link>
      </Button>
    </Box>
  );
}
