const ErrorContainer = () => {
  return (
    <main className="text-white bg-gray-800 sm:mx-auto mt-10 z-10 rounded-lg mx-4 shadow-2xl">
      <div className="flex flex-col justify-center items-center p-10 gap-3">
        <h1 className="text-7xl sm:text-9xl font-bold">404</h1>
        <p className="sm:text-2xl text-center">
          Unable to find what you are looking for...
        </p>
        <button
          className="bg-blue-600 rounded-full hover:bg-blue-800 transition-all px-4 py-2 cursor-pointer mt-5"
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>
    </main>
  );
};

export default ErrorContainer;
