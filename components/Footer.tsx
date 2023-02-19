import Link from 'next/link';
import React, { FunctionComponent } from 'react';

interface Props {
  appVersion?: string;
}
const NavBar: FunctionComponent<Props> = ({ appVersion }) => (
  <footer>
    <div className='app-footer container-fluid'>
      <div className=''>
        <div className='row'>
          <div className='col d-flex justify-content-center'>
            <div>
              <h4>Members</h4>
              <br />
              <ul className='column-links'>
                <li>
                  <Link href='/docs/about'>
                    <a>What Is Moob Marketplace</a>
                  </Link>
                </li>
                {/**
                 * Per Noel's request, this link is removed for the time being
                 */}
                {/* <li>
                  <Link href='/docs/location'>
                    <a>Locations</a>
                  </Link>
                </li> */}
                <li>
                  <Link href='/docs/get-app'>
                    <a>Get the App</a>
                  </Link>
                </li>
                {/**
                 * Member Support link should pull up the FAQ page for members
                 */}
                <li>
                  <Link href='/docs/member-faq'>
                    <a>Support</a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className='col d-flex justify-content-center'>
            <div>
              <h4>Business</h4>
              <br />
              <ul className='column-links'>
                <li>
                  <Link href='/docs/get-started'>
                    <a>Get Started</a>
                  </Link>
                </li>
                <li>
                  <Link href='/docs/guidelines'>
                    <a>Branding Assets & Guidelines</a>
                  </Link>
                </li>
                <li>
                  <Link href='/docs/merchant-faq'>
                    <a>Support</a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className='col d-flex justify-content-center'>
            <div>
              <h4>Company</h4>
              <br />
              <ul className='column-links'>
                <li>
                  <Link href='/docs/about'>
                    <a>Who We Are</a>
                  </Link>
                </li>
                <li>
                  <Link href='docs/employment'>
                    <a>Employment</a>
                  </Link>
                </li>
                <li>
                  <Link href='/docs/affiliate'>
                    <a>Legal</a>
                  </Link>
                </li>
                <li>
                  <Link href='/docs/contact-us'>
                    <a>Contact Us</a>
                  </Link>
                </li>
                <li>
                  <Link href='/docs/blog'>
                    <a>Blog</a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className='col d-flex justify-content-center'>
            <div>
              <h4>Social</h4>
              <br />
              <ul className='column-links'>
                <li>
                  <Link href='https://www.facebook.com/moobmarketplace'>
                    <a target='_blank'>Facebook</a>
                  </Link>
                </li>
                <li>
                  <Link href='https://www.linkedin.com/company/moob-marketplace'>
                    <a target='_blank'>LinkedIn</a>
                  </Link>
                </li>
                <li>
                  <Link href='https://twitter.com/moobmarketplace'>
                    <a target='_blank'>Twitter</a>
                  </Link>
                </li>
                <li>
                  <Link href='https://www.instagram.com/moobmarketplace/'>
                    <a target='_blank'>Instagram</a>
                  </Link>
                </li>
                <li>
                  <Link href='https://www.youtube.com/channel/UCO-4mA3viBoU_tAMsZBN7XQ'>
                    <a target='_blank'>YouTube</a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className='col d-flex justify-content-center'>
            <div>
              <h4>Contact</h4>
              <br />
              <ul className='column-links'>
                <li>
                  <Link href='/docs/contact-us'>
                    <a>Contact Us</a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {process.env.NODE_ENV !== 'live' && appVersion && <div className='row'>{appVersion}</div>}
      </div>
    </div>
  </footer>
);

export default NavBar;
