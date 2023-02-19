import Document, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

class MyDocument extends Document {
  render() {
    return (
      <Html lang='en' dir='ltr'>
        <Head>
          <meta charSet='utf-8' />

          <link
            rel='stylesheet'
            href='//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
          />
          <link rel='icon' type='image/vnd.microsoft.icon' href='/favicon.ico' />

          <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
          <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
          <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
          <link rel='manifest' href='/site.webmanifest' />

          <script
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_GOOGLE_MAPS_API_KEY}&libraries=places`}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
