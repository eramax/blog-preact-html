import {
  html,
  Component,
  render
} from "https://unpkg.com/htm/preact/standalone.module.js";
import Router from "https://unpkg.com/preact-router?module";

class App extends Component {
  render = () => html`
    <div class="app">
      <${Header} url=${this.state.url} />
      <${Router} onChange=${e => this.setState(e)}>
        <${About} path="/about" />
        <${NotFound} default />
        <${Home} path="/" />
      <//>
    </div>
  `;
}

const Header = props => {
  return html`
    <header>
      <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/error">Error</a>
      </nav>
      <section>URL:<input readonly value=${props.url} /></section>
    </header>
  `;
};

const Home = props => {
  console.log(props);
  return html`
    <section>
      <h1>Home</h1>
    </section>
  `;
};

const About = props => {
  console.log(props);

  return html`
    <section>
      <h1>About</h1>
    </section>
  `;
};

const NotFound = props => {
  console.log(props);

  return html`
    <section>
      <h1>NotFound</h1>
    </section>
  `;
};

render(
  html`
    <${App} />
  `,
  document.body
);
