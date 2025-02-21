'use client';

import Link from 'next/link';
import { useAppContext } from '../context';
import { formattedDate } from '../utils';

const Movie = () => {
  const { state } = useAppContext();
  const { id, title, description, thumbnail, releaseDate, duration, views } = state.video;

  return (
    <div
      className="relative flex flex-col md:flex-row items-center justify-center text-white rounded-lg overflow-hidden shadow-lg 
      w-full md:w-3/4 mx-auto min-h-screen md:min-h-[60vh] lg:min-h-[80vh] py-8 md:py-0"
      style={{ backgroundImage: `url(${thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      <div className="relative flex flex-col md:flex-row w-full items-center md:items-start">
        {/* Left: Movie Poster */}
        <div className="relative w-full md:w-1/3 p-4 flex justify-center">
          <img className="w-3/4 md:w-full rounded-lg shadow-lg" src={thumbnail} alt={title} />
        </div>

        {/* Right: Movie Details */}
        <div className="relative w-full md:w-2/3 p-4 md:p-6 text-center md:text-left">
          {/* Title & Release Info */}
          <h1 className="text-2xl md:text-4xl font-bold">
            {title} <span className="text-gray-300 text-xl md:text-2xl">({new Date(releaseDate).getFullYear()})</span>
          </h1>
          <p className="text-gray-400 mt-1">{formattedDate(releaseDate)} • {duration} min</p>

          {/* Description */}
          <h2 className="mt-4 text-lg md:text-xl font-semibold">Overview</h2>
          <p className="mt-2 text-gray-200">{description}</p>

          {/* Extra Details */}
          <p className="mt-4 text-gray-400">Views: {views}</p>

          {/* Play video */}
          <Link
            href={`/stream/${id}`}
            passHref
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded-md font-bold flex items-center justify-center w-48 
            hover:bg-red-700 hover:scale-105 transition-all duration-300 mx-auto md:mx-0"
          >
            ▶ Watch Movie
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Movie;
