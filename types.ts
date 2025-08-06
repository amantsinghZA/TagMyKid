
export interface LearnerInfo {
  tagId: string;
  name: string;
  grade: string;
  className: string;
  parentPhone: string;
  school: string;
}

export interface User {
  phone: string;
  name: string;
  surname: string;
  school: string;
}

export interface UserData {
  password: string;
  name: string;
  surname: string;
  school: string;
  tags: LearnerInfo[];
}