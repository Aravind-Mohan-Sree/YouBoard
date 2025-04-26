import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { CircleUserRound } from "lucide-react";

const Landing = () => {
  const { name, imageUrl } = useSelector((store: RootState) => store.auth);

  function greet(): string {
    const now = new Date();
    const hours = now.getHours();

    if (hours >= 5 && hours < 12) {
      return "Good morning,";
    } else if (hours >= 12 && hours < 17) {
      return "Good afternoon,";
    } else if (hours >= 17 && hours < 21) {
      return "Good evening,";
    } else {
      return "Good night,";
    }
  }

  return (
    <main className="z-10 px-4 sm:px-10 py-6 mt-10">
      <div className="text-white flex flex-col sm:flex-row justify-center items-center gap-6 bg-gray-800 p-6 sm:p-10 w-full max-w-3xl mx-auto rounded-3xl">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Profile"
            className="w-40 rounded-full object-cover border-2"
          />
        ) : (
          <CircleUserRound
            size={160}
            className="text-white border-2 rounded-full"
          />
        )}
        <h1 className="font-bold text-3xl sm:text-5xl leading-normal border-t-4 sm:border-t-0 sm:border-l-4 border-white px-2 sm:px-0 pt-4 sm:pt-0 sm:ms-2 text-center sm:text-right break-words w-65 md:w-110">
          <span className="font-extralight">{greet()}</span> <br /> {name}!
        </h1>
      </div>
    </main>
  );
};

export default Landing;
