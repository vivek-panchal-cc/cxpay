export const getMobilePlatform = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Check for Android
  if (/android/i.test(userAgent)) {
    return "android";
  }

  // Check for iOS (iPhone, iPad, iPod)
  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return "ios";
  }

//   if (window.innerWidth <= 981) {
//     return "android";
//   }

  // If neither Android nor iOS, return null for desktop
  return null;
};
