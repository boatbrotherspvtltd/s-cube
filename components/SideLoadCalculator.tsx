"use client";

import React, { useState, useMemo } from "react";
import {
  Zap,
  X,
  Plus,
  Minus,
  Trash2,
  RotateCcw,
  MessageCircle,
  Tv,
  Fan,
  Lightbulb,
  Laptop,
  Refrigerator,
  Flame,
  Waves,
  Cpu,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";
import { whatsappUrl } from "@/lib/whatsapp";

interface DeviceItem {
  id: string;
  name: string;
  watts: number;
  qty: number;
  iconName?: string;
  isCustom?: boolean;
}

const DEFAULT_DEVICES: DeviceItem[] = [
  { id: "fan", name: "Ceiling Fan", watts: 75, qty: 2, iconName: "fan" },
  { id: "led", name: "LED Bulb", watts: 9, qty: 4, iconName: "bulb" },
  { id: "tv", name: "LED Television", watts: 60, qty: 1, iconName: "tv" },
  { id: "fridge", name: "Refrigerator", watts: 250, qty: 1, iconName: "fridge" },
  { id: "laptop", name: "Laptop / Computer", watts: 50, qty: 1, iconName: "laptop" },
];

const PRESET_LIBRARY: { name: string; watts: number; iconName: string }[] = [
  { name: "Inverter AC 1.5 Ton", watts: 1500, iconName: "cpu" },
  { name: "Inverter AC 1.0 Ton", watts: 1000, iconName: "cpu" },
  { name: "Water Pump (1 HP)", watts: 750, iconName: "waves" },
  { name: "Water Pump (0.5 HP)", watts: 375, iconName: "waves" },
  { name: "Microwave Oven", watts: 1200, iconName: "flame" },
  { name: "Mixer Grinder", watts: 500, iconName: "cpu" },
  { name: "Washing Machine", watts: 500, iconName: "waves" },
  { name: "Room Air Cooler", watts: 180, iconName: "fan" },
  { name: "Tubelight (LED/CFL)", watts: 20, iconName: "bulb" },
  { name: "Wi-Fi Router", watts: 15, iconName: "cpu" },
  { name: "Desktop Computer", watts: 150, iconName: "laptop" },
  { name: "Electric Geyser", watts: 2000, iconName: "flame" },
];

export default function SideLoadCalculator() {
  const [isOpen, setIsOpen] = useState(false);
  const [devices, setDevices] = useState<DeviceItem[]>(DEFAULT_DEVICES);
  const [backupHours, setBackupHours] = useState<number>(3);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customWatts, setCustomWatts] = useState("");

  // Update quantity
  const updateQty = (id: string, delta: number) => {
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextQty = Math.max(0, d.qty + delta);
          return { ...d, qty: nextQty };
        }
        return d;
      })
    );
  };

  // Remove a device from the list
  const removeDevice = (id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
  };

  // Add preset device
  const addPresetDevice = (item: { name: string; watts: number; iconName: string }) => {
    setDevices((prev) => {
      const existing = prev.find((d) => d.name.toLowerCase() === item.name.toLowerCase());
      if (existing) {
        return prev.map((d) =>
          d.id === existing.id ? { ...d, qty: d.qty + 1 } : d
        );
      }
      return [
        ...prev,
        {
          id: `dev_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          name: item.name,
          watts: item.watts,
          qty: 1,
          iconName: item.iconName,
        },
      ];
    });
    setShowAddMenu(false);
  };

  // Add custom device
  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseInt(customWatts, 10);
    if (!customName.trim() || isNaN(w) || w <= 0) return;

    setDevices((prev) => [
      ...prev,
      {
        id: `custom_${Date.now()}`,
        name: customName.trim(),
        watts: w,
        qty: 1,
        iconName: "cpu",
        isCustom: true,
      },
    ]);
    setCustomName("");
    setCustomWatts("");
    setShowAddMenu(false);
  };

  // Reset to default
  const handleReset = () => {
    setDevices(DEFAULT_DEVICES);
    setBackupHours(3);
    setShowAddMenu(false);
  };

  // Calculations
  const activeItems = useMemo(() => devices.filter((d) => d.qty > 0), [devices]);

  const totalWatts = useMemo(() => {
    return devices.reduce((sum, d) => sum + d.watts * d.qty, 0);
  }, [devices]);

  // Recommended Inverter VA (Watts / PowerFactor 0.8 with standard ratings)
  const recommendedInverter = useMemo(() => {
    if (totalWatts === 0) return "—";
    const minVA = Math.round(totalWatts / 0.8);
    if (minVA <= 700) return "700 VA – 900 VA";
    if (minVA <= 1000) return "1000 VA – 1150 VA";
    if (minVA <= 1400) return "1400 VA – 1600 VA";
    if (minVA <= 2000) return "2.0 kVA – 2.5 kVA";
    if (minVA <= 3000) return "3.0 kVA – 3.5 kVA";
    if (minVA <= 5000) return "5.0 kVA – 6.0 kVA";
    return `${Math.ceil(minVA / 1000)} kVA+ Heavy Duty`;
  }, [totalWatts]);

  // Recommended Battery capacity
  const recommendedBattery = useMemo(() => {
    if (totalWatts === 0) return "—";
    const wattHours = totalWatts * backupHours;
    // Standard 12V tubular battery with 85% inverter efficiency
    const totalAhRequired = Math.round(wattHours / (12 * 0.85));

    if (totalAhRequired <= 100) return "1× 100Ah – 120Ah (12V)";
    if (totalAhRequired <= 160) return "1× 150Ah – 160Ah (12V)";
    if (totalAhRequired <= 220) return "1× 200Ah – 220Ah (12V)";
    if (totalAhRequired <= 350) return "2× 150Ah Batteries (24V Bank)";
    if (totalAhRequired <= 450) return "2× 200Ah Batteries (24V Bank)";
    return `${Math.ceil(totalAhRequired / 200)}× 200Ah High-Capacity Bank`;
  }, [totalWatts, backupHours]);

  // Build WhatsApp text
  const whatsappEnquiryText = useMemo(() => {
    const listSummary = activeItems
      .map((d) => `• ${d.qty}x ${d.name} (${d.watts}W)`)
      .join("\n");

    return `Hello S-Cube Mercantile!
I calculated my power backup requirements on your website:

*Total Load:* ${totalWatts} Watts
*Backup Duration:* ${backupHours} Hours
*Recommended Inverter:* ${recommendedInverter}
*Recommended Battery:* ${recommendedBattery}

*Appliances in my setup:*
${listSummary || "None selected"}

Please provide pricing and availability for this setup.`;
  }, [totalWatts, backupHours, recommendedInverter, recommendedBattery, activeItems]);

  const renderIcon = (name?: string) => {
    switch (name) {
      case "fan":
        return <Fan className="w-4 h-4 text-amber-500" />;
      case "bulb":
        return <Lightbulb className="w-4 h-4 text-sun" />;
      case "tv":
        return <Tv className="w-4 h-4 text-blue-500" />;
      case "fridge":
        return <Refrigerator className="w-4 h-4 text-emerald-500" />;
      case "laptop":
        return <Laptop className="w-4 h-4 text-indigo-500" />;
      case "waves":
        return <Waves className="w-4 h-4 text-cyan-500" />;
      case "flame":
        return <Flame className="w-4 h-4 text-red-500" />;
      default:
        return <Cpu className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <>
      {/* Floating Trigger Button Aligned Above Chatbot */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-[74px] right-5 z-40 group flex items-center gap-2.5 bg-[#0b1f36] hover:bg-[#153454] text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-[0_12px_28px_rgba(11,31,54,0.35)] transition-all duration-300 transform hover:-translate-y-0.5 border border-sun/40 font-sans cursor-pointer print:hidden"
          aria-label="Open Load Calculator"
        >
          <div className="relative">
            <Zap className="w-4 h-4 text-sun group-hover:scale-110 transition-transform animate-pulse" />
          </div>
          <span className="text-sm font-semibold tracking-wide text-white group-hover:text-sun transition-colors">
            Load Calculator
          </span>
          <span className="inline-flex items-center justify-center bg-sun/20 text-sun text-[10px] px-1.5 py-0.5 rounded font-mono font-medium">
            Watts
          </span>
        </button>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity animate-in fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Side Drawer Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[460px] bg-white text-navy shadow-2xl z-50 flex flex-col border-l border-slate-200 transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        {/* Drawer Header */}
        <div className="bg-navy text-white px-5 py-4 flex items-center justify-between border-b border-navy-mid flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sun">
              <Zap className="w-4 h-4 fill-sun" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide text-white">
                Power Load Calculator
              </h3>
              <p className="text-[11px] text-white/60">
                Estimate total wattage & required backup
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleReset}
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Reset devices"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close calculator"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Running Load Banner */}
        <div className="bg-[#f7f4ee] px-5 py-3 border-b border-line flex items-center justify-between flex-shrink-0">
          <div>
            <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block">
              Total Running Load
            </span>
            <span className="text-xl font-extrabold text-navy font-mono">
              {totalWatts} <span className="text-sm font-normal text-muted">Watts</span>
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block">
              Active Devices
            </span>
            <span className="text-sm font-bold text-navy">
              {activeItems.reduce((acc, d) => acc + d.qty, 0)} appliances
            </span>
          </div>
        </div>

        {/* Scrollable Device List */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2.5">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Appliance List
            </span>
            <button
              type="button"
              onClick={() => setShowAddMenu((v) => !v)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-green hover:text-[#176a3a] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddMenu ? "Cancel" : "Add Device"}</span>
            </button>
          </div>

          {/* Add Device Dropdown / Custom Form */}
          {showAddMenu && (
            <div className="mb-4 rounded-xl border border-line bg-paper p-3.5 shadow-sm animate-in fade-in duration-150">
              <p className="text-xs font-bold text-navy mb-2">
                Select an appliance to add:
              </p>
              <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
                {PRESET_LIBRARY.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => addPresetDevice(item)}
                    className="flex items-center justify-between rounded-lg bg-white px-2.5 py-1.5 text-left text-xs border border-line/60 hover:border-navy/30 hover:bg-slate-50 transition-colors"
                  >
                    <span className="truncate font-medium text-navy">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-muted font-mono ml-1 flex-shrink-0">
                      {item.watts}W
                    </span>
                  </button>
                ))}
              </div>

              {/* Or Add Custom */}
              <form onSubmit={handleAddCustom} className="mt-3 pt-2.5 border-t border-line/70">
                <p className="text-[11px] font-semibold text-muted mb-1.5">
                  Or enter custom appliance:
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Appliance name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="flex-1 rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs text-ink placeholder:text-slate-400 focus:border-navy focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Watts"
                    value={customWatts}
                    onChange={(e) => setCustomWatts(e.target.value)}
                    className="w-20 rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs text-ink placeholder:text-slate-400 focus:border-navy focus:outline-none font-mono"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-mid"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List of Devices */}
          {devices.length > 0 ? (
            <div className="space-y-2">
              {devices.map((device) => {
                const subtotal = device.watts * device.qty;
                return (
                  <div
                    key={device.id}
                    className={`flex items-center justify-between rounded-xl border p-2.5 transition-all ${
                      device.qty > 0
                        ? "border-slate-200 bg-white shadow-xs"
                        : "border-slate-100 bg-slate-50/60 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
                        {renderIcon(device.iconName)}
                      </div>
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-semibold text-navy truncate">
                          {device.name}
                        </p>
                        <p className="text-[10px] text-muted font-mono">
                          {device.watts} W each
                        </p>
                      </div>
                    </div>

                    {/* Stepper Controls */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="flex items-center rounded-lg border border-line bg-paper">
                        <button
                          type="button"
                          onClick={() => updateQty(device.id, -1)}
                          className="px-2 py-1 text-slate-500 hover:text-navy transition-colors disabled:opacity-30"
                          disabled={device.qty === 0}
                          aria-label={`Decrease ${device.name}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-mono text-xs font-bold text-navy">
                          {device.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(device.id, 1)}
                          className="px-2 py-1 text-slate-500 hover:text-navy transition-colors"
                          aria-label={`Increase ${device.name}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Row Total */}
                      <span className="w-14 text-right font-mono text-xs font-bold text-navy">
                        {subtotal} W
                      </span>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => removeDevice(device.id)}
                        className="text-slate-300 hover:text-red-500 p-1 transition-colors"
                        title="Remove device"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-muted">
              No devices added yet. Click &quot;Add Device&quot; to begin.
            </div>
          )}

          {/* Backup Duration Slider / Stepper */}
          <div className="mt-5 rounded-xl border border-line bg-paper p-3.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-navy block">
                  Desired Backup Duration
                </span>
                <span className="text-[10px] text-muted">
                  How many hours of power backup do you need?
                </span>
              </div>
              <div className="flex items-center rounded-lg border border-line bg-white">
                <button
                  type="button"
                  onClick={() => setBackupHours((h) => Math.max(1, h - 1))}
                  className="px-2.5 py-1 text-slate-500 hover:text-navy transition-colors disabled:opacity-30"
                  disabled={backupHours <= 1}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-16 text-center font-mono text-xs font-bold text-navy">
                  {backupHours} {backupHours === 1 ? "Hour" : "Hours"}
                </span>
                <button
                  type="button"
                  onClick={() => setBackupHours((h) => Math.min(12, h + 1))}
                  className="px-2.5 py-1 text-slate-500 hover:text-navy transition-colors disabled:opacity-30"
                  disabled={backupHours >= 12}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Sticky Recommendation Footer */}
        <div className="border-t border-slate-200 bg-white p-5 shadow-lg flex-shrink-0 space-y-3">
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Recommended Inverter:</span>
              <span className="font-bold text-navy font-mono">
                {recommendedInverter}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs border-t border-slate-200/60 pt-1.5">
              <span className="text-slate-500 font-medium">
                Recommended Battery ({backupHours}h backup):
              </span>
              <span className="font-bold text-navy font-mono">
                {recommendedBattery}
              </span>
            </div>
          </div>

          <a
            href={whatsappUrl(whatsappEnquiryText)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1f8a4c] hover:bg-[#186e3c] py-3 text-xs font-bold text-white shadow-md transition-all active:scale-[0.99]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Enquire Setup on WhatsApp</span>
          </a>

          <p className="text-[10px] text-center text-slate-400">
            Sourced genuine from Microtek, Luminous, Tata Power Solar & Adani Solar.
          </p>
        </div>
      </div>
    </>
  );
}
