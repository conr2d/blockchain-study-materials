import { contract } from "./Web3";
import { timestampToDate } from "./utils";

class PostStorage {
  posts = [];
  subscribers = new Set();

  constructor() {
    (async () => {
      const numPosts = await contract.methods.getNumberPosts().call();
      for (let i = numPosts - 1; i >= 0 && i >= numPosts - 11; --i) {
        await this.getPost(i);
      }
      this.publish();
    })();
  }

  insertPost(post) {
    if (!post) return;
    let pos = this.posts.findIndex((p) => {
      return post.id > p.id;
    });
    
    if (!this.posts.length) {
      this.posts.push(post);
    } else {
      this.posts.splice(pos, 0, post);
    }
  }

  newPost(component, post) {
    if (!window.ethereum) {
      console.warn("You need web3 provider to write a post");
      return;
    } else {
      window.ethereum.enable();
    }

    (async () => {
      try {
        await contract.methods.newPost(post.contents).send({ from: window.ethereum.selectedAddress });
        component.body.value = "";
      } catch (e) {
        console.error(e.message);
      }
    })();
  }

  async getPost(id) {
    const post = await contract.methods.post(id).call();
    this.insertPost({
      ...post,
      id: id,
      date: timestampToDate(post.created),
    });
  }

  subscribe(component) {
    this.subscribers.add(component);
    this.publish();
  }

  unsubscribe(component) {
    this.subscribers.delete(component);
  }

  publish() {
    for (let component of this.subscribers) {
      component.setState({ posts: this.posts });
    }
  }
}

const postStorage = new PostStorage();

export {
  postStorage,
}
