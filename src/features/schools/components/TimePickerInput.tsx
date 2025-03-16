"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"

interface TimePickerInputProps {
  value: string
  onChange: (value: string) => void
}

export function TimePickerInput({ value, onChange }: TimePickerInputProps) {
  const [hours, setHours] = useState<string>("")
  const [minutes, setMinutes] = useState<string>("")

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(":")
      setHours(h)
      setMinutes(m)
    }
  }, [value])

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHours = e.target.value
    if (/^\d{0,2}$/.test(newHours)) {
      const numericValue = newHours === "" ? 0 : Number.parseInt(newHours, 10)
      if (numericValue >= 0 && numericValue <= 23) {
        setHours(newHours)
        const formattedHours = newHours.padStart(2, "0")
        onChange(`${formattedHours}:${minutes}`)
      }
    }
  }

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinutes = e.target.value
    if (/^\d{0,2}$/.test(newMinutes)) {
      const numericValue = newMinutes === "" ? 0 : Number.parseInt(newMinutes, 10)
      if (numericValue >= 0 && numericValue <= 59) {
        setMinutes(newMinutes)
        const formattedMinutes = newMinutes.padStart(2, "0")
        onChange(`${hours}:${formattedMinutes}`)
      }
    }
  }

  return (
    <div className="flex items-center">
      <Input className="w-16 text-center" value={hours} onChange={handleHoursChange} placeholder="HH" maxLength={2} />
      <span className="mx-2">:</span>
      <Input
        className="w-16 text-center"
        value={minutes}
        onChange={handleMinutesChange}
        placeholder="MM"
        maxLength={2}
      />
    </div>
  )
}

