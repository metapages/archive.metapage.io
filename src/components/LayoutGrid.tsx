import { Metapage, MetapageDefinition } from "@metapages/metapage";

export const LayoutName = "flexboxgrid";

export type RuntimeOptions = {
  minimal: boolean;
};

export type MetapageLayoutGrid = {
  layout: LayoutFlexBoxGridElement[][];
  name: string;
};

export type ReactGridLayoutData = {
  i?: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  isDraggable?: boolean;
  isResizable?: boolean;
};

export type LayoutFlexBoxGridElement = {
  name: string;
  width?: string;
  style?: any;
  url?: string;
};

export const getLayout = (
  metapageDefinition: MetapageDefinition
): MetapageLayoutGrid | undefined => {
  if (metapageDefinition?.meta?.layouts?.[LayoutName]) {
    return metapageDefinition.meta.layouts[LayoutName] as MetapageLayoutGrid;
  }
};

export const generateDefaultLayout = (
  metapage: Metapage
): MetapageLayoutGrid => {
  const metaframeIds: string[] = metapage.getMetaframeIds();
  let columns = 2;
  if (metaframeIds.length < 2) {
    columns = 1;
  }
  metaframeIds.sort();
  const result: LayoutFlexBoxGridElement[][] = [];
  let rowIndex = 0;
  let colIndex = 0;
  while (metaframeIds.length > 0) {
    if (colIndex >= columns) {
      colIndex = 0;
      rowIndex++;
    }
    if (!result[rowIndex]) {
      result[rowIndex] = [];
    }
    result[rowIndex].push({
      name: metaframeIds.pop()!,
      width: "col-xs",
      style: {},
    });
    colIndex++;
  }
  return { layout: result, name: LayoutName };
};
