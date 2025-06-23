import React, { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

// Mock AI service for demonstration
const enhanceContent = async (content, field) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock enhancement logic
  if (field === 'companyName') {
    return content + ' Solutions';
  } else if (field === 'description') {
    return `${content} We leverage cutting-edge technology to deliver exceptional results and drive innovation in our industry.`;
  }
  return content;
};

export default function BrandProfileForm({ onSubmit }) {
  const [profile, setProfile] = useState({
    companyName: "",
    description: "",
    primaryColor: "#3B82F6",
    socialLinks: {},
    industry: "",
    targetAudience: "",
    logoUrl: "",
  });

  const [isEnhancing, setIsEnhancing] = useState({});
  const [errors, setErrors] = useState({});
  const [logoError, setLogoError] = useState("");

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setProfile((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value },
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setLogoError("Max 2MB logo");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfile((prev) => ({
          ...prev,
          logoUrl: event.target.result,
        }));
      };
      reader.readAsDataURL(file);
      setLogoError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!profile.companyName.trim()) newErrors.companyName = "Required";
    if (!profile.description.trim()) newErrors.description = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const enhanceField = async (field, content) => {
    if (!content.trim()) return;
    setIsEnhancing((prev) => ({ ...prev, [field]: true }));
    try {
      const enhanced = await enhanceContent(content, field);
      setProfile((prev) => ({ ...prev, [field]: enhanced }));
    } catch (err) {
      console.error("Enhancement failed", err);
    } finally {
      setIsEnhancing((prev) => ({ ...prev, [field]: false }));
    }
  };

  const enhanceAll = () => {
    enhanceField("companyName", profile.companyName);
    enhanceField("description", profile.description);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) onSubmit(profile);
  };

  return (
    <div className="w-full">
      {/* Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">✨</span>
          </div>
          LandCraft AI
        </h1>
        <div className="flex items-center gap-3">
          <button className="text-sm px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-200">
            Login
          </button>
          <button className="text-sm px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 hover:scale-105">
            Register
          </button>
        </div>
      </header>

      {/* Form */}
      <div className="max-w-4xl mx-auto my-8 bg-white/70 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-200/50">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
            Create Your Brand Profile
          </h2>
          <p className="text-gray-600">Build your perfect landing page with AI assistance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Logo Upload */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-3">Logo Upload</label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-200 bg-gray-50/50">
                {profile.logoUrl ? (
                  <img
                    src={profile.logoUrl}
                    alt="Logo Preview"
                    className="h-16 mx-auto rounded-lg shadow-sm"
                  />
                ) : (
                  <div className="text-gray-500">
                    <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded-lg flex items-center justify-center">
                      📁
                    </div>
                    <p className="text-sm">Click to upload logo (max 2MB)</p>
                  </div>
                )}
              </div>
            </div>
            {logoError && <p className="text-red-500 text-sm mt-2">{logoError}</p>}
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <div className="relative">
              <input
                type="text"
                value={profile.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                placeholder="Enter your company name"
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => enhanceField("companyName", profile.companyName)}
                disabled={isEnhancing.companyName}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700 transition-colors duration-200 disabled:opacity-50"
              >
                {isEnhancing.companyName ? (
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "✨"
                )}
              </button>
            </div>
            {errors.companyName && (
              <p className="text-red-500 text-sm">{errors.companyName}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <div className="relative">
              <textarea
                value={profile.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                placeholder="Describe what your company does..."
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 placeholder-gray-400 resize-none"
              />
              <button
                type="button"
                onClick={() => enhanceField("description", profile.description)}
                disabled={isEnhancing.description}
                className="absolute right-3 top-3 text-blue-600 hover:text-blue-700 transition-colors duration-200 disabled:opacity-50"
              >
                {isEnhancing.description ? (
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "✨"
                )}
              </button>
            </div>
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          {/* Primary Color */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Brand Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={profile.primaryColor}
                onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                className="w-16 h-12 rounded-lg border border-gray-200 cursor-pointer"
              />
              <div className="text-sm text-gray-600 font-mono">{profile.primaryColor}</div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Social Links</label>
            <div className="space-y-3">
              {[
                { platform: "website", icon: "🌐", placeholder: "https://yourwebsite.com" },
                { platform: "twitter", icon: "🐦", placeholder: "https://twitter.com/yourhandle" },
                { platform: "linkedin", icon: "💼", placeholder: "https://linkedin.com/company/yourcompany" },
                { platform: "instagram", icon: "📸", placeholder: "https://instagram.com/yourhandle" }
              ].map(({ platform, icon, placeholder }) => (
                <div key={platform} className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {icon}
                  </div>
                  <input
                    placeholder={placeholder}
                    value={profile.socialLinks[platform] || ""}
                    onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 placeholder-gray-400"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={enhanceAll}
            className="flex-1 bg-white border-2 border-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <Sparkles size={18} className="group-hover:text-blue-600 transition-colors duration-200" />
            Enhance
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            Generate Landing Page
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}