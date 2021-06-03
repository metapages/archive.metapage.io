import { h, FunctionalComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { MetaframeView } from "./MetaframeView";
import {
  Metapage,
  MetapageDefinition,
  MetapageEvents,
  MetapageEventDefinition,
} from "@metapages/metapage";

export const PluginPanel: FunctionalComponent<{
  selected: number;
  metapage: Metapage | undefined;
}> = ({ selected, metapage }) => {
  const [_, setDefinition] =
    useState<MetapageDefinition | undefined>(undefined);

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

  if (!metapage) {
  }

  const pluginUrls: string[] = metapage ? metapage.getPluginIds() : [];
  const plugins = pluginUrls.map((url, index) => {
    const pluginMetaframe = metapage!.getPlugin(url);
    if (!pluginMetaframe) {
      return null;
    }
    let styleHeight = "80vh";

    const style =
      index == selected
        ? { maxHeight: styleHeight, height: styleHeight, display: "" }
        : { display: "none" };

    const metaframeContainer = (
      <div class="siimple-card-body">
        <MetaframeView
          id={url}
          iframe={pluginMetaframe.iframe}
          style={{ maxHeight: styleHeight, height: styleHeight }}
        />
      </div>
    );

    return (
      <div class="siimple-card" id={url} style={style}>
        {metaframeContainer}
      </div>
    );
  });

  const rule =
    selected > -1 ? <div class="siimple-rule siimple--mb-5"></div> : null;

  return (
    <div id="PluginPanel">
      {plugins}
      {rule}
    </div>
  );
};
