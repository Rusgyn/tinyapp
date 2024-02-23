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
  it('should return a userRandomID when provided with user@example.com email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const actualId = user.id;
    const expectedUserID = "userRandomID";
    // Write your assert statement here
    assert.equal(actualId, expectedUserID);
  });

  it('should return a user2RandomID when provided with user2@example.com email', function() {
    const user = getUserByEmail("user2@example.com", testUsers);
    const actualId = user.id;
    const expectedUserID = "user2RandomID";
    // Write your assert statement here
    assert.equal(actualId, expectedUserID);
  });

  it('should return undefined when provided with non-existent email', function() {
    const user = getUserByEmail("unregistered@email.com", testUsers)
    const expectedUserID = undefined;
    // Write your assert statement here
    assert.equal(user, expectedUserID);
  });

});