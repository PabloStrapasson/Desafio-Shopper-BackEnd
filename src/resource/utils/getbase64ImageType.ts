export default function getBase64ImageType(firstCaracter: string) {
  // '/' = jpg, 'i' = png, 'R' = gif, 'U' = webp
  if (firstCaracter === '/') {
    return 'image/jpg';
  }
  if (firstCaracter === 'i') {
    return 'image/png';
  }
}
