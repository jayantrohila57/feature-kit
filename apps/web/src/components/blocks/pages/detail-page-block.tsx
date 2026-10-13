"use client"

import { ContentPageHeader, DashboardShell } from "layout"
import { Building2, CreditCard, FileText, Users } from "lucide-react"

import { BlockPageRoot } from "@/components/blocks/block-page-root"
import { LayoutShellSidebarSlots } from "@/components/blocks/block-shell-slots"
import { Badge } from "@/packages/ui/components/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/packages/ui/components/card"
import { Separator } from "@/packages/ui/components/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/packages/ui/components/tabs"

const slots = LayoutShellSidebarSlots()

export function DetailPageBlock() {
	return (
		<BlockPageRoot>
			<DashboardShell {...slots}>
				<ContentPageHeader
					actions={<Badge variant="secondary">Enterprise</Badge>}
					description="Customer account · ID acme-2048"
					title="Acme Corporation"
				/>
				<Tabs className="mt-4" defaultValue="overview">
					<TabsList>
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="people">People</TabsTrigger>
						<TabsTrigger value="billing">Billing</TabsTrigger>
						<TabsTrigger value="documents">Documents</TabsTrigger>
					</TabsList>
					<TabsContent className="mt-4 space-y-4" value="overview">
						<div className="grid gap-4 sm:grid-cols-3">
							<Card className="shadow-sm">
								<CardHeader className="flex flex-row items-center justify-between pb-2">
									<CardTitle className="font-medium text-sm">Seats</CardTitle>
									<Users className="size-4 text-muted-foreground" aria-hidden />
								</CardHeader>
								<CardContent>
									<p className="font-semibold text-2xl">128</p>
									<p className="text-muted-foreground text-xs">12 pending invites</p>
								</CardContent>
							</Card>
							<Card className="shadow-sm">
								<CardHeader className="flex flex-row items-center justify-between pb-2">
									<CardTitle className="font-medium text-sm">MRR</CardTitle>
									<CreditCard className="size-4 text-muted-foreground" aria-hidden />
								</CardHeader>
								<CardContent>
									<p className="font-semibold text-2xl">$4,200</p>
									<p className="text-muted-foreground text-xs">Renews Apr 1</p>
								</CardContent>
							</Card>
							<Card className="shadow-sm">
								<CardHeader className="flex flex-row items-center justify-between pb-2">
									<CardTitle className="font-medium text-sm">Industry</CardTitle>
									<Building2 className="size-4 text-muted-foreground" aria-hidden />
								</CardHeader>
								<CardContent>
									<p className="font-semibold text-2xl">SaaS</p>
									<p className="text-muted-foreground text-xs">North America</p>
								</CardContent>
							</Card>
						</div>
						<Card className="shadow-sm">
							<CardHeader>
								<CardTitle className="text-base">Summary</CardTitle>
								<CardDescription>High-level notes for the account team.</CardDescription>
							</CardHeader>
							<CardContent className="text-muted-foreground text-sm leading-relaxed">
								Acme expanded to three regions last quarter. Primary contact is on the enterprise plan with
								annual billing and SSO enabled.
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent className="mt-4" value="people">
						<Card className="shadow-sm">
							<CardHeader>
								<CardTitle className="text-base">Directory</CardTitle>
								<CardDescription>Admins and members with access to this workspace.</CardDescription>
							</CardHeader>
							<CardContent className="space-y-3 text-sm">
								{["Ada Lovelace · Admin", "Grace Hopper · Member", "Alan Turing · Billing"].map((line) => (
									<div key={line}>
										<p>{line}</p>
										<Separator className="mt-3" />
									</div>
								))}
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent className="mt-4" value="billing">
						<Card className="shadow-sm">
							<CardHeader>
								<CardTitle className="text-base">Invoices</CardTitle>
							</CardHeader>
							<CardContent className="text-muted-foreground text-sm">
								Last invoice #INV-2048 paid on Mar 1. Next estimate $4,200.
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent className="mt-4" value="documents">
						<Card className="shadow-sm">
							<CardHeader className="flex flex-row items-center gap-2">
								<FileText className="size-4 text-muted-foreground" aria-hidden />
								<CardTitle className="text-base">Contracts</CardTitle>
							</CardHeader>
							<CardContent className="text-muted-foreground text-sm">
								MSA signed Jan 2024 · DPA on file · Security review Q4.
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</DashboardShell>
		</BlockPageRoot>
	)
}
