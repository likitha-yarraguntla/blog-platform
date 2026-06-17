
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged Out Successfully");
    navigate("/");
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    transition: "background-color 0.3s ease",
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        backgroundColor: "#1f2937",
        color: "white",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: "24px",
        }}
      >
        📝 Blog Platform
      </h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <Link to="/home" style={linkStyle}>
          Home
        </Link>

        <Link to="/my-blogs" style={linkStyle}>
          My Blogs
        </Link>

        <Link to="/create-blog" style={linkStyle}>
          Create Blog
        </Link>

        <Link
  to="/profile"
  style={{
    color: "white",
    marginRight: "20px",
    textDecoration: "none",
  }}
>
  Profile
</Link>

        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            padding: "10px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "background-color 0.3s ease",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;