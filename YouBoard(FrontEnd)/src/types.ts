import React from "react";
import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";

type FormValues = {
  name: string;
  email?: string;
  currentPassword?: string;
  password?: string;
};

type InputProps = {
  title?: string;
  role?: string;
  register?: UseFormRegister<FormValues>;
  errors?: FieldErrors<FormValues>;
  watch?: UseFormWatch<FormValues>;
};

type NextButtonProps = {
  isVerifying: boolean;
  handleNextButton: () => Promise<void>;
  step: number;
  totalStep: number;
  text: string;
};

type FormContainerProps = {
  title: string;
  step: number;
  totalSteps: number;
  Inputs: React.ReactNode;
  handleNextButton: () => Promise<void>;
  NextButton: React.ReactNode;
};

type ProfileContentProps = {
  role: string;
  user: UserProps | null;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  handleName: () => Promise<void>;
  handlePassword?: () => Promise<void>;
  handleImageUpload: (croppedBlob: Blob) => Promise<void>;
  handleImageRemove: () => Promise<void>;
};

type UserProps = {
  _id: string;
  name: string;
  email: string;
  imageUrl: string;
  isBlocked: boolean;
  createdAt: string;
};

type ImageUploadProps = {
  handleImageUpload: (croppedBlob: Blob) => Promise<void>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

type ProtectedRouteProps = {
  requestRole: string;
};

type UserListProps = {
  users: UserProps[];
  rows: number;
  handleUserAccess: (userId: string) => Promise<void>;
};

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export type {
  FormValues,
  InputProps,
  NextButtonProps,
  FormContainerProps,
  ProfileContentProps,
  UserProps,
  ImageUploadProps,
  ProtectedRouteProps,
  UserListProps,
  PaginationProps,
};
