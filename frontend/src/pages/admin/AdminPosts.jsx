import { useState, useEffect } from "react";
import "../../styles/Admin.css";

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [message, setMessage] = useState("");

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      if (res.ok) setPosts(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setMessage("Post created!");
        setFormData({ title: "", content: "" });
        fetchPosts();
      } else {
        const data = await res.json();
        setMessage(data.error || "Failed to create post");
      }
    } catch {
      setMessage("Something went wrong");
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage("Post deleted");
        fetchPosts();
      }
    } catch {
      setMessage("Failed to delete");
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h2>Manage Announcements</h2>
        {message && <p className="msg">{message}</p>}

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Post Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Post Content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
            rows={4}
          />
          <button type="submit" className="btn-full">Create Post</button>
        </form>

        <hr />
        <h3>Existing Posts</h3>

        {posts.length === 0 ? (
          <p className="empty">No posts yet</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="request-item">
              <h4>{post.title}</h4>
              <p>{post.content}</p>
              <p className="date">{new Date(post.createdAt).toLocaleDateString()}</p>
              <button className="btn-danger" onClick={() => deletePost(post._id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPosts;
