import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] backdrop-blur-sm flex justify-center items-center pointer-events-auto">
      <Loader2 className="text-white animate-spin w-30 md:w-40 lg-50 h-auto" />
    </div>
  );
};

export default Loader;
