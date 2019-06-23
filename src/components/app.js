/**
 * Data flow:
 *  - if hash parameter "url" for a url to a metapage.json file
 * 		- if there, load it
 * 		- if an error, show the error
 *  - elseif check hash parameter "base64" for an encoded metapage json blob
 * 		- if there, load it
 * 		- if an error, show the error bottom of the text field
 * 		- also show the json in the help text box
 *  - else show the help 
 */

import { h, Component } from 'preact';
import { Metapage } from 'metapage';
import Header from './header';
import Alert from './alert';
import MetapageView from './metapage';

const exampleJson = JSON.stringify({
	"version": "0.3",
	"meta": {
		"layouts": {
		"flexboxgrid" : {
			"docs": "http://flexboxgrid.com/",
			"layout": [
			[ {"name":"random-data-generator", "width":"col-xs-4", "style": {"maxHeight":"600px"}}, {"url":"https://metapages.org/metaframes/passthrough-arrow/?rotation=90", "width":"col-xs-1"}, {"name":"graph-dynamic", "width":"col-xs-7"}  ]
			]
		}
		}
	},
	"metaframes": {
		"random-data-generator": {
		"url": "https://metapages.org/metaframes/random-data-generator/?frequency=1000"
		},
		"graph-dynamic": {
		"url": "https://metapages.org/metaframes/graph-dynamic/",
		"inputs": [
			{
			"metaframe": "random-data-generator",
			"source": "y"
			}
		]
		}
	},
	"plugins": [
		"https://metapages.org/metaframes/mermaid.js/?TITLE=0",
		"https://metapages.org/metaframes/passthrough/",
		"https://metapages.github.io/metaframe-editor-json/"
	]
}, null, "  ");

const examples = [
	'https://metapages.org/metapages/linked-molecule-viewers/metapage.json',
	'https://metapages.org/metapages/dynamic-plot/metapage.json',
]
.map((url) => `${typeof window !== "undefined" ? window.location.origin: ""}/#url=${url}`)
.map((url) => <div class="siimple-list-item"><a href={url} class="siimple-link">{url}</a></div>);

const urlExampleMetapageJsonAsHash = typeof window !== "undefined" ? `${window.location.origin}/#url=https://metapages.org/metapages/dynamic-plot/metapage.json` : null;

const Status = Object.freeze(['loading', 'loaded', 'help'].reduce((obj, currentVal) => {
	obj[currentVal] = currentVal;
	return obj;
}, {}));

