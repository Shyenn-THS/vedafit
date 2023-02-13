import ErrorMessage from '@/components/ErrorMessage';
import db from '@/lib/firebase';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
} from 'firebase/firestore';
import moment from 'moment';
import { User } from 'next-auth';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AiFillQuestionCircle, AiOutlineSend } from 'react-icons/ai';
import { AiOutlineLike } from 'react-icons/ai';
import { BsBookmarkCheck, BsShare } from 'react-icons/bs';
import { HiChatAlt2 } from 'react-icons/hi';

type Props = {};
type AskProps = {
  question: string;
  answers: string;
};

type QA = {
  question: string;
  user: User;
  answer: string | null;
  date: string;
};

const Ask = (props: Props) => {
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<QA>();

  const [processing, setProcessing] = useState<boolean>(false);
  const [questions, setQuestions] = useState<QA[]>();

  const onSubmit = async (data: QA) => {
    const { question } = data;

    if (question.length < 10) {
      toast.error(
        'Please ask a valid question greater than length of 10 charecters.'
      );
      return;
    }

    try {
      await addDoc(collection(db, 'qa'), {
        question,
        user: session?.user,
        answered: false,
        date: new Date().toISOString(),
      });
      toast.success('Question Asked Successfully!');
      setValue('question', '');
    } catch (error) {
      console.error(error);
      toast.error('Oops, Some Error occured while asking the question!');
    }
  };

  useEffect(() => {
    if (!session) {
      return;
    }
    const getQuestions = async () => {
      const questionsCollection = collection(db, 'qa');
      const questionQuery = query(
        questionsCollection,
        orderBy('date', 'desc'),
        limit(10)
      );
      const questionsSnap = await getDocs(questionQuery);
      let questions = [];
      questionsSnap.forEach((doc) => {
        const data = doc.data();
        questions.push(data);
      });

      setQuestions(questions);
    };

    getQuestions();
  }, [session]);

  if (!session) {
    return (
      <ErrorMessage
        action={{ name: 'Sign In', func: signIn }}
        message="Please Login to Ask Question and Get Answers from our Experts"
      />
    );
  }

  const AskCard = (AskProps: QA) => {
    const { question, answer, user, date } = AskProps;
    const { fname, image, username, lname } = user;
    return (
      <div className="flex flex-col max-w-lg p-6 space-y-6 overflow-hidden rounded-lg shadow-md bg-gray-200">
        <div className="flex space-x-4">
          <Image
            alt={name}
            src={image}
            height={50}
            width={50}
            className="object-cover rounded-full shadow dark:bg-gray-500"
          />
          <div className="flex flex-col space-y-1">
            <Link
              rel="noreferrer"
              target="_blank"
              href={`/profile/${username}`}
              className="text-sm font-semibold"
            >
              {fname + ' ' + lname}
            </Link>
            <span className="text-xs dark:text-gray-400">
              {moment(date).format('MMMM Do YYYY, h:mm:ss')}
            </span>
          </div>
        </div>
        <div>
          <h2 className="mb-1 text-xl font-semibold">{question}</h2>
          <p className="text-sm dark:text-gray-400 line-clamp-2">
            {answer ? answer : 'Not yet answered!'}
          </p>
        </div>
        <div className="flex flex-wrap justify-between">
          <div className="space-x-2">
            <button
              aria-label="Share this post"
              type="button"
              className="p-2 text-center"
            >
              <BsShare className="text-lg" />
            </button>
            <button
              aria-label="Bookmark this post"
              type="button"
              className="p-2"
            >
              <BsBookmarkCheck className="text-lg" />
            </button>
          </div>
          <div className="flex space-x-2 text-sm dark:text-gray-400">
            <button type="button" className="flex items-center p-1 space-x-1.5">
              <HiChatAlt2 className="text-lg" />
              <span>30</span>
            </button>
            <button type="button" className="flex items-center p-1 space-x-1.5">
              <AiOutlineLike />
              <span>283</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main>
      <section className="dark:bg-gray-800 dark:text-gray-100">
        <div className="container flex flex-col justify-center px-4 py-8 mx-auto md:p-8">
          <h2 className="mb-12 text-4xl font-bold leading-none text-center sm:text-5xl">
            Ask or Read from experts!
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full flex">
            <textarea
              className="w-full p-4 bg-gray-200"
              placeholder="Ask Your Question"
              {...register('question')}
            ></textarea>
            <button
              type="submit"
              className="bg-green-700 cursor-pointer flex rounded-r-2xl justify-between items-center px-4 py-2 text-white flex-1"
            >
              <AiOutlineSend className="text-xl" />
            </button>
          </form>

          <hr className="h-0.5 w-full bg-white my-4" />

          <section className="flex flex-col py-10">
            <h1 className="text-2xl text-white font-medium flex space-x-2 items-center">
              <span>Recently Asked Questions</span>
              <AiFillQuestionCircle />
            </h1>
            <div className="grid grid-cols-3 gap-4 py-10">
              {questions?.map((q, idx) => {
                const { answer, question, user } = q;
                return (
                  <AskCard
                    question={question}
                    answers={answer ? answer : ''}
                    user={user}
                    key={idx}
                  />
                );
              })}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
};

export default Ask;
