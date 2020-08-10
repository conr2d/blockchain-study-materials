// SPDX-License-Identifier: MIT
// A simplfied version of Uncensorable SNS for hands-on practice
pragma solidity >=0.4.0 <0.7.0;

contract NonceNS {
    struct Post {
        address author;
        uint32  created;
        uint32  updated;
        string  contents;
    }

    Post[] public post;

    event PostUpdated(address indexed author, uint indexed id);

    function newPost(string memory contents) public {
        Post memory p;
        p.author = msg.sender;
        p.created = uint32(now);
        p.updated = uint32(now);
        p.contents = contents;
        post.push(p);

        emit PostUpdated(msg.sender, post.length-1);
    }

    function updatePost(uint id, string memory contents) public {
        require(post[id].author == msg.sender, "Only author can modify the post");

        Post memory p = post[id];
        p.updated = uint32(now);
        p.contents = contents;

        emit PostUpdated(msg.sender, id);
    }

    function getNumberPosts() public view returns (uint) {
        return post.length;
    }
}
