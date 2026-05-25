import { Loader2 } from "lucide-react";

export default function LoadingScreen({ message = "Loading..." }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 animate-fade-in">
      <Loader2 className="h-8 w-8 text-accent animate-spin" strokeWidth={2} />
      <p className="text-slate-500 text-[15px]">{message}</p>
    </div>
  );
}
