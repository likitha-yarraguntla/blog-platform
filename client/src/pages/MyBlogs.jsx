
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBlogs();
  }, []);

  const fetchMyBlogs = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/blogs/my-blogs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBlogs(res.data.blogs);
    } catch (error) {
      console.log(
        "Error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          padding: "30px",
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          My Blogs
        </h1>

        {loading ? (
          <p style={{ textAlign: "center" }}>
            Loading...
          </p>
        ) : blogs.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              backgroundColor: "white",
              maxWidth: "500px",
              margin: "0 auto",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h3>No Blogs Yet 📝</h3>

            <p>
              You haven't created any blogs yet.
            </p>
          </div>
        ) : (
          blogs.map((blog) => (
            <div
              key={blog._id}
              style={{
                maxWidth: "700px",
                margin: "20px auto",
                padding: "20px",
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              <h2>{blog.title}</h2>

              <p
                style={{
                  color: "#555",
                  fontWeight: "bold",
                }}
              >
                By {blog.author?.username}
              </p>

              <p
                style={{
                  color: "#888",
                  fontSize: "14px",
                  marginBottom: "15px",
                }}
              >
                {new Date(
                  blog.createdAt
                ).toLocaleDateString()}
              </p>

              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title}
                  style={{
                    width: "100%",
                    maxHeight: "350px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "15px",
                  }}
                />
              )}

              <p
                style={{
                  lineHeight: "1.7",
                  color: "#333",
                }}
              >
                {blog.content}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  marginTop: "15px",
                  color: "#666",
                  fontWeight: "500",
                }}
              >
                <span>
                  ❤️ {blog.likes?.length || 0}
                </span>

                <span>
                  💬 {blog.comments?.length || 0}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default MyBlogs;
