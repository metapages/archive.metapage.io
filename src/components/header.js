import { h, Component } from 'preact';
import { PluginPanel } from './plugin-panel';

const RequiredProps = ['definition', 'metapage'];

const getMetapageName = ({definition, url}) => {
	const meta = definition ? definition.meta : null;
	const nameString = meta && meta.name ?
		meta.name
		:
		(url ? url : 'Metapage Application');
	if (url) {
		return <a href={url}>{nameString}</a>;
	} else {
		return nameString;
	}
}

// props: metapage, definition, url
export default class Header extends Component {

	state = {
		pluginDefinitions: null,
		selectedIndex    : -1,
	}

	componentDidMount() {
		// load the plugin definitions (async) so we can show
		// the plugin names

		if (this.props.metapage && this.props.definition && this.props.definition.plugins) {
			const pluginDefinitions = {};
			const metapage = this.props.metapage;
			const promises = metapage.getPluginIds().map((url) => {
				return metapage.getPlugin(url).getDefinition()
					.then((metaframeDefinition) => {
						pluginDefinitions[url] = metaframeDefinition;
					});
			});
			Promise.all(promises)
				.then(() => {
					this.setState({pluginDefinitions});
				});
		} else {
			this.setState({pluginDefinitions:{}}); // means loaded
		}
	}

	getPluginTabs = () => {
		const pluginDefinitions = this.state.pluginDefinitions;
		if (!pluginDefinitions) {
			return <div class="siimple-spinner siimple-spinner--primarysiimple--float-right"></div>;
		}

		const pluginKeys = this.props.metapage.getPluginIds();//Object.keys(pluginDefinitions);

		if (pluginKeys.length == 0) {
			return null;
		}

		const elements = pluginKeys.map((pluginId) => {
			const pluginMetaframeDefinition = pluginDefinitions[pluginId];

			// TODO process version when needed
			const pluginMetadata = pluginMetaframeDefinition.metadata;

			if (pluginMetadata && pluginMetadata.name) {
				return pluginMetadata.name;
			} else if (pluginMetadata && pluginMetadata.title) {
				return pluginMetadata.title;
			} else {
				// what should I use as the short link name?
				// the last part of the url
				if (typeof window !== "undefined") {
					const url = new URL(pluginId);
					if (url.pathname.length > 1) {
						return url.pathname.split('/')[url.pathname.split('/').length - 1];
					} else { // no path, then just the domain
						return url.host.replace('www.', '');
					}
				} else {
					return null;
				}
			}
		})
		.map((tabName, index) => {
			const onClick = () => {
				this.setState({selectedIndex: this.state.selectedIndex == index ? -1 : index});
			};
			let cls = "siimple-tabs-item siimple--float-right";
			if (index == this.state.selectedIndex) {
				cls += " siimple-tabs-item--selected";
			}
			return <div class={cls} onClick={onClick}>{tabName}</div>;
		});

		return (
			<div class="siimple-tabs siimple-tabs--boxed">
				{elements}
			</div>
		);
	}

	render(props) {
		for (var i = 0; i < RequiredProps.length; i++) {
			var propName = RequiredProps[i];
			if (!props[propName]) {
				return <div class="siimple-alert siimple-alert--error">
					Header is missing: {propName}
				</div>;
			}
		}

		const tabs = this.getPluginTabs();

		return (
			<div>
				<div class="siimple-navbar siimple-navbar--large siimple-navbar--light siimple--clearfix siimple--bg-white siimple--px-0 siimple--mx-0" style={{maxWidth:'100%'}}>
					<div class="siimple-navbar-title siimple--float-left siimple--pl-3">{getMetapageName(props)}</div>
					{tabs}					
				</div>
				<div>
					<PluginPanel selected={this.state.selectedIndex} metapage={props.metapage} definition={props.definition} />
				</div>
			</div>
		);
	}
};
