import { jsx as _jsx } from "react/jsx-runtime";
export const UrlToIframe = ({ url, height }) => {
    return (_jsx("div", { className: "iframe-container", style: { height, width: "100%" }, children: _jsx("iframe", { src: url, style: { height, width: "100%" } }) }));
};
