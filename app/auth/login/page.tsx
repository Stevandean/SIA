// @ts-nocheck
"use client"

import React, { useState } from "react"
import { CircleDollarSign } from "lucide-react"
import { useLogin } from "./hooks/useLogin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

/**
 * Halaman Login Sistem Informasi Akuntansi
 */
const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { handleLogin, loading } = useLogin()

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleLogin(email, password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <CircleDollarSign className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold">
            Sistem Informasi Akuntansi
          </CardTitle>
          <CardDescription>Siklus Pendapatan</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@accounting.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900 mb-2">
              Demo Credentials:
            </p>
            <p className="text-xs text-blue-700">
              Admin: admin@accounting.com / admin123
            </p>
            <p className="text-xs text-blue-700">
              Kasir: kasir@accounting.com / kasir123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
