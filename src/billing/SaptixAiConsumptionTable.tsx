'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sparkles, Cpu, Activity, Target, MessageSquare, Bot, 
  ArrowRight, CheckCircle2, Clock, DollarSign, Filter, 
  RefreshCw, Layers, ShieldCheck, FileText, ArrowUpRight, Zap
} from 'lucide-react';

export interface AiConsumptionItem {
  id: string;
  organization_id?: string;
  organization_name?: string;
  billing_month: string;
  stake: string;
  model: string;
  requests_count: number;
  prompt_tokens: string | number;
  completion_tokens: string | number;
  total_tokens: string | number;
  estimated_cost: string | number;
  admin_verified_count?: string | number;
  billing_status: 'recorded_admin' | 'moved_to_billing' | 'invoiced';
  moved_to_billing_at?: string | null;
  invoice_id?: string | null;
}

export interface AiConsumptionSummary {
  total_tokens: number;
  prompt_tokens: number;
  completion_tokens: number;
  estimated_cost: number;
  requests_count: number;
  active_models_count: number;
  active_stakes_count: number;
  plan_name?: string;
  plan_monthly_quota?: number;
}

export interface SaptixAiConsumptionTableProps {
  isAdmin?: boolean;
  endpointOverride?: string;
  title?: string;
  description?: string;
}

const AUTH_BASE = 'https://auth.saptix.tech/api/auth';

