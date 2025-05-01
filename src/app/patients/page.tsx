"use client"

import { useState, useMemo, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ArrowUp, ChevronLeft, ChevronRight, MoveDownLeft, MoveUpRight, Plus, Users } from "lucide-react"
import { PatientList } from '@/components/PatientList';
import { useRouter } from "next/navigation";

interface PatientStatsProps {
  totalPatients: number
  activePatients: number
  criticalCases: number
  newPatients: number
}

function PatientStats({ totalPatients, activePatients, criticalCases, newPatients }: PatientStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="flex gap-0 flex-col justify-between p-6 border rounded-md">
        <Users className="w-4 h-4 mb-10 text-primary" />
        <h2 className="text-4xl tracking-tighter max-w-xl text-left font-regular flex flex-row gap-4 items-end">
          {totalPatients}
        </h2>
        <p className="text-base leading-relaxed tracking-tight text-muted-foreground max-w-xl text-left">
          Total Patients
        </p>
      </div>
      <div className="flex gap-0 flex-col justify-between p-6 border rounded-md">
        <MoveUpRight className="w-4 h-4 mb-10 text-primary" />
        <h2 className="text-4xl tracking-tighter max-w-xl text-left font-regular flex flex-row gap-4 items-end">
          {activePatients}
          <span className="text-muted-foreground text-sm tracking-normal">
            {totalPatients > 0 ? `${Math.round((activePatients / totalPatients) * 100)}%` : '0%'}
          </span>
        </h2>
        <p className="text-base leading-relaxed tracking-tight text-muted-foreground max-w-xl text-left">
          Active Cases
        </p>
      </div>
      <div className="flex gap-0 flex-col justify-between p-6 border rounded-md">
        <MoveDownLeft className="w-4 h-4 mb-10 text-destructive" />
        <h2 className="text-4xl tracking-tighter max-w-xl text-left font-regular flex flex-row gap-4 items-end">
          {criticalCases}
          <span className="text-muted-foreground text-sm tracking-normal">
            {totalPatients > 0 ? `${Math.round((criticalCases / totalPatients) * 100)}%` : '0%'}
          </span>
        </h2>
        <p className="text-base leading-relaxed tracking-tight text-muted-foreground max-w-xl text-left">
          Critical Cases
        </p>
      </div>
      <div className="flex gap-0 flex-col justify-between p-6 border rounded-md">
        <MoveUpRight className="w-4 h-4 mb-10 text-green-500" />
        <h2 className="text-4xl tracking-tighter max-w-xl text-left font-regular flex flex-row gap-4 items-end">
          {newPatients}
          <span className="text-muted-foreground text-sm tracking-normal">
            {totalPatients > 0 ? `${Math.round((newPatients / totalPatients) * 100)}%` : '0%'}
          </span>
        </h2>
        <p className="text-base leading-relaxed tracking-tight text-muted-foreground max-w-xl text-left">
          New Patients (This Month)
        </p>
      </div>
    </div>
  )
}

export default function PatientsPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<"card" | "table">("table");
  const [stats, setStats] = useState<PatientStatsProps>({
    totalPatients: 0,
    activePatients: 0,
    criticalCases: 0,
    newPatients: 0
  });

  // Mock stats - in a real app you'd fetch these from your API
  useEffect(() => {
    // Simulating fetching stats
    setStats({
      totalPatients: 42,
      activePatients: 28,
      criticalCases: 5,
      newPatients: 12
    });
  }, []);

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold">Patient Management</h1>
        <Button onClick={() => router.push('/patients/new')} className="mt-4 sm:mt-0">
          <Plus className="mr-2 h-4 w-4" /> Add New Patient
        </Button>
      </div>
      
      <PatientStats {...stats} />
      
      <Card className="mt-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Patient Records</CardTitle>
              <CardDescription className="mt-1">
                Manage and view patient records in the system
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="table" value={activeView} onValueChange={(value) => setActiveView(value as "card" | "table")}>
            <div className="flex justify-end mb-4">
              <TabsList>
                <TabsTrigger value="table">Table View</TabsTrigger>
                <TabsTrigger value="card">Card View</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="table">
              <PatientList />
            </TabsContent>
            <TabsContent value="card">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">John Smith</CardTitle>
                    <CardDescription>DOB: Jan 15, 1978 • DOI: Mar 10, 2023</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid gap-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Provider</span>
                        <span className="text-sm font-medium">Dr. Johnson</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Type</span>
                        <span className="text-sm font-medium">Medical Examination</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <Badge>Active</Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <div className="flex justify-end w-full space-x-2">
                      <Button size="sm" variant="outline">View</Button>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Sarah Johnson</CardTitle>
                    <CardDescription>DOB: Apr 22, 1985 • DOI: Jun 05, 2023</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid gap-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Provider</span>
                        <span className="text-sm font-medium">Dr. Williams</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Type</span>
                        <span className="text-sm font-medium">Physical Therapy</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <Badge variant="outline">In Progress</Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <div className="flex justify-end w-full space-x-2">
                      <Button size="sm" variant="outline">View</Button>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Robert Brown</CardTitle>
                    <CardDescription>DOB: Nov 30, 1952 • DOI: Feb 18, 2023</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid gap-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Provider</span>
                        <span className="text-sm font-medium">Dr. Thompson</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Type</span>
                        <span className="text-sm font-medium">Orthopedic</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <Badge variant="destructive">Critical</Badge>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <div className="flex justify-end w-full space-x-2">
                      <Button size="sm" variant="outline">View</Button>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 