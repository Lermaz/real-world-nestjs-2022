import { diskStorage } from 'multer';
import { extname } from 'path';

export const storage = (destination, image = true) => {
  let filter;

  if (image) {
    filter = imageFileFilter;
  }
  return {
    storage: diskStorage({
      destination: destination,
      filename: editFileName,
    }),
    fileFilter: filter,
  };
};

const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Image files are only allowed!'), false);
  }
  callback(null, true);
};

const editFileName = (req, file, callback) => {
  const fileExtName = extname(file.originalname);
  const date = new Date();
  const dateName = `${date.getDay()}${date.getMonth()}${date.getDate()}`;
  const hourName = `${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
  const randomName = Array(5)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${dateName}${hourName}-${randomName}${fileExtName}`);
};