function getProviderTag(model: string): { label: string; bg: string; text: string } {
  const m = model.toLowerCase();
  if (m.includes('gpt')) {
    return { label: 'OpenAI', bg: 'bg-emerald-500/10 border-emerald-500/20', text: 'text-emerald-500' };
  }
  if (m.includes('claude')) {
    return { label: 'Anthropic', bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-500' };
  }
  if (m.includes('gemini')) {
    return { label: 'Google', bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-500' };
  }
  if (m.includes('llama')) {
    return { label: 'Meta', bg: 'bg-purple-500/10 border-purple-500/20', text: 'text-purple-500' };
  }
  if (m.includes('mistral')) {
    return { label: 'Mistral', bg: 'bg-orange-500/10 border-orange-500/20', text: 'text-orange-500' };
  }
  return { label: 'AI Model', bg: 'bg-muted border-border', text: 'text-muted-foreground' };
}

function getStakeBadge(stake: string): { icon: React.ReactNode; label: string } {
  const s = stake.toLowerCase();
  if (s === 'chat') return { icon: <MessageSquare className="size-3.5 text-cyan-400" />, label: 'Chat Portal' };
  if (s === 'agent') return { icon: <Bot className="size-3.5 text-indigo-400" />, label: 'Agent Hub' };
  if (s === 'modeler') return { icon: <Cpu className="size-3.5 text-blue-400" />, label: 'Modeler Studio' };
  if (s === 'spectra') return { icon: <Activity className="size-3.5 text-emerald-400" />, label: 'Spectra Engine' };
  if (s === 'lead') return { icon: <Target className="size-3.5 text-rose-400" />, label: 'Lead OS' };
  if (s === 'gate') return { icon: <Sparkles className="size-3.5 text-purple-400" />, label: 'AI Gateway' };
  return { icon: <Layers className="size-3.5 text-muted-foreground" />, label: stake };
}

export function SaptixAiConsumptionTable({
  isAdmin = false,
  endpointOverride,
  title = "Monthly AI Model-Wise Token Consumption",
  description = "Detailed token consumption and billing metrics across all native Saptix stakes."
}: SaptixAiConsumptionTableProps) {
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('2026-09');
  const [selectedStake, setSelectedStake] = useState('all');
  const [selectedModel, setSelectedModel] = useState('all');
  const [availableMonths, setAvailableMonths] = useState<string[]>(['2026-09', '2026-08']);
  const [summary, setSummary] = useState<AiConsumptionSummary>({
    total_tokens: 0, prompt_tokens: 0, completion_tokens: 0,
    estimated_cost: 0, requests_count: 0, active_models_count: 0, active_stakes_count: 0
  });
  const [breakdown, setBreakdown] = useState<AiConsumptionItem[]>([]);
  const [movingBilling, setMovingBilling] = useState(false);
  const [moveSuccessMsg, setMoveSuccessMsg] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const url = isAdmin
        ? `${AUTH_BASE}/ai-tokens/admin-audit?month=${selectedMonth}`
        : `${AUTH_BASE}/ai-tokens/my-consumption?month=${selectedMonth}&stake=${selectedStake}&model=${selectedModel}`;

      const res = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        if (data.summary) setSummary(data.summary);
        if (data.breakdown) setBreakdown(data.breakdown);
        if (data.records) setBreakdown(data.records);
        if (data.available_months && data.available_months.length > 0) {
          setAvailableMonths(data.available_months);
        }
      }
    } catch (_) {
    } finally {
      setLoading(false);
    }
  }, [isAdmin, selectedMonth, selectedStake, selectedModel]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleMoveToBilling = async () => {
    try {
      setMovingBilling(true);
      setMoveSuccessMsg(null);
      const res = await fetch(`${AUTH_BASE}/ai-tokens/move-to-billing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ month: selectedMonth }),
      });

      if (res.ok) {
        const data = await res.json();
        setMoveSuccessMsg(`Successfully moved ${data.organizations_processed || 1} organization record(s) to Saptix Technology Owner Billing Portal (account.saptix.tech)!`);
        fetchData();
      }
    } catch (_) {
    } finally {
      setMovingBilling(false);
    }
  };

  const filteredItems = breakdown.filter(item => {
    if (selectedStake !== 'all' && item.stake !== selectedStake) return false;
    if (selectedModel !== 'all' && item.model !== selectedModel) return false;
    return true;
  });

  return (
    <div className="w-full space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-4 rounded-2xl border border-border/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Zap className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground tracking-tight">{title}</h2>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Month Selector */}
          <div className="flex items-center gap-1.5 bg-muted/60 px-2.5 py-1.5 rounded-xl border border-border/60 text-xs">
            <Clock className="size-3.5 text-muted-foreground shrink-0" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-xs font-semibold text-foreground focus:outline-none cursor-pointer"
            >
              {availableMonths.map(m => (
                <option key={m} value={m} className="bg-popover text-foreground">
                  {m === '2026-09' ? 'September 2026 (Current)' : m === '2026-08' ? 'August 2026' : m}
                </option>
              ))}
            </select>
          </div>

          {/* Stake Filter */}
          <div className="flex items-center gap-1.5 bg-muted/60 px-2.5 py-1.5 rounded-xl border border-border/60 text-xs">
            <Filter className="size-3 text-muted-foreground shrink-0" />
            <select
              value={selectedStake}
              onChange={(e) => setSelectedStake(e.target.value)}
              className="bg-transparent text-xs font-medium text-foreground focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-popover text-foreground">All Stakes</option>
              <option value="chat" className="bg-popover text-foreground">Chat</option>
              <option value="modeler" className="bg-popover text-foreground">Modeler</option>
              <option value="agent" className="bg-popover text-foreground">Agent Hub</option>
              <option value="spectra" className="bg-popover text-foreground">Spectra</option>
              <option value="lead" className="bg-popover text-foreground">Lead OS</option>
              <option value="gate" className="bg-popover text-foreground">AI Gateway</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={fetchData}
            disabled={loading}
            className="p-2 rounded-xl bg-muted/60 hover:bg-muted border border-border/60 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Refresh Token Data"
          >
            <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Admin Stage 1 -> Stage 2 Move to Billing Action */}
          {isAdmin && (
            <button
              type="button"
              onClick={handleMoveToBilling}
              disabled={movingBilling}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-xs hover:bg-primary/90 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
            >
              <FileText className="size-3.5" />
              <span>{movingBilling ? 'Moving Records...' : 'Move to Saptix Technology Billing'}</span>
            </button>
          )}
        </div>
      </div>

      {moveSuccessMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{moveSuccessMsg}</span>
        </div>
      )}

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Total Monthly Tokens</span>
            <Sparkles className="size-3.5 text-primary" />
          </div>
          <div className="text-xl font-bold text-foreground tracking-tight">
            {summary.total_tokens.toLocaleString()}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">
            {summary.requests_count.toLocaleString()} API requests
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Estimated AI Cost</span>
            <DollarSign className="size-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-foreground tracking-tight">
            ${summary.estimated_cost.toFixed(2)}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            Model-weighted pricing
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Prompt / Completion</span>
            <Layers className="size-3.5 text-blue-400" />
          </div>
          <div className="text-xs font-bold text-foreground mt-1">
            {(summary.prompt_tokens / 1000).toFixed(0)}k in / {(summary.completion_tokens / 1000).toFixed(0)}k out
          </div>
          <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden mt-1.5 flex">
            <div
              className="bg-blue-500 h-full"
              style={{ width: `${summary.total_tokens > 0 ? (summary.prompt_tokens / summary.total_tokens) * 100 : 70}%` }}
            />
            <div
              className="bg-emerald-500 h-full"
              style={{ width: `${summary.total_tokens > 0 ? (summary.completion_tokens / summary.total_tokens) * 100 : 30}%` }}
            />
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground text-xs mb-1">
            <span>Billing Pipeline Stage</span>
            <ShieldCheck className="size-3.5 text-amber-500" />
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            {summary.estimated_cost > 0 ? (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                Stage 1: Admin Counted
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Stage 2: Moved to Billing
              </span>
            )}
          </div>
          <div className="text-[10px] text-muted-foreground mt-1 truncate">
            Owner: account.saptix.tech
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-muted/40 text-muted-foreground font-semibold">
                <th className="py-3 px-4">Application / Stake</th>
                <th className="py-3 px-4">AI Model</th>
                <th className="py-3 px-4">Requests</th>
                <th className="py-3 px-4">Prompt Tokens</th>
                <th className="py-3 px-4">Output Tokens</th>
                <th className="py-3 px-4">Total Tokens</th>
                <th className="py-3 px-4">Est. Cost</th>
                <th className="py-3 px-4">Billing Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground">
                    No consumption records found for the selected filters.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const stakeInfo = getStakeBadge(item.stake);
                  const prov = getProviderTag(item.model);
                  const total = parseInt(String(item.total_tokens), 10) || 0;
                  const prompt = parseInt(String(item.prompt_tokens), 10) || 0;
                  const completion = parseInt(String(item.completion_tokens), 10) || 0;
                  const cost = parseFloat(String(item.estimated_cost)) || 0;

                  return (
                    <tr key={item.id || `${item.stake}-${item.model}`} className="hover:bg-muted/30 transition-colors">
                      {/* Stake */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded-lg bg-background border border-border/60 shrink-0">
                            {stakeInfo.icon}
                          </div>
                          <span className="font-semibold text-foreground">{stakeInfo.label}</span>
                        </div>
                      </td>

                      {/* AI Model */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${prov.bg} ${prov.text}`}>
                            {prov.label}
                          </span>
                          <span className="font-mono text-foreground font-medium">{item.model}</span>
                        </div>
                      </td>

                      {/* Requests */}
                      <td className="py-3 px-4 font-mono text-muted-foreground">
                        {item.requests_count?.toLocaleString() || 1}
                      </td>

                      {/* Prompt */}
                      <td className="py-3 px-4 font-mono text-muted-foreground">
                        {prompt.toLocaleString()}
                      </td>

                      {/* Output */}
                      <td className="py-3 px-4 font-mono text-muted-foreground">
                        {completion.toLocaleString()}
                      </td>

                      {/* Total Tokens */}
                      <td className="py-3 px-4 font-mono font-bold text-foreground">
                        {total.toLocaleString()}
                      </td>

                      {/* Cost */}
                      <td className="py-3 px-4 font-mono font-semibold text-emerald-500">
                        ${cost.toFixed(4)}
                      </td>

                      {/* Billing Status */}
                      <td className="py-3 px-4">
                        {item.billing_status === 'moved_to_billing' ? (
                          <div className="flex items-center gap-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                              <CheckCircle2 className="size-3" />
                              Moved to Owner Billing
                            </span>
                            {item.invoice_id && (
                              <a
                                href="https://account.saptix.tech"
                                className="text-primary hover:underline text-[10px] font-mono flex items-center gap-0.5"
                                title="View in Owner Portal (account.saptix.tech)"
                              >
                                <span>Invoice</span>
                                <ArrowUpRight className="size-2.5" />
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            <Clock className="size-3" />
                            Recorded in Admin
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-3 bg-muted/20 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>
            Showing {filteredItems.length} model-wise usage metrics for {selectedMonth}
          </span>
          <span className="font-mono">
            Pipeline: admin.saptix.com ➔ account.saptix.tech
          </span>
        </div>
      </div>
    </div>
  );
}
