import { h, Component } from 'preact';

const RequiredProps = ['url', 'id', 'metapage'];

// props: url, metapage, maxHeight, id (==url)
export default class Plugin extends Component {
    
	// ensures the metaframe iframes aren't messed with
	// tells Virtual DOM rendering/diffing algorithm that it shouldn't try to undo any external DOM mutations
	shouldComponentUpdate = () => false;
	
	componentDidMount() {
        // now mounted, can freely modify the DOM:
        const metapage = this.props.metapage;
        if (!metapage) {
            return;
        }
        const url = this.props.url;
        if (!url) {
            return;
        }
        const pluginMetaframe = metapage.getPlugin(url);
        if (!pluginMetaframe) {
            return;
        }
		if (pluginMetaframe && (pluginMetaframe instanceof Node)) {
			if (this.props.style && this.props.style.maxHeight) {
				iframe.style.maxHeight = this.props.style.maxHeight;
			}
			this.base.appendChild(pluginMetaframe);
		}
	}
	
	render(props) {
        // Validation, show error if missing
        for (var i = 0; i < RequiredProps.length; i++) {
            var propName = RequiredProps[i];
            if (!props[propName]) {
                return <div class="siimple-alert siimple-alert--error">
                    Plugin class is missing prop: {propName}
                </div>;
            }
        }

        const url = props.url;

		if (!props.metapage.getPlugin(url)) {
			return <div class="siimple-alert siimple-alert--error">
				No plugin for url: {url}
			</div>;
        }

		const id = `iframe-container-${props.id}`;
		return <div class="iframe-container" id={id} style={props.style}> {warning} </div>;
	}
}
