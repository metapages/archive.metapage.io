import './style/iframes';
import 'siimple';
import 'flexboxgrid';
import { h, render } from "preact";
import { App } from './components/App';

render(<App />, document.getElementById("root")!);
