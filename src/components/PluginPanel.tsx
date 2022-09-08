import { h, FunctionalComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { MetaframeView } from "./MetaframeView";
import {
  Metapage,
  MetapageDefinitionV3,
  MetapageEvents,
  MetapageEventDefinition,
} from "@metapages/metapage";

export const PluginPanel: FunctionalComponent<{
  selected: number;
  metapage: Metapage | undefined;
}> = ({ selected, metapage }) => {
  const [_, setDefinition] =
    useState<MetapageDefinitionV3 | undefined>(undefined);

  const [pluginElements, setPluginElements] = useState<preact.JSX.Element[]>(
    []
  );

  // TODO put this elsewhere as metapageDefinitionHook
  useEffect(() => {
    if (!metapage) {
      return;
    }
    const listener = (e: MetapageEventDefinition) => {
      setDefinition(e.definition);
    };
    metapage.addListener(MetapageEvents.Definition, listener);
    setDefinition(metapage.getDefinition());

    return () => {
      metapage.removeListener(MetapageEvents.Definition, listener);
    };
  }, [metapage, setDefinition]);

  useEffect(() => {
    const pluginUrls: string[] = metapage ? metapage.getPluginIds() : [];
    let cancelled = false;

    (async () => {
      const plugins: preact.JSX.Element[] = [];
      for (const url of pluginUrls) {
        if (cancelled) {
          return;
        }
        const index = pluginUrls.indexOf(url);
        const pluginMetaframe = metapage!.getPlugin(url);
        if (!pluginMetaframe) {
          continue;
        }
        let styleHeight = "80vh";

        const style =
          index === selected
            ? { maxHeight: styleHeight, height: styleHeight, display: "" }
            : { display: "none" };

        const iframe = await pluginMetaframe.iframe;
        if (cancelled) {
          return;
        }

        const metaframeContainer = (
          <div class="siimple-card-body">
            <MetaframeView
              id={url}
              iframe={iframe}
              style={{ maxHeight: styleHeight, height: styleHeight }}
            />
          </div>
        );

        plugins.push(
          <div class="siimple-card" id={url} style={style}>
            {metaframeContainer}
          </div>
        );
      }
      setPluginElements(plugins);
    })();

    return () => {
      cancelled = true;
    };
  }, [metapage, selected, setPluginElements]);

  const rule =
    selected > -1 ? <div class="siimple-rule siimple--mb-5"></div> : null;

  return (
    <div id="PluginPanel">
      {pluginElements}
      {rule}
    </div>
  );
};
