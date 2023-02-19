import { Input, InputGroup, Table } from 'reactstrap';

const MerchantAccountDownloadTable = () => {
  return (
    <div className='TableMemberTransactionHistory w-100'>
      <div className='TableTransaction-acc'>
        <Table>
          <thead>
            <tr>
              <th className='date-header'>Date</th>
              <th className='address-header'>Gross Earnings</th>
              <th className='value-header'></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='date-number'>12/2019</td>
              <td>$2,500.00</td>
              <td>
                <a href='http://example.com'>
                  <div>
                    <a href='http://example.com'>
                      <div>Download Full Report</div>
                    </a>
                  </div>
                </a>
              </td>
            </tr>
            <tr>
              <td className='date-number'>11/30/2019</td>
              <td>$10,000.00</td>
              <td>
                <a href='http://example.com'>
                  <div>
                    <a href='http://example.com'>
                      <div>Download Full Report</div>
                    </a>
                  </div>
                </a>
              </td>
            </tr>
            <tr>
              <td className='date-number'>10/31/2019</td>
              <td>$5,000.00</td>
              <td>
                <a href='http://example.com'>
                  <div>Download Full Report</div>
                </a>
              </td>
            </tr>
            <tr>
              <td className='date-number'>9/30/2019</td>
              <td>$4,600.00</td>
              <td>
                <a href='http://example.com'>
                  <div>Download Full Report</div>
                </a>
              </td>
            </tr>
            <tr>
              <td className='date-number'>8/31/2019</td>
              <td>$12,000.00</td>
              <td>
                <a href='http://example.com'>
                  <div>Download Full Report</div>
                </a>
              </td>
            </tr>
            <tr>
              <td className='date-number'>7/31/2019</td>
              <td>$5,000.00</td>
              <td>
                <a href='http://example.com'>
                  <div>Download Full Report</div>
                </a>
              </td>
            </tr>
            <tr>
              <td className='date-number'>6/30/2019</td>
              <td>$5,500.00</td>
              <td>
                <a href='http://example.com'>
                  <div>Download Full Report</div>
                </a>
              </td>
            </tr>
            <tr>
              <td className='date-number'>5/31/2019</td>
              <td>$6,500.00</td>
              <td>
                <a href='http://example.com'>
                  <div>Download Full Report</div>
                </a>
              </td>
            </tr>
            <tr>
              <td className='date-number'>4/30/2019</td>
              <td>$3,200.00</td>
              <td>
                <a href='http://example.com'>
                  <div>Download Full Report</div>
                </a>
              </td>
            </tr>
            <tr>
              <td className='date-number'>3/31/2019</td>
              <td>$3,200.00</td>
              <td>
                <a href='http://example.com'>
                  <div>Download Full Report</div>
                </a>
              </td>
            </tr>
            <tr>
              <td className='date-number'>2/28/2019</td>
              <td>$4,000.00</td>
              <td>
                <a href='http://example.com'>
                  <div>Download Full Report</div>
                </a>
              </td>
            </tr>
            <tr>
              <td className='date-number'>1/31/2019</td>
              <td>$4,3,00.00</td>
              <td>
                <a href='http://example.com'>
                  <div>Download Full Report</div>
                </a>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default MerchantAccountDownloadTable;
