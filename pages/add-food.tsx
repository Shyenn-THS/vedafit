import ErrorMessage from '@/components/ErrorMessage';
import NutrientsTable from '@/components/NutrientsTable';
import db from '@/lib/firebase';
import { uploadToCloudinary } from '@/lib/uploadImage';
import { titleCase } from '@/lib/utilityFunctions';
import { Dish } from '@/types/typings';
import classNames from 'classnames';
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState, useRef, useEffect, RefObject } from 'react';
import toast from 'react-hot-toast';
import PieChart from '../components/Charts/PieChart';

const AddImage = ({ items }: { items: Dish[] }) => {
  const videoRef = useRef<HTMLVideoElement>();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [mounted, setMounted] = useState<Boolean>(false);
  const [image, setImage] = useState<File>();
  const [preview, setPreview] = useState<string | undefined>();
  const hiddenFileInput = useRef<RefObject<HTMLInputElement>>();
  const [dish, setDish] = useState<Dish>();
  const { data: session } = useSession();
  const [dishName, setDishName] = useState<string>();

  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = () => {
    hiddenFileInput?.current.click();
  };

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      await getDatails(file);
    }
  };

  const startStream = async () => {
    setProcessing(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      setStream(mediaStream);
      console.log(videoRef);
      videoRef.current.srcObject = mediaStream;
      videoRef.current?.play();
    } catch (error) {
      console.error('Error accessing webcam', error);
    } finally {
      setProcessing(false);
    }
  };

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });

      setStream(null);
    }
  };

  const captureImage = async () => {
    if (!videoRef.current) return;
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas?.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    if (canvas == null) throw new Error('Could not get canvas');
    setPreview(canvas.toDataURL('image/png'));

    canvas.toBlob(async (blob) => {
      const file = new File([blob], 'Image Captured');
      setImage(file);
      await getDatails(file);
      stopStream();
    });
  };

  const getDatails = async (img: File) => {
    if (!img) return;
    setProcessing(true);

    const formData = new FormData();
    formData.append('image', img);

    try {
      await fetch('http://localhost:5000/identify', {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          const dName = titleCase(data?.dish.replaceAll('_', ' '));
          console.log(data);
          setDishName(dName);
        });
    } catch (error) {
      console.error('Error sending image', error);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (!dishName) return;
    getData();
  }, [dishName]);

  const getData = async () => {
    try {
      const q = query(collection(db, 'food'), where('name', '==', dishName));
      const querySnapshot = await getDocs(q);
      const dishSnap = querySnapshot.docs[0];

      if (dishSnap) {
        setDish(dishSnap.data());
      } else {
        // doc.data() will be undefined in this case
        toast.error('Something Went Wrong!');
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const addItem = async () => {
    setProcessing(true);
    try {
      let dishImageUrl = image ? await uploadToCloudinary(image!) : preview;
      const q = query(collection(db, 'food'), where('name', '==', dishName));
      const querySnapshot = await getDocs(q);
      const dishSnap = querySnapshot.docs[0];

      const itemReportId = await addDoc(collection(db, 'itemReport'), {
        ...dishSnap.data(),
        image: dishImageUrl,
        date: new Date().toISOString(),
      });

      const userRef = doc(db, 'users', session?.user.email);
      await updateDoc(userRef, {
        foodIntakeHistory: arrayUnion(itemReportId),
      });

      router.push('/food-intake-history');

      toast.success('Sucessfuly added item to your intake');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setProcessing(false);
    }
  };

  if (!session) {
    return (
      <ErrorMessage
        action={{ name: 'Sign In', func: signIn }}
        message="Please Login to Add Food Intake"
      />
    );
  }

  if (!mounted) {
    return <div className=""></div>;
  }

  return (
    <main className="py-20">
      <div className="flex items-center w-3/4 h-96 mx-auto rounded-lg shadow-xl">
        <div className="w-1/2 bg-black h-full">
          <video
            ref={videoRef}
            autoPlay
            className="w-full h-full"
            hidden={!stream}
          />
          <div
            className={classNames(
              'w-full relative h-full ',
              stream ? 'hidden' : 'block'
            )}
          >
            <div
              onClick={handleClick}
              className="absolute z-10 top-0 w-full h-full text-white left-0 bg-black bg-opacity-70 cursor-pointer flex flex-col items-center justify-center"
            >
              Click To Upload / Select Item
            </div>
            <Image
              fill
              src={preview ? preview : '/assets/svg/Add Food.svg'}
              alt="Captured from webcam"
              className="object-cover"
            />
          </div>
        </div>
        <div className="px-10 space-y-10 flex flex-col justify-center items-center w-1/2 bg-gradient-to-r from-gray-500 to-gray-300 h-full">
          <input
            onChange={handleChange}
            type="file"
            ref={hiddenFileInput}
            hidden
          />

          <div className="flex flex-col justify-center space-y-2 items-center">
            <h1 className="text-2xl">Select an Item</h1>
            <select className="w-80 px-4 py-2" size={4}>
              {items?.map((opt, idx) => {
                return (
                  <option
                    className="space-x-2 uppercase"
                    key={idx}
                    onClick={() => {
                      setPreview(
                        `https://source.unsplash.com/random/1080x1080/?${dishName}`
                      );
                      setDishName(opt.name.replaceAll('_', ' '));
                    }}
                  >
                    {opt.name.replaceAll('_', ' ')}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl">Upload your daily intake</h1>

            <div className="flex items-center space-x-4 w-full">
              {mounted && navigator.mediaDevices ? (
                <button
                  className="btn bg-gray-700 whitespace-nowrap w-full"
                  onClick={!stream ? startStream : stopStream}
                >
                  {stream ? 'Stop Capture' : 'Start Capture'}
                </button>
              ) : null}
              <button
                onClick={captureImage}
                className="btn bg-gray-700 whitespace-nowrap w-full"
              >
                Capture Image
              </button>
            </div>
            {dishName && (
              <button
                className={classNames(
                  'btn btn-success w-full whitespace-nowrap disabled:animate-pulse disabled:bg-opacity-70 disabled:cursor-not-allowed',
                  processing ? 'btn-loading' : ''
                )}
                onClick={addItem}
                disabled={processing}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>

      {dish ? (
        <section className="p-10 space-y-4">
          <h1 className="text-4xl text-center text-semibold">Item Details</h1>
          <div className="p-6 space-y-8">
            <h2 className="text-2xl font-medium">
              Dish Name:{' '}
              <span className="font-light text-green-900">{dish.name}</span>
            </h2>
            <div className="grid grid-cols-4 gap-x-6 gap-y-4">
              <div className="flex flex-col justify-center items-center space-y-4">
                <PieChart lable="Calories" ci={dish?.calories} ri={8} />
                <h4>Calories</h4>
              </div>
              <div className="flex flex-col justify-center items-center space-y-4">
                <PieChart
                  lable="Carbohydrate"
                  ci={dish?.carbohydrates / 10000}
                  ri={8}
                />
                <h4>Carbohydrate</h4>
              </div>
              <div className="flex flex-col justify-center items-center space-y-4">
                <PieChart lable="Fat" ci={dish?.fat / 100000} ri={8} />
                <h4>Fat</h4>
              </div>
              <div className="flex flex-col justify-center items-center space-y-4">
                <PieChart
                  lable="Proteins"
                  ci={dish?.proteins / 100000}
                  ri={8}
                />
                <h4>Proteins</h4>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-8">
            <h2 className="text-2xl font-medium">Other Nutrients:</h2>
            <NutrientsTable data={dish?.nutrients} />
          </div>
        </section>
      ) : null}
    </main>
  );
};

export const getServerSideProps = async () => {
  const itemsCollection = collection(db, 'food');
  const itemsQuery = query(itemsCollection);
  const itemsSnap = await getDocs(itemsQuery);
  let items: any = [];
  itemsSnap.forEach((doc) => {
    const data = doc.data();
    items.push({ ...data, id: doc.id });
  });

  return {
    props: {
      items,
    },
  };
};

export default AddImage;
