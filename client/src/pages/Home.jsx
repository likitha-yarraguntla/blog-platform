import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { jwtDecode } from "jwt-decode";
import "./Home.css";

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [userId, setUserId] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [commentText, setCommentText] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
      } catch (error) {
        console.log("Invalid token");
        localStorage.removeItem("token");
      }
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [search, page]);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/blogs?search=${search}&page=${page}`
      );

      setBlogs(res.data.blogs);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  const updateBlog = async (id, title, content) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/blogs/update/${id}`,
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchBlogs();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteBlog = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/blogs/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchBlogs();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/blogs/like/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchBlogs();
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async (id) => {
    if (!commentText[id]?.trim()) return;

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:5000/api/blogs/comment/${id}`,
        {
          text: commentText[id],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCommentText({
        ...commentText,
        [id]: "",
      });

      fetchBlogs();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          padding: "30px",
          backgroundColor: "#f3f4f6",
          minHeight: "100vh",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          All Blogs
        </h1>

        <input
          type="text"
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{
            display: "block",
            margin: "20px auto",
            padding: "12px",
            width: "320px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />

        {blogs.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              fontSize: "18px",
              color: "#666",
            }}
          >
            {search
              ? `No blogs found for "${search}"`
              : "No Blogs Found"}
          </p>
        ) : (
          blogs.map((blog) => (
            <div
              key={blog._id}
              className="blog-card"
              style={{
                maxWidth: "750px",
                margin: "25px auto",
                padding: "25px",
                backgroundColor: "white",
                borderRadius: "16px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
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
                }}
              >
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>

              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title}
                  style={{
                    width: "100%",
                    maxHeight: "400px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    marginTop: "15px",
                    marginBottom: "15px",
                  }}
                />
              )}

              <p
                style={{
                  lineHeight: "1.8",
                  marginTop: "15px",
                }}
              >
                {blog.content}
              </p>

              <button
                onClick={() => handleLike(blog._id)}
                style={{
                  marginTop: "15px",
                  padding: "10px 16px",
                  backgroundColor: "#ffe4e6",
                  color: "#e11d48",
                }}
              >
                ❤️ {blog.likes?.length || 0}
              </button>

              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  gap: "10px",
                }}
              >
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentText[blog._id] || ""}
                  onChange={(e) =>
                    setCommentText({
                      ...commentText,
                      [blog._id]: e.target.value,
                    })
                  }
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                />

                <button
                  onClick={() => handleComment(blog._id)}
                  style={{
                    padding: "12px 18px",
                    backgroundColor: "#2563eb",
                    color: "white",
                  }}
                >
                  Comment
                </button>
              </div>

              <div style={{ marginTop: "15px" }}>
                {blog.comments?.map((comment) => (
                  <div
                    key={comment._id}
                    style={{
                      background: "#f8fafc",
                      padding: "10px",
                      borderRadius: "8px",
                      marginTop: "10px",
                    }}
                  >
                    <strong>{comment.user?.username}</strong>

                    <p style={{ marginTop: "5px" }}>
                      {comment.text}
                    </p>
                  </div>
                ))}
              </div>

              {blog.author?._id === userId && (
                <div style={{ marginTop: "20px" }}>
                  <button
                    onClick={() => {
                      const newTitle = prompt(
                        "Enter New Title",
                        blog.title
                      );

                      const newContent = prompt(
                        "Enter New Content",
                        blog.content
                      );

                      if (newTitle && newContent) {
                        updateBlog(
                          blog._id,
                          newTitle,
                          newContent
                        );
                      }
                    }}
                    style={{
                      padding: "10px 16px",
                      backgroundColor: "green",
                      color: "white",
                      marginRight: "10px",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteBlog(blog._id)}
                    style={{
                      padding: "10px 16px",
                      backgroundColor: "red",
                      color: "white",
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "15px",
            marginTop: "30px",
          }}
        >
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            style={{
              padding: "10px 18px",
              backgroundColor:
                page === 1 ? "#cbd5e1" : "#2563eb",
              color: "white",
            }}
          >
            Previous
          </button>

          <span style={{ fontWeight: "bold" }}>
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            style={{
              padding: "10px 18px",
              backgroundColor:
                page === totalPages
                  ? "#cbd5e1"
                  : "#2563eb",
              color: "white",
            }}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default Home;