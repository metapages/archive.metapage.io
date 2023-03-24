import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Metapage, } from "@metapages/metapage";
import { MetaframeIframe } from "./MetaframeIframe";
const MetaPageTemplate = {
    version: "0.3",
    metaframes: {
        embed: {
            url: "",
        },
    },
};
export const MetaframeStandaloneComponent = ({ url, inputs, onOutputs, onMetapageCreation, debug, height, style }) => {
    const [metaframe, setMetaframe] = useState();
    const [metapage, setMetapage] = useState();
    // create the metapage and bind
    useEffect(() => {
        // now actually create the metapage, this also instantiates the iframe objects
        const definition = Object.assign({}, { ...MetaPageTemplate });
        definition.metaframes.embed.url = url;
        const metapage = new Metapage();
        metapage.debug = debug;
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
        return _jsx("p", { children: "..." });
    }
    return _jsx(MetaframeIframe, { metaframe: metaframe, style: style, height: height });
};
