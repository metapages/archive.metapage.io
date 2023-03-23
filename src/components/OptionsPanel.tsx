import {
  Container,
  FormControl,
  Input,
  Switch,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { useHashParamBoolean } from "@metapages/hash-query";
import React, { useCallback } from "react";
import { useForm } from "react-hook-form";

import { metapageDefinitionFromUrl } from "../hooks/metapageDefinitionFromUrl";

export const OptionKeyHideMetaframeBorder = "hide-mf-border";
export const OptionKeyHideHeader = "hide-header";
export const OptionKeyHideDescription = "hide-desc";
export const OptionKeyShowMetaframeKey = "show-mf-name";
export const OptionKeyDisableLayoutEdit = "disable-layout-edit";
export const OptionKeyDebug = "debug";

export const OptionsPanel: React.FC = () => {
  return (
    <VStack alignItems="flex-start">
      <TableContainer>
        <Table size="sm">
          <TableCaption>
            Options are automatically saved in the URL
          </TableCaption>
          <Tbody>
            <OptionMetapageTitle />
            <OptionMetapageAuthor />
            <OptionBoolean
              label={OptionKeyHideMetaframeBorder}
              description={"Hide metaframe borders"}
            />
            <OptionBoolean
              label={OptionKeyShowMetaframeKey}
              description={"Show the metaframe names"}
            />
            <OptionBoolean
              label={OptionKeyHideHeader}
              description={"Hide app header (minimal)"}
            />
            {/* <OptionBoolean
              label={OptionKeyHideDescription}
              description={"Hide author and description"}
            /> */}
            <OptionBoolean
              label={OptionKeyDisableLayoutEdit}
              description={"Disable layout editing"}
            />
            <OptionBoolean label={OptionKeyDebug} description={"Debug mode"} />
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
};

const OptionBoolean: React.FC<{ label: string; description: string }> = ({
  label,
  description,
}) => {
  const [option, setOption] = useHashParamBoolean(label);
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setOption(e.target.checked);
    },
    [setOption]
  );
  return (
    <Tr>
      <Td>{description}</Td>
      <Td>
        <FormControl display="flex" alignItems="center">
          <Switch id={label} isChecked={option} onChange={onChange} />
        </FormControl>
      </Td>
    </Tr>
  );
};

type FormValues = {
  value: string;
};

const OptionMetapageTitle: React.FC = () => {
  const [metapageDefinition, setMetapageDefinition] =
    metapageDefinitionFromUrl();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    values: { value: metapageDefinition?.meta?.name || "" },
  });

  const onSubmit = useCallback(
    (values: FormValues) => {
      if (!metapageDefinition) {
        return;
      }

      metapageDefinition.meta = {
        ...metapageDefinition.meta,
        name: values.value,
      };
      setMetapageDefinition(metapageDefinition);
    },
    [metapageDefinition, setMetapageDefinition]
  );

  return (
    <Tr>
      <Td>Title</Td>
      <Td>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <Input
              id="value"
              placeholder="title"
              {...register("value", {
                value: metapageDefinition?.meta?.name || "",
              })}
            />
          </FormControl>
        </form>
      </Td>
    </Tr>
  );
};

const OptionMetapageAuthor: React.FC = () => {
  const [metapageDefinition, setMetapageDefinition] =
    metapageDefinitionFromUrl();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    values: { value: metapageDefinition?.meta?.author || "" },
  });

  const onSubmit = useCallback(
    (values: FormValues) => {
      if (!metapageDefinition) {
        return;
      }

      metapageDefinition.meta = {
        ...metapageDefinition.meta,
        author: values.value,
      };
      setMetapageDefinition(metapageDefinition);
    },
    [metapageDefinition, setMetapageDefinition]
  );

  return (
    <Tr>
      <Td>Author</Td>
      <Td>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl>
            <Input
              id="value"
              placeholder="author"
              {...register("value", {
                value: metapageDefinition?.meta?.name || "",
              })}
            />
          </FormControl>
        </form>
      </Td>
    </Tr>
  );
};
