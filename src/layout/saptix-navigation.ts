import {
  LayoutDashboard,
  User,
  Key,
  Users,
  ShieldCheck,
  Shield,
  TrendingUp,
  Receipt,
  Mail,
  Database,
  Layers,
  FileCode,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Cpu,
  FileText,
  History,
  Activity,
  Coins,
  Package,
  Factory,
  Wrench,
  Terminal,
  CheckSquare,
  FileSpreadsheet,
  Lock,
  Settings,
  Bot,
  Network,
  Palette,
  LayoutGrid,
  BarChart3,
  Server,
  Globe,
  Radio,
  Zap,
} from "lucide-react";
import type { NavSection } from "./SaptixAppSidebar";

// 1. Account Workspace Navigation
export const ACCOUNT_NAV_SECTIONS: NavSection[] = [
  {
    title: "Identity & Credentials",
    items: [
      { id: "profile", label: "Profile & Identity", href: "/", icon: User },
      { id: "tokens", label: "API Tokens & Secrets", href: "/?tab=tokens", icon: Key, badge: "3 Active" },
      { id: "team", label: "Team & Role Access", href: "/?tab=team", icon: Users },
      { id: "security", label: "Security & MFA Policies", href: "/?tab=security", icon: ShieldCheck },
    ],
  },
  {
    title: "Connected Saptix Suite",
    items: [
      { id: "admin", label: "Admin Console", href: "https://admin.saptix.tech", icon: Shield, isExternal: true },
      { id: "lead", label: "Lead OS Web", href: "https://lead.saptix.tech", icon: TrendingUp, isExternal: true },
      { id: "modeler", label: "Modeler Studio", href: "https://modeler.saptix.tech", icon: LayoutGrid, isExternal: true },
      { id: "chat", label: "AI Chat Assistant", href: "https://chat.saptix.tech", icon: MessageSquare, isExternal: true },
      { id: "spectra", label: "Spectra Engine", href: "https://spectra.saptix.tech", icon: Activity, isExternal: true },
      { id: "agent", label: "Agentic Platform", href: "https://agent.saptix.tech", icon: Bot, isExternal: true },
    ],
  },
];

