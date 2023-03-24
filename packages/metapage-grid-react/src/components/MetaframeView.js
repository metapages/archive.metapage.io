import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
export const MetaframeView = ({ id, iframe, style, ErrorWrapper }) => {
    // Initialize useRef with an initial value of `null`
    const iframeContainer = useRef(null);
    useEffect(() => {
        if (iframeContainer.current) {
            // now mounted, can freely modify the DOM:
            if (iframe && iframe instanceof Node) {
                if (style && style.maxHeight) {
                    iframe.style.maxHeight = style.maxHeight;
                }
                iframeContainer.current.appendChild(iframe);
            }
        }
    }, [iframeContainer.current, iframe, style]);
    if (!id) {
        return _jsx(ErrorWrapper, { error: "Metaframe class is missing id prop" });
    }
    if (!iframe) {
        return _jsx(ErrorWrapper, { error: `Missing iframe for ${id}` });
    }
    if (!(iframe instanceof Node)) {
        return _jsx(ErrorWrapper, { error: `iframe is not a Node` });
    }
    // Optionally show a warning instead of the metaframe if missing required configuration
    const warning = iframe ? null : (_jsx(ErrorWrapper, { error: `Missing iframe for ${id}` }));
    return (_jsxs("div", { ref: iframeContainer, className: "iframe-container", style: style, children: [" ", warning, " "] }));
};
