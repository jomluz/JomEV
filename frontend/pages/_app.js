import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme/theme";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  HttpLink,
  ApolloLink,
} from "@apollo/client";

const { chains, provider } = configureChains(
  [chain.polygonMumbai, chain.mainnet],
  [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

//Declare your endpoints
const endpoint1 = new HttpLink({
  uri: "https://jomev-backend.frp.wmtech.cc/graphql",
});

const endpoint2 = new HttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/jrcarlos2000/miamipolygon",
});

// const client = new ApolloClient({
//   uri: "https://jomev-backend.frp.wmtech.cc/graphql",
//   cache: new InMemoryCache(),
// });

//pass them to apollo-client config
const client = new ApolloClient({
  link: ApolloLink.split(
    (operation) => operation.getContext().clientName === "endpoint2",
    endpoint2, //if above
    endpoint1
  ),
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      {" "}
      <ChakraProvider theme={theme}>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider
            chains={chains}
            theme={darkTheme({ accentColor: "#8c5220" })}
          >
            <Component {...pageProps} />
          </RainbowKitProvider>
        </WagmiConfig>
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