// 2. Lead OS Navigation
export const LEAD_NAV_SECTIONS: NavSection[] = [
  {
    title: "Revenue Pipeline",
    items: [
      { id: "overview", label: "Pipeline Overview", href: "/", icon: LayoutDashboard },
      { id: "orders", label: "Orders & Transactions", href: "/dashboard/orders", icon: Receipt, badge: "Live" },
      { id: "leads", label: "Discovered Leads", href: "/dashboard/orders?tab=leads", icon: Users, badge: "12k" },
      { id: "analytics", label: "Performance Analytics", href: "/dashboard/orders?tab=analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Autonomous Swarms",
    items: [
      { id: "radar", label: "Lead Radar & Signals", href: "/dashboard/orders?tab=signals", icon: Activity, badge: "Active" },
      { id: "hermes", label: "Hermes Outreach", href: "/dashboard/orders?tab=hermes", icon: Mail },
      { id: "erp", label: "ERP Integration", href: "/dashboard/orders?tab=erp", icon: Database },
    ],
  },
  {
    title: "System",
    items: [
      { id: "account", label: "Account & Keys", href: "https://account.saptix.tech", icon: Key, isExternal: true },
      { id: "settings", label: "Pipeline Settings", href: "/dashboard/orders?tab=settings", icon: Settings },
    ],
  },
];

// 3. AI Chat Navigation
export const CHAT_NAV_SECTIONS: NavSection[] = [
  {
    title: "AI Assistant",
    items: [
      { id: "chat", label: "Active Conversation", href: "/", icon: MessageSquare, badge: "Live" },
      { id: "prompts", label: "Prompt Library", href: "/prompts", icon: Sparkles },
      { id: "models", label: "Model Benchmarks", href: "/models", icon: Cpu },
    ],
  },
  {
    title: "Knowledge & Data",
    items: [
      { id: "documents", label: "Enterprise Knowledge", href: "/documents", icon: FileText },
      { id: "history", label: "Prompt History Archive", href: "/history", icon: History },
    ],
  },
  {
    title: "Ecosystem",
    items: [
      { id: "agent", label: "Agentic Platform", href: "https://agent.saptix.tech", icon: Bot, isExternal: true },
      { id: "spectra", label: "Spectra Telemetry", href: "https://spectra.saptix.tech", icon: Activity, isExternal: true },
      { id: "settings", label: "Chat Settings", href: "/settings", icon: Settings },
    ],
  },
];

// 4. UI Portal Navigation
export const UI_NAV_SECTIONS: NavSection[] = [
  {
    title: "Design Architecture",
    items: [
      { id: "components", label: "Component Suite", href: "/", icon: Palette, badge: "60+" },
      { id: "tokens", label: "OKLCH Tokens", href: "/tokens", icon: Sparkles },
      { id: "standard", label: "Standard Suite (KPI/Table)", href: "/standard", icon: LayoutGrid },
    ],
  },
  {
    title: "Gateway & Service",
    items: [
      { id: "models", label: "Gateway Model Router", href: "/models", icon: Cpu, badge: "104" },
      { id: "providers", label: "Provider Connections", href: "/providers", icon: Database, badge: "141" },
    ],
  },
  {
    title: "Suite Links",
    items: [
      { id: "account", label: "Account Portal", href: "https://account.saptix.tech", icon: User, isExternal: true },
      { id: "admin", label: "Admin Console", href: "https://admin.saptix.tech", icon: Shield, isExternal: true },
      { id: "settings", label: "Theme Customizer Settings", href: "/settings", icon: Settings },
    ],
  },
];

// 5. Modeler Studio Navigation
export const MODELER_NAV_SECTIONS: NavSection[] = [
  {
    title: "Studio Workspace",
    items: [
      { id: "overview", label: "Architecture Overview", href: "/dashboard/overview", icon: LayoutGrid },
      { id: "studio", label: "Canvas Modeler", href: "/studio", icon: Layers, badge: "v3" },
      { id: "components", label: "Cloud Components", href: "/dashboard/components", icon: Layers },
    ],
  },
  {
    title: "Enterprise Blueprint",
    items: [
      { id: "sap", label: "SAP BTP Blueprints", href: "/dashboard/sap", icon: Database },
      { id: "templates", label: "Architecture Templates", href: "/dashboard/templates", icon: FileCode },
      { id: "export", label: "Export & Infrastructure", href: "/dashboard/export", icon: ExternalLink },
    ],
  },
];


// 6. Spectra Navigation
export const SPECTRA_NAV_SECTIONS: NavSection[] = [
  {
    title: "Executive & Telemetry",
    items: [
      { id: "dashboard", label: "Overview Dashboard", href: "/", icon: LayoutDashboard },
      { id: "topology", label: "System Topology", href: "/topology", icon: Network },
      { id: "telemetry", label: "Real-time Telemetry", href: "/telemetry", icon: Activity, badge: "Live" },
    ],
  },
  {
    title: "SAP Module Suites",
    items: [
      { id: "finance", label: "Finance (FI / AR Aging)", href: "/finance", icon: Coins },
      { id: "controlling", label: "Controlling (CO-PA)", href: "/controlling", icon: Receipt },
      { id: "sales", label: "Sales & Distribution (SD)", href: "/sales", icon: TrendingUp },
      { id: "procurement", label: "Materials Mgmt (MM)", href: "/procurement", icon: Package },
      { id: "production", label: "Production Planning (PP)", href: "/production", icon: Factory },
      { id: "maintenance", label: "Plant Maintenance (PM)", href: "/maintenance", icon: Wrench },
      { id: "quality", label: "Quality Mgmt (QM)", href: "/quality", icon: ShieldCheck },
    ],
  },
  {
    title: "Cognitive Tools",
    items: [
      { id: "sandbox", label: "BAPI Write-Back Sandbox", href: "/sandbox", icon: Terminal, badge: "TESTRUN" },
      { id: "audit", label: "Agent Audit Logs", href: "/audit", icon: FileText },
    ],
  },
  {
    title: "System Operations",
    items: [
      { id: "tasks", label: "Operational Tasks", href: "/tasks", icon: CheckSquare, badge: "8" },
      { id: "invoice", label: "Billing & Invoices", href: "/invoice", icon: FileSpreadsheet },
      { id: "roles", label: "Roles & GRC Access", href: "/roles", icon: Lock },
      { id: "settings", label: "Settings & Connectivity", href: "/settings", icon: Settings },
    ],
  },
];

// 7. Agentic Platform Navigation
export const AGENT_NAV_SECTIONS: NavSection[] = [
  {
    title: "Agent Orchestration",
    items: [
      { id: "dashboard", label: "Agents Dashboard", href: "/", icon: Bot, badge: "Live" },
      { id: "workflows", label: "Autonomous Workflows", href: "/workflows", icon: Network },
      { id: "tools", label: "Tool Terminal", href: "/tools", icon: Terminal },
      { id: "logs", label: "Execution Trace Logs", href: "/logs", icon: Activity },
    ],
  },
  {
    title: "Cloud Infrastructure",
    items: [
      { id: "providers", label: "LLM Providers & Keys", href: "/providers", icon: Cpu },
      { id: "spectra", label: "Spectra ERP Engine", href: "https://spectra.saptix.tech", icon: Database, isExternal: true },
      { id: "settings", label: "Platform Settings", href: "/settings", icon: Settings },
    ],
  },
];

// 8. Admin Console Navigation
export const ADMIN_NAV_SECTIONS: NavSection[] = [
  {
    title: "Governance & Ops",
    items: [
      { id: "overview", label: "Operations Overview", href: "/dashboard/default", icon: LayoutDashboard },
      { id: "users", label: "Users & Multi-Tenants", href: "/dashboard/users", icon: Users },
      { id: "infrastructure", label: "PM2 & Node Infrastructure", href: "/dashboard/infrastructure", icon: Server, badge: "Live" },
      { id: "analytics", label: "Platform Metrics", href: "/dashboard/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Security & Policy",
    items: [
      { id: "audit", label: "Audit Trails", href: "/dashboard/audit", icon: FileText },
      { id: "security", label: "Security & Keys", href: "/dashboard/security", icon: ShieldCheck },
      { id: "settings", label: "Global Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];


// Universal Saptix Portal Tabs & Ecosystem Apps
export interface SaptixPortalTab {
  id: string;
  label: string;
  href: string;
}

export interface SaptixAppDef {
  name: string;
  sub: string;
  desc: string;
  url: string;
  icon: string;
}

export const SAPTIX_PORTAL_TABS: SaptixPortalTab[] = [
  { id: 'hub', label: 'Hub', href: 'https://saptix.tech' },
  { id: 'account', label: 'Account', href: 'https://account.saptix.tech' },
  { id: 'admin', label: 'Admin', href: 'https://admin.saptix.tech' },
  { id: 'lead', label: 'Lead OS', href: 'https://lead.saptix.tech' },
  { id: 'modeler', label: 'Modeler', href: 'https://modeler.saptix.tech' },
  { id: 'chat', label: 'Chat', href: 'https://chat.saptix.tech' },
  { id: 'spectra', label: 'Spectra', href: 'https://spectra.saptix.tech' },
  { id: 'agent', label: 'Agent', href: 'https://agent.saptix.tech' },
  { id: 'ui', label: 'UI Suite', href: 'https://ui.saptix.tech' },
];

export const SAPTIX_APPS: SaptixAppDef[] = [
  { name: 'Saptix Hub', sub: 'hub', desc: 'Central enterprise portal', url: 'https://saptix.tech', icon: '🌐' },
  { name: 'Account Portal', sub: 'account', desc: 'SSO, API keys & billing', url: 'https://account.saptix.tech', icon: '👤' },
  { name: 'Admin Console', sub: 'admin', desc: 'Multi-tenant governance', url: 'https://admin.saptix.tech', icon: '🛡️' },
  { name: 'Modeler Studio', sub: 'modeler', desc: 'Visual SAP architecture builder', url: 'https://modeler.saptix.tech', icon: '🏗️' },
  { name: 'Spectra ERP', sub: 'spectra', desc: 'Autonomous ERP & telemetry', url: 'https://spectra.saptix.tech', icon: '📊' },
  { name: 'Agent Studio', sub: 'agent', desc: 'Multi-agent orchestration', url: 'https://agent.saptix.tech', icon: '🤖' },
  { name: 'AI Chat', sub: 'chat', desc: 'Enterprise cognitive consultant', url: 'https://chat.saptix.tech', icon: '💬' },
  { name: 'Automate RPA', sub: 'automate', desc: 'Process & workflow automation', url: 'https://automate.saptix.tech', icon: '⚙️' },
  { name: 'Lead OS', sub: 'lead', desc: 'Enterprise CRM & pipeline', url: 'https://lead.saptix.tech', icon: '⚡' },
  { name: 'UI Suite', sub: 'ui', desc: 'Design system & component lab', url: 'https://ui.saptix.tech', icon: '🎨' },
  { name: 'Transformer', sub: 'transformer', desc: 'ABAP code transformer', url: 'https://transformer.saptix.tech', icon: '🔄' },
  { name: 'DataSafe', sub: 'datasafe', desc: 'Cryptographic data masking', url: 'https://datasafe.saptix.tech', icon: '🔒' },
  { name: 'Annotator', sub: 'annotator', desc: 'CDS & OData annotation studio', url: 'https://annotator.saptix.tech', icon: '📝' },
  { name: 'Foundry', sub: 'foundry', desc: 'Clean Core extension scaffold', url: 'https://foundry.saptix.tech', icon: '🔬' },
  { name: 'Migrate', sub: 'migrate', desc: 'ECC to S/4HANA migration tool', url: 'https://migrate.saptix.tech', icon: '🚀' },
  { name: 'Analytics', sub: 'analytics', desc: 'Executive BI & performance', url: 'https://analytics.saptix.tech', icon: '📈' },
  { name: 'DataMachine', sub: 'datamachine', desc: 'High-throughput data ETL', url: 'https://datamachine.saptix.tech', icon: '🗄️' },
  { name: 'Trial Sandbox', sub: 'trial', desc: 'Instant enterprise sandbox', url: 'https://trial.saptix.tech', icon: '🧪' },
  { name: 'Postman Hub', sub: 'postman', desc: 'API testing & VPS CORS proxy', url: 'https://postman.saptix.tech', icon: '📮' },
  { name: 'Cloud Connector', sub: 'scc', desc: 'SAP RFC & BAPI connectivity', url: 'https://scc.saptix.tech', icon: '🔌' },
  { name: 'Infisical Vault', sub: 'vault', desc: 'Secrets & encryption keys', url: 'https://vault.saptix.tech', icon: '🔑' },
];
