import React from "react";
import { Alert, AlertDescription, AlertIcon } from "@chakra-ui/react";

export const CustomErrorDisplay: React.FC<{ error: any }> = ({ error }) => {
  console.error(error);
  return (
    <Alert status="error">
      <AlertIcon />
      <AlertDescription>{`${JSON.stringify(error)}`}</AlertDescription>
    </Alert>
  );
};
