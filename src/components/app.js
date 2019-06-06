/**
 * Data flow:
 *  - if hash parameter "url" for a url to a metapage.json file
 * 		- if there, load it
 * 		- if an error, show the error at the top 
 *  - elseif check hash parameter "base64" for an encoded metapage json blob
 * 		- if there, load it
 * 		- if an error, show the error at the top
 * 		- also show the json in the help text box
 *  - else show the help 
 */

import { h, Component } from 'preact';
import { Metapage } from 'metapage';
import Header from './header';
// import HelpCard from './help';
import Alert from './alert';
import MetapageView from './view_metapage';

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
	}
}, null, "  ");

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


	// document.location.hash = tokens.join('&');
}

// const removeHashParameter = (key) => {
// 	let hash = document.location.hash;
// 	if (hash.startsWith('#')) {
// 		hash = hash.substr(1);
// 	}
// 	let tokens = hash.split('&').filter((token) => {
// 		const keyVal = token.split('=');
// 		return keyVal[0] != key;
// 	});
// 	document.location.hash = tokens.join('&');
// }

const getHashParameters = () => {
	const hash = document.location.hash;
	// console.log('hash', hash);
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

// const getHashParameters = () => {
// 	const hash = document.location.hash;
// 	// console.log('hash', hash);
// 	if (hash.length < 3) {
// 		//TODO set state to mean the page is empty, and probably show the docs
// 		return null;
// 	}
// 	const tokens = hash.substr(1).split('&');
// 	const hashParams = {};
// 	tokens.forEach((token) => {
// 		const keyVal = token.split('=');
// 		hashParams[keyVal[0]] = keyVal[1] || true;
// 	});
// 	return hashParams;
// }

// const setHashParamUrl = (url) => {
// 	setHashParameter('url', url);
// }

// const setUrl = (url) => {
// 	setHashParameter('url', url);
// }

export default class MetapageApp extends Component {
	
	state = {
		alert             : null,   // {level,message}
		metapage          : null,
		metapageDefinition: null,
		nonce_loading     : null,
		params            : {},     // from the URL hash string
		status            : Status.loading,   //Status.loading,
		url               : null,
	};

	componentDidMount() {
		// window.onhashchange = this.onHashChange;
		// this.onHashChange();
		window.onhashchange = this.load;
		this.load();
	}

	componentWillUnmount() {
		window.onhashchange = null;
	}

	// onHashChange = () => {
	// 	console.log('onHashChange');
	// 	// this.setState({
			
	// 	// });
	// 	this.load();
	// }

	load = async () => {
		if (this.state.metapage) {
			this.state.metapage.dispose();
		}

		// if load is called again, the async portion of this will be cancelled
		const nonce = createNonce();

		this.setState({
			alert             : null,
			nonce_loading     : nonce,
			metapage          : null,
			metapageDefinition: null,
			params            : getHashParameters(),
			status            : Status.loading,
		});
		
		if (!this.state.params || Object.keys(this.state.params).length == 0) {
			// This will show the help
			console.log('empty state.params');
			console.log(getHashParameters());
			this.setState({status:Status.help});
			return;
		}
		try {
			const loadState = await this.getMetapageDefinitionFromParams(this.state.params); // { alert, metapageDefinition }
			if (this.state.nonce_loading != nonce) {
				console.log('Cancelling previous loading definition');
				return;
			}
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

	getMetapageDefinitionFromParams = async (hashParams) => {
		const result = {
			alert             : null,
			metapageDefinition: null,
		}
		
		if (hashParams['url']) {
			let url = hashParams['url'];
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
		} else if (hashParams['base64']) {
			const base64String = hashParams['base64'];
			const metapageJsonString = atob(decodeURIComponent(base64String))
			console.log('final metapageJsonString decoded', metapageJsonString);
			try {
				result.metapageDefinition = JSON.parse(metapageJsonString);
			} catch(err) {
				result.alert = { level: 'error', message: `Failed to decode #base64 ${err}`};
			}
		}
		return result;
	}

	loadMetapageJson = () => {
        const metapageJsonString = document.getElementById("text:metapage.json").value;
        console.log(metapageJsonString);
        try {
            // try to parse the JSON string
            JSON.parse(metapageJsonString);
            this.props.setHashParameter('base64', btoa(encodeURIComponent(metapageJsonString)));
        } catch(err) {
            // do something fancier there
            this.props.setState({
                alert : {level: 'error', message: `Failed to parse JSON: ${err}`},
            });
            // console.error(err);
        }
        // document.location.hash = 'base64=' + btoa(unescape(encodeURIComponent(JSON.stringify(metapageDef))));
        
    }

    onKeyDown = (e) => {
        console.log(`keyCode=${event.keyCode}`);
        if (event.keyCode === 13) {
            this.loadMetapageJson();
        }
    }

	// getHelp = () => {
	// 	return <HelpCard setHashParameter={setHashParameter} setState={this.setState} />;
	// }

	getAlert = () => {
		return this.state.alert ? <Alert {...this.state.alert} /> : null;
	}

	render() {
		switch(this.state.status) {
			case Status.loading: { 
				return this.renderStatusLoading();
			} 
			case Status.loaded: {
				return this.renderStatusLoaded();
			}
			case Status.help: {
				return this.renderStatusHelp();
			}
			default: {
				throw `Uknown status: ${this.state.status}`;
			} 
		}
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

		//<Plugins definition={metapageDefinition} />
		const header = this.state.params['header'] == '0' ? null : <Header definition={metapageDefinition} metapage={metapage} url={this.state.url} />;
		return (
			<div id="app">
				{header}
				<MetapageView definition={metapageDefinition} metapage={metapage} setHashParameter={this.setHashParameter} />
			</div>
		);
	}

	renderMain = () => {
        const examples = [
            'https://metapages.org/metapages/linked-molecule-viewers/metapage.json',
            'https://metapages.org/metapages/dynamic-plot/metapage.json',
        ]
        .map((url) => `${window.location.origin}/#url=${url}`)
        .map((url) => <div class="siimple-list-item"><a href={url} class="siimple-link">{url}</a></div>);
        
        
        // <div class="siimple-btn" onClick={() => {props.setHashParameter('url', exampleUrl)}} >{exampleUrl}</div>);


        // <a href={urlExampleMetapageJsonAsHash} class="siimple-link">{urlExampleMetapageJsonAsHash}</a>

        const urlExampleMetapageJsonAsHash = typeof window !== "undefined" ? `${window.location.origin}/#url=https://metapages.org/metapages/dynamic-plot/metapage.json` : null;

		return (
            <div class="siimple-card">
                <div class="siimple-card-header">
                    <a href="https://metapages.org/" class="siimple-link">Metapage</a> viewer
                </div>
                
                <div class="siimple-card-body">  
                    Provide a <a href="https://metapages.org/api/#metapagedefinition" class="siimple-link">metapage definition</a> and this app will build the application. The definition can be provided in the URL hash parameters one of two ways::
                </div>

                <div class="siimple-card">
                    
                    <div class="siimple-card-body">
                    <label class="siimple-label">(<code class="siimple-code">#url=?</code>) pointing to the location of the metapage.json, e.g.:</label><br/>
                        <a href={urlExampleMetapageJsonAsHash} class="siimple-link">{urlExampleMetapageJsonAsHash}</a>
                    </div>
                </div>

                <div class="siimple-card">
                    <div class="siimple-card-body">
                        <label class="siimple-label">(<code class="siimple-code">#base64=?</code>) containing the base64 encoded metapage JSON:</label><br/>
                        <textarea id="text:metapage.json" class="siimple-textarea siimple-textarea--fluid" rows="5" onKeyDown={this.onKeyDown}>
                        {exampleJson}
                        </textarea>
                        <div class="siimple-btn siimple-btn--primary" onClick={this.loadMetapageJson} >Load</div>
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
        );
	}

}
