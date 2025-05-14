
import React from "react";
import { Link, LinkProps, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const Separator = () => {
  return <div className="h-px w-full my-2 bg-gray-200" />;
};

interface NavLinkProps extends LinkProps {
  className?: string;
  activeClassName?: string;
  end?: boolean;
}

export const NavLink = ({ className, activeClassName, end = false, ...props }: NavLinkProps) => {
  const location = useLocation();
  const isActive = end 
    ? location.pathname === props.to 
    : location.pathname.startsWith(props.to as string);

  return (
    <Link
      {...props}
      className={cn(
        className,
        isActive && (activeClassName || "text-primary font-medium")
      )}
    />
  );
};
