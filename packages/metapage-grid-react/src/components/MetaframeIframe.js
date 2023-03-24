import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
export const MetaframeIframe = ({ metaframe, Wrapper, height, style }) => {
    const ref = useRef(null);
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
                const child = ref.current.firstChild;
                if (child) {
                    ref.current.removeChild(child);
                }
                // https://stackoverflow.com/questions/18765762/how-to-make-width-and-height-of-iframe-same-as-its-parent-div
                iframe.style.cssText = `overflow:hidden; position:absolute;top:0px;width:100%;height:${height ? height : "100%"}; max-height:${height ? height : "100%"};`;
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
        return _jsx("p", { children: "Missing metaframe" });
    }
    if (Wrapper) {
        return (_jsx(Wrapper, { ref: ref, style: { position: "relative" } }, metaframe.id));
    }
    else {
        return (_jsx("div", { ref: ref, className: "iframe-container", style: { ...style, ...{ height: height, maxHeight: height } } }, metaframe.id));
    }
};
