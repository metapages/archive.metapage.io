import React from "react";

export const UrlToIframe: React.FC<{
  url: string;
  height: string;
}> = ({ url, height }) => {
  return (
    <div className="iframe-container" style={{height, width:"100%"}}>
      <iframe src={url} style={{height, width:"100%"}}/>
    </div>
  );
};
