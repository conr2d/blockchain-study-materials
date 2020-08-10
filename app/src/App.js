import React, { Component } from 'react';
import './App.css';
import Writer from "./Writer";
import Post from "./Post";
import { postStorage } from "./PostStorage";

class App extends Component {
  constructor() {
    super();
    this.state = {
      posts: [
        {
          author: "Alice",
          contents: "Hello",
          date: new Date().toString(),
        },
      ],
    };
  }

  componentDidMount() {
    postStorage.subscribe(this);
  }

  componentWillUnmount() {
    postStorage.unsubscribe(this);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>NonceNS</h1>
        </header>
        <div className="container">
          <div className="content">
            <Writer />
            <div>
              {
                Object
                .keys(this.state.posts)
                .map(key => <Post key={key} post={this.state.posts[key]} />)
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
