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

import { h, FunctionalComponent } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import { Metapage } from "@metapages/metapage";
import { Header } from "./Header";
import { Alert } from "./Alert";
import { MetapageView } from "./MetapageView";
import { MetapageDefinition } from "@metapages/metapage/metapage/v0_2/all";
import { useHashParamJson } from "../hooks/useHashParamJson";
import useHashParam from "use-hash-param";
import { AlertBlob } from "./Alert";

// change this if developing locally the root site to the demo metapages
const METAPAGES_ORG = "https://metapages.org/";

export const App: FunctionalComponent = () => {
  const [alert, setAlert] = useState<AlertBlob | undefined>(undefined);
  const [url, setUrl] = useHashParam("url", undefined as any);
  const [metapageDefinition, setMetapageDefinition] = useState<
    MetapageDefinition | undefined
  >(undefined);
  const [metapageDefinitionUrl, setMetapageDefinitionUrl] = useState<
    { definition: MetapageDefinition; url: string } | undefined
  >(undefined);
  const [
    metapageDefinitionBase64,
    setMetapageDefinitionBase64,
  ] = useHashParamJson<MetapageDefinition | undefined>("definition");
  const [metapage, setMetapage] = useState<Metapage | undefined>(undefined);

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
        const definition:
          | MetapageDefinition
          | undefined = await getMetapageDefinitionFromUrl(thisUrl);
        if (!definition) {
          throw `No MetapageDefinition found at: ${thisUrl}`;
        }
        setMetapageDefinitionUrl({ url: thisUrl, definition });
      } catch (err: any) {
        console.error(err);
        setAlert({
          level: "error",
          message: `${err}`,
        });
        setMetapageDefinitionUrl(undefined);
      }
    })();
  }, [
    alert,
    url,
    metapageDefinitionUrl,
    setMetapageDefinitionUrl,
    setAlert,
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
        setMetapageDefinition(undefined);
      }
      return;
    }
    if (
      JSON.stringify(metapageDefinition) !==
      JSON.stringify(newMetapageDefinition)
    ) {
      setMetapageDefinition(newMetapageDefinition);
    }
  }, [
    metapageDefinitionUrl,
    metapageDefinitionBase64,
    metapageDefinition,
    setMetapageDefinition,
  ]);

  // create or delete metapage from metapageDefinition
  useEffect(() => {
    if (!metapageDefinition) {
      if (metapage) {
        setMetapage(undefined);
      }
      return;
    }
    const newMetapage = Metapage.from(metapageDefinition);
    setMetapage(newMetapage);
    return () => {
      newMetapage.dispose();
    };
  }, [metapageDefinition, setMetapage]);

  const loadMetapageJsonFromTextBox = useCallback(() => {
    const metapageJsonString = (document!.getElementById(
      "text:metapage.json"
    ) as HTMLInputElement)!.value!;
    try {
      // try to parse the JSON string
      const newMetapageBlob = JSON.parse(metapageJsonString);
      setMetapageDefinitionBase64(newMetapageBlob);
    } catch (err) {
      // do something fancier there
      console.error(err);
      setAlert({ level: "error", message: `Failed to parse JSON: ${err}` });
    }
  }, [setMetapageDefinitionBase64, setAlert]);

  const headerDisabled =
    new URL(window.location.href).searchParams.get("header") === "0";

  const getAlert = useCallback(() => {
    return alert ? (
      <div>
        <Alert {...alert} />
        <br />
      </div>
    ) : null;
  }, [status, alert]);

  // if there's a metapage, we don't care about anything else
  if (metapage) {
    const header =
      headerDisabled || !metapageDefinition ? null : (
        <Header definition={metapageDefinition} metapage={metapage} url={url} />
      );
    return (
      <div id="app">
        {header}
        <MetapageView metapage={metapage} />
      </div>
    );
  }

  // Otherwise it's the main help page with various alerts etc
  const mainAlert = getAlert();

  return (
    <div>
      {mainAlert}

      <div class="siimple-card">
        <div class="siimple-card-header">
          <a href={METAPAGES_ORG} class="siimple-link">
            Metapage
          </a>{" "}
          viewer
        </div>

        <div class="siimple-card-body">
          Provide a{" "}
          <a
            href={`${METAPAGES_ORG}api/#metapagedefinition`}
            class="siimple-link"
          >
            metapage definition
          </a>{" "}
          and this app will build the application. The definition can be
          provided in the URL hash parameters one of two ways::
        </div>

        <div class="siimple-card">
          <div class="siimple-card-body">
            <label class="siimple-label">
              (<code class="siimple-code">#url=?</code>) pointing to the
              location of the metapage.json, e.g.:
            </label>
            <br />
            <a href={urlExampleMetapageJsonAsHash} class="siimple-link">
              {urlExampleMetapageJsonAsHash}
            </a>
          </div>
        </div>

        <div class="siimple-card">
          <div class="siimple-card-body">
            <label class="siimple-label">
              (<code class="siimple-code">#definition=?</code>) containing the
              base64 encoded metapage definition JSON:
            </label>
            <br />
            {/* onKeyDown={this.onKeyDown} */}
            <textarea
              id="text:metapage.json"
              class="siimple-textarea siimple-textarea--fluid"
              rows={5}
            >
              {exampleJson}
            </textarea>
            <div
              class="siimple-btn siimple-btn--primary"
              onClick={loadMetapageJsonFromTextBox}
            >
              Load
            </div>
          </div>
        </div>

        <br />
        <br />
        <br />

        <div class="siimple-card">
          <div class="siimple-card-body">
            <label class="siimple-label">Examples:</label>
            <br />
            <div class="siimple-list">{examples}</div>
          </div>
        </div>
      </div>
    </div>
  );
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

const exampleJson = JSON.stringify(
  {
    version: "0.3",
    meta: {
      layouts: {
        flexboxgrid: {
          docs: "http://flexboxgrid.com/",
          layout: [
            [
              {
                name: "random-data-generator",
                width: "col-xs-4",
                style: {
                  maxHeight: "600px",
                },
              },
              {
                url:
					`${METAPAGES_ORG}metaframes/passthrough-arrow/?rotation=90`,
                width: "col-xs-1",
              },
              {
                name: "graph-dynamic",
                width: "col-xs-7",
              },
            ],
          ],
        },
      },
    },
    metaframes: {
      "random-data-generator": {
        url:
          `${METAPAGES_ORG}metaframes/random-data-generator/?frequency=1000`,
      },
      "graph-dynamic": {
        url: `${METAPAGES_ORG}metaframes/graph-dynamic/`,
        inputs: [
          {
            metaframe: "random-data-generator",
            source: "y",
          },
        ],
      },
    },
    plugins: ["https://metapages.github.io/metaframe-editor/"],
  },
  null,
  "  "
);

const examples = [
  `${METAPAGES_ORG}metapages/linked-molecule-viewers/metapage.json`,
  `${METAPAGES_ORG}metapages/dynamic-plot/metapage.json`,
]
  .map(
    (url) =>
      `${
        typeof window !== "undefined" ? window.location.origin : ""
      }/#?url=${url}`
  )
  .map((url) => (
    <div class="siimple-list-item">
      <a href={url} class="siimple-link">
        {url}
      </a>
    </div>
  ));

const urlExampleMetapageJsonAsHash =
  typeof window !== "undefined"
    ? `${window.location.origin}/#?url=${METAPAGES_ORG}metapages/dynamic-plot/metapage.json`
    : undefined;
