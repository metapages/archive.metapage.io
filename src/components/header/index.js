import { h, Component } from 'preact';
import { Plugin } from '../plugin';

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

// const get

// props: metapage, definition, url
export default class Header extends Component {

	render(props) {
		for (var i = 0; i < RequiredProps.length; i++) {
			var propName = RequiredProps[i];
			if (!props[propName]) {
				return <div class="siimple-alert siimple-alert--error">
					Header is missing: {propName}
				</div>;
			}
		}

		const plugins = !props.definition.plugins ? null
			: props.definition.plugins.map((url) => {
				return <Plugin id={url} url={url} metapage={props.metapage} />;
				// return <a class="siimple-navbar-item" id={url} href={url}>{url}</a>;
			});

		return <div class="siimple-navbar">
			<div class="siimple-navbar-title">{getMetapageName(props)}</div>
			<div class="siimple--float-right">
				{plugins}
			</div>
		</div>;


		// return <header >
		// 	<h1>{getMetapageName(props)}</h1>
		// </header>
	}
};
