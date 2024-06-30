// Helper Function

//To get the user object by email
const getUserByEmail = (email, database) => {
  let usersEmail = "";

  //Iterate the key properties of users object
  for (let key in database) {
    usersEmail = (database[key].email);
    if (email === usersEmail) {
      return database[key]; //return the user's object
    }
  }
};

module.exports = { getUserByEmail };