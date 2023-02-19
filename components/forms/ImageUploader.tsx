import React, { FC, ReactElement, useRef, useState } from 'react';

// interface Props {}

const ImageUploader: FC = (): ReactElement => {
  const fileUploader = useRef<HTMLInputElement | null>(null);
  const [pimage, setPImage] = useState('');
  let form_data;

  const uploadImageChange = () => {
    fileUploader.current?.click();
  };
  const changeImage = (event) => {
    if (event.target.files && event.target.files[0]) {
      setPImage(URL.createObjectURL(event.target.files[0]));
      form_data = new FormData();
      form_data.append('file', event.target.files[0], event.target.files[0].name);
    }
  };

  return (
    <div className='d-flex d-wrap justify-content-center m-2' onClick={uploadImageChange}>
      <input
        type='file'
        id='file'
        ref={fileUploader}
        style={{ display: 'none' }}
        onChange={changeImage}
        alt='Profile'
      />
      <div style={{ cursor: 'pointer' }}>
        {pimage.length === 0 ? (
          <div>
            <h2>
              UPLOAD
              <br /> PRODUCT IMAGE
            </h2>
            <i className='fa fa-upload fa-5x'></i>
            <br />
            <span>
              CLICK TO UPLOAD
              <br />
              600px x 600px
            </span>
          </div>
        ) : (
          <img width={300} height={300} src={pimage} alt='Profile' />
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
