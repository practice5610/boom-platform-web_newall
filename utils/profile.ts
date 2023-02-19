import { AllOptionalExceptFor, BoomUser, RoleKey } from '@boom-platform/globals';
import firebase from 'firebase/app';

/**
 * Parses first name and last name values from the user credential profile, if it exists
 * @param userCredential The firebase user credential provided after signing up with a new user
 */
export const parseDisplayNameFromFirebaseUserCredential = (
  userCredential: firebase.auth.UserCredential
): AllOptionalExceptFor<BoomUser, 'firstName' | 'lastName'> => {
  let userProfile: AllOptionalExceptFor<BoomUser, 'firstName' | 'lastName'> = {
    firstName: '',
    lastName: '',
  };

  if (
    userCredential.additionalUserInfo &&
    userCredential.additionalUserInfo.profile &&
    userCredential.additionalUserInfo.profile
  ) {
    const profile: { name: string } = userCredential.additionalUserInfo.profile as { name: string };
    const firstNameAndLastName = profile.name || '';
    const hasFirstName = firstNameAndLastName.split(' ').length > 0;
    const hasLastName = firstNameAndLastName.split(' ').length > 1;

    const userFirstName = hasFirstName ? firstNameAndLastName.split(' ')[0] : '';
    const userLastName = hasLastName ? firstNameAndLastName.split(' ')[1] : '';

    userProfile = {
      firstName: userFirstName,
      lastName: userLastName,
    };
  }
  return userProfile;
};

/**
 * Only used for email/password account creation. This is the initial profile data set, before it exists in Firebase.
 * @param credentials
 * @param email
 * @param password
 * @param roles
 * @param userData Extra data to add to the profile
 */
export const prepareEmailPasswordProfileDataForInitialCreation = (
  credentials: firebase.auth.UserCredential,
  email: string,
  password: string,
  roles: RoleKey[],
  userData: BoomUser | undefined
): AllOptionalExceptFor<BoomUser, 'uid' | 'roles' | 'contact'> => {
  const profile: AllOptionalExceptFor<BoomUser, 'uid' | 'roles' | 'contact'> = {
    uid: credentials.user?.uid ?? '',
    roles: roles,
    contact: { emails: [email] },
    ...(userData && { ...userData }),
  };
  /*const profile: AllOptionalExceptFor<BoomUser, 'uid' | 'roles' | 'contact'> = _.merge(
    {},
    current,
    userData || {}
  );*/
  return profile;
};
