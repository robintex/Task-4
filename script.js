// Dummy user data
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = null;

// Show login/register/admin panel based on user authentication
function showPage(pageId) {
  document.querySelectorAll("body > div").forEach((page) => {
    page.classList.add("hidden");
  });
  document.getElementById(pageId).classList.remove("hidden");
}

// Save users to localStorage
function saveUsers() {
  localStorage.setItem("users", JSON.stringify(users));
}
function formatDateAndTime(isoString) {
  const [date, timeWithMs] = isoString.split("T");
  const time = timeWithMs?.split(".")[0]; // Remove milliseconds
  return `${date} ${time}`; // Combine date and time
}

function timeSince(isoString) {
  const now = new Date();
  const lastLogin = new Date(isoString);
  const diffInSeconds = Math.floor((now - lastLogin) / 1000);

  if (diffInSeconds < 60) return "Currently active";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minute(s) ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hour(s) ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} day(s) ago`;

  return `${Math.floor(diffInSeconds / 604800)} week(s) ago`;
}

// Search functionality
document.getElementById("search-users").addEventListener("input", (e) => {
    populateTable(e.target.value.toLowerCase());
  });
  
  // Populate table (with optional search term)
  function populateTable(searchTerm = "") {
    const tableBody = document.getElementById("user-table");
    const filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm)
    );
  
    tableBody.innerHTML = filteredUsers
      .sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin))
      .map(
        (user, index) => `
        <tr>
          <td class="border p-2 text-center ">
            <input type="checkbox" class="user-checkbox " data-index="${users.indexOf(user)}">
          </td>
          <td class="border p-2"><div class="font-bold">${user.name}</div>${user.Designation}</td>
          <td class="border p-2">${user.email}</td>
         <td class="border p-2">
  ${user.lastLogin ? timeSince(user.lastLogin) : "Never"}
</td>

          <td class="border p-2">${user.status}</td>
        </tr>
      `
      )
      .join("");
  }
  
// Login handler
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    if (user.status === "blocked") {
      alert("Your account is blocked.");
    } else {
      currentUser = user;
      user.lastLogin = new Date().toISOString();
      saveUsers();
      showPage("admin-panel");
      populateTable();
    }
  } else {
    alert("Invalid email or password.");
  }
});

// Registration handler
document.getElementById("register-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("register-name").value;
  const email = document.getElementById("register-email").value;
  const  Designation = document.getElementById("Designation").value;
  const password = document.getElementById("register-password").value;

  if (users.some((u) => u.email === email)) {
    alert("Email already exists.");
  } else {
    users.push({
      id: users.length + 1,
      name,
      email,
      Designation,
      password,
      status: "active",
      lastLogin: null,
    });
    saveUsers();
    alert("Registration successful!");
    showPage("login-page");
  }
});

// Toolbar actions
document.getElementById("block-users").addEventListener("click", () => {
  document.querySelectorAll(".user-checkbox:checked").forEach((checkbox) => {
    const index = checkbox.dataset.index;
    users[index].status = "blocked";
  });
  saveUsers();
  populateTable();
});

document.getElementById("unblock-users").addEventListener("click", () => {
  document.querySelectorAll(".user-checkbox:checked").forEach((checkbox) => {
    const index = checkbox.dataset.index;
    users[index].status = "active";
  });
  saveUsers();
  populateTable();
});

document.getElementById("delete-users").addEventListener("click", () => {
  users = users.filter(
    (_, index) => !document.querySelector(`.user-checkbox[data-index="${index}"]`).checked
  );
  saveUsers();
  populateTable();
});

// Select all functionality
document.getElementById("select-all").addEventListener("change", (e) => {
  document.querySelectorAll(".user-checkbox").forEach((checkbox) => {
    checkbox.checked = e.target.checked;
  });
});

// Navigation between login/register
document.getElementById("show-register").addEventListener("click", () => showPage("register-page"));
document.getElementById("show-login").addEventListener("click", () => showPage("login-page"));

// Initialize
showPage("login-page");
