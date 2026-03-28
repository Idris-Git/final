import { useState, useEffect } from "react";
import b1 from "../assets/b1.png";
import b2 from "../assets/b2.jpg";
import "../styles/Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        if (res.ok) setPosts(data);
      } catch {
        // ignore
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="page">
      <div id="header">
        <h1>Welcome to the Blood Donation System</h1>
        <p>Connecting hospitals with donors to save lives</p>
      </div>

      <div id="posts">
        <img src={b1} alt="Blood donation" />
        <img src={b2} alt="Blood donation" />
      </div>

      {posts.length > 0 && (
        <div className="announcements">
          <h2>Announcements</h2>
          {posts.map((post) => (
            <div key={post._id} id="pcontent">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <small>{new Date(post.createdAt).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
