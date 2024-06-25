// tests/userService.test.js
const mockingoose = require('mockingoose');
const User = require('../../models/user');
require("dotenv").config();
const authenticationService = require('../../services/authentication.service');
const { AUTHENTICATION_ERRORS } = require('../../constants/error')

describe('Authentication Service', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('should signup a user with data in wallet db', async () => {
    const userData = { name: "User1", email: 'user1@cdw.com', employeeId: "0001", role: 'user', gender: "male", password: 'password123' };
    mockingoose(User).toReturn(userData, 'save');

    const user = await authenticationService.signUp(userData);

    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
  });

  it('should throw error when a user data not matches with wallet db', async () => {
    const userData = { name: "User1", email: 'user1@cdw.com', employeeId: "0005", role: 'user', gender: "male", password: 'password123' };
    mockingoose(User).toReturn(userData, 'save');
    await expect(authenticationService.signUp(userData)).rejects.toThrow(AUTHENTICATION_ERRORS.USER_NOT_EXIST_IN_WALLET_DB);
  });

  it('should return existing user data when user already in pending state', async () => {
    const userData = { name: "User1", email: 'user1@cdw.com', employeeId: "0001", role: 'user', gender: "male", password: 'password123' };
    mockingoose(User).toReturn(userData, 'findOne');

    await expect(authenticationService.signUp(userData)).rejects.toThrow(AUTHENTICATION_ERRORS.PENDING_REQUEST_EXISTS);
  });

  it('should get pending user', async () => {
    const userData = [{ _id: '60d5f60a18d3d80014bf0a2b', username: 'testuser', email: 'test@example.com' }];
    mockingoose(User).toReturn(userData, 'find');

    const result = await authenticationService.pendingApprovals();

    expect(result.length).toBe(userData.length);
  });

  it('should get a pending status user', async () => {
    const userData = { _id: '60d5f60a18d3d80014bf0a2b', username: 'testuser', email: 'newemail@example.com' };
    mockingoose(User).toReturn(userData, 'findOne');

    const result = await authenticationService.getPendingUser('60d5f60a18d3d80014bf0a2b');

    expect(result.email).toBe(userData.email);
  });

  it('should return true when approving an existing user by id', async () => {
    const userData = { _id: '60d5f60a18d3d80014bf0a2b', username: 'testuser', email: 'test@example.com' };
    mockingoose(User).toReturn(userData, 'findOneAndUpdate');

    const result = await authenticationService.approveUser('60d5f60a18d3d80014bf0a2b');

    expect(result).toBe(true);
  });

  it('should throw error when approving an non existing user by id', async () => {
    const userData = null;
    mockingoose(User).toReturn(userData, 'findOneAndUpdate');

    await expect(authenticationService.approveUser('60d5f60a18d3d80014bf0a2b')).rejects.toThrow(AUTHENTICATION_ERRORS.NO_PENDING_USER_FOUND);
  });

  it('should return true when rejecting an existing user by id', async () => {
    const userData = { _id: '60d5f60a18d3d80014bf0a2b', username: 'testuser', email: 'test@example.com' };
    mockingoose(User).toReturn(userData, 'findOneAndUpdate');

    const result = await authenticationService.rejectUser('60d5f60a18d3d80014bf0a2b');

    expect(result).toBe(true);
  });

  it('should throw error when rejecting an non existing user by id', async () => {
    const userData = null;
    mockingoose(User).toReturn(userData, 'findOneAndUpdate');

    await expect(authenticationService.rejectUser('60d5f60a18d3d80014bf0a2b')).rejects.toThrow(AUTHENTICATION_ERRORS.NO_PENDING_USER_FOUND);
  });

  it('should return true when removing an existing user by id', async () => {
    const userData = { _id: '60d5f60a18d3d80014bf0a2b', username: 'testuser', email: 'test@example.com' };
    mockingoose(User).toReturn(userData, 'findOneAndUpdate');

    const result = await authenticationService.removeUser('60d5f60a18d3d80014bf0a2b');

    expect(result).toBe(true);
  });

  it('should throw error when removing an non existing user by id', async () => {
    const userData = null;
    mockingoose(User).toReturn(userData, 'findOneAndUpdate');

    await expect(authenticationService.removeUser('60d5f60a18d3d80014bf0a2b')).rejects.toThrow(AUTHENTICATION_ERRORS.NO_USER_FOUND);
  });

});
