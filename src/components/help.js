import { h, Component } from 'preact';

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

export default class HelpCard extends Component {

    loadMetapageJson = () => {
		// preact pre-rendering with node
        if (typeof window === "undefined") {
			return;
        }
        const metapageJsonString = typeof window !== "undefined" ? window.document.getElementById("text:metapage.json").value : null;
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
        }
    }

    onKeyDown = (e) => {
        console.log(`keyCode=${event.keyCode}`);
        if (event.keyCode === 13) {
            this.loadMetapageJson();
        }
    }

	render(props) {
        const examples = [
            'https://metapages.org/metapages/linked-molecule-viewers/metapage.json',
            'https://metapages.org/metapages/dynamic-plot/metapage.json',
        ]
        .map((url) => `${typeof window !== "undefined" ? window.location.origin : ""}/#url=${url}`)
        .map((url) => <div class="siimple-list-item"><a href={url} class="siimple-link">{url}</a></div>);
        
        
        // <div class="siimple-btn" onClick={() => {props.setHashParameter('url', exampleUrl)}} >{exampleUrl}</div>);


        // <a href={urlExampleMetapageJsonAsHash} class="siimple-link">{urlExampleMetapageJsonAsHash}</a>

		const urlExampleMetapageJsonAsHash = typeof window !== "undefined"
			? `${window.location.origin}/#url=https://metapages.org/metapages/dynamic-plot/metapage.json`
			: null;

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