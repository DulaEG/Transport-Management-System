import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseConfig";

export const uploadFile = async (file, path) => {
  try {
    const fileRef = ref(storage, `products/${file.name}`);
    return await uploadBytesResumable(fileRef, file)
      .then(async (res) => {
        const url = await getDownloadURL(res.ref);
        return url;
      })
      .catch((err) => {
        throw Error(`${err}`);
      });
  } catch (error) {
    throw Error(`${error}`);
  }
};
