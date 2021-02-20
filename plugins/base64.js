export default (context, inject) => {
  let readUploadedFileAsBase64 = inputFile => {
    const temporaryFileReader = new FileReader();

    return new Promise((resolve, reject) => {
      temporaryFileReader.onerror = () => {
        temporaryFileReader.abort();
        reject(new DOMException("(Base64 plugin) Problem parsing input file."));
      };

      temporaryFileReader.onload = () => {
        resolve(temporaryFileReader.result);
      };

      try {
        temporaryFileReader.readAsDataURL(inputFile);
      } catch {
        reject(new DOMException("(Base64 plugin) Problem parsing input file."));
      }
    });
  };

  inject("base64", readUploadedFileAsBase64);
};
