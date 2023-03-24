import React, { useEffect, useState } from 'react';
import { Spinner } from '@chakra-ui/react';
import { MetaframeDefinitionV6, Metapage, MetapageEvents } from '@metapages/metapage';

import { MetaframeView } from "@metapages/metapage-grid-react";
import { HEIGHT_LESS_NAVBAR } from '../style/constants';
import { ErrorMessage } from '../components/Message';

type PluginDefinitions = {
  [key in string]: {
    error?: any;
    definition?: MetaframeDefinitionV6 | undefined;
  };
};

export type TabItem = { label: string; content: JSX.Element };
export type TabData = TabItem[];

export const getPluginTabs: (args: {
  metapage: Metapage | undefined;
  url?: string;
}) => TabData = ({ metapage, url }) => {
  // const [headerDisabled] = useHashParamBoolean("header-hide");
  const [pluginDefinitions, setPluginDefinitions] =
    useState<PluginDefinitions | null>(null);
  const [tabData, setTabData] =
  useState<TabData>([]);

  const [tabHeaders, setTabHeaders] = useState<string[]>(
    metapage?.getDefinition()?.plugins !== undefined
        ? Array.from(Array(metapage.getDefinition().plugins!.length)).map(
            (_, i) => "⌛"
          )
        : []
  );

  const [tabPanels, setTabPanels] = useState<JSX.Element[]>(
    metapage?.getDefinition()?.plugins !== undefined
        ? Array.from(Array(metapage.getDefinition().plugins!.length)).map(
            (_, i) => (
                <Spinner />
            )
          )
        : []
  );

  // load the plugin definitions (async) so we can show
  // the plugin names
  useEffect(() => {
    if (!metapage || metapage.isDisposed()) {
      setPluginDefinitions(null);
      return;
    }
    let listener: () => Promise<void>;
    let cancelled = false;

    listener = async () => {
      if (cancelled) {
        return;
      }
      if (metapage.isDisposed()) {
        return;
      }
      const newPluginDefinitions: PluginDefinitions = {};
      const promises = metapage
        .getPluginIds()
        .map((pluginIdIsUrl: string) => {
          return metapage
            .getPlugin(pluginIdIsUrl)
            .getDefinition()
            .then(
              (metaframeDefinition: MetaframeDefinitionV6 | undefined) => {
                if (metaframeDefinition) {
                  newPluginDefinitions[pluginIdIsUrl] = {
                    definition: metaframeDefinition,
                  };
                } else {
                  newPluginDefinitions[pluginIdIsUrl] = {
                    error: "Missing definition",
                  };
                }
              }
            )
            .catch((err) => {
              newPluginDefinitions[pluginIdIsUrl] = { error: `${err}` };
            });
        });
      await Promise.all(promises);
      if (cancelled || metapage.isDisposed()) {
        return;
      }
      setPluginDefinitions(newPluginDefinitions);
    };
    listener();
    metapage.addListener(MetapageEvents.Definition, listener);

    return () => {
      cancelled = true;
      if (metapage) {
        metapage.removeListener(MetapageEvents.Definition, listener);
      }
    };
  }, [metapage, setPluginDefinitions]);

  // get the names of the plugins
  useEffect(() => {
    if (!pluginDefinitions) {
      setTabHeaders([]);
      return;
    }

    const newTabHeaders =
      metapage?.getPluginIds().map((pluginId): string => {
        const pluginMetaframeDefinition: MetaframeDefinitionV6 | undefined =
          pluginDefinitions?.[pluginId]?.definition;
        // TODO process version when needed
        const pluginMetadata = pluginMetaframeDefinition?.metadata;

        if (pluginMetadata && (pluginMetadata as any).name) {
          return (pluginMetadata as any).name;
        } else {
          // what should I use as the short link name?
          // the last part of the url
          if (typeof window !== "undefined") {
            const url = new URL(pluginId);
            if (url.pathname.length > 1) {
              return url.pathname.split("/")[
                url.pathname.split("/").length - 1
              ];
            }
          }
          return pluginId;
        }
      }) || [];

      setTabHeaders(newTabHeaders);

  }, [pluginDefinitions]);

  // get the plugin panels
  useEffect(() => {
    if (!metapage) {
      setTabData([]);
      return;
    }
    const pluginUrls: string[] = metapage.getPluginIds();
    let cancelled = false;

    (async () => {
      const plugins: JSX.Element[] = [];
      for (const url of pluginUrls) {
        if (cancelled) {
          return;
        }
        const index = pluginUrls.indexOf(url);
        const pluginMetaframe = metapage!.getPlugin(url);
        if (!pluginMetaframe) {
          continue;
        }
        let styleHeight = HEIGHT_LESS_NAVBAR;

        const iframe = await pluginMetaframe.iframe;
        if (cancelled) {
          return;
        }

        const metaframeContainer = (
          <MetaframeView
            id={url}
            iframe={iframe}
            style={{ height: styleHeight }}
            ErrorWrapper={ErrorMessage}
          />
        );

        plugins.push(
            metaframeContainer
        );
      }
      setTabPanels(plugins);
    })();

    return () => {
      cancelled = true;
    };
  }, [metapage, setTabPanels]);

  useEffect(() => {
    setTabData(tabHeaders.map((label, i) => {
      return {
        label,
        content: tabPanels[i],
      }
    }));
  }, [tabHeaders, tabPanels, setTabData])

  return tabData;
};

// const getMetapageName = (args: {
//   definition: MetapageDefinitionV3 | undefined;
//   url: string | undefined;
// }) => {
//   const { definition, url } = args;
//   const meta = definition ? definition.meta : null;
//   const nameString =
//     meta && meta.name ? meta.name : url ? url : "Metapage Application";
//   if (url) {
//     return <a href={url}>{nameString}</a>;
//   } else {
//     return nameString;
//   }
// };

// const PluginTab: React.FC<{
//   selectedIndex: number;
//   index: number;
//   setSelectedIndex: (index: number) => void;
//   name: string;
// }> = ({ selectedIndex, index, setSelectedIndex, name }) => {
//   const onClick = useCallback(() => {
//     setSelectedIndex(selectedIndex === index ? -1 : index);
//   }, [setSelectedIndex, selectedIndex, index]);
//   let cls = "siimple-tabs-item siimple--float-right";
//   if (index === selectedIndex) {
//     cls += " siimple-tabs-item--selected";
//   }
//   return (
//     <div className={cls} onClick={onClick}>
//       {name}
//     </div>
//   );
// };
