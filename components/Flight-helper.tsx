"use client"

import { useState, useMemo, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plane, DollarSign, Shield, Package, CheckCircle } from "lucide-react"
import AsyncSelect from "react-select/async"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { FlightFormData } from "@/types/checkout"


// Async search logic
export const searchCache = new Map<string, Promise<any[]>>()
export const searchCacheCity = new Map<string, Promise<any[]>>()

export const debouncedFetchMunicipalities = (() => {
  let timeout: NodeJS.Timeout
  let controller: AbortController | null = null

  return async (query: string) => {
    if (!query || query.length < 2) return []

    const key = query.toLowerCase()
    if (searchCacheCity.has(key)) return searchCacheCity.get(key)!

    if (timeout) clearTimeout(timeout)
    if (controller) controller.abort()
    controller = new AbortController()

    const searchPromise = new Promise<any[]>((resolve) => {
      timeout = setTimeout(async () => {
        try {
          const res = await fetch(`/api/airports?query=${encodeURIComponent(query)}`, {
            signal: controller!.signal,
          })
          const data = await res.json()
          const uniqueMunicipalities = Array.from(new Set(data.map((airport: any) => airport.municipality))).map(
            (municipality) => ({
              label: municipality,
              value: municipality,
            }),
          )
          resolve(uniqueMunicipalities)
        } catch (err) {
          if ((err as Error).name !== "AbortError") console.error(err)
          resolve([])
        }
      }, 300)
    })

    searchCacheCity.set(key, searchPromise)
    setTimeout(() => searchCacheCity.delete(key), 5 * 60 * 1000)
    return searchPromise
  }
})()

export const debouncedFetchAirports = (() => {
  let timeout: NodeJS.Timeout
  let controller: AbortController | null = null

  return async (query: string, city?: string) => {
    if (!query || query.length < 2) return []
    if (!city) return []

    const key = `${query.toLowerCase()}-${city.toLowerCase()}`
    if (searchCache.has(key)) return searchCache.get(key)!

    if (timeout) clearTimeout(timeout)
    if (controller) controller.abort()
    controller = new AbortController()

    const searchPromise = new Promise<any[]>((resolve) => {
      timeout = setTimeout(async () => {
        try {
          const res = await fetch(`/api/airports?query=${encodeURIComponent(query)}&city=${encodeURIComponent(city)}`, {
            signal: controller!.signal,
          })
          const data = await res.json()
          const filteredAirports = data.filter(
            (airport: any) => airport.municipality && airport.municipality.toLowerCase() === city.toLowerCase(),
          )
          resolve(
            filteredAirports.map((airport: any) => ({
              label: `${airport.name || airport.ident} (${airport.iata_code || airport.local_code})`,
              value: airport.name,
            })),
          )
        } catch (err) {
          if ((err as Error).name !== "AbortError") console.error(err)
          resolve([])
        }
      }, 300)
    })

    searchCache.set(key, searchPromise)
    setTimeout(() => searchCache.delete(key), 5 * 60 * 1000)
    return searchPromise
  }
})()
