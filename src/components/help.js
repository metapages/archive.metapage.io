import { h, Component } from 'preact';

export default class HelpCard extends Component {
	render(props) {
        const examples = [
            'http://localhost:4000/metapages/dynamic-plot/metapage.json',
            'http://localhost:4000/metapages/linked-molecule-viewers/metapage.json',
        ].map((exampleUrl) => <div class="siimple-btn" onClick={() => {props.setUrl(exampleUrl)}} >{exampleUrl}</div>);
		return (
            <div class="siimple-card" style="max-width:600px">
                <div class="siimple-card-header">
                Documentatation
                </div>
                <div class="siimple-card-body">
                    <div class="siimple-h3">URL hash parameters</div>
                    <pre class="siimple-pre">
                        Example:
                        someurl
                    </pre>
                    <pre class="siimple-pre">
                        url: points to the metapage JSON definition.
                        base64: encoded string of the metapage JSON definition
                    </pre>
                </div>
                <div class="siimple-card-footer">
                    {examples}
                </div>
            </div>
        );
	}
}
