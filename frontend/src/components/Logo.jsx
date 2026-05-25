import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

export default function Logo({ className = "" }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 group ${className}`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 border border-accent/20 transition-colors group-hover:bg-accent/15">
        <Shield className="h-5 w-5 text-accent" strokeWidth={2} />
      </div>
      <span className="text-[17px] font-semibold tracking-tight text-white">
        Internship<span className="text-accent">Guard</span>
      </span>
    </Link>
  );
}
