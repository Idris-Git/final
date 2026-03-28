import { useState, useEffect } from "react";
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

      {posts.length > 0 ? (
        <div className="announcements">
          <h2>Announcements</h2>
          {posts.map((post) => (
            <div key={post._id} className="post-card">
              {post.image && <img src={post.image} alt={post.title} className="post-img" />}
              <div className="post-text">
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <small>{new Date(post.createdAt).toLocaleDateString()}</small>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty">No announcements yet</p>
      )}
    </div>
  );
};

export default Home;
