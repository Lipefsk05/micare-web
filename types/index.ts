export interface User {
  id: string
  name: string
  email: string
  crm: string
  createdAt: string
}

export interface Patient {
  id: string
  name: string
  cpf: string
  birthDate: string
  phone?: string
  emergencyPhone?: string
  accessCode: string
  createdAt: string
  prenatalCards?: PrenatalCard[]
}

export interface PrenatalCard {
  id: string
  patientId: string
  doctorId: string
  pnarPor?: string
  
  dum?: string
  dpp?: string
  firstUsg?: string
  igWeeks?: number
  gestacoes?: number
  partosCesareos?: number
  partosNormais?: number
  abortos?: number
  hpp?: string
  hgo?: string
  hs?: string
  hf?: string
  createdAt: string
  updatedAt: string
  patient?: Patient
  doctor?: { name: string; crm: string }
  exams?: Exam[]
  consultations?: Consultation[]
}

export interface Exam {
  id: string
  cardId: string
  type: string
  result1?: string; date1?: string
  result2?: string; date2?: string
  result3?: string; date3?: string
}

export interface Consultation {
  id: string
  cardId: string
  consultNumber: number
  date?: string
  complaint?: string
  ss?: string
  weight?: number
  pa?: string
  ai?: string
  touch?: string
  signature?: string
  returnDate?: string
  conduta?: string
}

export const EXAM_LABELS: Record<string, string> = {
  GS: 'GS', COOMBS_IND: 'Coombs Ind.', HB_HT: 'HB/HT', GL: 'GL',
  PLAQ: 'Plaq', HIV: 'HIV', HBSAG: 'HBsAg', VDRL: 'VDRL',
  ANTI_HCV: 'Anti HCV', TOXOPLASMOSE: 'Toxoplasmose', RUBEOLA: 'Rubéola',
  CVM: 'CVM', ANTI_HBS: 'Anti HBS', GLICOSE_J: 'Glicose J', GPD: 'GPD',
  HTLV: 'HTLV', TSH_T4L: 'TSH/T4L', EAS: 'EAS', UROCULTURA: 'Urocultura',
  STREP_B: 'Strep B', PREVENTIVO: 'Preventivo', FERRITINA: 'Ferritina',
  VITAMINA_D: 'Vitamina D', VITAMINA_B12: 'Vitamina B12',
}

export const EXAM_TYPES = Object.keys(EXAM_LABELS)
