import React, { ComponentType, useEffect, useRef } from "react";
import { MetapageIFrameRpcClient } from "@metapages/metapage";

const defaultIframeContainerStyle : React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  width: "100%",
  height: "100%",
  border: "0",
  left: "0",
  top: "0",
}

export const MetaframeIframe: React.FC<{
  metaframe?: MetapageIFrameRpcClient;
  Wrapper?: ComponentType<any>;
  height?: string;
  style?: React.CSSProperties;
}> = ({ metaframe, Wrapper, height, style }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    if (!metaframe) {
      return;
    }
    if (metaframe.isDisposed()) {
      return;
    }

    // the iframe is delivered asynchronously
    (async () => {
      if (metaframe.isDisposed()) {
        return;
      }

      if (cancelled) {
        return;
      }
      const iframe = await metaframe.iframe;
      if (metaframe.isDisposed()) {
        return;
      }
      if (cancelled) {
        return;
      }
      if (!ref?.current) {
        return;
      }

      if (!ref.current.firstChild || ref.current.firstChild !== iframe) {
        const child: ChildNode | null = ref.current.firstChild;
        if (child) {
          ref.current.removeChild(child);
        }
        // https://stackoverflow.com/questions/18765762/how-to-make-width-and-height-of-iframe-same-as-its-parent-div
        iframe.style.cssText = `overflow:hidden; position:absolute;top:0px;width:100%;height:${
          height ? height : "100%"
        };`;

        ref.current.appendChild(iframe);
      }
    })();

    return () => {
      cancelled = true;
      while (ref?.current?.firstChild) {
        ref.current.removeChild(ref.current.firstChild);
      }
    };
  }, [metaframe, ref]);

  if (!metaframe) {
    return <p>Missing metaframe</p>;
  }

  if (Wrapper) {
    return (
      <Wrapper ref={ref} key={metaframe.id} style={{ position: "relative" }} />
    );
  } else {
    return (
      <div ref={ref} key={metaframe.id} style={{ ...defaultIframeContainerStyle, ...style, ...{height:height} }}></div>
    );
  }
};

// className="iframe-container"
