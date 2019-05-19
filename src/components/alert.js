import { h, Component } from 'preact';

export default class Alert extends Component {
    
	render(props) {
        const message = `${props.message}`;
        let level = `${props.level}`;
        level = level ? level : 'primary';
        const className = `siimple-alert siimple-alert--${level}`;
		return (
            <div class={className}>
                {message}
            </div>
        );
	}
}
