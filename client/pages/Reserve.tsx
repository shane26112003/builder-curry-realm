import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";

type PassengerType = "woman" | "pregnant" | "elderly" | "luggage" | "regular";

interface PassengerDetails {
  fullName: string;
  age: number | "";
  type: PassengerType;
  fromStation: string;
  toStation: string;
}

interface Seat {
  id: string; // e.g., 1A
  row: number;
  col: 0 | 1; // 0 A, 1 B
}

const STATIONS = ["Baiyappanahalli", "Swami Vivekananda Road", "Indiranagar", "Halasuru", "Trinity", "MG Road", "Cubbon Park", "Vidhana Soudha", "Sir M Visvesvaraya (Central College)", "Kempegowda (Majestic)", "KSR Railway Station", "Magadi Road", "Vijayanagar", "Attiguppe", "Mysuru Road", "Jayanagar", "Yelachenahalli"];

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function Reserve() {
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState<PassengerDetails>({ fullName: "", age: "", type: "woman", fromStation: "", toStation: "" });
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [paid, setPaid] = useState(false);
  const routeInvalid = details.fromStation === "" || details.toStation === "" || details.fromStation === details.toStation;

  const seats: Seat[] = useMemo(() => {
    const all: Seat[] = [];
    for (let r = 1; r <= 50; r++) {
      all.push({ id: `${r}A`, row: r, col: 0 });
      all.push({ id: `${r}B`, row: r, col: 1 });
    }
    return all;
  }, []);

  useEffect(() => {
    if (step === 2 && !isEligible(details.type)) {
      setStep(1);
    }
  }, [details.type, step]);

  function isEligible(t: PassengerType) {
    return ["woman", "pregnant", "elderly", "luggage", "regular"].includes(t);
  }

  function next() {
    if (step === 1) {
      if (!details.fullName || details.age === "" || Number(details.age) <= 0 || routeInvalid) return;
      setStep(2);
    } else if (step === 2) {
      if (selectedSeats.length === 0) return;
      setStep(3);
    } else if (step === 3) {
      if (!paid) return;
      setStep(4);
    }
  }
  function prev() {
    setStep((s) => Math.max(1, s - 1));
  }

  function toggleSeat(id: string) {
    setSelectedSeats((seats) =>
      seats.includes(id) ? seats.filter((s) => s !== id) : [...seats, id]
    );
  }

  const totalFare = 25 * Math.max(1, selectedSeats.length);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Reserve Your Seat</h1>
          <p className="text-slate-600">Women Priority Coach • 50 rows × 2 seats</p>
        </div>

        <Stepper step={step} />

        {step === 1 && (
          <section className="mt-8 grid md:grid-cols-2 gap-8">
            <div className="bg-white/80 border border-purple-100 rounded-2xl p-6">
              <h2 className="font-semibold mb-4">Passenger details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Full name</label>
                  <input
                    value={details.fullName}
                    onChange={(e) => setDetails((d) => ({ ...d, fullName: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter full name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Age</label>
                    <input
                      type="number"
                      min={1}
                      value={details.age}
                      onChange={(e) => setDetails((d) => ({ ...d, age: e.target.value === "" ? "" : Number(e.target.value) }))}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Age"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Passenger type</label>
                    <select
                      value={details.type}
                      onChange={(e) => setDetails((d) => ({ ...d, type: e.target.value as PassengerType }))}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="woman">Woman</option>
                      <option value="pregnant">Pregnant woman</option>
                      <option value="elderly">Elderly passenger</option>
                      <option value="luggage">Woman with large luggage</option>
                      <option value="regular">Regular passenger</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">From</label>
                    <select
                      value={details.fromStation}
                      onChange={(e) => setDetails((d) => ({ ...d, fromStation: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select origin</option>
                      {STATIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Destination</label>
                    <select
                      value={details.toStation}
                      onChange={(e) => setDetails((d) => ({ ...d, toStation: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select destination</option>
                      {STATIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {routeInvalid && (
                  <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-2">
                    Please select both stations, and ensure they are different.
                  </div>
                )}
                <div className="text-sm text-slate-500">
                  Note: This coach is reserved for women, pregnant women, elderly passengers, and women carrying large luggage.
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={next} className="px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700">Continue</button>
              </div>
            </div>
            <InfoCard />
          </section>
        )}

        {step === 2 && (
          <section className="mt-8 grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-white/80 border border-purple-100 rounded-2xl p-6">
              <h2 className="font-semibold mb-4">Select your seat</h2>
              <div className="grid grid-cols-2 gap-x-10 gap-y-3">
                {Array.from({ length: 50 }, (_, i) => i + 1).map((row) => (
                  <div key={row} className="grid grid-cols-2 gap-3 items-center">
                    {[0, 1].map((c) => {
                      const id = `${row}${c === 0 ? "A" : "B"}`;
                      const selected = selectedSeats.includes(id);
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => toggleSeat(id)}
                          className={classNames(
                            "h-10 rounded-lg border flex items-center justify-center font-medium",
                            selected ? "bg-purple-600 text-white border-purple-700" : "bg-white text-slate-700 border-slate-200 hover:border-purple-400",
                          )}
                          aria-pressed={selected}
                        >
                          {id}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-between items-center">
                <button onClick={prev} className="px-4 py-2 rounded-xl border border-slate-200">Back</button>
                <div className="text-sm text-slate-600">Selected: <span className="font-semibold">{selectedSeats.length}</span></div>
                <button onClick={next} disabled={selectedSeats.length === 0} className="px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-60">Proceed to payment</button>
              </div>
            </div>
            <div className="bg-white/80 border border-purple-100 rounded-2xl p-6 h-fit">
              <h3 className="font-semibold">Selection</h3>
              <p className="text-sm text-slate-600 mt-2">Passenger: {details.fullName || "—"}</p>
              <p className="text-sm text-slate-600">Type: {prettyType(details.type)}</p>
              <p className="text-sm text-slate-600">From: {details.fromStation || "—"}</p>
              <p className="text-sm text-slate-600">To: {details.toStation || "—"}</p>
              <p className="text-sm text-slate-600">Seats: {selectedSeats.length ? selectedSeats.join(", ") : "—"}</p>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="mt-8 grid md:grid-cols-2 gap-8">
            <div className="bg-white/80 border border-purple-100 rounded-2xl p-6">
              <h2 className="font-semibold mb-4">Payment</h2>
              <PaymentForm onPaid={() => setPaid(true)} amount={totalFare} />
              <div className="mt-6 flex justify-between">
                <button onClick={prev} className="px-4 py-2 rounded-xl border border-slate-200">Back</button>
                <button onClick={next} disabled={!paid} className="px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-60">Get ticket</button>
              </div>
            </div>
            <div className="bg-white/80 border border-purple-100 rounded-2xl p-6 h-fit">
              <h3 className="font-semibold">Summary</h3>
              <ul className="mt-2 text-sm text-slate-600 space-y-1">
                <li>Name: {details.fullName}</li>
                <li>Age: {details.age}</li>
                <li>Type: {prettyType(details.type)}</li>
                <li>From: {details.fromStation}</li>
                <li>Destination: {details.toStation}</li>
                <li>Seats: {selectedSeats.join(", ")}</li>
                <li>Total: ₹{totalFare}</li>
              </ul>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="mt-8 grid md:grid-cols-2 gap-8">
            <div className="bg-white/80 border border-purple-100 rounded-2xl p-6">
              <h2 className="font-semibold mb-4">Your Ticket</h2>
              <div className="rounded-xl border border-slate-200 p-4 bg-white">
                <Ticket details={details} seats={selectedSeats} />
              </div>
              <div className="mt-6 flex gap-3">
                <button onClick={() => window.print()} className="px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700">Print</button>
                <button onClick={() => { setStep(1); setSelectedSeats([]); setPaid(false); }} className="px-4 py-2 rounded-xl border border-slate-200">Book another</button>
              </div>
            </div>
            <InfoCard />
          </section>
        )}
      </Layout>
    </ProtectedRoute>
  );
}

function Stepper({ step }: { step: number }) {
  const steps = ["Passenger", "Seat", "Payment", "Ticket"];
  return (
    <ol className="grid grid-cols-4 gap-3">
      {steps.map((label, idx) => {
        const s = idx + 1;
        const done = step > s;
        const current = step === s;
        return (
          <li key={label} className={classNames("flex items-center gap-3 rounded-xl border px-4 py-3", current ? "border-purple-400 bg-purple-50" : done ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white") }>
            <span className={classNames("h-6 w-6 grid place-items-center rounded-full text-xs font-bold", done ? "bg-emerald-500 text-white" : current ? "bg-purple-600 text-white" : "bg-slate-200 text-slate-700")}>{s}</span>
            <span className={classNames("text-sm font-medium", current ? "text-purple-800" : done ? "text-emerald-700" : "text-slate-600")}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

function prettyType(t: PassengerType) {
  switch (t) {
    case "woman":
      return "Woman";
    case "pregnant":
      return "Pregnant woman";
    case "elderly":
      return "Elderly passenger";
    case "luggage":
      return "Woman with large luggage";
    case "regular":
      return "Regular passenger";
  }
}

function InfoCard() {
  return (
    <div className="bg-white/80 border border-purple-100 rounded-2xl p-6 h-fit">
      <h3 className="font-semibold">Coach rules</h3>
      <ul className="mt-2 text-sm text-slate-600 space-y-1 list-disc pl-5">
        <li>Reserved for women, pregnant women, elderly passengers, and women carrying large luggage.</li>
        <li>One seat per passenger. Keep your ticket accessible during the journey.</li>
        <li>Please offer assistance to those in need and maintain decorum.</li>
      </ul>
    </div>
  );
}

function PaymentForm({ onPaid, amount }: { onPaid: () => void; amount: number }) {
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");
  const valid = number.replace(/\s+/g, "").length >= 12 && name.length > 2 && /^(0?[1-9]|1[0-2])\/(\d{2})$/.test(exp) && cvv.length >= 3;
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">Card number</label>
        <input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="1234 5678 9012 3456" className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Name on card</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Expiry (MM/YY)</label>
          <input value={exp} onChange={(e) => setExp(e.target.value)} placeholder="08/29" className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">CVV</label>
          <input value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="123" className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500" />
        </div>
      </div>
      <button onClick={onPaid} disabled={!valid} className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white py-3 font-semibold hover:from-purple-700 hover:to-fuchsia-700 disabled:opacity-60">Pay ₹{amount}</button>
      <p className="text-xs text-slate-500">This is a demo payment and will not charge your card.</p>
    </div>
  );
}

function Ticket({ details, seats }: { details: PassengerDetails; seats: string[] }) {
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">Namma Metro • Bengaluru</div>
          <div className="text-xl font-bold">Women Priority Coach</div>
        </div>
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-500 grid place-items-center text-white font-extrabold">N</div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        <div className="rounded-lg border border-slate-200 p-3">
          <div className="text-slate-500">Passenger</div>
          <div className="font-semibold">{details.fullName}</div>
        </div>
        <div className="rounded-lg border border-slate-200 p-3">
          <div className="text-slate-500">Type</div>
          <div className="font-semibold">{prettyType(details.type)}</div>
        </div>
        <div className="rounded-lg border border-slate-200 p-3">
          <div className="text-slate-500">Route</div>
          <div className="font-semibold">{details.fromStation} → {details.toStation}</div>
        </div>
        <div className="rounded-lg border border-slate-200 p-3">
          <div className="text-slate-500">Seats</div>
          <div className="font-semibold">{seats.join(", ")}</div>
        </div>
        <div className="rounded-lg border border-slate-200 p-3">
          <div className="text-slate-500">Issued</div>
          <div className="font-semibold">{new Date().toLocaleString()}</div>
        </div>
      </div>
      <div className="text-xs text-slate-500">Carry a valid ID. Subject to Namma Metro rules and regulations.</div>
    </div>
  );
}
