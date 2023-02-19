import React from 'react';
import Avatar from 'react-avatar-edit';

type Props = {
  setPreview: Function;
  setProfileImage: Function;
  setNullProfileBase64Data: Function;
  profileBase64Data: string | null | undefined;
};

interface State {
  preview: any;
  src: string | null | undefined;
}

class ImageUploaderAccProfile extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      preview: null,
      src: props.profileBase64Data,
    };
    this.onCrop = this.onCrop.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onFileLoad = this.onFileLoad.bind(this);
  }

  onClose() {
    const { setPreview, setProfileImage, setNullProfileBase64Data } = this.props;
    this.setState({ preview: null });
    setPreview(null);
    setProfileImage(null);
    setNullProfileBase64Data();
  }

  onCrop(preview) {
    const { setPreview } = this.props;
    this.setState({ preview });
    setPreview(preview, true);
  }

  onFileLoad(file) {
    const { setProfileImage } = this.props;
    setProfileImage(file);
  }

  render() {
    const { src } = this.state;
    return (
      <div className='file-upload'>
        <Avatar
          width={429}
          height={429}
          imageWidth={429}
          label='CLICK TO UPLOAD'
          onCrop={this.onCrop}
          onClose={this.onClose}
          onFileLoad={this.onFileLoad}
          src={src ? src : ''}
        />
      </div>
    );
  }
}

export default ImageUploaderAccProfile;
