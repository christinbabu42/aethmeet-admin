import React from "react";

export default function DeleteAccount() {
  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1 style={styles.title}>Delete Your AethMeet Account</h1>

        <p>
          If you wish to delete your account and all associated data, you can do
          so directly from the app or by contacting us.
        </p>

        <h3>Option 1: Delete from App</h3>
        <p>
          Open the app → Go to <strong>Settings</strong> → Click{" "}
          <strong>Delete Account</strong>
        </p>

        <h3>Option 2: Request via Email</h3>
        <p>
          Send an email to:{" "}
          <strong>aethmeet@gmail.com</strong>
        </p>

        <p>Please include your registered Google email ID.</p>

        <h3>Data that will be deleted:</h3>
        <ul>
          <li>User profile (name, email)</li>
          <li>Wallet balance and transactions</li>
          <li>Game history and records</li>
        </ul>

        <h3>Data retention:</h3>
        <p>
          Some financial transaction records may be retained for up to 90 days
          for legal and fraud prevention purposes.
        </p>

        <h3>Processing Time:</h3>
        <p>Your account will be permanently deleted within 7 days of request.</p>

        {/* <a
          href="mailto:support@aethmeet.com?subject=Delete My Account"
          style={styles.button}
        >
          Request Account Deletion
        </a> */}
      </div>
    </div>
  );
}

const styles = {
  body: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f5f6fa",
    padding: "20px",
    minHeight: "100vh",
  },
  container: {
    maxWidth: "700px",
    margin: "auto",
    background: "#fff",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  title: {
    color: "#e74c3c",
  },
  button: {
    display: "inline-block",
    padding: "12px 20px",
    backgroundColor: "#e74c3c",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "6px",
    marginTop: "15px",
  },
};