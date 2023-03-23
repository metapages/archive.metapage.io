import React from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertStatus,
  AlertTitle,
} from "@chakra-ui/react";

export type AlertBlob = {
  title: string;
  level: AlertStatus;
  description?: string;
};

export const Message: React.FC<{
  title: string;
  level: AlertStatus;
  description?: string;
}> = ({ level, title, description }) => {
  title = `${title}`;
  level = level ? level : "info";

  return (
    <Alert status={level}>
      <AlertIcon />
      <AlertTitle mr={2}>{title}</AlertTitle>
      {description ? <AlertDescription>{description}</AlertDescription> : null}
    </Alert>
  );
};

export const ErrorMessage: React.FC<{
  title?: string;
  error: string;
}> = ({ title, error }) => {
  title = `${title}`;

  return (
    <Alert status="error">
      <AlertIcon />
      {title ? <AlertTitle mr={2}>{title}</AlertTitle> : null}
      {error ? <AlertDescription>{error}</AlertDescription> : null}
    </Alert>
  );
};
