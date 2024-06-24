// It is best practise to organize your cloud functions group into their own file. You can then import them in your main.js.
await import('./functions.js');

Parse.Cloud.beforeSave('Cart', ({ object, user, master }) => {
  if (!master && !user)
    throw new Parse.Error(Parse.Error.INVALID_SESSION_TOKEN, 'Please sign in first.');
  if (user)
    object.set('user', user);
});

export default void 0;
