import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"
import { Icon } from "../Icon"
import Labels from "../Labels"

interface QuickLinksProps {
  className?: string
  children: React.ReactNode | React.ReactNode[]
}

export const QuickLinks: React.FC<QuickLinksProps> = ({
  className,
  children,
}) => {
  return (
    <div
      className={clsx(
        "not-prose my-12 grid grid-cols-1 gap-6 sm:grid-cols-2",
        className
      )}
    >
      {children}
    </div>
  )
}

interface QuickLinkProps {
  title: string
  description?: string
  labels?: string[]
  href: string
  image?: string
  icon?: string
  className?: string
}

export const QuickLink: React.FC<QuickLinkProps> = ({
  title,
  description,
  labels,
  href,
  image,
  icon,
  className,
}) => {
  return (
    <div
      className={clsx(
        "group relative rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-800",
        className
      )}
    >
      <div className="absolute -inset-px rounded-xl border-2 border-transparent opacity-0 [background:linear-gradient(var(--quick-links-hover-bg,theme(colors.sky.50)),var(--quick-links-hover-bg,theme(colors.sky.50)))_padding-box,linear-gradient(to_top,theme(colors.indigo.400),theme(colors.cyan.400),theme(colors.sky.500))_border-box] group-hover:opacity-100 dark:[--quick-links-hover-bg:theme(colors.slate.800)]" />
      <div className="relative overflow-hidden rounded-xl p-6">
        {icon && <Icon icon={icon} className="mb-4 h-8 w-8" />}
        <div className="flex items-center gap-6">
          {image && (
            <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-md shadow-slate-800/5 ring-1 ring-slate-900/5 dark:border dark:border-slate-700/50 dark:bg-slate-700 dark:ring-0">
              <Image
                className="h-16 w-16 rounded-full"
                width={32}
                height={32}
                src={image}
                alt={title}
              />
            </div>
          )}
          <div className="flex-1">
            <h2 className="font-display text-2xl text-slate-900 dark:text-white">
              <Link href={href}>
                <span className="absolute -inset-px rounded-xl" />
                {title}
              </Link>
            </h2>
            <p className="mt-1 text-sm text-slate-700 dark:text-slate-400">
              {description}
            </p>
            {labels && <Labels labels={labels} />}
          </div>
        </div>
      </div>
    </div>
  )
}
