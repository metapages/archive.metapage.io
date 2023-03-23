import React, { useEffect, useState } from "react";
import {
  MetaframeInputMap,
  Metapage,
  MetapageIFrameRpcClient,
} from "@metapages/metapage";
import { MetaframeIframe } from "./MetaframeIframe";

const MetaPageTemplate = {
  version: "0.3",
  metaframes: {
    embed: {
      url: "",
    },
  },
};

export const MetaframeStandaloneComponent: React.FC<{
  url: string;
  inputs?: any;
  onOutputs?: (outputs: MetaframeInputMap) => void;
  // optional, for debugging
  onMetapageCreation?: (metapage: Metapage) => void;
  debug?: boolean;
  style?: React.CSSProperties;
  height?: string;
}> = ({ url, inputs, onOutputs, onMetapageCreation, debug, height, style }) => {
  const [metaframe, setMetaframe] = useState<
    MetapageIFrameRpcClient | undefined
  >();

  const [metapage, setMetapage] = useState<Metapage | undefined>();

  // create the metapage and bind
  useEffect(() => {
    // now actually create the metapage, this also instantiates the iframe objects
    const definition = Object.assign({}, { ...MetaPageTemplate });
    definition.metaframes.embed.url = url;

    const metapage = new Metapage();
    metapage.debug = debug!!;
    metapage.setDefinition(definition);

    setMetapage(metapage);

    const metaframe = metapage.getMetaframe("embed");
    setMetaframe(metaframe);

    if (onOutputs) {
      metaframe.onOutputs(onOutputs);
    }

    // for debugging
    if (onMetapageCreation) {
      onMetapageCreation(metapage);
    }

    return () => {
      metapage.dispose();
    };
  }, [url, setMetaframe, onOutputs, onMetapageCreation, debug]);

  // listeners
  useEffect(() => {
    if (metapage && !metapage.isDisposed() && inputs) {
      metapage.setInputs({
        embed: inputs,
      });
    }
  }, [metapage, inputs]);

  if (!metaframe) {
    return <p>...</p>;
  }

  return <MetaframeIframe metaframe={metaframe} style={style} height={height}/>;
};
