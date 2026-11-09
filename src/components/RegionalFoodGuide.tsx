import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Search,
  MapPin,
  Flame,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Info,
} from 'lucide-react';
import { REGIONAL_FOOD_DATABASE } from '../data/foodData';
import { RegionalFood, IndianRegion, IndianOriginCity } from '../types/travel';

interface RegionalFoodGuideProps {
  origin?: IndianOriginCity;
  foodItems?: RegionalFood[];
}

export const RegionalFoodGuide: React.FC<RegionalFoodGuideProps> = ({
  origin,
  foodItems = REGIONAL_FOOD_DATABASE,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedDietary, setSelectedDietary] = useState<string>('All');
  const [selectedMealType, setSelectedMealType] = useState<string>('All');
  const [locationNotice, setLocationNotice] = useState<string>('');

  const regions: string[] = ['All', 'North', 'South', 'West', 'East', 'North-East', 'Central', 'Himalayas'];
  const dietaryOptions: string[] = ['All', 'Pure Veg', 'Jain Friendly', 'Non-Veg', 'Seafood', 'Vegan'];
  const mealTypes: string[] = ['All', 'Breakfast', 'Street Food', 'Main Course', 'Dessert & Beverage'];

  // When origin changes, set notice and highlight dishes for that location
  React.useEffect(() => {
    if (origin) {
      setLocationNotice(`Serving local culinary specialties and verified food stalls for ${origin.name}, ${origin.state}`);
      const t = setTimeout(() => setLocationNotice(''), 4000);
      return () => clearTimeout(t);
    }
  }, [origin?.id]);

  const filteredDishes = foodItems.filter((dish) => {
    const matchesSearch =
      dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dish.keyIngredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRegion = selectedRegion === 'All' || dish.region === selectedRegion;
    const matchesDietary = selectedDietary === 'All' || dish.dietary === selectedDietary;
    const matchesMeal = selectedMealType === 'All' || dish.mealType === selectedMealType;

    return matchesSearch && matchesRegion && matchesDietary && matchesMeal;
  }).sort((a, b) => {
    // If origin state matches, bring to top
    if (origin) {
      const aMatches = a.state.toLowerCase().includes(origin.state.toLowerCase()) || a.name.toLowerCase().includes(origin.name.toLowerCase());
      const bMatches = b.state.toLowerCase().includes(origin.state.toLowerCase()) || b.name.toLowerCase().includes(origin.name.toLowerCase());
      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
    }
    return 0;
  });

  const getDietaryBadge = (dietary: string) => {
    switch (dietary) {
      case 'Pure Veg':
        return 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800';
      case 'Jain Friendly':
        return 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800';
      case 'Vegan':
        return 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800';
      case 'Seafood':
        return 'text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800';
      default:
        return 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800';
    }
  };

  const getSpiceIcon = (spice: string) => {
    switch (spice) {
      case 'Fiery Spicy':
        return (
          <span className="flex items-center text-red-600 dark:text-red-400 gap-0.5">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <Flame className="w-3.5 h-3.5 fill-current" />
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span className="text-[11px] ml-1 font-semibold">Fiery</span>
          </span>
        );
      case 'Medium':
        return (
          <span className="flex items-center text-amber-600 dark:text-amber-400 gap-0.5">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span className="text-[11px] ml-1 font-semibold">Medium Heat</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center text-emerald-600 dark:text-emerald-400 gap-0.5">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span className="text-[11px] ml-1 font-semibold">Mild & Gentle</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {locationNotice && (
        <div className="p-3 bg-orange-50 dark:bg-orange-950/40 border border-orange-300 dark:border-orange-800 text-orange-900 dark:text-orange-200 text-xs font-semibold rounded-lg flex items-center gap-2 animate-fadeIn">
          <UtensilsCrossed className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
          <span>{locationNotice}</span>
        </div>
      )}

      {/* Header */}
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <span>Culinary Discovery</span>
              <span aria-hidden="true">·</span>
              <span>Regional India Gastronomy</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-1">
              Regional Food Availability & Dietary Guide
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Explore authentic regional specialties, Jain and pure vegetarian options, famous local establishments, and traveler hygiene tips.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 p-2.5 rounded-lg text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>
              All dishes include food-safety and thermal hygiene guidelines
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search regional dishes, ingredients, or states (e.g. Dal Baati, Sadya, Thukpa, Coconut, Rajasthan)..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Region Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] font-medium text-neutral-400 mr-1 shrink-0">Region:</span>
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedRegion === reg
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {reg}
            </button>
          ))}
        </div>

        {/* Dietary Preferences Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] font-medium text-neutral-400 mr-1 shrink-0">Dietary:</span>
          {dietaryOptions.map((diet) => (
            <button
              key={diet}
              onClick={() => setSelectedDietary(diet)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedDietary === diet
                  ? 'bg-amber-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {diet}
            </button>
          ))}
        </div>
      </div>

      {/* Food Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDishes.map((dish) => (
          <div
            key={dish.id}
            className="flex flex-col rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 space-y-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-xs"
          >
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">{dish.state}</span>
                  <span aria-hidden="true">·</span>
                  <span>{dish.region} India</span>
                  <span aria-hidden="true">·</span>
                  <span>{dish.mealType}</span>
                </div>
                {getSpiceIcon(dish.spiceLevel)}
              </div>

              <div className="flex items-center justify-between gap-2 mt-1.5">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  {dish.name}
                </h3>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border whitespace-nowrap ${getDietaryBadge(dish.dietary)}`}>
                  {dish.dietary}
                </span>
              </div>

              <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-2 leading-relaxed">
                {dish.description}
              </p>
            </div>

            {/* Key Ingredients */}
            <div>
              <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Key Components & Ingredients:
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {dish.keyIngredients.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-xs text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Famous Spots */}
            <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 text-xs">
              <span className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                <span>Renowned Local Spots to Taste:</span>
              </span>
              <ul className="mt-1 space-y-0.5 text-neutral-600 dark:text-neutral-300 list-disc list-inside">
                {dish.famousSpots.map((spot, i) => (
                  <li key={i}>{spot}</li>
                ))}
              </ul>
            </div>

            {/* Traveler Hygiene Tip */}
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-xs text-emerald-900 dark:text-emerald-300 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <div>
                <span className="font-bold">Traveler Hygiene Note: </span>
                <span>{dish.hygieneTip}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
