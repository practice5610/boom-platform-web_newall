const HeaderAccount = ({ title, renderHeaderItem = () => {} }) => {
  return (
    <div className='HeaderAccount'>
      <div className='member-header d-flex align-items-center justify-content-between'>
        <h2>{title}</h2>
        {renderHeaderItem()}
      </div>
    </div>
  );
};

export default HeaderAccount;
