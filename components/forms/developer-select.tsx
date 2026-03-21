"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Popover as PopoverPrimitive } from "@base-ui/react/popover"
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
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger
        className={cn(
          "flex h-9 w-full cursor-pointer items-center justify-between rounded-lg border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        {selectedDeveloper ? selectedDeveloper.label : "Seleccionar desarrollador"}
        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner side="bottom" align="start" sideOffset={4} className="z-50">
          <PopoverPrimitive.Popup className="w-[200px] rounded-lg border bg-popover p-0 text-popover-foreground shadow-md">
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
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
