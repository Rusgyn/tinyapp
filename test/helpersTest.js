const { assert } = require('chai');

const { getUserByEmail } = require("../helpers");

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user when provided with a valid user email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    // Write your assert statement here
    assert.equal(user.email, testUsers[expectedUserID].email);
  });

  it('should return undefined when provided with non-existent email', function() {
    const user = getUserByEmail("unregistered@email.com", testUsers)
    // Write your assert statement here
    assert.equal(user, undefined);
  });

});