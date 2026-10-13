"use client"

import { FolderIcon, HomeIcon } from "lucide-react"
import Link from "next/link"

import { BreadcrumbDocFrame } from "@/components/examples/breadcrumb/breadcrumb-doc-frame"
import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/packages/ui/components/breadcrumb"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/packages/ui/components/dropdown-menu"

const BASIC_CODE = `import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/packages/ui/components/breadcrumb"

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`

export function BreadcrumbBasicExample() {
	return (
		<BreadcrumbDocFrame>
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Home</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Breadcrumb</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		</BreadcrumbDocFrame>
	)
}

export const breadcrumbBasicCode = BASIC_CODE

export function BreadcrumbCustomSeparatorExample() {
	return (
		<BreadcrumbDocFrame>
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Home</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator>/</BreadcrumbSeparator>
					<BreadcrumbItem>
						<BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator>/</BreadcrumbSeparator>
					<BreadcrumbItem>
						<BreadcrumbPage>Profile</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		</BreadcrumbDocFrame>
	)
}

export const breadcrumbCustomSeparatorCode = `import { BreadcrumbSeparator } from "@/packages/ui/components/breadcrumb"

<BreadcrumbSeparator>/</BreadcrumbSeparator>`

export function BreadcrumbWithIconsExample() {
	return (
		<BreadcrumbDocFrame>
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink className="inline-flex items-center gap-1" href="/">
							<HomeIcon className="size-3.5" aria-hidden />
							Home
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink className="inline-flex items-center gap-1" href="/projects">
							<FolderIcon className="size-3.5" aria-hidden />
							Projects
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Q4 report</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		</BreadcrumbDocFrame>
	)
}

export const breadcrumbWithIconsCode = `import { HomeIcon, FolderIcon } from "lucide-react"

<BreadcrumbLink className="inline-flex items-center gap-1" href="/">
  <HomeIcon className="size-3.5" aria-hidden />
  Home
</BreadcrumbLink>`

export function BreadcrumbCurrentPageExample() {
	return (
		<BreadcrumbDocFrame>
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/accounts">Accounts</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Acme Corp</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		</BreadcrumbDocFrame>
	)
}

export const breadcrumbCurrentPageCode = `<BreadcrumbPage>Acme Corp</BreadcrumbPage>`

export function BreadcrumbCollapsedDropdownExample() {
	return (
		<BreadcrumbDocFrame>
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Home</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<DropdownMenu>
							<DropdownMenuTrigger className="flex items-center" type="button">
								<BreadcrumbEllipsis />
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start">
								<DropdownMenuItem asChild>
									<Link href="/org">Organization</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href="/org/teams">Teams</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href="/org/teams/design">Design</Link>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href="/org/teams/design/projects">Projects</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Website</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		</BreadcrumbDocFrame>
	)
}

export const breadcrumbCollapsedDropdownCode = `import { BreadcrumbEllipsis } from "@/packages/ui/components/breadcrumb"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/packages/ui/components/dropdown-menu"

<BreadcrumbItem>
  <DropdownMenu>
    <DropdownMenuTrigger type="button">
      <BreadcrumbEllipsis />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start">
      <DropdownMenuItem asChild>
        <Link href="/org/teams">Teams</Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</BreadcrumbItem>`

export function BreadcrumbMobileTruncateExample() {
	return (
		<BreadcrumbDocFrame className="max-w-[280px]">
			<Breadcrumb className="min-w-0">
				<BreadcrumbList className="flex-nowrap overflow-hidden">
					<BreadcrumbItem className="shrink-0">
						<BreadcrumbLink href="/">Home</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator className="shrink-0" />
					<BreadcrumbItem className="min-w-0">
						<BreadcrumbLink className="block truncate" href="/reports">
							Reports and analytics
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator className="shrink-0" />
					<BreadcrumbItem className="min-w-0">
						<BreadcrumbPage className="block truncate">North America</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		</BreadcrumbDocFrame>
	)
}

export const breadcrumbMobileTruncateCode = `<BreadcrumbList className="flex-nowrap overflow-hidden">
  <BreadcrumbLink className="block truncate" href="...">...</BreadcrumbLink>
  <BreadcrumbPage className="block truncate">...</BreadcrumbPage>
</BreadcrumbList>`
