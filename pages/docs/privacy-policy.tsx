import { NextPageContext } from 'next';

import { NextLayoutPage } from '../../types';

const Page: NextLayoutPage = () => {
  return (
    <div style={{ backgroundColor: '#cccccc' }}>
      <div style={{ padding: '3rem' }}>
        <h1>Privacy Policy</h1>

        <p>
          Moob Marketplace is committed to protecting your privacy. The following is our information
          gathering and dissemination policy. Upon registering and accessing our site, you agree to
          the following:
        </p>

        <p>
          We do not collect personal information when you visit our site unless you complete the
          optional registration for a Moob card. If you do register, we will not disclose any of
          your personal information to third parties.{' '}
        </p>

        <p>
          When providing personal information, we may ask for contact information such as name,
          postal address, and email address. With your permission, we will use contact information
          to send newsletters, information about Moob Marketplace, or other promotional materials.
          We reserve the right to disclose to third parties information about general subscriber
          usage of our website and any related services, including information gathered during your
          use of our site. Any information disclosed will be in the form of aggregate data (such as
          overall patterns or demographic reports) that does not describe or identify any individual
          user. We may disclose information when legally compelled to do so, in other words, when
          we, in good faith, believe that the law requires it or for the protection of our or your
          legal rights.
        </p>

        <p>
          We use email links or web forms throughout the website for customer comments, reviews,
          questions and suggestions. Provision of reviews is optional, and your review will be
          listed publicly on our website with the merchant’s name. Any information we collect from
          emails or web forms is used for the purpose of logging reviews, or responding to the
          questions, comments or suggestions. Please recognize that email and web form transmissions
          through our site, or otherwise made by means of the Internet, are not encrypted and cannot
          be made absolutely secure. Moob will have no liability for disclosure of data due to
          errors in transmission or unauthorized acts of third parties.{' '}
        </p>

        <p>
          We are not responsible for the practices employed by merchants, including their respective
          websites, which are linked to or from our website. Further, we are not responsible for the
          information or content contained within merchant websites. We are not responsible for any
          transactions, or the security of such transactions, with merchants participating in the
          Moob Marketplace program. Before providing private information to any business, including
          our merchants, you should carefully review their privacy statements and other conditions
          of use. You affirmatively agree that you undertake any such transactions with the
          merchants at your own risk.
        </p>
      </div>
    </div>
  );
};

Page.getInitialProps = async (context: NextPageContext) => {
  return {
    globalProps: {
      headTitle: 'Privacy Policy',
    },
  };
};

export default Page;
