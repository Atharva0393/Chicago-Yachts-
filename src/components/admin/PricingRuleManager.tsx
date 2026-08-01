"use client";

import React, { useEffect, useState } from "react";
import { getPricingRules, savePricingRule, deletePricingRule } from "@/actions/pricing-admin";
import { Yacht } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit2, Check, X, AlertTriangle } from "lucide-react";
import { DayType, TimePeriod } from "@prisma/client";

export function PricingRuleManager({ yacht }: { yacht: Yacht }) {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    dayType: "WEEKDAY" as DayType,
    timePeriod: "CUSTOM" as TimePeriod,
    basePrice: 0,
    hourlyRate: 0,
    minDuration: 2,
    maxDuration: 24,
    priority: 0,
    isActive: true,
    effectiveFrom: "",
    effectiveTo: ""
  });
  
  const [error, setError] = useState("");

  const loadRules = async () => {
    setLoading(true);
    const data = await getPricingRules(yacht.id);
    setRules(data);
    setLoading(false);
  };

  useEffect(() => {
    loadRules();
  }, [yacht.id]);

  const handleAddNew = () => {
    setEditingId("new");
    setFormData({
      title: "New Rule",
      dayType: "WEEKDAY",
      timePeriod: "CUSTOM",
      basePrice: yacht.pricePerHour * 4,
      hourlyRate: yacht.pricePerHour,
      minDuration: 2,
      maxDuration: 24,
      priority: 0,
      isActive: true,
      effectiveFrom: "",
      effectiveTo: ""
    });
    setError("");
  };

  const handleEdit = (rule: any) => {
    setEditingId(rule.id);
    setFormData({
      title: rule.title,
      dayType: rule.dayType,
      timePeriod: rule.timePeriod,
      basePrice: parseFloat(rule.basePrice),
      hourlyRate: rule.hourlyRate ? parseFloat(rule.hourlyRate) : 0,
      minDuration: rule.minDuration,
      maxDuration: rule.maxDuration,
      priority: rule.priority,
      isActive: rule.isActive,
      effectiveFrom: rule.effectiveFrom ? new Date(rule.effectiveFrom).toISOString().split('T')[0] : "",
      effectiveTo: rule.effectiveTo ? new Date(rule.effectiveTo).toISOString().split('T')[0] : ""
    });
    setError("");
  };

  const handleSave = async () => {
    setError("");
    const res = await savePricingRule({
      id: editingId === "new" ? undefined : editingId!,
      yachtId: yacht.id,
      title: formData.title,
      dayType: formData.dayType,
      timePeriod: formData.timePeriod,
      basePrice: formData.basePrice,
      hourlyRate: formData.hourlyRate > 0 ? formData.hourlyRate : null,
      minDuration: formData.minDuration,
      maxDuration: formData.maxDuration,
      priority: formData.priority,
      isActive: formData.isActive,
      effectiveFrom: formData.effectiveFrom ? new Date(formData.effectiveFrom) : null,
      effectiveTo: formData.effectiveTo ? new Date(formData.effectiveTo) : null
    });

    if (res.error) {
      setError(res.error);
    } else {
      setEditingId(null);
      await loadRules();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this pricing rule?")) {
      await deletePricingRule(id);
      await loadRules();
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-slate-900">Pricing Rules</h3>
        <Button onClick={handleAddNew} className="bg-slate-900 text-white rounded-full flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Rule
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5" /> {error}
        </div>
      )}

      {editingId && (
        <div className="mb-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-slate-900">{editingId === "new" ? "Create New Rule" : "Edit Rule"}</h4>
            <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="space-y-1">
              <Label>Rule Title</Label>
              <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g., Summer Weekend Morning" />
            </div>
            
            <div className="space-y-1">
              <Label>Day Type</Label>
              <select 
                value={formData.dayType} 
                onChange={e => setFormData({...formData, dayType: e.target.value as DayType})}
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-slate-900"
              >
                <option value="WEEKDAY">Weekday</option>
                <option value="WEEKEND">Weekend</option>
                <option value="HOLIDAY">Holiday</option>
                <option value="SPECIAL_EVENT">Special Event</option>
              </select>
            </div>
            
            <div className="space-y-1">
              <Label>Time Period</Label>
              <select 
                value={formData.timePeriod} 
                onChange={e => setFormData({...formData, timePeriod: e.target.value as TimePeriod})}
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-slate-900"
              >
                <option value="CUSTOM">Custom (Any Time)</option>
                <option value="MORNING">Morning</option>
                <option value="AFTERNOON">Afternoon</option>
                <option value="EVENING">Evening</option>
                <option value="FULL_DAY">Full Day</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label>Priority (Higher wins)</Label>
              <Input type="number" value={formData.priority} onChange={e => setFormData({...formData, priority: parseInt(e.target.value) || 0})} />
            </div>

            <div className="space-y-1">
              <Label>Base Price ($)</Label>
              <Input type="number" value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: parseFloat(e.target.value) || 0})} />
            </div>

            <div className="space-y-1">
              <Label>Hourly Rate ($)</Label>
              <Input type="number" value={formData.hourlyRate} onChange={e => setFormData({...formData, hourlyRate: parseFloat(e.target.value) || 0})} />
            </div>

            <div className="space-y-1">
              <Label>Min Duration (Hrs)</Label>
              <Input type="number" value={formData.minDuration} onChange={e => setFormData({...formData, minDuration: parseInt(e.target.value) || 0})} />
            </div>

            <div className="space-y-1">
              <Label>Max Duration (Hrs)</Label>
              <Input type="number" value={formData.maxDuration} onChange={e => setFormData({...formData, maxDuration: parseInt(e.target.value) || 0})} />
            </div>

            <div className="space-y-1">
              <Label>Effective From</Label>
              <Input type="date" value={formData.effectiveFrom} onChange={e => setFormData({...formData, effectiveFrom: e.target.value})} />
            </div>

            <div className="space-y-1">
              <Label>Effective To</Label>
              <Input type="date" value={formData.effectiveTo} onChange={e => setFormData({...formData, effectiveTo: e.target.value})} />
            </div>

            <div className="space-y-1 flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.isActive}
                  onChange={e => setFormData({...formData, isActive: e.target.checked})}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">Rule is Active</span>
              </label>
            </div>

          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-slate-900 text-white flex items-center gap-2">
              <Check className="w-4 h-4" /> Save Rule
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-slate-500">Loading rules...</div>
      ) : rules.length === 0 ? (
        <div className="text-center py-10 text-slate-500">No pricing rules configured for this yacht.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl font-medium">Rule</th>
                <th className="px-6 py-4 font-medium">Target</th>
                <th className="px-6 py-4 font-medium">Pricing</th>
                <th className="px-6 py-4 font-medium">Priority</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 rounded-tr-xl font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{rule.title}</div>
                    <div className="text-xs text-slate-500">
                      {rule.effectiveFrom ? new Date(rule.effectiveFrom).toLocaleDateString() : "Always"} - 
                      {rule.effectiveTo ? new Date(rule.effectiveTo).toLocaleDateString() : "Forever"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 w-fit">
                        {rule.dayType}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-50 text-purple-700 w-fit">
                        {rule.timePeriod}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {rule.hourlyRate ? (
                      <div>${parseFloat(rule.hourlyRate)} <span className="text-xs text-slate-500">/hr</span></div>
                    ) : (
                      <div>${parseFloat(rule.basePrice)} <span className="text-xs text-slate-500">base</span></div>
                    )}
                    <div className="text-xs text-slate-500">{rule.minDuration}-{rule.maxDuration} hrs</div>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {rule.priority}
                  </td>
                  <td className="px-6 py-4">
                    {rule.isActive ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">Inactive</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(rule)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(rule.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
