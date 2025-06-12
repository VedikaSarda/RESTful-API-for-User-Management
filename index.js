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
  return res.json(users);
});

// 2. get: user data in html format
app.get("/users", (req, res) => {
  const html = `
    <ul>
    ${users.map((users) => `<li> ${users.first_name} </li>`).join("")}
    </ul>
    `;
  res.send(html);
});

// 3. Get/api/users/:id : list the user by id
app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((users) => users.id === id);
  return res.json(user);
});

//4. post /api/users/ : creat a new user
app.post("/api/users", (req, res) => {
  //create new user
  const body = req.body;
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "success", id: users.length });
  });
});

//5. Patch
app.patch("/api/users/:id", (req, res) => {
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
});

//6. Delete : delete user by id
app.delete("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const userIndex = users.findIndex((users) => users.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  users.splice(userIndex, 1);

  fs.writeFileSync("./MOCK_DATA.json", JSON.stringify(users, null, 2));

  res.json({ message: "User deleted successfully" });
});


app.listen(PORT, () => console.log(`Server Started at PORT 3000`));
