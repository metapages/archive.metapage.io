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
