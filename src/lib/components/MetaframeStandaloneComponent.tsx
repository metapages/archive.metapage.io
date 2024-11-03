import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  MetaframeInputMap,
  Metapage,
  MetapageDefinitionV1,
  MetapageEventDefinition,
  MetapageEvents,
  MetapageIFrameRpcClient,
} from '@metapages/metapage';

import { MetaframeIframe } from './MetaframeIframe.js';

const MetaframeKey = "embed";

const MetaPageTemplate :MetapageDefinitionV1 = {
  version: "1",
  metaframes: {
    [MetaframeKey]: {
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
  onUrlChange?: (url: string) => void;
  debug?: boolean;
  style?: React.CSSProperties;
  className?: string;
  classNameWrapper?: string;
}> = ({
  url,
  inputs,
  onOutputs,
  onMetapageCreation,
  debug,
  style,
  className,
  classNameWrapper,
  onUrlChange,
}) => {
  const [metaframe, setMetaframe] = useState<
    MetapageIFrameRpcClient | undefined
  >();

  const [metapage, setMetapage] = useState<Metapage | undefined>();
  const onUrlChangeRef = useRef(onUrlChange);

  // create the metapage and bind
  useEffect(() => {
    const disposers: (() => void)[] = [];
    // now actually create the metapage, this also instantiates the iframe objects
    const definition = Object.assign({}, { ...MetaPageTemplate });
    definition.metaframes.embed.url = url;
    const metapage = new Metapage();
    metapage.debug = debug!!;
    let cancelled = false;
    (async () => {
      await metapage.setDefinition(definition);
      if (cancelled) {
        return;
      }

      setMetapage(metapage);

      const metaframe = metapage.getMetaframe(MetaframeKey);
      setMetaframe(metaframe);

      if (onOutputs) {
        metaframe.onOutputs(onOutputs);
      }

      // for debugging
      if (onMetapageCreation) {
        onMetapageCreation(metapage);
      }

      // listen to metapage definition changes
      // which will happen if the metaframe changes it's own hash params
      disposers.push(
        metapage.addListenerReturnDisposer(
          MetapageEvents.Definition,
          (e: MetapageEventDefinition) => {
            const sourceMetaframe = e.definition.metaframes[MetaframeKey];
            onUrlChangeRef.current?.(sourceMetaframe.url);
          }
        )
      );
    })();

    return () => {
      cancelled = true;
      metapage.dispose();
      while (disposers.length > 0) {
        const disposer = disposers.pop();
        if (disposer) {
          disposer();
        }
      }
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

  return (
    <MetaframeIframe
      metaframe={metaframe}
      style={style}
      className={className}
      classNameWrapper={classNameWrapper}
    />
  );
};
