export const replaceDomain = (url?: string | null) => {
  const regex: RegExp =
    /https:\/\/apiqa.boomcard.net\/api\/v1\/images\/|https:\/\/d1k0ppjronk6up.cloudfront.net\/products\/4030\//;
  return url?.replace(regex, `${process.env.NEXT_PUBLIC_API_URL}/images/`) || '';
};
