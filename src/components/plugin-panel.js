import { h, Component } from 'preact';
import Metaframe from './metaframe';

// NOT TRUE: This does not have mechanisms to show/hide, assumed a parent component does that
// props: metapage, definition
export class PluginPanel extends Component {

    render({metapage, definition, selected}) {

        const pluginUrls = metapage.getPluginIds();
        const plugins = pluginUrls.map((url, index) => {
            const styleHidden = index == selected ? {maxHeight:"300px", height:"300px", display:""} : {display:'none'};
            const pluginMetaframe = metapage.getPlugin(url);
            const metaframeContainer = <div class="siimple-card-body">
                <Metaframe id={url} iframe={pluginMetaframe.iframe} style={{maxHeight:"280px", height:"280px"}}/>
            </div>;

            return (
                <div class="siimple-card" id={url} style={styleHidden}>
                    {metaframeContainer}
                </div>
            );
        });

        const rule = selected > -1 ? <div class="siimple-rule siimple--mb-5"></div> : null;

        // TODO get the metapage itself, not the definition
        // otherwise it's too much parsing the definition all
        // over the place, instead of making the same function call
        return (
            <div id="PluginPanel">
                {plugins}
                {rule}
            </div>
        );
	}
}
