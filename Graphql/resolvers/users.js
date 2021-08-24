const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const {
  validateRegisterInput,
  validateLoginInput,
} = require('../../util/inputValidation.js');
const { SECRETE_KEY } = require('../../config.js');
const User = require('../../models/User');
const { defaultTypeResolver } = require('graphql');

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRETE_KEY,
    { expiresIn: '1h' }
  );
}

module.exports = {
  Mutation: {
    // parent / _: from previous action - required to have access to the args (second param)
    // args: destructured to 'registerInput' coming from ./typeDefs.js registerInput param in register method
    // context: (not used)
    // info: (not used)

    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) {
      // Validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError('Errors:', { errors });
      }
      // Check if user already exists
      const user = await User.findOne({ email });

      if (user) {
        console.log('something went wrong!', user);
        //   user already exists
        throw new UserInputError('Username or email is already registered', {
          // The following error object will be used on our front-end
          errors: {
            username: 'This username or email is already registered',
          },
        });
      }
      // Hash password for db & create auth token
      password = await bcrypt.hash(password, 12);

      // Create new User object to then save
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      //   Save new user to the database
      const res = await newUser.save();

      // Generate a token for the 'res'ulting new user
      const token = generateToken(res);

      // console.log('Console logging the res data object ', res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await User.findOne({ username });

      if (!user) {
        // user doesn't exist
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = 'Incorrect credentials';
        throw new UserInputError('Incorrect credentials', { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
  },
  Query: {
    async getAllUsers() {
      const allUsers = await User.find();
      try {
        return allUsers;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
