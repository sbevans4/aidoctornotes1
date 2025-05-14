
import { cn } from "@/lib/utils";
import { NavLink as RouterNavLink, NavLinkProps as RouterNavLinkProps } from "react-router-dom";

interface NavLinkProps extends RouterNavLinkProps {
  className?: string;
  activeClassName?: string;
  end?: boolean;
}

export const NavLink = ({
  to,
  className,
  activeClassName,
  children,
  end = false,
  ...props
}: NavLinkProps) => {
  return (
    <RouterNavLink
      to={to}
      end={end}
      className={({ isActive }) => 
        cn(
          className,
          isActive && activeClassName
        )
      }
      {...props}
    >
      {children}
    </RouterNavLink>
  );
};

export const Separator = () => (
  <hr className="my-2 border-t border-gray-200" />
);
