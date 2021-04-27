import { h, FunctionalComponent } from "preact";
import { useEffect } from "preact/hooks";
import {
  Metapage,
  MetapageEvents,
  MetapageDefinition,
  MetapageIFrameRpcClient,
  MetapageEventDefinition,
} from "@metapages/metapage";
import { MetaframeView } from "./MetaframeView";
import { useHashParamJson } from "../hooks/useHashParamJson";
import {
  LayoutName as LayoutFlexBoxGridName,
  LayoutFlexBoxGridElement,
  getLayout,
  MetapageLayoutGrid,
  generateDefaultLayout,
} from "./LayoutGrid";

/**
 * Generate the virtual dom of the layed out metaframes
 * @param {*} layout
 * @param {*} metapage
 *    "meta": {
 *      "plugins": [],
 *      "layouts": {
 *        "flexboxgrid" : {
 *          "version": 1,
 *          "docs": "http://flexboxgrid.com/",
 *          "layout": [
 *            [ {"name":"input-button", "width":"col-xs-4", "height": "200px"}, {"name":"viewer1", "width":"col-xs-8"}  ],
 *            [ {"name":"passthrough1", "width":"col-xs-6", "height": "100px"}, {"name":"viewer2", "width":"col-xs-4"} ],
 *            [ {"name":"passthrough2", "width":"col-xs-4", "height": "300px"}, {"name":"viewer3", "width":"col-xs-4"} ]
 *          ],
 *          "options": {
 *            "arrows": true
 *          }
 *        }
 *      }
 *    }
 */

type Params = {
  rowElement: LayoutFlexBoxGridElement;
  defaultRowStyle: any;
  metaframes: { [key: string]: MetapageIFrameRpcClient };
};
const getFlexboxRowElementMetaframe = (params: Params) => {
  var { rowElement, metaframes, defaultRowStyle } = params;
  if (!metaframes) {
    return (
      <div class="siimple-alert siimple-alert--error">
        Missing metaframes parameter
      </div>
    );
  }

  defaultRowStyle = defaultRowStyle ? defaultRowStyle : {};
  const metaframeId: string = rowElement.name;

  if (!metaframes[metaframeId]) {
    return (
      <div class="siimple-alert siimple-alert--error">
        Missing metaframe: {metaframeId}
      </div>
    );
  }

  const colClass = rowElement.width ? rowElement.width : "col-xs";
  const itemStyle = rowElement.style ? rowElement.style : defaultRowStyle;
  const classes = `siimple-card ${colClass}`;
  const header = <div class="siimple-card-header">{metaframeId}</div>;
  const id = `siimple-card-${metaframeId}`;
  itemStyle["overflowY"] = "hidden";

  const metaframeContainer = (
    <div
      class="siimple-card-body siimple--mx-0 siimple--my-0 siimple--px-0 siimple--py-0"
      style={itemStyle}
    >
      <MetaframeView
        id={metaframeId}
        iframe={metaframes[metaframeId].iframe}
        style={itemStyle}
      />
    </div>
  );
  return header ? (
    <div class={classes} id={id}>
      {header}
      {metaframeContainer}
    </div>
  ) : (
    <div class={classes} id={id}>
      {metaframeContainer}
    </div>
  );
};

// This iframe is sandboxed
const getFlexboxRowElementUrl = (params: Params) => {
  var { rowElement, defaultRowStyle } = params;
  var { url, width, style } = rowElement;
  const colClass = width ? width : "col-xs";
  style = style ? style : defaultRowStyle;
  return (
    <div id={url} class={colClass}>
      <div class="iframe-container" style={style}>
        <iframe src={url} sandbox="allow-scripts"></iframe>
      </div>
    </div>
  );
};

const getFlexboxRowElement = (params: Params) => {
  if (params.rowElement.url) {
    return getFlexboxRowElementUrl(params);
  } else {
    return getFlexboxRowElementMetaframe(params);
  }
};

const applyLayout = (
  name: string,
  layout: MetapageLayoutGrid,
  metapage: Metapage
) => {
  // name = name ? name : LayoutFlexBoxGridName;
  const metaframes = metapage.metaframes();

  switch (name) {
    case LayoutFlexBoxGridName:
      // TODO process version when needed
      return layout.layout.map((layoutRow) => {
        let defaultRowStyle = layoutRow.reduce((curStyle, rowElement) => {
          return curStyle ? curStyle : rowElement.style;
        }, null);

        const rowElements = layoutRow.map((rowElement) => {
          return getFlexboxRowElement({
            rowElement,
            metaframes,
            defaultRowStyle,
          });
        });
        return <div class="row">{rowElements}</div>;
      });
    default:
      throw `Unknown layout: ${name}`;
  }
};

export const MetapageView: FunctionalComponent<{
  metapage: Metapage;
  // metapageDefinition:MetapageDefinition;
}> = ({ metapage }) => {
  const [_, setMetapageDefinitionBase64] = useHashParamJson<
    MetapageDefinition | undefined
  >("definition");

  useEffect(() => {
    let listener: (e: MetapageEventDefinition) => void;
    if (metapage) {
      listener = (e: MetapageEventDefinition) => {
        // if a plugin modifies the definition, update the hash param that is the source of truth
        setMetapageDefinitionBase64(e.definition);
      };
      metapage.addListener(MetapageEvents.Definition, listener);
    }
    return () => {
      if (metapage) {
        metapage.removeListener(MetapageEvents.Definition, listener);
      }
    };
  }, [metapage, setMetapageDefinitionBase64]);

  if (!metapage) {
    return null;
  }
  let layoutName = LayoutFlexBoxGridName;
  let layout: MetapageLayoutGrid | undefined = getLayout(
    metapage.getDefinition()
  );
  if (!layout) {
    layout = generateDefaultLayout(metapage);
  }

  var metaframesArranged = applyLayout(layoutName, layout, metapage);

  return <div class="siimple-grid">{metaframesArranged}</div>;
};
