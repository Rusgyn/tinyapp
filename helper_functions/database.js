//========== Define Database ========
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
  test: {
    id: "test",
    email: "test@test.com",
    password: "test123"
  }
};

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "45bd00",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "45bd00",
  },
  u1r2L3: {
    longURL: "https://www.amazon.ca",
    userID: "test",
  },
};

module.exports = Object.freeze({
  users,
  urlDatabase
});