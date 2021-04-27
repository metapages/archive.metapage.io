import { h, FunctionalComponent } from "preact";

export type AlertBlob = { message?: string; level: string };

export const Alert: FunctionalComponent<{
  message?: string;
  level: string;
}> = ({ level, message }) => {
  message = `${message}`;
  level = `${level}`;
  level = level ? level : "primary";
  const className = `siimple-alert siimple-alert--${level}`;
  return <div class={className}>{message}</div>;
};
