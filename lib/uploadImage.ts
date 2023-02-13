// import axios from 'axios';

export const uploadToCloudinary = async (image: File) => {
  const cloudinaryUrl = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!;
  const formData = new FormData();
  formData.append('file', image);
  formData.append(
    'upload_preset',
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
  );

  try {
    const response = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();
    const imageUrl = data.secure_url;
    return imageUrl;
  } catch (error) {
    console.error(error);
  }
};
