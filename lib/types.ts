export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type RiasecDim = "R" | "I" | "A" | "S" | "E" | "C";
export type CareerLevel = "tecnico" | "graduacao" | "pos";
export type OrderStatus = "pending" | "paid" | "failed" | "expired";

export interface Institution {
  id: number;
  name: string;
  acronym: string | null;
  uf: string | null;
  city: string | null;
  isPublic: boolean;
  _count?: { courses: number };
}

export interface Course {
  id: number;
  institutionId: number;
  name: string;
  normalizedName: string;
  degree: string;
  modality: string;
  uf: string | null;
  city: string | null;
  institution?: { id: number; name: string };
}

export interface CareerRow {
  id: string;
  slug: string;
  nameM: string;
  level: CareerLevel;
  code: string;
  published: boolean;
  updatedAt: string;
  _count: { courseMaps: number };
}

export interface Career {
  id: string;
  slug: string;
  nameM: string;
  nameF: string;
  nameEn: string | null;
  onetSocCode: string | null;
  cboCode: string | null;
  level: CareerLevel;
  r: number;
  i: number;
  a: number;
  s: number;
  e: number;
  c: number;
  code: string;
  description: string;
  dailyTasks: unknown;
  paths: unknown;
  salaryJunior: string;
  salaryPleno: string;
  salarySenior: string;
  salarySource: string;
  published: boolean;
  updatedAt: string;
  courseMaps: { careerId: string; coursePattern: string }[];
}

export interface Question {
  id: number;
  order: number;
  dim: RiasecDim;
  block: number;
  textEn: string;
  textPtBr: string | null;
}

export interface QuestionnaireVersion {
  id: number;
  key: string;
  status: "draft" | "active" | "retired";
  notes: string | null;
  createdAt: string;
  activatedAt: string | null;
  questions: Question[];
  _count?: { assessments: number };
  validation?: string[];
}

export interface Order {
  id: string;
  assessmentId: string;
  payerName: string;
  payerEmail: string;
  method: "pix" | "credit_card";
  amountCents: number;
  currency: string;
  status: OrderStatus;
  gateway: string;
  gatewayRef: string | null;
  paymentId: string | null;
  statusDetail: string | null;
  expiresAt: string;
  paidAt: string | null;
  createdAt: string;
}

export interface PaymentEvent {
  id: string;
  gateway: string;
  externalId: string;
  type: string;
  payload: unknown;
  createdAt: string;
}

export interface OrdersPage extends Page<Order> {
  totals: { status: OrderStatus; count: number; amountCents: number }[];
}
