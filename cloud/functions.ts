import { AppCache } from 'parse-server/lib/cache.js';
import { compare } from 'parse-server/lib/password.js';

const app = AppCache.get(Parse.applicationId);
const adapter = app.databaseController.adapter;

Parse.Cloud.define('changePassword', async ({ user, params }) => {
  if (!user) throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'Please Sign in first.');
  const { old_password, new_password } = params;
  if (!old_password)
    throw new Parse.Error(Parse.Error.OTHER_CAUSE, 'Missing old_password parameter.');
  if (!new_password)
    throw new Parse.Error(Parse.Error.OTHER_CAUSE, 'Missing new_password parameter.');
  const [dbUser] = await adapter.find('_User', { fields: {} }, { objectId: user.id }, { limit: 1 });
  if (!dbUser) throw new Parse.Error(Parse.Error.OTHER_CAUSE, 'Invalid user.');
  if (!(await compare(old_password, dbUser._hashed_password)))
    throw new Parse.Error(Parse.Error.OTHER_CAUSE, 'Invalid old password.');
  return user.save({ password: new_password }, { sessionToken: user.getSessionToken() });
});
