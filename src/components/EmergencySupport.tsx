import React, { useState } from 'react';
import {
  ShieldAlert,
  PhoneCall,
  Volume2,
  VolumeX,
  Heart,
  Save,
  CheckCircle2,
  AlertTriangle,
  Hospital,
  MapPin,
  HelpCircle,
  Volume1,
  FileText,
  UserCheck,
} from 'lucide-react';
import {
  EMERGENCY_CONTACTS,
  HINDI_EMERGENCY_PHRASES,
  TOURIST_HOSPITALS_DIRECTORY,
  HindiEmergencyPhrase,
} from '../data/emergencyData';
import { MedicalEmergencyProfile } from '../types/travel';

interface EmergencySupportProps {
  profile: MedicalEmergencyProfile;
  onSaveProfile: (profile: MedicalEmergencyProfile) => void;
}

export const EmergencySupport: React.FC<EmergencySupportProps> = ({
  profile,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<MedicalEmergencyProfile>(profile);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [audioContextRef, setAudioContextRef] = useState<AudioContext | null>(null);
  const [sirenIntervalRef, setSirenIntervalRef] = useState<any>(null);

  const handleSaveProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setIsEditingProfile(false);
    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 3000);
  };

  // Offline Web Audio Emergency Siren
  const toggleEmergencySiren = () => {
    if (isSirenActive) {
      if (audioContextRef) {
        audioContextRef.close().catch(() => {});
        setAudioContextRef(null);
      }
      if (sirenIntervalRef) {
        clearInterval(sirenIntervalRef);
        setSirenIntervalRef(null);
      }
      setIsSirenActive(false);
    } else {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        setAudioContextRef(ctx);

        let highFreq = true;
        const playTone = () => {
          if (ctx.state === 'suspended') {
            ctx.resume();
          }
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(highFreq ? 900 : 650, ctx.currentTime);
          highFreq = !highFreq;

          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.5);
        };

        playTone();
        const interval = setInterval(playTone, 500);
        setSirenIntervalRef(interval);
        setIsSirenActive(true);
      } catch (err) {
        console.warn('Web Audio Siren unavailable', err);
      }
    }
  };

  // Pronounce Hindi Phrase via Browser Speech Synthesis
  const speakHindiPhrase = (phrase: HindiEmergencyPhrase) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(phrase.devanagari);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Critical Banner */}
      <div className="p-5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/80 dark:bg-red-950/30 text-red-900 dark:text-red-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            <div>
              <h1 className="text-lg font-bold">
                Emergency & Traveler Safety Command
              </h1>
              <p className="text-xs text-red-800/90 dark:text-red-300/80 mt-0.5">
                All contacts, offline Hindi phrasecards, and emergency sirens operate 100% without cellular data or Wi-Fi.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleEmergencySiren}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg border transition-all ${
                isSirenActive
                  ? 'bg-red-600 text-white border-red-700 animate-pulse'
                  : 'bg-white dark:bg-neutral-900 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-100'
              }`}
            >
              {isSirenActive ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isSirenActive ? 'Stop Audio Alarm' : 'Sound SOS Siren Beacon'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Official Government 24x7 Helplines Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Official 24x7 Toll-Free Emergency Numbers in India
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EMERGENCY_CONTACTS.map((contact) => (
            <div
              key={contact.id}
              className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between space-y-3 shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">
                    {contact.priority}
                  </span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                    {contact.availableHours}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                  {contact.service}
                </h3>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                  {contact.description}
                </p>
              </div>

              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <span className="text-2xl font-black font-mono tracking-tight text-neutral-900 dark:text-neutral-100">
                  {contact.number}
                </span>

                <a
                  href={`tel:${contact.number}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-md transition-colors shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call {contact.number}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Digital Emergency Medical & ID Card */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              Digital Medical & Traveler Emergency ID
            </h2>
          </div>

          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
          >
            {isEditingProfile ? 'Cancel Editing' : 'Edit Medical Info'}
          </button>
        </div>

        {profileSavedMsg && (
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium rounded-md flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Emergency medical profile saved to offline device storage!</span>
          </div>
        )}

        {isEditingProfile ? (
          <form onSubmit={handleSaveProfileSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Blood Group
                </label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                >
                  <option value="O+">O Positive (O+)</option>
                  <option value="O-">O Negative (O-)</option>
                  <option value="A+">A Positive (A+)</option>
                  <option value="A-">A Negative (A-)</option>
                  <option value="B+">B Positive (B+)</option>
                  <option value="B-">B Negative (B-)</option>
                  <option value="AB+">AB Positive (AB+)</option>
                  <option value="AB-">AB Negative (AB-)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Emergency Phone 1 (India / Local Host)
                </label>
                <input
                  type="text"
                  value={formData.emergencyPhone1}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone1: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Emergency Phone 2 (Home Country Contact)
                </label>
                <input
                  type="text"
                  value={formData.emergencyPhone2}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone2: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Severe Drug / Food Allergies
                </label>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Chronic Conditions / Medications (Asthma, Diabetes, etc.)
                </label>
                <input
                  type="text"
                  value={formData.medicalConditions}
                  onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-md flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save to Local Card</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800 text-xs">
            <div>
              <span className="text-neutral-400 block text-[11px]">Traveler Name</span>
              <span className="font-bold text-neutral-900 dark:text-neutral-100">{formData.fullName}</span>
            </div>

            <div>
              <span className="text-neutral-400 block text-[11px]">Blood Group</span>
              <span className="font-bold font-mono text-red-600 dark:text-red-400 text-sm">{formData.bloodGroup}</span>
            </div>

            <div>
              <span className="text-neutral-400 block text-[11px]">Local Emergency Contact</span>
              <span className="font-mono text-neutral-800 dark:text-neutral-200">{formData.emergencyPhone1}</span>
            </div>

            <div>
              <span className="text-neutral-400 block text-[11px]">Home Emergency Contact</span>
              <span className="font-mono text-neutral-800 dark:text-neutral-200">{formData.emergencyPhone2}</span>
            </div>

            <div className="col-span-2 pt-2 border-t border-neutral-200/50 dark:border-neutral-700/50">
              <span className="text-neutral-400 block text-[11px]">Allergies</span>
              <span className="text-neutral-800 dark:text-neutral-200 font-medium">{formData.allergies || 'None reported'}</span>
            </div>

            <div className="col-span-2 pt-2 border-t border-neutral-200/50 dark:border-neutral-700/50">
              <span className="text-neutral-400 block text-[11px]">Conditions & Medications</span>
              <span className="text-neutral-800 dark:text-neutral-200 font-medium">{formData.medicalConditions || 'None reported'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Offline Hindi Emergency Phrasecards */}
      <div className="space-y-3">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Offline Hindi Emergency Phrase Cards (Show to Locals or Play Audio)
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Show your screen directly to local helpers, police, or hospital staff.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {HINDI_EMERGENCY_PHRASES.map((phrase) => (
            <div
              key={phrase.id}
              className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2 shadow-xs"
            >
              <div className="flex items-center justify-between text-[11px] text-neutral-400">
                <span className="font-semibold text-amber-600 dark:text-amber-400">{phrase.situation}</span>
                <button
                  onClick={() => speakHindiPhrase(phrase)}
                  className="flex items-center gap-1 text-neutral-600 dark:text-neutral-300 hover:text-amber-500 p-1"
                  title="Speak Hindi pronunciation out loud"
                >
                  <Volume1 className="w-3.5 h-3.5" />
                  <span>Pronounce</span>
                </button>
              </div>

              <div className="text-base font-bold text-neutral-900 dark:text-white font-serif tracking-wide">
                {phrase.devanagari}
              </div>

              <div className="text-xs font-mono text-amber-600 dark:text-amber-400 italic">
                "{phrase.phonetic}"
              </div>

              <div className="text-xs text-neutral-600 dark:text-neutral-300 pt-1 border-t border-neutral-100 dark:border-neutral-800">
                {phrase.english}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 24x7 Tourist Hospital Directory */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          24x7 Apex Trauma & Hospital Emergency Units
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {TOURIST_HOSPITALS_DIRECTORY.map((hosp, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-2 text-xs shadow-xs"
            >
              <div className="flex items-center gap-1.5 text-neutral-500">
                <Hospital className="w-3.5 h-3.5 text-red-500" />
                <span className="font-bold text-neutral-800 dark:text-neutral-200">{hosp.city}</span>
              </div>

              <h4 className="font-bold text-neutral-900 dark:text-neutral-100">{hosp.name}</h4>

              <div className="text-neutral-500 leading-relaxed text-[11px]">{hosp.address}</div>

              <div className="text-emerald-600 dark:text-emerald-400 font-medium text-[11px] pt-1">
                {hosp.emergencyUnit}
              </div>

              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <span className="font-mono tabular-nums text-neutral-700 dark:text-neutral-300">{hosp.phone}</span>
                <a
                  href={`tel:${hosp.phone}`}
                  className="px-2.5 py-1 text-[11px] font-semibold text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded"
                >
                  Call
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
