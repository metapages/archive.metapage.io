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
import { Metapage, MetapageEvents, MetapageDefinition } from "@metapages/metapage";
import { Header } from "./Header";
import { Alert } from "./Alert";
import { MetapageView } from "./MetapageView";
import { useHashParamJson } from "@metapages/metaframe-hook";
import useHashParam from "use-hash-param";
import { AlertBlob } from "./Alert";
import {metapageFromUrl } from "../hooks/metapageFromUrlHook";

// change this if developing locally the root site to the demo metapages
const METAPAGES_ORG = "https://metapages.org/";

export const App: FunctionalComponent = () => {
  const [alert, setAlert] = useState<AlertBlob | undefined>(undefined);
  const [url] = useHashParam("url", undefined as any);
  const [metapage, setMetapageDefinition] = metapageFromUrl();

  const loadMetapageJsonFromTextBox = useCallback(() => {
    const metapageJsonString = (document!.getElementById(
      "text:metapage.json"
    ) as HTMLInputElement)!.value!;
    try {
      // try to parse the JSON string
      const newMetapageBlob = JSON.parse(metapageJsonString);
      setMetapageDefinition(newMetapageBlob);
    } catch (err) {
      // do something fancier there
      console.error(err);
      setAlert({ level: "error", message: `Failed to parse JSON: ${err}` });
    }
  }, [setMetapageDefinition, setAlert]);

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
      headerDisabled || !metapage ? null : (
        <Header metapage={metapage} url={url} />
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
