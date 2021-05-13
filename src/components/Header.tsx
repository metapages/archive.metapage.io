import { h, FunctionalComponent } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import {
  Metapage,
  MetapageEvents,
  MetapageDefinition,
  MetaframeDefinition,
} from "@metapages/metapage";
import { PluginPanel } from "./PluginPanel";

type PluginDefinitions = { [key in string]: MetaframeDefinition };

export const Header: FunctionalComponent<{
  // definition: MetapageDefinition;
  metapage: Metapage;
  url?: string;
}> = ({ metapage, url }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [pluginDefinitions, setPluginDefinitions] = useState<
    PluginDefinitions | undefined
  >(undefined);

  useEffect(() => {
    // load the plugin definitions (async) so we can show
    // the plugin names
    let listener: () => Promise<void>;

    if (metapage) {
      listener = async () => {
        const newPluginDefinitions: PluginDefinitions = {};
        const promises = metapage
          .getPluginIds()
          .map((pluginIdIsUrl: string) => {
            return metapage
              .getPlugin(pluginIdIsUrl)
              .getDefinition()
              .then((metaframeDefinition: MetaframeDefinition) => {
                newPluginDefinitions[pluginIdIsUrl] = metaframeDefinition;
              });
          });
        await Promise.all(promises);
        setPluginDefinitions(newPluginDefinitions);
        setSelectedIndex(
          Math.min(selectedIndex, Object.keys(newPluginDefinitions).length - 1)
        );
      };
      listener();
      metapage.addListener(MetapageEvents.Definition, listener);
    } else {
      setPluginDefinitions({}); // means loaded
    }
    return () => {
      if (metapage) {
        metapage.removeListener(MetapageEvents.Definition, listener);
      }
    };
  }, [metapage, selectedIndex, setSelectedIndex, setPluginDefinitions]);

  if (!metapage) {
    return (
      <div class="siimple-alert siimple-alert--error">
        Missing: metapage. Reload?
      </div>
    );
  }

  const headerDisabled =
    new URL(window.location.href).searchParams.get("header") === "0";

  const isPluginsDisabled =
    headerDisabled ||
    !pluginDefinitions ||
    metapage.getPluginIds().length === 0;

  return (
    <div>
      <div
        class="siimple-navbar siimple-navbar--large siimple-navbar--light siimple--clearfix siimple--bg-white siimple--px-0 siimple--mx-0"
        style={{ maxWidth: "100%" }}
      >
        <div class="siimple-navbar-title siimple--float-left siimple--pl-3">
          {getMetapageName({ definition: metapage ? metapage.getDefinition() : undefined, url })}
        </div>
        {isPluginsDisabled ? null : (
          <div class="siimple-tabs siimple-tabs--boxed">
            {metapage
              .getPluginIds()
              .map((pluginId) => {
                const pluginMetaframeDefinition = pluginDefinitions![pluginId];

                // TODO process version when needed
                const pluginMetadata = pluginMetaframeDefinition.metadata;

                if (pluginMetadata && (pluginMetadata as any).name) {
                  return (pluginMetadata as any).name;
                } else if (pluginMetadata && pluginMetadata.title) {
                  return pluginMetadata.title;
                } else {
                  // what should I use as the short link name?
                  // the last part of the url
                  if (typeof window !== "undefined") {
                    const url = new URL(pluginId);
                    if (url.pathname.length > 1) {
                      return url.pathname.split("/")[
                        url.pathname.split("/").length - 1
                      ];
                    } else {
                      // no path, then just the domain
                      return url.host.replace("www.", "");
                    }
                  } else {
                    return null;
                  }
                }
              })
              .map((tabName, index) => {
                return (
                  <PluginTab
                    index={index}
                    selectedIndex={selectedIndex}
                    setSelectedIndex={setSelectedIndex}
                    name={tabName}
                  />
                );
              })}
          </div>
        )}
      </div>
      <div>
        {isPluginsDisabled ? null : (
          <PluginPanel selected={selectedIndex} metapage={metapage} />
        )}
      </div>
    </div>
  );
};

const getMetapageName = (args: {
  definition: MetapageDefinition | undefined;
  url: string | undefined;
}) => {
  const { definition, url } = args;
  const meta = definition ? definition.meta : null;
  const nameString =
    meta && meta.name ? meta.name : url ? url : "Metapage Application";
  if (url) {
    return <a href={url}>{nameString}</a>;
  } else {
    return nameString;
  }
};

const PluginTab: FunctionalComponent<{
  selectedIndex: number;
  index: number;
  setSelectedIndex: (index: number) => void;
  name: string;
}> = ({ selectedIndex, index, setSelectedIndex, name }) => {
  const onClick = useCallback(() => {
    setSelectedIndex(selectedIndex === index ? -1 : index);
  }, [setSelectedIndex, selectedIndex, index]);
  let cls = "siimple-tabs-item siimple--float-right";
  if (index === selectedIndex) {
    cls += " siimple-tabs-item--selected";
  }
  return (
    <div class={cls} onClick={onClick}>
      {name}
    </div>
  );
};
