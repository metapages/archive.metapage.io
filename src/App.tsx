import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

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
import {
  Box,
  Heading,
  HStack,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from '@chakra-ui/react';
import { useHashParamBoolean } from '@metapages/hash-query';
import {
  Metapage,
  MetapageDefinitionV1,
} from '@metapages/metapage';

import { ButtonGotoExternalLink } from './components/ButtonGotoExternalLink';
import { MenuMetapage } from './components/MenuMetapage';
import {
  AlertBlob,
  Message,
} from './components/Message';
import {
  OptionKeyDisableLayoutEdit,
  OptionKeyHideHeader,
} from './components/OptionsPanel';
import { PanelHelp } from './components/PanelHelp';
import { CustomGridItemComponentLabel } from './CustomGridItemComponentLabel';

import { metapageDefinitionFromUrl } from './hooks/metapageDefinitionFromUrl';
import { MetapageGridLayoutFromDefinition } from './lib';

export type TabItem = { label: string; content: JSX.Element };
export type TabData = TabItem[];

export const App: React.FC = () => {
  const [alert, setAlert] = useState<AlertBlob | undefined>(undefined);
  // const [metapage, setMetapage] = useState<Metapage | undefined>();
  const [metapageDefinition, setMetapageDefinition] =
    metapageDefinitionFromUrl();
  const [finalTabData, setFinalTabData] = useState<TabData>([]);
  const [hideHeader] = useHashParamBoolean(OptionKeyHideHeader);
  const [disableLayoutEdits] = useHashParamBoolean(OptionKeyDisableLayoutEdit);

  const onDefinition = useCallback(
    (m: MetapageDefinitionV1) => {
      setMetapageDefinition(m);
    },
    [setMetapageDefinition]
  );

  // const onMetapage = useCallback(
  //   (m: Metapage) => {
  //     setMetapage(m);
  //   },
  //   [setMetapage]
  // );

  // collate the plugin tabs with the main tabs
  useEffect(() => {
    setFinalTabData([
      {
        label: "Metapage",
        content: metapageDefinition ? (
          <VStack w="100%" alignItems="flex-start">
            {mainAlert}
            {/* <AuthorAndDescription /> */}
            <Box w="100%">
              <MetapageGridLayoutFromDefinition
                definition={metapageDefinition}
                // metapage={metapage}
                disableEditing={disableLayoutEdits}
                // onMetapage={onMetapage}
                onDefinition={onDefinition}
                // onOutputs={onOutputs as any}
                Wrapper={CustomGridItemComponentLabel}
                // ErrorWrapper={CustomErrorDisplay}
              />
            </Box>
          </VStack>
        ) : (
          <PanelHelp />
        ),
      },
    ]);
  }, [metapageDefinition, onDefinition]);

  const getAlert = useCallback(() => {
    return alert ? (
      <div>
        <Message {...alert} />
        <br />
      </div>
    ) : null;
  }, [status, alert]);

  // Otherwise it's the main help page with various alerts etc
  const mainAlert = getAlert();

  
  if (hideHeader) {
    return (
      <VStack w="100%" h="100vh" alignItems="flex-start">
        <HStack p={1} w="100%" justifyContent="space-between">
          <MetapageHeader />
          <Spacer />
          <ButtonGotoExternalLink/>
          <MenuMetapage />
        </HStack>
        <Box p={1} w="100%" alignContent="stretch">
          {finalTabData[0]?.content}
        </Box>
      </VStack>
    );
  }

  return (
    <div>
      <Tabs
        defaultIndex={0}
        align="end"
        variant="enclosed"
      >
        <TabList>
          
          <Tab key={0}>
            <MetapageHeader />
          </Tab>
          {/* <AuthorDisplay /> */}
          <Spacer />

          {/* {pluginTabData.map((tab: TabItem, index: number) => (
            <Tab key={index + 1}>{tab.label}</Tab>
          ))} */}
          <ButtonGotoExternalLink/>
          <MenuMetapage />

        </TabList>
        <TabPanels>
          {finalTabData.map((tab: TabItem, index: number) => (
            <TabPanel p={2} key={index + 1}>
              {tab.content}
            </TabPanel>
          ))}

        </TabPanels>
      </Tabs>
    </div>
  );
};

const MetapageHeader: React.FC = () => {
  const [metapage] = metapageDefinitionFromUrl();

  const name = metapage?.meta?.name;

  if (name) {
    return <Heading size="sm">{name}</Heading>;
  }
  return <Heading size="sm">Metapage</Heading>;
};
