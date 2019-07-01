import { Component, h } from 'preact';

import Metaframe from './metaframe';

const getLayout = (metapageDefinition, layoutName) => {
	if (metapageDefinition == null || metapageDefinition.meta == null || metapageDefinition.meta.layouts == null) {
		return null;
	}
	return metapageDefinition.meta.layouts[layoutName];
}

/**
 * If there is no layout, just dump the metaframes
 * in a simple grid, without caring about the order
 * "layouts": {
      "flexboxgrid" : {
        "version": 1,
        "docs": "http://flexboxgrid.com/",
        "layout": [
          [ {"name":"input-button", "width":"col-xs-4", "style": {"maxHeight":"400px"}}, {"url":"http://localhost:4000/metaframes/passthrough-arrow/?rotation=90", "width":"col-xs-2"}, {"name":"viewer1", "width":"col-xs-6"} ],
          [ {"name":"passthrough2", "width":"col-xs-6"}, {"name":"passthrough1", "width":"col-xs-6", "style": {"maxHeight":"100px"}} ],
          [ {"name":"viewer2", "width":"col-xs-6", "style": {"maxHeight":"400px"}} , {"name":"viewer3", "width":"col-xs-6"} ]
        ],
        "options": {
          "arrows": true
        }
      }
    }
 */
const generateDefaultLayout = (metapage) => {
	const metaframeIds = metapage.getMetaframeIds();
	let columns = 2;
	if (metaframeIds.length < 2) {
		columns = 1;
	}
	metaframeIds.sort();
	const result = [];
	let rowIndex = 0;
	let colIndex = 0;
	while(metaframeIds.length > 0) {
		if (colIndex >= columns) {
			colIndex = 0;
			rowIndex++;
		}
		if (!result[rowIndex]) {
			result[rowIndex] = [];
		}
		result[rowIndex].push({name:metaframeIds.pop(), width:'col-xs', style:{}});
		colIndex++;
	}
	return {layout:{layout:result}, layoutName:'flexboxgrid'};
}

/**
 * Generate the virtual dom of the layed out metaframes
 * @param {*} layout 
 * @param {*} metapage 
 *    "meta": {
 *      "plugins": [],
 *      "layouts": {
 *        "flexboxgrid" : {
 *          "version": 1,
 *          "docs": "http://flexboxgrid.com/",
 *          "layout": [
 *            [ {"name":"input-button", "width":"col-xs-4", "height": "200px"}, {"name":"viewer1", "width":"col-xs-8"}  ],
 *            [ {"name":"passthrough1", "width":"col-xs-6", "height": "100px"}, {"name":"viewer2", "width":"col-xs-4"} ],
 *            [ {"name":"passthrough2", "width":"col-xs-4", "height": "300px"}, {"name":"viewer3", "width":"col-xs-4"} ]
 *          ],
 *          "options": {
 *            "arrows": true
 *          }
 *        }
 *      }
 *    }
 */
const getFlexboxRowElementMetaframe = (params) => {
	var {rowElement, metaframes, defaultRowStyle} = params;
	if (!metaframes) {
		return <div class="siimple-alert siimple-alert--error">
			Missing metaframes parameter
		</div>;
	}

	defaultRowStyle = defaultRowStyle ? defaultRowStyle : {};
	const metaframeId = rowElement.name;

	if (!metaframes[metaframeId]) {
		return <div class="siimple-alert siimple-alert--error">
			Missing metaframe: {metaframeId}
		</div>;
	}

	const colClass = rowElement.width ? rowElement.width : 'col-xs';
	const itemStyle = rowElement.style ? rowElement.style : defaultRowStyle;
	const classes = `siimple-card ${colClass}`;
	const header = <div class="siimple-card-header">{metaframeId}</div>;
	const id = `siimple-card-${metaframeId}`;
	
	itemStyle['overflowY'] = 'hidden';
	const metaframeContainer = <div class="siimple-card-body siimple--mx-0 siimple--my-0 siimple--px-0 siimple--py-0" style={itemStyle}  >
		<Metaframe id={metaframeId} iframe={metaframes[metaframeId].iframe} style={itemStyle} />
	</div>;
	return header ?
		(<div class={classes} id={id} >
			{header}
			{metaframeContainer}
		</div>)
		:
		(<div class={classes} id={id}  >
			{metaframeContainer}
		</div>);
}

// This iframe is sandboxed
const getFlexboxRowElementUrl = (params) => {
	var {rowElement, defaultRowStyle} = params;
	var {url, width, style} = rowElement;
	const colClass = width ? width : 'col-xs';
	style = style ? style : defaultRowStyle;
	return (
		<div id={url} class={colClass}>
			<div class="iframe-container" style={style}>
				<iframe src={url} sandbox="allow-scripts"></iframe>
			</div>
		</div>);
}

const getFlexboxRowElement = (params) => {
	if (params.rowElement.url) {
		return getFlexboxRowElementUrl(params);
	} else {
		return getFlexboxRowElementMetaframe(params);
	}
}

const applyLayout = (name, layout, metapage) => {
	name = name ? name : 'flexboxgrid';
	const metaframes = metapage.metaframes();
	
	switch(name) {
		case 'flexboxgrid':
			// TODO process version when needed
			return layout.layout.map((layoutRow) => {

				let defaultRowStyle = layoutRow.reduce((curStyle, rowElement) => {
					return curStyle ? curStyle : rowElement.style;
				}, null);

				const rowElements = layoutRow.map((rowElement) => {
					return getFlexboxRowElement({rowElement, metaframes, defaultRowStyle});
				});
				return (
					<div class="row">
						{rowElements}
					</div>);
			});
		default:
			throw `Unknown layout: ${name}`;
	}
}

export default class ViewMetapage extends Component {

	componentDidMount() {
		// load the plugin definitions (async) so we can show
		// the plugin names

		if (this.props.metapage) {
			const metapage = this.props.metapage;
			metapage.on('definition', ({definition}) => {
				this.setState({ definition });
			});
		} else {
			this.setState({definition: null}); // means loaded
		}
	}
	
	render({metapage}, {definition}) {
		if (!definition) {
			return null;
		}
		if (!metapage) {
			return null;
		}
		let layoutName = 'flexboxgrid';
		let layout = getLayout(definition, layoutName);
		if (!layout) {
			console.log(`no layout, generating default layout="${layoutName}"`);
			({layoutName, layout} = generateDefaultLayout(metapage));
		}

		var metaframesArranged = applyLayout(layoutName, layout, metapage)
		
		return (
			<div class="siimple-grid">
                {metaframesArranged}
			</div>
		);
	}
}
