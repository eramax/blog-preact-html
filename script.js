import {
  html,
  Component,
  render
} from "https://unpkg.com/htm/preact/standalone.module.js";
import Router from "https://unpkg.com/preact-router?module";

const API = "/assets/";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: null,
      posts: {},
      selectedCategory: null,
      url: null
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
  getCategories() {
    let list = [];
    if (this.state.categories != null) {
      this.state.categories.map(it => {
        list.push(
          html`
            <li
              className=${it == this.state.selectedPost
                ? "pure-menu-item cat-item-selected"
                : "pure-menu-item"}
            >
              <a
                className="pure-menu-link"
                onClick=${() => this.selectCategory([...[it]])}
              >
                ${it}
              </a>
            </li>
          `
        );
      });
    }

    return list;
  }
  render = () => html`
    <div class="app">
      <${Header} url=${this.state.url} />
      <${Router} onChange=${e => this.setState(e)}>
        <${About} path="/about" />
        <${NotFound} default />
        <${Post} path="/:slug" url=${this.state.url}><//>
        <${Home} path="/">${this.getCategories()}<//>
      <//>
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
          <h1>Loading....</h1>
        `
      : this.state.error
      ? this.notFound
      : html`
          <h2>${this.state.post.title}</h2>
        `;
  }
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
