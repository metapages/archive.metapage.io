import React, { useEffect, useState } from 'react';

import { metapageDefinitionFromUrl } from './metapageDefinitionFromUrl';


export const usePasteMetapageDefinition: () => void = () => {
  const [_, setMetapageDefinition] = metapageDefinitionFromUrl();

  useEffect(() => {
    const listener = (event: any) => {
      event.preventDefault();
      let paste = (event.clipboardData || window.Clipboard).getData("text");
      if (typeof paste === "string" && paste.length > 0) {
        try {
          const json = JSON.parse(paste);
          setMetapageDefinition(json);
        } catch (err) {
          console.log("err", err);
          // do nothing
        }
      }
    };
    window.document.body.addEventListener("paste", listener);
    return () => {
      window.document.body.removeEventListener("paste", listener);
    };
  }, []);

  return;
};
