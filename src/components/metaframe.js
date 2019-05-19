import { h, Component } from 'preact';

export default class Metaframe extends Component {
    
	// ensures the metaframe iframes aren't messed with
	// tells Virtual DOM rendering/diffing algorithm that it shouldn't try to undo any external DOM mutations
	shouldComponentUpdate = () => false;
	
	componentDidMount() {
		// now mounted, can freely modify the DOM:
		const iframe = this.props.iframe;
		if (iframe && (iframe instanceof Node)) {
			if (this.props.style && this.props.style.maxHeight) {
				iframe.style.maxHeight = this.props.style.maxHeight;
			}
			this.base.appendChild(iframe);
		}
	}
	
	render(props) {
		if (!props.id) {
			return <div class="siimple-alert siimple-alert--error">
				Metaframe class is missing id prop
			</div>;
		}
		if (!props.iframe) {
			return <div class="siimple-alert siimple-alert--error">
				Missing iframe for {props.id}
			</div>;
		}
		if (!(props.iframe instanceof Node)) {
			return <div class="siimple-alert siimple-alert--error">
				iframe is not a Node
			</div>;
		}

		// Optionally show a warning instead of the metaframe if missing required configuration
		const warning = props.iframe ? null : <div>Missing iframe for {props.id}</div>
		// const style = {
		// 	maxHeight: props.maxHeight ? props.maxHeight : undefined,
		// }
		//style={style}
		const id = `iframe-container-${props.id}`;
		return <div class="iframe-container" id={id} style={props.style}> {warning} </div>;
	}
}

// export default class ViewMetaframe extends Component {
// 	render(props) {
// 		const style = props.style;
// 		// const classes = props.classes;
// 		const metaframe = <Metaframe id={props.id} iframe={props.iframe} maxHeight={props.maxHeight} />
// 		const header = props.displayName ? <div class="siimple-card-header">{props.id}</div> : undefined;
		// console.log('header', header);
		// console.log('props.displayName', props.displayName);
		// If you return an undefined header, it still shows a stupid grey bar
		// const classes = `siimple-card ${props.classes != null ? props.classes : ""}`;
		// return header ?
		// 	(<div class={classes} id={props.id} style={style} >
		// 		{header}
		// 		<div class="siimple-card-body">
		// 			{metaframe}
		// 		</div>
		// 	</div>)
		// 	:
		// 	(<div class={classes} id={props.id} style={style} >
		// 		<div class="siimple-card-body">
		// 			{metaframe}
		// 		</div>
		// 	</div>);
// 	}
// }
