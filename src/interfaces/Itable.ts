export interface IUsersRoleTable {
  id: string;
  fullName: string | null;
  email: string;
  about: any;
  introImages: any;
  profileimageurl: string;
  role: string | null;
  isVerfied: any;
  isActive: any;
  createdAt: string;
  status: string;
  isSetupDone: any;
  notification: any;
  verification: any;
  socialLinks: any;
  privatemedia: any;
  _id?: string;
  amount?: any;
}
export type ITeamsTable = any;
export interface IUserID {
  email: string;
  fullName: string | null;
  profileimageurl: string;
  id: string;
}

export interface ITeam {
  score: number;
  shortName: string;
  teamId: string;
}

export interface IMatchTable {
  _id: string;
  zone: string;
  round: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  homeTeam: ITeam;
  awayTeam: ITeam;
}
export interface IRoundScheduleTable {
  _id: string;
  roundname: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  rounddate:string;
  roundorder: number,
}

export type complex = IUsersRoleTable | IFaqTable | ITeamsTable|IMatchTable|IRoundScheduleTable;

export interface Itable {
  limit?: number;
  selectedCategory?: string;
  headData: string[];
  dataShow?: complex[]; // Mark as optional
  pages?: number; // Mark as optional
  currPage?: number; // Mark as optional
  changePage?: (pageNumber: number) => void; // Mark as optional
  bodyData: complex[];
  totalData: number;
  totalPage: number;
  dataCurrentPage: number;
  role?: any;
}

export interface ICustomModelSettingstable {
  limit?: number;
  headData: string[];
  pages?: number;
  currPage?: number;
  changePage?: (pageNumber: number) => void;
  bodyData: complex[];
  totalData: number;
  totalPage: number;
  dataCurrentPage: number;
  statuss?: string;
  onClickCheckBox?: any;
  items?: object;
  setitems: any;
}
export interface commonItable {
  title?: string;
  limit?: number;
  selectedCategory?: string;
  searchTerm?: string; // Mark as optional
  headData: Record<string, string>;
  changePage?: (pageNumber: number) => void; // Mark as optional
  bodyData: complex[];
  totalData: number;
  totalPage: number;
  dataCurrentPage: number;
  deleteMessage?: string;
  handleDelete?: (id: string) => void;
  searchChange?: (term: string) => void;
  slug?: string;
}
export interface IFaqTable {
  _id: string;
  question: string;
  createdAt: any;
}
export interface roundItable {
  headData: string[];
  bodyData: complex[];
}