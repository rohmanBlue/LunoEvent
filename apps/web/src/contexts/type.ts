import { ReactNode } from "react";

export type UserType = {
  id: string;
  email: string;
  name?: string;
  role: string;
  image: string;
  balance: number;
  points: number;
  identificationId: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string; // ubah ke string
  referralCode?: string; 
};

export interface UserContextType {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface UserProviderProps {
  children: ReactNode;
}
