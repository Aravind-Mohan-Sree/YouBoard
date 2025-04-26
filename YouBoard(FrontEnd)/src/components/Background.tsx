import {
  KeyRound,
  Shield,
  LockKeyhole,
  User2,
  Fingerprint,
} from "lucide-react";

const Background = () => {
  return (
    <>
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-15 p-8">
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} className="text-gray-100/50 mx-auto">
              {i % 5 === 0 && <Shield size={60} />}
              {i % 5 === 1 && <KeyRound size={60} />}
              {i % 5 === 2 && <Fingerprint size={60} />}
              {i % 5 === 3 && <User2 size={60} />}
              {i % 5 === 4 && <LockKeyhole size={60} />}
            </div>
          ))}
        </div>
      </div>

      {/* Blue wave */}
      <div className="absolute bottom-0 w-full h-1/3">
        <div className="absolute bottom-0 w-full h-full bg-blue-600 rounded-t-[50%] transform scale-x-125"></div>
      </div>
    </>
  );
};

export default Background;
