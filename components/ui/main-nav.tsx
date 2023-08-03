import Link from "next/link"

import { cn } from "@/lib/utils"
import InstallationSwitcher from "./installation-switcher"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Dashboard
      </Link>
    <InstallationSwitcher />
    </nav>
  )
}
