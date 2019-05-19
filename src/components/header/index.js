import { h } from 'preact';

const getMetapageName = ({definition, url}) => {
	const meta = definition ? definition.meta : null;
	return meta && meta.name ?
		meta.name
		:
		(url ? url : 'Metapage Application');
}

const Header = (props) => {
	return <header >
		<h1>{getMetapageName(props)}</h1>
	</header>
};

export default Header;
