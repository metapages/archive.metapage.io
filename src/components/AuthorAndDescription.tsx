import { Box, Center, Text, VStack } from '@chakra-ui/react';

import { metapageDefinitionFromUrl } from '../hooks/metapageDefinitionFromUrl';
import { AuthorDisplay } from './AuthorDisplay';
import { DescriptionDisplay } from './DescriptionDisplay';
import { useHashParamBoolean } from '@metapages/hash-query';
import { OptionKeyHideDescription } from './OptionsPanel';

export const AuthorAndDescription: React.FC = () => {
  const [metapageDefinition] = metapageDefinitionFromUrl();
  const [hideDescription] = useHashParamBoolean(OptionKeyHideDescription);

  if (!metapageDefinition?.meta?.description && !metapageDefinition?.meta?.author) {
    return null;
  }
  return (
    <VStack w="100%" alignItems="flex-start" pl={1} textAlign={"left"}>
      <AuthorDisplay/>
      <DescriptionDisplay/>
    </VStack>
  );
};