const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const randomString = (length) => {
    var text = "";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

const createNonce = () => {
    return randomString(8);
}

const setHashParameter = (key, val) => {
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

	if (history.replaceState) {
		history.replaceState(null, null, `#${tokens.join('&')}`);
	}
	else {
		location.hash = `#${tokens.join('&')}`;
	}
}

const getHashParameters = () => {
	const hash = document.location.hash;
	if (hash.length < 3) {
		//TODO set state to mean the page is empty, and probably show the docs
		return null;
	}
	const tokens = hash.substr(1).split('&');
	const hashParams = {};
	tokens.forEach((token) => {
		const keyVal = token.split('=');
		hashParams[keyVal[0]] = keyVal[1] || true;
	});
	return hashParams;
}

export default class MetapageApp extends Component {
	
	state = {
		alert             : null,   // {level,message}
		base64Text        : null,
		metapage          : null,
		metapageDefinition: null,
		nonce_loading     : null,
		params            : {},     // from the URL hash string
		status            : Status.loading,   //Status.loading,
		url               : null,
	};

	componentDidMount() {
		if (typeof window !== "undefined") {
			window.onhashchange = this.load;
		}
		this.load();
	}

	componentWillUnmount() {
		if (typeof window !== "undefined") {
			window.onhashchange = null;
		}
	}

	load = async () => {
		if (this.state.metapage) {
			this.state.metapage.dispose();
		}

		const hashParams = getHashParameters();

		// Only one hash param allowed, otherwise what to do?
		const moreThanOneParam = hashParams && hashParams['url'] && hashParams['base64'];
		const noParams = !hashParams || Object.keys(hashParams).length == 0;
		if (moreThanOneParam || noParams) {
			this.setState({
				alert             : moreThanOneParam ? "Only one hash param allowed (url or base64)" : null,
				metapage          : null,
				metapageDefinition: null,
				loadResult        : null,
				status            : Status.help,
			});
			return;
		}

		const paramKey = hashParams['url'] ? 'url' : 'base64'; // if more are supported add here

		// if load is called again, the async portion of this will be cancelled
		const nonce = createNonce();
		let loadResult = { // {key:["url"|"base64"|"metaframe"], alert:<null|string>, nonce:<null|string>}
			alert: null,
			key  : paramKey,
			value: hashParams[paramKey],
			nonce,
		};

		this.setState({
			alert             : null,   // <null|string>
			loadResult,
			metapage          : null,
			metapageDefinition: null,
			status            : Status.loading,
		});
		
		const blob = await this.getMetapageDefinitionFromParams(loadResult.key, loadResult.value, nonce); // { alert, metapageDefinition }
		const error = blob.error;
		const metapageDefinition = blob.metapageDefinition;
		if (this.state.loadResult.nonce != nonce) {
			console.log('Cancelling previous loading definition');
			// actually bail out early in this 
			return;
		}
		// make new object so react picks up the state diff
		const newState = {
			loadResult        : Object.assign({}, loadResult),
			metapage          : null,
			metapageDefinition: null,
			status            : Status.loaded,
		};
		if (error) {
			newState.loadResult.alert = { level: 'error', message: error};
		} else if (!metapageDefinition) {
			newState.loadResult.alert = { level: 'error', message: 'No metapage definition found'};
		} else {
			newState.metapageDefinition = metapageDefinition;
			try {
				newState.metapage = Metapage.from(metapageDefinition);
			} catch(err) {
				newState.loadResult.alert = { level: 'error', message: `Failed to create a matapage from the definition: ${err}` };
			}
		}
		this.setState(newState);
	}

	getMetapageDefinitionFromParams = async (key, value, nonce) => {
		const result = {
			error             : undefined,
			metapageDefinition: undefined,
		}
		
		if (key === 'url') {
			let url = value;
			if (!url.endsWith('.json')) {
				if (!url.endsWith('/')) {
					url += '/';
				}
				url += 'metapage.json';
			}
			this.setState({
				loadingResult: {
					alert : {level: 'primary', message: `loading: ${url}`},
					key,
					nonce,
					url,
				},
			});
			try {
				const response = await fetch(url);
				try {
					result.metapageDefinition = await response.json();
				} catch (err) {
					result.error = `Failed to parse metapage JSON: ${err}`;
				}
			} catch (err) {
				result.error = `Failed to load #url ${err}`;
			}
		} else if (key === 'base64') {
			const base64String = value;
			let metapageJsonString;
			try {
				metapageJsonString = atob(base64String);
				this.setState({base64Text:metapageJsonString});
				try {
					result.metapageDefinition = JSON.parse(metapageJsonString);
				} catch(err) {
					result.error = `Failed to JSON.parse #base64: ${err}`;
				}
			} catch(err) {
				result.error = `Not valid base64: ${err}`;
			}
		}
		return result;
	}

	setExampleBase64 = () => {
		this.setState({base64Text:exampleJson});
    }

	setMetapageJsonBase64 = () => {
		// preact pre-rendering with node
		if (typeof window === "undefined") {
			return;
		}
		const metapageJsonString = document.getElementById("text:metapage.json").value;
		setHashParameter('base64', btoa(metapageJsonString));
		this.load();        
    }

	getAlert = (key) => {
		if (!key) {
			return this.state.alert ? <div><Alert {...this.state.alert} /><br/></div> : null;
		} else {
			return this.state.loadResult && this.state.loadResult.key === key && this.state.loadResult.alert
				? <div><Alert {...this.state.loadResult.alert} /><br/></div>
				: null;
		}
	}

	render() {
		// if there's a metapage, we don't care about anything else
		if (this.state.metapage) {
			return this.renderMetapage();
		// the loading status is minimal
		} else if (this.state.status == Status.loading) {
			return this.renderStatusLoading();
		}
		// Otherwise it's the main help page with various alerts etc
		const mainAlert = this.getAlert();
		const alertUrl = this.getAlert('url');
		const alertBase64 = this.getAlert('base64');

		return <div>
				{mainAlert}
				
				<div class="siimple-card">
					<div class="siimple-card-header">
						<a href="https://metapages.org/" class="siimple-link">Metapage</a> viewer
					</div>
					
					<div class="siimple-card-body">  
						Provide a <a href="https://metapages.org/api/#metapagedefinition" class="siimple-link">metapage definition</a> and this app will build the application. The definition can be provided in the URL hash parameters one of two ways:
					</div>

					<div class="siimple-card">
						
						<div class="siimple-card-body">
						<label class="siimple-label">(<code class="siimple-code">#url=?</code>) pointing to the location of the metapage.json, e.g.:</label><br/>
							<a href={urlExampleMetapageJsonAsHash} class="siimple-link">{urlExampleMetapageJsonAsHash}</a>
						</div>
						{alertUrl}
					</div>

					<div class="siimple-card">
						<div class="siimple-card-body">
							<label class="siimple-label">(<code class="siimple-code">#base64=?</code>) containing the base64 encoded metapage JSON:</label>
							<div class="siimple-btn siimple-btn--primary siimple-btn--small" onClick={this.setExampleBase64} >Example</div>
							<br/>
							<textarea id="text:metapage.json" class="siimple-textarea siimple-textarea--fluid" rows={this.state.base64Text != null ? this.state.base64Text.split("\n").length : 5} >
							{this.state.base64Text}
							</textarea>
							<div class="siimple-btn siimple-btn--primary" onClick={this.setMetapageJsonBase64} >Load</div>
							
							{alertBase64}
						</div>
					</div>

					<br/><br/><br/>

					<div class="siimple-card">
						<div class="siimple-card-body">
							<label class="siimple-label">Examples:</label><br/>
							<div class="siimple-list">
								{examples}
							</div>
						</div>
					</div>

				</div>
			</div>
	}

	renderStatusHelp = () => {
		if (this.state.alert) {
			const alert = this.getAlert();
			return <div>
				{alert}
				<br/>
				{this.getHelp()}
			</div>
		} else {
			return this.getHelp();
		}
	}

	renderStatusLoading = () => {

		const alert = this.getAlert();
		return <div class="siimple-list">
			<div class="siimple-list-item">{alert}</div>
			<div class="siimple-spinner siimple-spinner--primary"></div>
		</div>;
	}

	renderStatusLoaded = () => {
		if (this.state.metapage && this.state.metapageDefinition) {
			return this.renderMetapage();
		} else {
			return this.renderStatusHelp();
		}
	}

	renderMetapage = () => {
		const metapage = this.state.metapage;
		const metapageDefinition = this.state.metapageDefinition;

		const header = this.state.params['header'] == '0' ? null : <Header definition={metapageDefinition} metapage={metapage} url={this.state.url} />;
		return (
			<div id="app">
				{header}
				<MetapageView definition={metapageDefinition} metapage={metapage} setHashParameter={setHashParameter} />
			</div>
		);
	}
}
