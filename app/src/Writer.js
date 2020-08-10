import React, { Component } from "react";
import { postStorage } from "./PostStorage";

class Writer extends Component {
  newPost(e) {
    e.preventDefault();
    let post = {
      contents: this.body.value,
    };
    postStorage.newPost(this, post);
  }

  render() {
    return (
      <form onSubmit={(e) => this.newPost(e)}>
        <p>
          <textarea ref={(input) => this.body = input} />
          <br />
          <button type="submit">Post</button>
        </p>
      </form>
    );
  }
}

export default Writer;
