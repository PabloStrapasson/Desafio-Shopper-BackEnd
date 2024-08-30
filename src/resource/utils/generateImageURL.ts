import getBase64ImageType from './getbase64ImageType';

export default function generateImageURL(image: string) {
  const imageMimeType = getBase64ImageType(image[0]);
  const baseUrl = `data:${imageMimeType};base64,`;
  const imageURL = baseUrl + image;

  return imageURL;
}
