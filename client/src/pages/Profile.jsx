
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data.user);

      setUser(res.data.user);
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <h2 style={{ textAlign: "center", marginTop: "50px" }}>
          Loading...
        </h2>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f3f4f6",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "500px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "20px",
            padding: "40px 30px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
              fontWeight: "700",
              margin: "0 auto 20px",
            }}
          >
            {user?.username?.charAt(0).toUpperCase()}
          </div>

          <h2
            style={{
              color: "#1e293b",
              marginBottom: "10px",
            }}
          >
            {user?.username}
          </h2>

          <p
            style={{
              color: "#6b7280",
              marginBottom: "20px",
            }}
          >
            {user?.email}
          </p>

          <div
            style={{
              marginTop: "20px",
              padding: "20px",
              backgroundColor: "#f8fafc",
              borderRadius: "12px",
            }}
          >
            <h3
              style={{
                color: "#1e293b",
                marginBottom: "10px",
              }}
            >
              Bio
            </h3>

            <p
              style={{
                color: "#4b5563",
              }}
            >
              {user?.bio || "No bio added yet."}
            </p>
          </div>

          <p
            style={{
              marginTop: "25px",
              fontSize: "14px",
              color: "#9ca3af",
            }}
          >
            Joined on{" "}
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>
    </>
  );
}

export default Profile;
