import { request } from "@/utils/appHelpers";

const isDev: boolean = import.meta.env.DEV;

export const getBlurHashEncode = async (blob: Blob) => {
  if (isDev) console.log(">>> api: get blurHash encode");
  const start = Date.now();

  const res = await request.post<{ data: { encode: string } }>(
    "/image/encode",
    blob,
  );
  let encode = "";
  if (res) {
    encode = res.data.data.encode;
  }

  const consuming = (Date.now() - start) / 1000;
  console.log(">>> api: get blurHash encode finished after", consuming);
  return { encode };
};

export const optimizeImage = async (imageFile: File) => {
  const fd = new FormData();
  fd.append("file", imageFile);
  const start = Date.now();

  if (isDev) console.log(">>> api: optimize image");
  const res = await request.post("/image/optimize", fd, {
    responseType: "blob",
  });

  let imageBlob;
  if (res) {
    // if use fetch => await res.blob()
    imageBlob = res.data;
  }

  const consuming = (Date.now() - start) / 1000;
  console.log(">>> api: optimize finished after", consuming);

  return imageBlob;
};
