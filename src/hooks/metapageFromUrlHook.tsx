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
import objectHash from "object-hash"
import {
  MetapageEventUrlHashUpdate,
  Metapage,
  MetapageEvents,
  MetapageEventDefinition,
  MetapageDefinition,
} from "@metapages/metapage";
import { useHashParamJson } from "@metapages/metaframe-hook";
import useHashParam from "use-hash-param";

// type MetapageUpdateBlob = {
//   definition: MetapageDefinition;
//   // some updates come from metaframes e.g. updating thier hash params
//   // they are already set internally by the metaframe, so although we want
//   // to update the encoded metapage hash param containing the update, we
//   // do not want to trigger a metapage refresh since that is destructive
//   // and leads to poor UX
//   update: boolean;
// };

export const metapageFromUrl: () => [
  Metapage | undefined,
  (definition: MetapageDefinition | undefined) => void,
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
  const metapageRef = useRef<Metapage|undefined>(null);
  // updating the hash url of a metaframe then updating the metapage hash params
  // then NOT triggering a metapage rebuild has been tricky to get right. In the
  // hope that updates are not too frequent, trying to use a simple switch: if the
  // hash params update a metaframe URL (FROM the metaframe itself) just update the
  // definition in the URL but DON'T rebuild the metapage
//   const [disableNextMetapageUpdate, setDisableNextMetapageUpdate] =
//     useState<boolean>(false);
//   const [ignore, setDisableNextMetapageUpdate] =
//     useState<boolean>(false);

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
  }, [alert, url, metapageDefinitionUrl, setMetapageDefinitionUrl, status]);

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
    console.log('🧰 on some new metapage URL thing ')
    if (
        objectHash.sha1(metapageDefinition) !==
        objectHash.sha1(newMetapageDefinition)
    ) {
    //   if (disableNextMetapageUpdate) {
    //     console.log('🧰 do nothing bc disableNextMetapageUpdate === true');
    //     setDisableNextMetapageUpdate(false);
    //   } else {
        console.log('🧰 setMetapageDefinition!!', newMetapageDefinition);
        setMetapageDefinition(newMetapageDefinition);
    //   }
    } else {
        console.log('🧰 end with nothing bc metapageDefinition === newMetapageDefinition');
    }
  }, [
    metapageDefinitionUrl,
    metapageDefinitionBase64,
    metapageDefinition,
    // disableNextMetapageUpdate,
    // setDisableNextMetapageUpdate,
    setMetapageDefinition,
    metapage,
  ]);

  // create or delete metapage from metapageDefinition
  useEffect(() => {

    console.log(`🐥 useEffect`)
    if (!metapageDefinition) {
      console.log(`🐥 metapageDefinition undefined so unsetting then returning`)
      metapageRef.current = undefined;
      setMetapage(undefined);
    //   if (metapage.current) {
    //     metapage.current.dispose();
    //   }
    //   metapage.current = undefined;
      return;
    }

    console.log(`🐥 metapageRef.current defined? ${metapageRef.current!!}`);


    if (metapageRef.current) {
        console.log(`🐥 objectHash.sha1(metapageDefinition) ${objectHash.sha1(metapageDefinition)}`);
        console.log(`🐥 objectHash.sha1(metapageRef.current.getDefinition()) ${objectHash.sha1(metapageRef.current.getDefinition())}`);
        console.log(`🐥 ${metapageDefinition}`);
        console.log(`🐥 ${metapageRef.current.getDefinition()}`);
        if (
            objectHash.sha1(metapageDefinition) ===
            objectHash.sha1(metapageRef.current.getDefinition())
          ) {
             console.log('🐥 NOT creating a new metapage bc objectHash.sha1(metapageDefinition) === objectHash.sha1(metapageRef.current.getDefinition())');
              return;
          } else {

          }
    }

    const newMetapage = Metapage.from(metapageDefinition);
    console.log(`🐥 🌱🌱🌱 new metapage!  ${newMetapage._id}`);
    metapageRef.current = newMetapage;

    setMetapage(newMetapage);
    // The dispose of the metapage happens in the next useEffect block
    // since we might not actually create a new metapage here
    // return () => {
    //   newMetapage.dispose();
    // };
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
          console.log(`new MetapageDefinition from ${metapage._id}`);
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
            console.log(`new MetapageDefinition from ${metapage._id}`);
            setMetapageDefinitionBase64(definition);
          };
          metapage.addListener(MetapageEvents.DefinitionUpdateRequest, listener);
          return () =>
            metapage.removeListener(MetapageEvents.DefinitionUpdateRequest, listener);
        })()
      );

    // update our definition if a hash param changes
    // removeListeners.push(
    //   (() => {
    //     const listener = (e: HashParamsUpdatePayload) => {
    //       console.log("🍄", e);
    //       const currentDefinition = metapage.getDefinition();
    //       if (currentDefinition.metaframes[e.metaframe]) {
    //         // const url = new URL(currentDefinition.metaframes[e.metaframe].url);
    //         // url.hash = e.hash;
    //         // if (currentDefinition.metaframes[e.metaframe].url !== url.href) {
    //         //   currentDefinition.metaframes[e.metaframe].url = url.href;
    //           console.log(`metapage.updatePluginsWithDefinition`);
    //           metapage.updatePluginsWithDefinition();
    //           setDisableNextMetapageUpdate(true);
    //           console.log(`setMetapageDefinitionBase64`);
    //           setMetapageDefinitionBase64(currentDefinition);
    //         // } else {
    //         //   console.log(
    //         //     `Got HashParamsUpdatePayload but URL is the same: ${url.href}`
    //         //   );
    //         // }
    //       } else {
    //         console.error(
    //           `HashParamsUpdatePayload event but not matching metaframe=${e.metaframe}`
    //         );
    //       }
    //     };
    //     metapage.addListener(MetapageEvents.UrlHashUpdate, listener);
    //     return () =>
    //       metapage.removeListener(MetapageEvents.UrlHashUpdate, listener);
    //   })()
    // );

    return () => {
        metapage.dispose();
      while (removeListeners.length > 0) removeListeners.pop()!();
    };
  }, [metapage, setMetapageDefinitionBase64]);

  return [
    metapage,
    setMetapageDefinitionBase64,
    error,
  ];
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
