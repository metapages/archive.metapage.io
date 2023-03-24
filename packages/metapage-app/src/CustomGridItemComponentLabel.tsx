import { forwardRef } from "react";
import { Box, HStack, Tag } from "@chakra-ui/react";
import { useHashParamBoolean } from "@metapages/hash-query";
import { OptionKeyHideMetaframeBorder, OptionKeyShowMetaframeKey } from "/@/components/OptionsPanel";

export const CustomGridItemComponentLabel = forwardRef(
  (props: any, ref) => {

    const [hideMetaframeBorder] = useHashParamBoolean(OptionKeyHideMetaframeBorder);
    const [showMetaframeName] = useHashParamBoolean(OptionKeyShowMetaframeKey);

    return (
      <Box
        style={{ overflow: "scroll", textAlign: "left", ...props.style }}
        // https://github.com/react-grid-layout/react-grid-layout/issues/1750
        onMouseDown={props.onMouseDown}
        onMouseUp={props.onMouseUp}
        onTouchEnd={props.onTouchEnd}
        borderWidth={hideMetaframeBorder ? undefined : "1px"}
        className={props.className}
        ref={ref as any}
      >
        {showMetaframeName ? (
          <HStack flexDirection="row-reverse">
            <Tag>{props.children[0].key}</Tag>
          </HStack>
        ) : undefined}

        {props.children}
      </Box>
    );
  }
);
