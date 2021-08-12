import { h, FunctionalComponent } from "preact";
import { useEffect, useRef } from "preact/hooks";

export const MetaframeView: FunctionalComponent<{
  id: string;
  iframe: HTMLIFrameElement;
  style?: any;
}> = ({ id, iframe, style }) => {
  // Initialize useRef with an initial value of `null`
  const iframeContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (iframeContainer.current) {
      // now mounted, can freely modify the DOM:
      if (iframe && iframe instanceof Node) {
        if (style && style.maxHeight) {
          iframe.style.maxHeight = style.maxHeight;
        }
        (iframeContainer.current! as Node).appendChild(iframe);
      }
    }
  }, [iframeContainer.current, iframe, style]);

  if (!id) {
    return (
      <div class="siimple-alert siimple-alert--error">
        Metaframe class is missing id prop
      </div>
    );
  }
  if (!iframe) {
    return (
      <div class="siimple-alert siimple-alert--error">
        Missing iframe for {id}
      </div>
    );
  }
  if (!(iframe instanceof Node)) {
    return (
      <div class="siimple-alert siimple-alert--error">iframe is not a Node</div>
    );
  }

  // Optionally show a warning instead of the metaframe if missing required configuration
  const warning = iframe ? null : <div>Missing iframe for {id}</div>;
  return (
    <div
      ref={iframeContainer}
      class="iframe-container"
      id={`iframe-container-${id}`}
      style={style}
    >
      {" "}
      {warning}{" "}
    </div>
  );
};
