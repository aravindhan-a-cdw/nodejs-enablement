const mockingoose = require('mockingoose');
const UserModel = require('../../models/user');
const { editProfile } = require('../../services/profile.service');

describe('User Service', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe('editProfile', () => {
    it('should update the user profile and return the updated user', async () => {
      const userId = '60d5f60a18d3d80014bf0a2b';
      const existingUserData = {
        _id: userId,
        name: 'Old Name',
        employeeId: "0007",
        email: "user@test.com",
        gender: 'male',
        profilePicture: 'old-pic.jpg',
        profileBio: 'Old bio',
        latestWorkDesignation: 'Old designation',
        certifications: ['Cert1'],
        password: "secret",
        experience: '5 years',
        businessUnit: 'Old unit',
        workLocation: 'Old location'
      };

      const additionalData = {
        name: 'New Name',
        gender: 'female',
        profilePicture: 'new-pic.jpg',
        profileBio: 'New bio',
        latestWorkDesignation: 'New designation',
        certifications: ['Cert1', 'Cert2'],
        experience: '10 years',
        businessUnit: 'New unit',
        workLocation: 'New location'
      };

      // Mock the UserModel save method
      mockingoose(UserModel).toReturn(existingUserData, 'save');

      const user = new UserModel(existingUserData);
      const result = await editProfile(additionalData, user);

      expect(result.name).toBe('New Name');
      expect(result.gender).toBe('female');
      expect(result.profilePicture).toBe('new-pic.jpg');
      expect(result.profileBio).toBe('New bio');
      expect(result.latestWorkDesignation).toBe('New designation');
      expect(result.certifications).toEqual(['Cert1', 'Cert2']);
      expect(result.experience).toBe('10 years');
      expect(result.businessUnit).toBe('New unit');
      expect(result.workLocation).toBe('New location');
    });

    it('should not update fields that are not provided', async () => {
      const userId = '60d5f60a18d3d80014bf0a2b';
      const existingUserData = {
        _id: userId,
        name: 'Old Name',
        email: "user@test.com",
        employeeId: "0007",
        gender: 'male',
        profilePicture: 'old-pic.jpg',
        profileBio: 'Old bio',
        latestWorkDesignation: 'Old designation',
        certifications: ['Cert1'],
        password: "secret",
        experience: '5 years',
        businessUnit: 'Old unit',
        workLocation: 'Old location'
      };

      const partialUpdateData = {
        name: 'New Name',
        profileBio: 'New bio'
      };

      // Mock the UserModel save method
      mockingoose(UserModel).toReturn(existingUserData, 'save');

      const user = new UserModel(existingUserData);
      const result = await editProfile(partialUpdateData, user);

      expect(result.name).toBe('New Name');
      expect(result.gender).toBe('male');
      expect(result.profilePicture).toBe('old-pic.jpg');
      expect(result.profileBio).toBe('New bio');
      expect(result.latestWorkDesignation).toBe('Old designation');
      expect(result.certifications).toEqual(['Cert1']);
      expect(result.experience).toBe('5 years');
      expect(result.businessUnit).toBe('Old unit');
      expect(result.workLocation).toBe('Old location');
    });
  });
});
