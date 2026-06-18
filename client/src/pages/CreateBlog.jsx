
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./CreateBlog.css";

function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [imageError, setImageError] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "https://blog-platform-api-xar7.onrender.com/api/blogs/create",
        {
          title,
          content,
          image,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Blog Created Successfully");

      setTitle("");
      setContent("");
      setImage("");
      setImageError(false);

      navigate("/home");
    } catch (error) {
      console.log(error.response?.data || error);
      alert("Failed to create blog");
    }
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "650px",
            margin: "0 auto",
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "16px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              marginBottom: "30px",
            }}
          >
            Create Blog
          </h1>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter Blog Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "15px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
            />

            <input
              type="text"
              placeholder="Paste Image URL (optional)"
              value={image}
              onChange={(e) => {
                setImage(e.target.value);
                setImageError(false);
              }}
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "15px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "16px",
                boxSizing: "border-box",
              }}
            />

            {image && !imageError && (
              <img
                src={image}
                alt="Preview"
                onError={() => setImageError(true)}
                style={{
                  width: "100%",
                  maxHeight: "250px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  marginBottom: "15px",
                }}
              />
            )}

            {imageError && (
              <p
                style={{
                  color: "red",
                  marginBottom: "15px",
                }}
              >
                Invalid image URL
              </p>
            )}

            <textarea
              placeholder="Enter Blog Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows="8"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "16px",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />

            <button
              type="submit"
              className="create-btn"
            >
              Create Blog
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateBlog;
