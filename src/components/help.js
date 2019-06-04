import { h, Component } from 'preact';

export default class HelpCard extends Component {
	render(props) {
        // const examples = [
        //     'https://metapages.org/metapages/linked-molecule-viewers/metapage.json',
        //     'https://metapages.org/metapages/dynamic-plot/metapage.json',
        // ].map((exampleUrl) => <div class="siimple-btn" onClick={() => {props.setUrl(exampleUrl)}} >{exampleUrl}</div>);

        const urlExampleMetapageJsonAsHash = typeof window !== "undefined" ? `${window.location.origin}/#url=https://metapages.org/metapages/dynamic-plot/metapage.json` : null;
		return (
            <div class="siimple-card">
                <div class="siimple-card-header">
                    <a href="https://metapages.org/" class="siimple-link">Metapage</a> viewer
                </div>
                
                <div class="siimple-card-body">  
                    This website takes a <a href="https://metapages.org/api/#metapagedefinition" class="siimple-link">metapage definition</a> and constructs the metapage application.
                </div>

                {/* <div class="siimple-rule"></div> */}

                <div class="siimple-card">
                    <div class="siimple-card-header">
                        The <a href="https://metapages.org/api/#metapagedefinition" class="siimple-link">metapage definition</a> can be given as a hash parameter (<code class="siimple-code">#url=?</code>):
                    </div>
                    <div class="siimple-card-body">
                        {/* <a href={urlExampleMetapageJsonAsHash} class="siimple-link">{urlExampleMetapageJsonAsHash}</a> */}
                        <blockquote class="siimple-tip siimple-tip--primary">
                            <a href={urlExampleMetapageJsonAsHash} class="siimple-link">{urlExampleMetapageJsonAsHash}</a>
                        </blockquote>
                    </div>
                </div>

            </div>
        );
	}
}
