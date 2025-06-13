const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");
const { error } = require("console");
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: false }));
//Routes
//1. Get : List all the users

app.get("/api/users", (req, res) => {
  try {
    return res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch User" })
  }
});

// 2. get: user data in html format

app.get("/users", (req, res) => {
  try {
    const html = `
    <ul>
    ${users.map((users) => `<li> ${users.first_name} </li>`).join("")}
    </ul>
    `;
    res.send(html);
  } catch (err) {
    res.status(500).send("Failed to render HTML")
  }
});

// 3. Get/api/users/:id : list the user by id

app.get("/api/users/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = users.find((users) => users.id === id);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

//4. post /api/users/ : creat a new user

app.post("/api/users", (req, res) => {
  //create new user
  try {
    const body = req.body;
    users.push({ ...body, id: users.length + 1 });
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
      return res.json({ status: "success", id: users.length });
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//5. Patch

app.patch("/api/users/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const body = req.body;

    const user = users.find((users) => users.id === id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Update allowed fields only
    if (body.first_name) user.first_name = body.first_name;
    if (body.last_name) user.last_name = body.last_name;
    if (body.email) user.email = body.email;
    if (body.gender) user.gender = body.gender;
    if (body.ip_address) user.ip_address = body.ip_address;

    // Save updated users back to file
    fs.writeFileSync("./MOCK_DATA.json", JSON.stringify(users, null, 2));

    res.json({ message: "User updated successfully", user });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Failed to update user" });
  }
});

//6. Delete : delete user by id

app.delete("/api/users/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    const userIndex = users.findIndex((users) => users.id === id);
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    users.splice(userIndex, 1);

    fs.writeFileSync("./MOCK_DATA.json", JSON.stringify(users, null, 2));

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});


app.listen(PORT, () => console.log(`Server Started at PORT 3000`));
