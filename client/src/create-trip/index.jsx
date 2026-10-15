import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import NominatimAutocomplete from '../components/NominatimAutocomplete'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { SelectBudgetOptions, SelectTravelersList } from '../constants/options'
import { generateTripPlan } from '../service/AIModel'
import { useToast } from '../components/ui/toast'
import { useAuth } from '../context/AuthContext'
import api from '../service/api'
import TravelLoader from '../components/custom/TravelLoader'
import { ArrowLeft, Sparkles, MapPin, Calendar, Users, DollarSign, Shield, CheckCircle2 } from 'lucide-react'

function CreateTrip() {
  const [searchParams] = useSearchParams();
  const prefilledDest = searchParams.get("destination");

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBudget, setSelectedBudget] = useState(null)
  const [selectedTraveler, setSelectedTraveler] = useState(null)
  const [formData, setFormData] = useState({
    location: prefilledDest ? { display_name: prefilledDest, name: prefilledDest } : null,
    noOfDays: 3,
    budget: null,
    traveler: null,
    requestOrganiser: false
  })
  const [loading, setLoading] = useState(false)

  const toast = useToast()
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const GenerateTrip = async () => {
    if (!user) {
      toast.error("Please log in to generate your journey!", {
        action: {
          label: "Login",
          onClick: () => navigate('/login')
        }
      });
      navigate('/login');
      return;
    }

    if (
      !formData?.location ||
      !formData?.budget ||
      !formData?.traveler ||
      !formData?.noOfDays ||
      formData.noOfDays < 1 ||
      formData.noOfDays > 7
    ) {
      toast.error("Please complete all fields. Duration must be between 1 and 7 days.");
      return;
    }

    setLoading(true);

    try {
      const locationName =
        formData.location.display_name ||
        formData.location.name ||
        formData.location.label ||
        formData.location ||
        "Kyoto, Japan";

      const tripData = await generateTripPlan(
        locationName,
        formData.noOfDays,
        formData.budget,
        formData.traveler
      );

      if (
        !tripData ||
        !Array.isArray(tripData.hotels) ||
        !Array.isArray(tripData.itinerary)
      ) {
        throw new Error("Invalid AI response format - missing hotel or itinerary data");
      }

      const saveResponse = await api.post('/trips', {
        destination: locationName,
        tripData: tripData,
        duration: formData.noOfDays,
        budget: formData.budget,
        requestOrganiser: formData.requestOrganiser || false
      });

      if (saveResponse && saveResponse.data) {
        toast.success("Pathora journey generated and saved successfully!");
        navigate('/view-trip/' + saveResponse.data._id);
      }
    } catch (err) {
      console.error("DEBUG GenerateTrip Error:", err);
      toast.error(`Failed to generate itinerary: ${err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      {loading && <TravelLoader />}

      <div className="max-w-6xl mx-auto">
        {/* Top Navigation Bar matching UI Reference */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            to="/"
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1628] font-jakarta">
              Create a New Trip
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Customize your preferences and let Pathora AI craft your personalized path.
            </p>
          </div>
        </div>

        {/* 2-Column Layout matching UI Reference */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: 4-Step Vertical Stepper */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
              Journey Builder
            </h3>

            <div className="space-y-6">
              {/* Step 1 */}
              <div
                onClick={() => setCurrentStep(1)}
                className={`flex items-start gap-4 p-3 rounded-xl cursor-pointer transition-all ${
                  currentStep === 1 ? 'bg-[#F0F9FF] border border-[#00B4D8]/30' : 'hover:bg-slate-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                  formData.location ? 'bg-[#00B4D8] text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0A1628]">Destination</h4>
                  <p className="text-xs text-slate-500">Where are you going?</p>
                  {formData.location && (
                    <span className="text-[11px] text-[#0096B4] font-semibold block mt-1 truncate max-w-[180px]">
                      {formData.location.name || formData.location.display_name}
                    </span>
                  )}
                </div>
              </div>

              {/* Step 2 */}
              <div
                onClick={() => setCurrentStep(2)}
                className={`flex items-start gap-4 p-3 rounded-xl cursor-pointer transition-all ${
                  currentStep === 2 ? 'bg-[#F0F9FF] border border-[#00B4D8]/30' : 'hover:bg-slate-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                  formData.traveler ? 'bg-[#00B4D8] text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0A1628]">Travel Details</h4>
                  <p className="text-xs text-slate-500">When and with whom?</p>
                  {formData.traveler && (
                    <span className="text-[11px] text-[#0096B4] font-semibold block mt-1">
                      {formData.noOfDays} Days • {formData.traveler}
                    </span>
                  )}
                </div>
              </div>

              {/* Step 3 */}
              <div
                onClick={() => setCurrentStep(3)}
                className={`flex items-start gap-4 p-3 rounded-xl cursor-pointer transition-all ${
                  currentStep === 3 ? 'bg-[#F0F9FF] border border-[#00B4D8]/30' : 'hover:bg-slate-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                  formData.budget ? 'bg-[#00B4D8] text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  3
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0A1628]">Preferences</h4>
                  <p className="text-xs text-slate-500">Tailor your experience</p>
                  {formData.budget && (
                    <span className="text-[11px] text-[#0096B4] font-semibold block mt-1">
                      Budget: {formData.budget}
                    </span>
                  )}
                </div>
              </div>

              {/* Step 4 */}
              <div
                onClick={() => setCurrentStep(4)}
                className={`flex items-start gap-4 p-3 rounded-xl cursor-pointer transition-all ${
                  currentStep === 4 ? 'bg-[#F0F9FF] border border-[#00B4D8]/30' : 'hover:bg-slate-50'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-[#FF6B35] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  4
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0A1628]">Generate</h4>
                  <p className="text-xs text-slate-500">Let Pathora AI plan your trip</p>
                </div>
              </div>
            </div>

            {/* AI Capability Note */}
            <div className="mt-8 p-3.5 bg-[#F0F9FF] rounded-xl border border-cyan-100 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#00B4D8] shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Powered by Pathora AI engine. Curates geocoded attractions, scenic routes, and hotel suggestions in seconds.
              </p>
            </div>
          </div>

          {/* Right Column: Step Forms & Previews */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">

            {/* STEP 1: DESTINATION */}
            <div className="mb-8">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-6 h-6 rounded-full bg-[#00B4D8] text-white flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <h2 className="text-lg font-bold text-[#0A1628]">
                  Where do you want to go?
                </h2>
              </div>
              <p className="text-xs text-slate-500 mb-4 ml-8.5">
                Search cities, landmarks, or countries worldwide.
              </p>

              <div className="relative mb-6">
                <NominatimAutocomplete
                  onChange={(item) => {
                    handleInputChange('location', item)
                  }}
                />
              </div>

              {/* Destination Preview Card matching UI Reference */}
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                <div className="h-44 sm:h-52 w-full relative overflow-hidden">
                  <img
                    src={formData.location?.name?.toLowerCase().includes("kyoto") ? "/assets/pathora/destinations/kyoto-banner.jpg" :
                         formData.location?.name?.toLowerCase().includes("bali") ? "/assets/pathora/destinations/bali.jpg" :
                         formData.location?.name?.toLowerCase().includes("paris") ? "/assets/pathora/destinations/paris.jpg" :
                         formData.location?.name?.toLowerCase().includes("tokyo") ? "/assets/pathora/destinations/tokyo.jpg" :
                         formData.location?.name?.toLowerCase().includes("santorini") ? "/assets/pathora/destinations/santorini.jpg" :
                         "/assets/pathora/destinations/kyoto-banner.jpg"}
                    alt="Destination preview"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 text-white">
                    <span className="text-[10px] uppercase font-bold text-[#00E5FF] tracking-wider">Featured Destination</span>
                    <h3 className="text-xl font-bold font-jakarta leading-tight">
                      {formData.location?.name || formData.location?.display_name || "Kyoto, Japan"}
                    </h3>
                  </div>
                </div>
                <div className="p-4 text-xs text-slate-600 leading-relaxed">
                  A perfect blend of ancient traditions and modern culture. Pathora offers stunning temples, beautiful gardens, and rich cultural experiences.
                </div>
              </div>
            </div>

            {/* STEP 2: DURATION & TRAVELERS */}
            <div className="mb-8 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-6 h-6 rounded-full bg-[#00B4D8] text-white flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <h2 className="text-lg font-bold text-[#0A1628]">
                  Travel Duration & Group
                </h2>
              </div>

              {/* Number of days input */}
              <div className="mb-6 ml-8.5">
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Trip Duration (1 - 7 Days)
                </label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    min={1}
                    max={7}
                    placeholder="3"
                    value={formData.noOfDays ?? ''}
                    onChange={(e) => {
                      const value = Math.max(1, Math.min(7, Number(e.target.value)));
                      handleInputChange('noOfDays', value);
                    }}
                    className="max-w-[140px] px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800"
                  />
                  <span className="text-xs text-slate-500 font-medium">Days (max 7 recommended for AI density)</span>
                </div>
              </div>

              {/* Travelers Selection */}
              <div className="ml-8.5">
                <label className="block text-xs font-semibold text-slate-700 mb-3">
                  Who is traveling with you?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {SelectTravelersList.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedTraveler(index);
                        handleInputChange('traveler', item.title);
                      }}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        selectedTraveler === index
                          ? 'border-[#00B4D8] bg-[#F0F9FF] shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="text-2xl mb-2">{item.icon}</div>
                      <h4 className="font-bold text-sm text-[#0A1628]">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* STEP 3: BUDGET & LEADERSHIP */}
            <div className="mb-8 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-6 h-6 rounded-full bg-[#00B4D8] text-white flex items-center justify-center font-bold text-xs">
                  3
                </span>
                <h2 className="text-lg font-bold text-[#0A1628]">
                  Budget & Organization
                </h2>
              </div>

              {/* Budget options */}
              <div className="ml-8.5 mb-6">
                <label className="block text-xs font-semibold text-slate-700 mb-3">
                  Select your spending tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {SelectBudgetOptions.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedBudget(index);
                        handleInputChange('budget', item.title);
                      }}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        selectedBudget === index
                          ? 'border-[#00B4D8] bg-[#F0F9FF] shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="text-2xl mb-2">{item.icon}</div>
                      <h4 className="font-bold text-sm text-[#0A1628]">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lead Organiser Option */}
              <div className="ml-8.5 p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#0A1628]">Lead this Journey as Organiser?</h4>
                  <p className="text-[11px] text-slate-500">
                    Enables managing member join requests, group chat moderation, and publishing.
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="requestOrganiser"
                  checked={formData.requestOrganiser || false}
                  onChange={(e) => handleInputChange('requestOrganiser', e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-[#00B4D8] focus:ring-[#00B4D8] cursor-pointer"
                />
              </div>
            </div>

            {/* STEP 4: ACTION */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-500">
                Ready to transform your ideas into a day-by-day plan?
              </span>
              <button
                onClick={GenerateTrip}
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-[#00B4D8] hover:bg-[#0096B4] shadow-md shadow-[#00B4D8]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Itinerary with AI</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateTrip