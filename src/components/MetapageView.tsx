import { h, FunctionalComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { Metapage, MetapageIFrameRpcClient } from "@metapages/metapage";
import { MetaframeView } from "./MetaframeView";
import {
  LayoutName as LayoutFlexBoxGridName,
  LayoutFlexBoxGridElement,
  getLayout,
  MetapageLayoutGrid,
  generateDefaultLayout,
} from "./LayoutGrid";

// For now, we only support one type of layout, bake it in here
// In the future we might support many
const layoutName = LayoutFlexBoxGridName;

export const MetapageView: FunctionalComponent<{
  metapage: Metapage;
}> = ({ metapage }) => {
  if (!metapage) {
    return null;
  }

  const [metaframesArranged, setMetaframesArranged] = useState<h.JSX.Element[]>(
    []
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let layout: MetapageLayoutGrid | undefined = getLayout(
        metapage.getDefinition()
      );
      if (!layout) {
        layout = generateDefaultLayout(metapage);
      }

      const elements = await applyLayout(layoutName, layout, metapage);
      if (cancelled) {
        return;
      }

      setMetaframesArranged(elements);
    })();

    return () => {
      cancelled = true;
    };
  }, [metapage, setMetaframesArranged]);

  return <div class="siimple-grid">{metaframesArranged}</div>;
};

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

const getFlexboxRowElementMetaframe = async (params: Params) => {
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

  const iframeElement = await metaframes[metaframeId].iframe;

  const metaframeContainer = (
    <div
      class="siimple-card-body siimple--mx-0 siimple--my-0 siimple--px-0 siimple--py-0"
      style={itemStyle}
    >
      <MetaframeView
        id={metaframeId}
        iframe={iframeElement}
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

const getFlexboxRowElement = async (params: Params) => {
  if (params.rowElement.url) {
    return getFlexboxRowElementUrl(params);
  } else {
    const rowElement = await getFlexboxRowElementMetaframe(params);
    return rowElement;
  }
};

const applyLayout = async (
  name: string,
  layout: MetapageLayoutGrid,
  metapage: Metapage
): Promise<preact.JSX.Element[]> => {
  const metaframes = metapage.metaframes();

  const elements: preact.JSX.Element[] = [];

  switch (name) {
    case LayoutFlexBoxGridName:
      // TODO process version when needed
      for (const layoutRow of layout.layout) {
        let defaultRowStyle = layoutRow.reduce((curStyle, rowElement) => {
          return curStyle ? curStyle : rowElement.style;
        }, null);

        const rowElements: preact.JSX.Element[] = [];
        for (const rowElement of layoutRow) {
          const flexboxElement = await getFlexboxRowElement({
            rowElement,
            metaframes,
            defaultRowStyle,
          });
          rowElements.push(flexboxElement);
        }
        elements.push(<div class="row">{rowElements}</div>);
      }
      break;
    default:
      throw `Unknown layout: ${name}`;
  }

  return elements;
};
