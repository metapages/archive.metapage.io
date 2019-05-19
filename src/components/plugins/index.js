import { h, Component } from 'preact';

class PluginPanel extends Component {

    state = {
        metaframe: null,
    }

    componentDidMount() {
		this.load(this.props.url);
    }

    load = async () => {

    }
//<div class="siimple-spinner siimple-spinner--primary"></div>
    render(props, state) {
        if (!state.metaframe) { // not yet loaded
            const cls = `siimple-tabs-item ${props.index == 0 ? "siimple-tabs-item--selected" : ""}`;
            return <div class={cls}>
                <p>foo</p>
                <p>{this.props.url}</p>
            </div>
        }
        
    }
}


// let response;
// 			try {
// 				response = await fetch(url);
// 			} catch (err) {
// 				result.alert = { level: 'error', message: `Failed to load #url ${err}`};
// 			}
// 			try {
// 				if (response) {
// 					const metapageDefinition = await response.json();
// 					result.metapageDefinition = metapageDefinition;
// 				}
// 			} catch (err) {
// 				result.alert = { level: 'error', message: `Failed to parse metapage JSON: ${err}`};
// 			}




// This does not have mechanisms to show/hide, assumed a parent component does that
class PluginsPanel extends Component {

    state = {
        selected: 0,
    };

    componentDidMount() {
		this.load();
    }

    load = async () => {

    }

    generateChildTabs = (urls) => {
        return urls.map((url, index) => {
            return <PluginPanel url={url} index={index} />
        });
		// return urls.map((url, index) => {
        //     const cls = `siimple-tabs-item${index == this.state.selected ? " siimple-tabs-item--selected" : ""}`;
        //     const selectThis = () => {this.setState({selected:index})};
        //     return <div class={cls} onClick={selectThis}>
        //         Tab {index}
        //     </div>
        // });
    }

    render(props) {
        // TODO get the metapage itself, not the definition
        // otherwise it's too much parsing the definition all
        // over the place, instead of making the same function call
        // eg metapage.getPlugins()
        const plugins = props.plugins;
        if (!plugins) {
            return <div>no plugins</div>;
        }
        console.log('plugins', plugins);


        
        return <div class="siimple-tabs siimple-tabs--boxed">
            {this.generateChildTabs(plugins)}
        </div>
	}
}

export default class Plugins extends Component {
    
	state = {
        open: false,
    };
    
    open = () => {
		this.setState({open:true});
    }

    close = () => {
		this.setState({open:false});
    }

	render(props) {
        // TODO get the metapage itself, not the definition
        // otherwise it's too much parsing the definition all
        // over the place, instead of making the same function call
        // eg metapage.getPlugins()
        const metapageDefinition = props.definition;
        if (!metapageDefinition || !metapageDefinition.meta || !metapageDefinition.meta.plugins) {
            return <div>no plugins</div>;
        }

        const plugins = metapageDefinition.meta.plugins;

        const modelStyle = this.state.open ? "display:;" : "display:none;";
        // It's an invisible modal, the plugin iframes are still part of the dom, so still connected
        // style="max-width:300px"
        return <div class="siimple-card">
            <div class="siimple-card-header">
                Plugins
            </div>
            <div class="siimple-card-body">
                <PluginsPanel plugins={plugins}></PluginsPanel>
                
            </div>
        </div>;
    }
}

{/* <div class="siimple-btn siimple-btn--primary" onClick={this.open} >Show</div>

<div class="siimple-modal siimple-modal--medium" id="modal" style={modelStyle}>
    <div class="siimple-modal-content">
        <div class="siimple-modal-header">
            <div class="siimple-modal-header-title">Plugins</div>
            <div class="siimple-modal-header-close" id="modal-close" onClick={this.close} ></div>
        </div>
        <div class="siimple-modal-body">
            <PluginsPanel plugins={plugins}></PluginsPanel>
        </div>
    </div>
</div> */}

