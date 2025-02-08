"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

export function Dialog({ children }: { children: React.ReactNode }) {
  return <DialogPrimitive.Root>{children}</DialogPrimitive.Root>;
}

export function DialogTrigger({ children }: { children: React.ReactNode }) {
  return <DialogPrimitive.Trigger asChild>{children}</DialogPrimitive.Trigger>;
}

export function DialogContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPrimitive.Content className={cn("bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6", className)}>
          {children}
          <DialogPrimitive.Close className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            ✕
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </div>
    </DialogPrimitive.Portal>
  );
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
        className={`w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-[#3182ce] focus:shadow-[0_0_15px_#3182ce] focus:outline-none ${className}`}
        {...props}
        />
    );
}

export function Button({ className, variant = "default", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline" | "ghost" }) {
    const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200";
    const variants = {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        outline: "border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-[0_0_15px_#3182ce]",
        ghost: "text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800",
    };

    return <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props} />;
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
        className={`w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-[#3182ce] focus:shadow-[0_0_15px_#3182ce] focus:outline-none ${className}`}
        {...props}
        />
    );
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
    return (
      <DialogPrimitive.Title className="text-2xl font-semibold text-white flex justify-center pb-5">
        {children}
      </DialogPrimitive.Title>
    );
  }