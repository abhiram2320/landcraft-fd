import { useState } from "react";
import BrandProfileForm from "./components/BrandProfileForm";
import GenerationView from "./components/GenerationView";

export default function App() {
  const [submittedProfile, setSubmittedProfile] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-indigo-100 text-gray-900 transition-colors">
      {!submittedProfile ? (
        <div className="flex items-center justify-center min-h-screen px-4">
          <BrandProfileForm onSubmit={setSubmittedProfile} />
        </div>
      ) : (
        <GenerationView profile={submittedProfile} />
      )}
    </div>
  );
}
