"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"

interface Developer {
  value: string
  label: string
}

const developers: Developer[] = [
  { value: "dev_alex", label: "dev_alex" },
  { value: "sarah_codes", label: "sarah_codes" },
  { value: "dev_mike", label: "dev_mike" },
  { value: "web_wizard", label: "web_wizard" },
  { value: "code_ninja", label: "code_ninja" },
]

interface DeveloperSelectProps {
  value: string
  onChange: (value: string) => void
}

export function DeveloperSelect({ value, onChange }: DeveloperSelectProps) {
  const [open, setOpen] = useState(false)

  const selectedDeveloper = developers.find((d) => d.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={<Button variant="outline" />}
        className="flex h-9 w-full items-center justify-between px-3 py-1 text-sm"
      >
        {selectedDeveloper ? selectedDeveloper.label : "Seleccionar desarrollador"}
        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Buscar desarrollador..." />
          <CommandList>
            <CommandEmpty>No encontrado.</CommandEmpty>
            <CommandGroup>
              {developers.map((developer) => (
                <CommandItem
                  key={developer.value}
                  value={developer.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50"
                  )}
                >
                  <span className="absolute left-2 flex size-4 items-center justify-center">
                    <Check
                      className={cn(
                        "size-4",
                        value === developer.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </span>
                  {developer.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
