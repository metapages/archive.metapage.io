import { Center, Text } from '@chakra-ui/react';

import { metapageDefinitionFromUrl } from '../hooks/metapageDefinitionFromUrl';

export const AuthorDisplay: React.FC = () => {
  const [metapageDefinition] = metapageDefinitionFromUrl();

  if (!metapageDefinition?.meta?.author) {
    return null;
  }
  return (
    <Center pl={2}>
      <Text className="author" fontSize='xs'>  - {metapageDefinition.meta.author}</Text>
    </Center>
  );
};
