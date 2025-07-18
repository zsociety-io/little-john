// Backup of alternative approach if the current fix doesn't work
// Replace the onPressYesLogOut function with this version:

const onPressYesLogOut = async () => {
  try {
    // Close the action sheet immediately
    LogOutSheetRef?.current?.hide();
    
    // Perform disconnect in background
    const disconnectPromise = disconnect();
    
    // Use requestAnimationFrame to ensure navigation happens after UI updates
    await new Promise(resolve => {
      requestAnimationFrame(() => {
        setTimeout(async () => {
          try {
            await disconnectPromise;
            navigation.reset({
              index: 0,
              routes: [{ name: StackNav.Auth }],
            });
            resolve(true);
          } catch (err) {
            console.error('Navigation reset error:', err);
            resolve(false);
          }
        }, 500);
      });
    });
    
    return true;
  } catch (exception) {
    console.error('Logout error:', exception);
    return false;
  }
};