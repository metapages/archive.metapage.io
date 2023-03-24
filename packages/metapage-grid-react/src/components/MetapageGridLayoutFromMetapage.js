import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState, } from "react";
import { MetapageEvents, } from "@metapages/metapage";
import { MetaframeIframe } from "./MetaframeIframe";
import { DEFAULT_ROW_HEIGHT, ResizingGridLayout, } from "./MetapageGridLayoutFromDefinition";
/**
 * Create a grid layout metapage from a metapage object
 */
export const MetapageGridLayoutFromMetapage = ({ metapage, inputs, onOutputs, onDefinition, Wrapper, ErrorWrapper }) => {
    const definitionRef = useRef();
    const [definitionInternal, setDefinitionInternal] = useState();
    const [metapageInternal, setMetapageInternal] = useState();
    const [error, setError] = useState();
    useEffect(() => {
        setMetapageInternal(metapage);
        setDefinitionInternal(metapage && !metapage.isDisposed() ? metapage.getDefinition() : undefined);
    }, [metapage, setMetapageInternal, setDefinitionInternal]);
    // listeners: metapage events
    useEffect(() => {
        if (!metapageInternal) {
            return;
        }
        const disposers = [];
        disposers.push(metapageInternal.addListenerReturnDisposer(MetapageEvents.Error, setError));
        if (onOutputs) {
            disposers.push(metapageInternal.addListenerReturnDisposer(MetapageEvents.Outputs, onOutputs));
        }
        if (onDefinition) {
            disposers.push(metapageInternal.addListenerReturnDisposer(MetapageEvents.Definition, (e) => {
                // Update the local definitionRef that is authoritative on what
                // is actually running, so incoming updates don't unnecessarily
                // clobber (and cause ugly re-renders)
                // This update comes from internal metaframe URL updates, so there's
                // no need to trigger a re-render
                definitionRef.current = { definition: e.definition };
                onDefinition(e.definition);
            }));
        }
        return () => {
            while (disposers.length > 0) {
                const disposer = disposers.pop();
                if (disposer) {
                    disposer();
                }
            }
        };
    }, [metapageInternal, onOutputs, onDefinition, setError]);
    // listeners: inputs
    useEffect(() => {
        if (metapageInternal && !metapageInternal.isDisposed() && inputs) {
            metapageInternal.setInputs(inputs);
        }
    }, [metapageInternal, inputs]);
    const defaultLayout = !metapageInternal
        ? []
        : Object.keys(metapageInternal.getMetaframes()).map((metaframeId, i) => {
            return {
                i: metaframeId,
                x: i % 2 === 0 ? 0 : 6,
                y: Math.floor(i / 2),
                w: 6,
                h: 2,
            };
        });
    const rowHeight = (metapageInternal &&
        definitionInternal?.meta?.layouts?.["react-grid-layout"]?.props
            ?.rowHeight) ||
        DEFAULT_ROW_HEIGHT;
    const containerPadding = (metapageInternal &&
        definitionInternal?.meta?.layouts?.["react-grid-layout"]?.props
            ?.containerPadding) || [5, 5];
    const cols = (metapageInternal &&
        definitionInternal?.meta?.layouts?.["react-grid-layout"]?.props?.cols) ||
        12;
    const margin = (metapageInternal &&
        definitionInternal?.meta?.layouts?.["react-grid-layout"]?.props
            ?.margin) || [10, 20];
    let layout = metapageInternal &&
        definitionInternal?.meta?.layouts?.["react-grid-layout"]?.layout
        ? [...definitionInternal?.meta?.layouts?.["react-grid-layout"]?.layout]
        : defaultLayout;
    const onLayoutChange = useCallback((layout) => {
        if (!onDefinition || !definitionInternal) {
            return;
        }
        // The passed in definition could be immutable, so we need to clone it
        const newDefinition = JSON.parse(JSON.stringify(definitionInternal));
        newDefinition.meta = newDefinition.meta || {};
        newDefinition.meta.layouts = newDefinition.meta.layouts || {};
        const reactGridLayout = {
            docs: "https://www.npmjs.com/package/react-grid-layout",
            props: {
                cols,
                margin,
                rowHeight,
                containerPadding,
            },
            layout,
        };
        newDefinition.meta.layouts["react-grid-layout"] = reactGridLayout;
        onDefinition(newDefinition);
    }, [onDefinition, definitionInternal]);
    if (error) {
        if (ErrorWrapper) {
            return _jsx(ErrorWrapper, { error: error });
        }
        else {
            return _jsxs("div", { children: ["Error: ", `${error}`] });
        }
    }
    return (_jsx(ResizingGridLayout, { layout: layout, 
        // isBounded={grid.bounded}
        isDraggable: true, isResizable: true, className: "layout", cols: cols, containerPadding: containerPadding, 
        // rowHeight={grid.rowHeight}
        rowHeight: rowHeight, margin: margin, onLayoutChange: onLayoutChange, children: !metapageInternal
            ? []
            : Object.keys(metapageInternal.getMetaframes()).map((metaframeId, i) => Wrapper ? (_jsx(Wrapper, { children: _jsx(MetaframeIframe, { metaframe: metapageInternal.getMetaframes()[metaframeId], height: `${rowHeight * layout.find((v) => v.i === metaframeId).h}px` }, metaframeId) }, metaframeId)) : (_jsx("div", { children: _jsx(MetaframeIframe, { height: `${rowHeight * layout.find((v) => v.i === metaframeId).h}px`, metaframe: metapageInternal.getMetaframes()[metaframeId] }, metaframeId) }, metaframeId))) }));
};
