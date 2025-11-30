const form = document.getElementById("signupForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get values from form
  const firstName = document.getElementById("firstname").value.trim();
  const lastName = document.getElementById("lastname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmpassword").value;

  // Basic validation
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  // ✅ Create user object
  const user = { firstName, lastName, email, password};

  try {
    const response = await fetch("http://localhost:5000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });

    const data = await response.json();
    alert(data.message);

    if (data.success) {
      form.reset(); // Clear form on success
    }

  } catch (error) {
    console.error(error);
    alert("Error connecting to server");
  }
});
