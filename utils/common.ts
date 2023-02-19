export const meterToMiles = (meters) => {
  const miles = meters / 1609.344;
  return Math.round(miles);
};

export const urlIsSocialMedia = (url) => {
  return (
    ~url.indexOf('pinterest') ||
    ~url.indexOf('facebook') ||
    ~url.indexOf('twitter') ||
    ~url.indexOf('linkedin') ||
    ~url.indexOf('google') ||
    ~url.indexOf('youtube')
  );
};

export const getSocialIconClassForUrl = (url) => {
  switch (true) {
    case url.indexOf('pinterest') > -1:
      return 'fa-pinterest-square';
    case url.indexOf('facebook') > -1:
      return 'fa-facebook-square';
    case url.indexOf('twitter') > -1:
      return 'fa-twitter-square';
    case url.indexOf('linkedin') > -1:
      return 'fa-linkedin-square';
    case url.indexOf('google') > -1:
      return 'fa-google-plus-square';
    case url.indexOf('youtube') > -1:
      return 'fa-youtube-square';
  }
};

export const duplicateObject = (state) => JSON.parse(JSON.stringify(state));
