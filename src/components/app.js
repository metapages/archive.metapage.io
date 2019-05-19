import { h, Component } from 'preact';
import { Metapage } from 'metapage';
import Header from './header';
import HelpCard from './help';
import Alert from './alert';
import MetapageView from './view_metapage';
// import Plugins from './plugins';


const Status = Object.freeze(['loading', 'loaded', 'empty'].reduce((obj, currentVal) => {
	obj[currentVal] = currentVal;
	return obj;
}, {}));

export default class MetapageApp extends Component {
	
	state = {
		alert             : null,   // {level,message}
		metapage          : null,
		metapageDefinition: null,
		params            : {},    // from the URL hash string
		status            : null,   //Status.loading,
		url               : null,
	};

	componentDidMount() {
		window.onhashchange = this.onHashChange;
		this.onHashChange();
	}

	componentWillUnmount() {
		window.onhashchange = null;
	}

	componentDidUpdate(prevProps, prevState) {

	}

	load = async () => {
		if (this.state.metapage) {
			this.state.metapage.dispose();
		}
		this.setState({
			alert             : null,
			metapage          : null,
			metapageDefinition: null,
			status            : Status.loading,
		});
		
		if (Object.keys(this.state.params).length == 0) {
			// This will show the help
			this.setState({status:Status.empty});
			return;
		}
		try {
			const loadState = await this.getMetapageDefinitionFromParams(this.state.params);
			this.setState(loadState);

			const metapageDefinition = loadState.metapageDefinition;

			let metapage = null;
			if (metapageDefinition) {
				try {
					metapage = Metapage.from(metapageDefinition);
					//TODO later
					// document.location.hash = 'base64=' + btoa(unescape(encodeURIComponent(JSON.stringify(metapageDef))));
					this.setState({metapage: metapage});
				} catch(err) {
					this.setState({
						alert : {level: 'error', message: `Failed to load metapage object: ${err}`},
					});
				}
			}

			this.setState({
				status: Status.loaded,
			});
			
		} catch(err) {
			this.setState({
				alert : {level: 'error', message: err},
				status: Status.loaded,
			});
		}
	}

	onHashChange = () => {
		// console.log('onhashchanage', window.location.hash);
		this.setState({params: this.getHashParameters()});
		this.load();
	}

	setHashParameter = (key, val) => {
		let hash = document.location.hash;
		if (hash.startsWith('#')) {
			hash = hash.substr(1);
		}
		let tokens = hash.split('&');
		let found = false;
		for (let i = 0; i < tokens.length; i++) {
			const token = tokens[i];
			const keyVal = token.split('=');
			if (keyVal[0] == key) {
				tokens[i] = `${key}=${val}`;
				found = true;
				break;
			}
		}
		if (!found) {
			tokens.push(`${key}=${val}`);
		}
		tokens = tokens.filter(token => token.length > 1);
		document.location.hash = tokens.join('&');
	}

	removeHashParameter = (key) => {
		let hash = document.location.hash;
		if (hash.startsWith('#')) {
			hash = hash.substr(1);
		}
		let tokens = hash.split('&').filter((token) => {
			const keyVal = token.split('=');
			return keyVal[0] != key;
		});
		document.location.hash = tokens.join('&');
	}

	getHashParameters = () => {
		const hash = document.location.hash;
		// console.log('hash', hash);
		if (hash.length < 3) {
			//TODO set state to mean the page is empty, and probably show the docs
			return null;
		}
		const tokens = hash.substr(1).split('&');
		const params = {};
		tokens.forEach((token) => {
			const keyVal = token.split('=');
			params[keyVal[0]] = keyVal[1] || true;
		});
		return params;
	}

	setUrl = (url) => {
		this.setHashParameter('url', url);
	}

	getMetapageDefinitionFromParams = async (hashParams) => {
		const result = {
			alert             : null,
			metapageDefinition: null,
		}
		let url = hashParams['url'];
		if (url) {
			console.log('raw url', url);
			if (!url.endsWith('.json')) {
				if (!url.endsWith('/')) {
					url += '/';
				}
				url += 'metapage.json';
			}
			console.log('final url', url);
			this.setState({
				alert : {level: 'primary', message: `loading url: ${url}`},
				url   : url,
			});
			// console.log(`loading ${url}`);
			let response;
			try {
				response = await fetch(url);
			} catch (err) {
				result.alert = { level: 'error', message: `Failed to load #url ${err}`};
			}
			try {
				if (response) {
					const metapageDefinition = await response.json();
					result.metapageDefinition = metapageDefinition;
				}
			} catch (err) {
				result.alert = { level: 'error', message: `Failed to parse metapage JSON: ${err}`};
			}
		}
		return result;
	}

	getHelp = () => {
		return <HelpCard setUrl={this.setUrl}/>;
	}

	getAlert = () => {
		return this.state.alert ? <Alert {...this.state.alert} /> : null;
	}

	render() {
		switch(this.state.status) {
			case Status.loading: { 
				const alert = this.getAlert();
				return <div class="siimple-list" style="max-width:600px;">
					<div class="siimple-list-item">{alert}</div>
					<div class="siimple-spinner siimple-spinner--primary"></div>
				</div>;
			} 
			case Status.loaded: {
				if (this.state.alert) {
					const alert = this.getAlert();
					return <div class="siimple-list" style="max-width:600px;">
						<div class="siimple-list-item">{alert}</div>
						<div class="siimple-list-item">{this.getHelp()}</div>
					</div>
				}

				const metapage = this.state.metapage;
				const metapageDefinition = this.state.metapageDefinition;
				// console.log('loaded metapage', metapage);
				// console.log('loaded metapageDefinition', metapageDefinition);
				// No data? Show the help then.
				if (!metapage) {
					return this.getHelp();
				}
				//<Plugins definition={metapageDefinition} />
				const header = this.state.params['header'] == '0' ? null : <Header definition={metapageDefinition} url={this.state.url} />;
				return (
					<div id="app">
						{header}
						<MetapageView definition={metapageDefinition} metapage={metapage} setUrl={this.setUrl} />
					</div>
				);
			}
			case Status.empty: {
				return <div class="siimple-list" style="max-width:600px;">
					<div class="siimple-list-item"><Alert level="primary" message="No metapage definition" /></div>
					{this.getHelp()}
				</div>;
			}
			default: {
				const alert = this.getAlert();
				return <div class="siimple-list" style="max-width:600px;">
					<div class="siimple-list-item">{alert}</div>
					{this.getHelp()}
				</div>;
			} 
		}
	}
}
