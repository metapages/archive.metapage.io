import "./style/iframes.css";
import "./style/app.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { WithMetaframe } from "@metapages/metapage-react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { App } from "./App";

const theme = extendTheme({
  layerStyles: {
    textHighlightBox: {
      p: '1',
      w: "100%",
      bg:"lightblue",
      borderRadius: 'md',
    }
  },
})

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <WithMetaframe>
        <App />
      </WithMetaframe>
    </ChakraProvider>
  </StrictMode>
);
