import React, { useState } from 'react';
import { MapPin, Navigation, Calculator, MessageCircle, RefreshCw, Calendar, ArrowRight } from 'lucide-react';
import { PHONE_NUMBER_CLEAN, FARE_RULES } from '../constants';
import { getGroupedZones, quoteFare, formatPrice, composeLocation, describeQuote, priceLabel } from '../pricing';
import type { ZoneId, TripType, FareQuote } from '../types';

const GROUPED_ZONES = getGroupedZones();

interface ZoneSelectProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  zone: ZoneId | '';
  detail: string;
  placeholder: string;
  onZoneChange: (zone: ZoneId | '') => void;
  onDetailChange: (detail: string) => void;
}

const ZoneSelect: React.FC<ZoneSelectProps> = ({
  id, label, icon, zone, detail, placeholder, onZoneChange, onDetailChange,
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <select
        id={id}
        value={zone}
        onChange={(e) => onZoneChange(e.target.value)}
        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow text-sm bg-white appearance-none"
      >
        <option value="">{placeholder}</option>
        {GROUPED_ZONES.map((group) => (
          <optgroup key={group.name} label={group.name}>
            {group.zones.map((z) => (
              <option key={z.id} value={z.id}>{z.label}</option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
    <input
      type="text"
      value={detail}
      onChange={(e) => onDetailChange(e.target.value)}
      placeholder="Street / building (optional)"
      className="mt-2 block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow text-sm"
    />
  </div>
);

export const FareEstimator: React.FC = () => {
  const [pickupZone, setPickupZone] = useState<ZoneId | ''>('');
  const [pickupDetail, setPickupDetail] = useState('');
  const [dropoffZone, setDropoffZone] = useState<ZoneId | ''>('');
  const [dropoffDetail, setDropoffDetail] = useState('');
  const [tripType, setTripType] = useState<TripType>('one-way');
  const [dateTime, setDateTime] = useState('');
  const [waitTimeMins, setWaitTimeMins] = useState(0);
  const [carsCount, setCarsCount] = useState(1);
  const [passengerGroup, setPassengerGroup] = useState<'1-4' | '4+'>('1-4');
  const [vehicleType, setVehicleType] = useState<'car' | 'suv'>('car');
  const [quote, setQuote] = useState<FareQuote | null>(null);

  const waitHours = Math.round(waitTimeMins / 60);

  const pickupText = composeLocation(pickupZone || undefined, pickupDetail);
  const dropoffText = composeLocation(dropoffZone || undefined, dropoffDetail);

  const buildWhatsAppLink = (message: string) => {
    const whatsappMessage = encodeURIComponent(message);
    return `https://wa.me/${PHONE_NUMBER_CLEAN}?text=${whatsappMessage}`;
  };

  const buildQuoteMessage = (includeEstimate: boolean) => {
    const whenText = dateTime || 'ASAP';
    const waitText = tripType === 'round-trip' ? `${waitHours} hr` : 'N/A';
    const estimateText = includeEstimate && quote?.status === 'fixed'
      ? formatPrice(quote.price)
      : 'Price on request';

    return `*Fare Estimate ${includeEstimate ? 'Booking' : 'Request'}*\n` +
      `Pickup: ${pickupText}\n` +
      `Dropoff: ${dropoffText}\n` +
      `Trip type: ${tripType}\n` +
      `When: ${whenText}\n` +
      `Wait time: ${waitText}\n` +
      `Estimate: ${estimateText}`;
  };

  const handleWhatsAppClick = () => {
    window.open(buildWhatsAppLink(buildQuoteMessage(true)), '_blank');
  };

  const handleManualWhatsApp = () => {
    window.open(buildWhatsAppLink(buildQuoteMessage(false)), '_blank');
  };

  const handleCustomRequest = () => {
    const waitText = tripType === 'round-trip' ? `${waitHours} hr` : 'N/A';
    const message = `*Custom Ride Request*\n\nPickup: ${pickupText}\nDropoff: ${dropoffText}\nCars: ${carsCount}\nPassengers: ${passengerGroup}\nVehicle: ${vehicleType.toUpperCase()}\nTrip type: ${tripType}\nWait time: ${waitText}\nWhen: ${dateTime || 'Not provided'}`;
    const whatsappMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${PHONE_NUMBER_CLEAN}?text=${whatsappMessage}`, '_blank');
  };

  const handleCalculate = () => {
    setQuote(quoteFare(pickupZone || undefined, dropoffZone || undefined, tripType));
  };

  const resetQuote = () => setQuote(null);

  return (
    <section id="fare-estimator" className="py-12 md:py-16 border-t border-gray-200/50 scroll-mt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-taxi-yellow text-taxi-dark rounded-full font-bold text-xs tracking-wider uppercase mb-3">
            <Calculator className="w-4 h-4" />
            Fare Estimator
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Estimate Your Fare</h2>
          <p className="mt-2 text-gray-600">Get a quick estimate. Confirm and book on WhatsApp.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative">
          <div className="p-6 md:p-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <ZoneSelect
                id="pickup-zone"
                label="Pickup Point"
                icon={<MapPin className="h-5 w-5 text-gray-400" />}
                zone={pickupZone}
                detail={pickupDetail}
                placeholder="Select pickup area..."
                onZoneChange={(z) => { setPickupZone(z); resetQuote(); }}
                onDetailChange={(d) => { setPickupDetail(d); resetQuote(); }}
              />
              <ZoneSelect
                id="dropoff-zone"
                label="Drop-off Destination"
                icon={<Navigation className="h-5 w-5 text-gray-400" />}
                zone={dropoffZone}
                detail={dropoffDetail}
                placeholder="Select destination area..."
                onZoneChange={(z) => { setDropoffZone(z); resetQuote(); }}
                onDetailChange={(d) => { setDropoffDetail(d); resetQuote(); }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
               {/* Trip Type */}
               <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Trip Type</label>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => { setTripType('one-way'); resetQuote(); setWaitTimeMins(0); }}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${tripType === 'one-way' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    One-way
                  </button>
                  <button
                    onClick={() => { setTripType('round-trip'); resetQuote(); }}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${tripType === 'round-trip' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Round Trip
                  </button>
                </div>
              </div>

              {/* Date Time Optional */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">When? (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="datetime-local"
                    value={dateTime}
                    onChange={(e) => { setDateTime(e.target.value); resetQuote(); }}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow text-sm"
                  />
                </div>
              </div>
            </div>

            {tripType === 'round-trip' && (
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Estimated wait time (hours)</label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={FARE_RULES.MAX_WAIT_HOURS}
                    step={1}
                    value={waitHours}
                    onChange={(e) => {
                      const value = Math.max(0, Math.min(FARE_RULES.MAX_WAIT_HOURS, Number(e.target.value)));
                      setWaitTimeMins(Number.isNaN(value) ? 0 : value * 60);
                      resetQuote();
                    }}
                    className="block w-full pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow text-sm"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">First {FARE_RULES.FREE_WAIT_MINUTES} min free. Extra wait time confirmed on WhatsApp.</p>
              </div>
            )}

            {!quote ? (
              <button
                onClick={handleCalculate}
                disabled={!pickupZone || !dropoffZone}
                className="w-full bg-taxi-yellow hover:bg-yellow-400 text-taxi-dark font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Calculator className="w-5 h-5" />
                Calculate Estimate
              </button>
            ) : (
              <div className="animate-fade-in-up">
                <div className="bg-taxi-dark text-white rounded-xl p-6 mb-6">
                  {quote.status === 'fixed' ? (
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">{priceLabel()}</p>
                        <p className="text-4xl font-extrabold text-taxi-yellow">{formatPrice(quote.price)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Trip</p>
                        <p className="text-xl font-bold">{tripType === 'round-trip' ? 'Round trip' : 'One-way'}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6">
                      <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">Price on request</p>
                      <p className="mt-2 text-gray-200 text-sm leading-relaxed max-w-md">{describeQuote(quote)}</p>
                    </div>
                  )}

                  <div className="border-t border-gray-800 pt-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                       <div className="w-1.5 h-1.5 rounded-full bg-taxi-yellow"></div>
                       {quote.status === 'fixed'
                         ? 'Final price confirmed on WhatsApp.'
                         : 'Send us your trip and we will confirm the price on WhatsApp.'}
                    </div>
                    {quote.status === 'fixed' && !FARE_RULES.PRICES_CONFIRMED && (
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-taxi-yellow"></div>
                        Indicative price. Waiting time and extra stops may affect the final price.
                      </div>
                    )}
                    {tripType === 'round-trip' && (
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-taxi-yellow"></div>
                        {waitTimeMins > FARE_RULES.FREE_WAIT_MINUTES
                          ? `Wait time ${waitHours} hr. First ${FARE_RULES.FREE_WAIT_MINUTES} min free; extra time confirmed on WhatsApp.`
                          : `Wait time ${waitHours} hr. First ${FARE_RULES.FREE_WAIT_MINUTES} min free.`}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={quote.status === 'fixed' ? handleWhatsAppClick : handleManualWhatsApp}
                    className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 rounded-xl shadow-md transition-all"
                  >
                    <MessageCircle className="w-6 h-6" />
                    {quote.status === 'fixed' ? 'Book on WhatsApp' : 'Get a price on WhatsApp'}
                  </button>
                  <button
                    onClick={resetQuote}
                    className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-600 font-semibold py-4 rounded-xl hover:bg-gray-50 transition-all"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Clear / New Quote
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          *Prices are fixed per route. A minimum fare of {formatPrice(FARE_RULES.MIN_FARE_USD)} applies to all trips.
          Area not listed? <button onClick={handleManualWhatsApp} className="underline hover:text-gray-600 inline-flex items-center gap-1">Message us for a quote <ArrowRight className="w-3 h-3" /></button>
        </p>

        <div className="mt-10 bg-white border border-gray-200 rounded-2xl shadow-md p-6 md:p-8">
          <div className="text-center">
            <h3 className="text-2xl font-extrabold text-gray-900">Custom Request</h3>
            <p className="mt-2 text-gray-600">Tell us what you need and we will contact you directly.</p>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-taxi-yellow/15 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-taxi-dark" fill="currentColor" aria-hidden="true">
                    <path d="M7 4h10l3 6v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1H9v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7l3-6zm1.5 2L7 9h10l-1.5-3h-7zM6 11v3h2v-3H6zm10 0v3h2v-3h-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Vehicle Type</p>
                  <p className="text-xs text-gray-500">Choose car or SUV</p>
                </div>
              </div>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value as 'car' | 'suv')}
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow text-sm bg-white"
              >
                <option value="car">Car</option>
                <option value="suv">SUV</option>
              </select>
            </div>

            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-taxi-yellow/15 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-taxi-dark" fill="currentColor" aria-hidden="true">
                    <path d="M16 11c1.66 0 3 1.34 3 3v3h-2v-3a1 1 0 0 0-2 0v3h-2v-3c0-1.66 1.34-3 3-3zM8 11c1.66 0 3 1.34 3 3v3H9v-3a1 1 0 0 0-2 0v3H5v-3c0-1.66 1.34-3 3-3zM12 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Passengers</p>
                  <p className="text-xs text-gray-500">Let us know group size</p>
                </div>
              </div>
              <select
                value={passengerGroup}
                onChange={(e) => setPassengerGroup(e.target.value as '1-4' | '4+')}
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow text-sm bg-white"
              >
                <option value="1-4">1-4 passengers</option>
                <option value="4+">4+ passengers</option>
              </select>
            </div>

            <div className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-taxi-yellow/15 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-taxi-dark" fill="currentColor" aria-hidden="true">
                    <path d="M4 6h9a3 3 0 0 1 3 3v1h4v8h-2v-2H6v2H4V6zm2 8h10v-2a1 1 0 0 0-1-1H6v3zm9-6a1 1 0 0 0-1-1H6v2h9V8zm2 6h2v-2h-2v2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Number of Cars</p>
                  <p className="text-xs text-gray-500">Book multiple cars</p>
                </div>
              </div>
              <input
                type="number"
                min={1}
                max={5}
                step={1}
                value={carsCount}
                onChange={(e) => {
                  const value = Math.max(1, Math.min(5, Number(e.target.value)));
                  setCarsCount(Number.isNaN(value) ? 1 : value);
                }}
                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taxi-yellow focus:border-taxi-yellow text-sm"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center gap-3">
            <button
              onClick={handleCustomRequest}
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105"
            >
              <MessageCircle className="w-5 h-5" />
              Contact Us on WhatsApp
            </button>
            <p className="text-xs text-gray-500">We will contact you directly for special requests.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
