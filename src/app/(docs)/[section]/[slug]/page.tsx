import TableOfContents from "@/app/(docs)/(components)/TableOfContents"
import {
  collectHeadings,
  getMarkdownContent,
} from "@/app/(docs)/(utils)/markdown"
import { navigation } from "@/app/(docs)/(utils)/navigation"
import { components } from "@/app/(docs)/config.markdoc"
import { Prose } from "@/components/Prose"
import Markdoc from "@markdoc/markdoc"
import { glob } from "glob"
import { Metadata } from "next"
import Link from "next/link"
import path from "path"
import React from "react"

const ARTICLES_PATH = "src/app/(docs)/(articles)"
const POSTS_DIR = path.join(process.cwd(), ARTICLES_PATH)

type Params = {
  section: string
  slug: string
}

type PageProps = {
  params: Params
}

export const dynamicParams = false

export async function generateStaticParams() {
  const docPaths = await glob(path.join(POSTS_DIR, "**/*.md"))
  return docPaths.map((docPath) => {
    const section = path
      .dirname(docPath.replace(POSTS_DIR, ""))
      .replace("/", "")
    const slug = path.basename(docPath, path.extname(docPath))
    return { section, slug }
  })
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const filePath = path.join(ARTICLES_PATH, params.section, params.slug + ".md")
  const { title } = await getMarkdownContent(filePath)
  return {
    title: params.section.replaceAll("-", " ") + " - " + title,
  }
}

export default async function Page({ params }: PageProps) {
  const filePath = path.join(ARTICLES_PATH, params.section, params.slug + ".md")
  const { title, content } = await getMarkdownContent(filePath)
  const tableOfContents = collectHeadings(content)

  // TODO: use file system to iterate through them
  const pathname = path.join(POSTS_DIR, params.slug) // usePathname()
  let allLinks = navigation.flatMap((section) => section.links)
  let linkIndex = allLinks.findIndex((link) => link.href === pathname)
  let previousPage = allLinks[linkIndex - 1]
  let nextPage = allLinks[linkIndex + 1]
  let section = navigation.find((section) =>
    section.links.find((link) => link.href === pathname)
  )

  return (
    <div className="flex-1">
      <div className="flex">
        <div className="min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16">
          <article>
            <header className="mb-9 space-y-1">
              <p className="font-display text-sm font-medium capitalize text-sky-500">
                {params.section.replaceAll("-", " ")}
              </p>
              <h1 className="font-display text-3xl tracking-tight text-slate-900 dark:text-white">
                {title}
              </h1>
            </header>
            <Prose>
              {Markdoc.renderers.react(content, React, { components })}
            </Prose>
          </article>
          <dl className="mt-12 flex border-t border-slate-200 pt-6 dark:border-slate-800">
            {previousPage && (
              <div>
                <dt className="font-display text-sm font-medium text-slate-900 dark:text-white">
                  Previous
                </dt>
                <dd className="mt-1">
                  <Link
                    href={previousPage.href}
                    className="text-base font-semibold text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
                  >
                    <span aria-hidden="true">&larr;</span> {previousPage.title}
                  </Link>
                </dd>
              </div>
            )}
            {nextPage && (
              <div className="ml-auto text-right">
                <dt className="font-display text-sm font-medium text-slate-900 dark:text-white">
                  Next
                </dt>
                <dd className="mt-1">
                  <Link
                    href={nextPage.href}
                    className="text-base font-semibold text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
                  >
                    {nextPage.title} <span aria-hidden="true">&rarr;</span>
                  </Link>
                </dd>
              </div>
            )}
          </dl>
        </div>
        <div className="hidden xl:sticky xl:top-[4.5rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.5rem)] xl:flex-none xl:overflow-y-auto xl:py-16 xl:pr-6">
          <TableOfContents tableOfContents={tableOfContents} />
        </div>
      </div>
    </div>
  )
}