import { fromMoney } from '@boom-platform/globals';
import moment from 'moment';
import Image from 'next/image';

import { replaceDomain } from '../../utils/images';

const myLoader = ({ src }) => {
  return src;
};

const SearchResultItem: React.FC<{ item: any; now: number; handleSelect: (item: any) => void }> = ({
  item,
  now,
  handleSelect,
}) => {
  console.log('item.imageUrl', item?.imageUrl);
  return (
    <div
      className={'search-item'}
      onClick={(e) => {
        e.preventDefault;
        handleSelect(item);
      }}
    >
      <div className={'searchCard-image'}>
        {item?.imageUrl ? (
          <Image
            src={replaceDomain(item?.imageUrl)}
            alt={'Image: ' + item.name}
            width={200}
            height={200}
            loader={myLoader}
          />
        ) : (
          <div>No Image</div>
        )}
      </div>

      <div className={'searchCard-info'}>
        <div className={'searchCard-name'}>{item.name}</div>
        <div className={'searchCard-name'}>
          <div className={'display-flex'}>
            <div>{fromMoney(item.price)}</div>
            {item.offer &&
              item.offer?.expiration &&
              item.offer.expiration > now &&
              item.offer?.startDate &&
              item.offer.startDate < now && (
                <div>
                  <div>Cashback: {fromMoney(item.offer.cashBackPerVisit)}</div>
                  <div>
                    Expires {moment.unix(item.offer.expiration).local().format('MM/DD/YYYY')}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultItem;
