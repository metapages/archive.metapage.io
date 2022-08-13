/**
 * Data flow:
 *  - if hash parameter "url" for a url to a metapage.json file
 * 		- if there, load it
 * 		- if an error, show the error at the top
 *  - elseif check hash parameter "definition" for an encoded metapage json blob
 * 		- if there, load it
 * 		- if an error, show the error at the top
 * 		- also show the json in the help text box
 *  - else show the help
 */

import { useEffect, useRef, useState } from "preact/hooks";
import objectHash from "object-hash";
import {
  Metapage,
  MetapageEvents,
  MetapageEventDefinition,
  MetapageDefinition,
} from "@metapages/metapage";
import {
  useHashParamJson,
  useHashParam,
  SetHashParamOpts,
} from "@metapages/hash-query";

export const metapageFromUrl: () => [
  Metapage | undefined,
  (definition: MetapageDefinition | undefined, opts?: SetHashParamOpts) => void,
  any
] = () => {
  const [url, setUrl] = useHashParam("url", undefined as any);
  const [error, setError] = useState<any>(undefined);
  const [metapageDefinition, setMetapageDefinition] =
    useState<MetapageDefinition | null>(null);
  const [metapageDefinitionUrl, setMetapageDefinitionUrl] =
    useState<{ definition: MetapageDefinition; url: string } | undefined>(
      undefined
    );
  const [metapageDefinitionBase64, setMetapageDefinitionBase64] =
    useHashParamJson<MetapageDefinition>("definition");
  const [metapage, setMetapage] = useState<Metapage | undefined>(undefined);
  // access the metapage without triggering a re-render
  const metapageRef = useRef<Metapage | undefined>(null);

  // - if there is a *just* a URL hash param: https://app.metapages.org/#url=<url>
  //   - then use the url definition
  // - if there is https://app.metapages.org/#definition=<base64>
  //   - then use the base64 definition
  //   - if there is a url param also, remove it

  // url => metapageDefinitionUrl
  useEffect(() => {
    // bail early maybe, but also clean up
    if ((!url || url.length === 0) && metapageDefinitionUrl) {
      setMetapageDefinitionUrl(undefined);
    }

    if (!url || url.length === 0) {
      if (typeof url === "string") {
        setUrl(undefined as any);
      }
      return;
    }

    // if no url or we already have the definition, bail
    if (metapageDefinitionUrl?.url === url) {
      return;
    }

    // load #url=<url>
    const thisUrl = url;
    (async () => {
      try {
        const definition: MetapageDefinition | undefined =
          await getMetapageDefinitionFromUrl(thisUrl);
        if (!definition) {
          throw `No MetapageDefinition found at: ${thisUrl}`;
        }
        setMetapageDefinitionUrl({ url: thisUrl, definition });
      } catch (err: any) {
        console.error(err);
        //  setAlert({
        //    level: "error",
        //    message: `${err}`,
        //  });
        setMetapageDefinitionUrl(undefined);
      }
    })();
  }, [
    alert,
    url,
    metapageDefinitionUrl,
    setMetapageDefinitionUrl,
    setUrl,
    status,
  ]);

  // if both exist #definition=<base64> #url=<url> then remove #url=<url>
  useEffect(() => {
    if (typeof url === "string" && metapageDefinitionBase64) {
      setUrl(undefined as any);
    }
  }, [url, setUrl, metapageDefinitionBase64]);

  // choose the metapage definition or delete it
  useEffect(() => {
    // base64 always has priority (and if both, the url param will be removed)
    const newMetapageDefinition: MetapageDefinition | undefined =
      metapageDefinitionBase64 || metapageDefinitionUrl?.definition;
    if (!newMetapageDefinition) {
      if (metapageDefinition) {
        setMetapageDefinition(null);
      }
      return;
    }

    if (
      objectHash.sha1(metapageDefinition) !==
      objectHash.sha1(newMetapageDefinition)
    ) {
      setMetapageDefinition(newMetapageDefinition);
    }
  }, [
    metapageDefinitionUrl,
    metapageDefinitionBase64,
    metapageDefinition,
    setMetapageDefinition,
    metapage,
  ]);

  // create or delete metapage from metapageDefinition
  useEffect(() => {
    if (!metapageDefinition) {
      metapageRef.current = undefined;
      setMetapage(undefined);
      return;
    }

    if (metapageRef.current) {
      if (
        objectHash.sha1(metapageDefinition) ===
        objectHash.sha1(metapageRef.current.getDefinition())
      ) {
        return;
      } else {
      }
    }

    const newMetapage = Metapage.from(metapageDefinition);
    metapageRef.current = newMetapage;

    setMetapage(newMetapage);
    // The dispose of the metapage happens in the next useEffect block
    // since we might not actually create a new metapage here
  }, [metapageDefinition, setMetapage, metapageRef]);

  useEffect(() => {
    if (!metapage) {
      return;
    }

    const removeListeners: (() => void)[] = [];

    // update our definition if a plugin sets it
    removeListeners.push(
      (() => {
        const listener = (e: MetapageEventDefinition) => {
          // if a plugin modifies the definition, update the hash param that is the source of truth
          setMetapageDefinitionBase64(e.definition);
        };
        metapage.addListener(MetapageEvents.Definition, listener);
        return () =>
          metapage.removeListener(MetapageEvents.Definition, listener);
      })()
    );

    // update our definition if a plugin sets it
    removeListeners.push(
      (() => {
        const listener = (definition: MetapageDefinition) => {
          // if a plugin modifies the definition, update the hash param that is the source of truth
          setMetapageDefinitionBase64(definition);
        };
        metapage.addListener(MetapageEvents.DefinitionUpdateRequest, listener);
        return () =>
          metapage.removeListener(
            MetapageEvents.DefinitionUpdateRequest,
            listener
          );
      })()
    );

    return () => {
      metapage.dispose();
      while (removeListeners.length > 0) removeListeners.pop()!();
    };
  }, [metapage, setMetapageDefinitionBase64]);

  return [metapage, setMetapageDefinitionBase64, error];
};

const getMetapageDefinitionFromUrl = async (
  url: string
): Promise<MetapageDefinition | undefined> => {
  if (!url.endsWith(".json")) {
    if (!url.endsWith("/")) {
      url += "/";
    }
    url += "metapage.json";
  }
  const response = await fetch(url, {});
  const metapageDefinition: MetapageDefinition = await response.json();
  return metapageDefinition;
};
