import {
  Component,
  render,
  h
} from "https://cdn.jsdelivr.net/npm/preact@10.4.0/dist/preact.module.js";
import htm from "https://cdn.jsdelivr.net/npm/htm@3.0.4/dist/htm.module.js";
const html = htm.bind(h);
import Router from "./router.js";

const API = "/assets/";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      posts: {},
      selectedCategory: null,
      url: null,
      hideSidebar: true
    };
  }

  componentDidMount() {
    this.loadIndex();
  }

  loadIndex() {
    let currentComponent = this;
    fetch(API + "index.json")
      .then(data => data.json())
      .then(data => {
        if ("cats" in data && "posts" in data) {
          currentComponent.setState({
            categories: data.cats,
            posts: data.posts
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  render = () => html`
    <div class="w3-row w3-theme wapper">
      <button
        class="w3-button w3-hide-medium w3-hide-large w3-display-topright"
        onClick=${e =>
          this.setState({
            hideSidebar: !this.state.hideSidebar
          })}
      >
        <img src="./assets/icons/menu.webp" alt="sidebar" />
      </button>

      <div
        class=${"w3-col s12 m4 l4 " +
          (this.state.hideSidebar ? "w3-hide-small" : "")}
      >
        <${CatNav} cats=${this.state.categories} />
        <${PostNav} url=${this.state.url} cats=${this.state.categories} />
      </div>
      <div class="w3-green w3-col s12 m8 l8">
        <${Router} onChange=${e => this.setState(e)}>
          <${Post} path="/:slug" url=${this.state.url}><//>
          <${Home} path="/"><h1>Hi</h1><//>
        <//>
      </div>
    </div>
  `;
}

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: null,
      isLoading: true,
      error: null
    };
    this.notFound = html`
      <h3>Please select a post.</h3>
    `;
  }
  componentDidMount() {
    this.setState({ isLoading: true });
    let currentComponent = this;
    if (this.props.url != null) {
      console.log(API + "posts" + this.props.url + ".json");
      fetch(API + "posts" + this.props.url + ".json")
        .then(data => data.json())
        .then(data => {
          console.log(data.title);
          currentComponent.setState({ post: data, isLoading: false });
        })
        .catch(function(error) {
          console.log(error);
          currentComponent.setState({ error: error, isLoading: false });
        });
    }
  }
  render() {
    return this.state.isLoading
      ? html`
          <main><h1>Loading....</h1></main>
        `
      : this.state.error
      ? this.notFound
      : html`
          <main>
            <h2>${this.state.post.title}</h2>
          </main>
        `;
  }
}

const Header = props => {
  return html`
    <header>
      Header
    </header>
  `;
};

const CatNav = props => {
  return html`
    <nav class="navlist  catList w3-col s5 m5 l5">
      <div>
        <img
          class="w3-circle"
          alt="Ahmed Essam"
          src="./assets/icons/me0.webp"
        />
        <h4 class="brand">AHMED ESSAM</h4>
      </div>
      ${props.cats.map(
        it =>
          html`
            <li><a onClick=${() => console.log(it)}>${it}</a></li>
          `
      )}
    </nav>
  `;
};

const PostNav = props => {
  return html`
    <nav class="navlist postList w3-col s7 m6 l7">
      ${props.cats.map(
        it =>
          html`
            <li><a onClick=${() => console.log(it)}>${it}</a></li>
          `
      )}
    </nav>
  `;
};

const Home = props => {
  console.log(props);
  return html`
    <section>
      <h1>Home</h1>
      <ul className="pure-menu-list">
        ${props.children}
      </ul>
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
