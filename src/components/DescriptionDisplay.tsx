import { metapageDefinitionFromUrl } from '../hooks/metapageDefinitionFromUrl';
import { UrlToIframe } from './UrlToIframe';

export const DescriptionDisplay: React.FC = () => {
  const [metapageDefinition] = metapageDefinitionFromUrl();

  if (!metapageDefinition?.meta?.description) {
    console.log("not rendering description")
    return null;
  }

  const url = `https://markdown.mtfm.io/#?base64=${btoa(metapageDefinition.meta.description)}`;
  return (<UrlToIframe url={url} height="200px"/>);
};
