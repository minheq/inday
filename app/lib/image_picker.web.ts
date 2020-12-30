import type {
  ImageCropPicker,
  Options,
  Image,
} from 'react-native-image-crop-picker';

const imageInput = document.createElement('input');
imageInput.setAttribute('accept', 'image/png, image/jpg, image/jpeg');
imageInput.setAttribute('type', 'file');
imageInput.setAttribute('multiple', 'true');
imageInput.setAttribute('id', 'file-image-upload');
imageInput.style.display = 'none';

document.body.appendChild(imageInput);

const MediaTypeInput = {
  any: 'video/mp4,video/quicktime,video/x-m4v,video/*,image/*',
  photo: 'image/*',
  video: 'video/mp4,video/quicktime,video/x-m4v,video/*',
};

export const ImagePicker: ImageCropPicker = {
  openPicker: (options: Options): Promise<Image | Image[]> => {
    return openFileBrowser(options);
  },
  openCamera: (options: Options): Promise<Image | Image[]> => {
    return openFileBrowser(options, true);
  },
  openCropper: (_options: Options): Promise<Image> => {
    throw new Error('No implemented yet');
  },
  clean: (): Promise<void> => {
    throw new Error('No available on web');
  },
  cleanSingle: (_path: string): Promise<void> => {
    throw new Error('No available on web');
  },
};

function openFileBrowser(
  options: Options,
  capture?: boolean,
): Promise<Image | Image[]> {
  const { multiple, mediaType = 'photo' } = options;
  const mediaTypeFormat = MediaTypeInput[mediaType];

  const input = document.createElement('input');
  input.style.display = 'none';
  input.setAttribute('type', 'file');
  input.setAttribute('accept', mediaTypeFormat);
  if (multiple) {
    input.setAttribute('multiple', 'multiple');
  }
  if (capture) {
    input.setAttribute('capture', 'camera');
  }
  document.body.appendChild(input);

  return new Promise((resolve, reject) => {
    input.addEventListener('change', () => {
      if (input.files) {
        if (multiple) {
          const files = input.files;

          Promise.all(Array.from(files).map(toImage)).then((images) =>
            resolve(images),
          );
        } else {
          const file = input.files[0];

          toImage(file).then(resolve);
        }
      } else {
        reject('Image not selected');
      }

      document.body.removeChild(input);
    });

    const event = new window.MouseEvent('click');
    input.dispatchEvent(event);
  });
}

async function toImage(file: File): Promise<Image> {
  const { width, height, uri } = await getImageData(file);

  return {
    path: uri,
    size: file.size,
    data: null,
    width: width,
    height: height,
    mime: file.type,
    exif: null,
    cropRect: null,
    filename: file.name,
    creationDate: `${file.lastModified}`,
    modificationDate: `${file.lastModified}`,
  };
}

// https://github.com/ivpusic/react-native-image-crop-picker/issues/1168
// const data = new FormData();
// data.append('uid', loginid);
// data.append('email', email);
// data.append('name', Fullname);
// if (pic != null) {
//     console.log('image data',pic)
//     data.append('input_img', {
//         uri: pic.uri,
//         type: pic.type,
//         name: pic.name,
//     });
// }
// fetch(uploadUrl, {
//     method: 'post',
//     body: data
// }).then((response) => response.json())
//     .then((responseJson) => {
//
//     });

// https://stackoverflow.com/questions/37457128/react-open-file-browser-on-click-a-div
// var form = new FormData();
// form.append('file', this.state.file);
// YourAjaxLib.doUpload('/yourEndpoint/',form).then(result=> console.log(result));

function getImageData(
  file: File,
): Promise<{ width: number; height: number; uri: string }> {
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader();
    reader.onerror = () => {
      reject('Failed to read the selected media because the operation failed.');
    };
    reader.onload = ({ target }) => {
      const uri = (target as any).result;

      const returnRaw = () => {
        reject('Image failed to load');
      };

      if (typeof target?.result === 'string') {
        const image = new Image();
        image.src = target.result;
        image.onload = function () {
          resolve({
            width: image.naturalWidth ?? image.width,
            height: image.naturalHeight ?? image.height,
            uri,
          });
        };
        image.onerror = () => {
          returnRaw();
        };
      } else {
        returnRaw();
      }
    };
    // Read in the image file as a binary string.
    reader.readAsDataURL(file);
  });
}
