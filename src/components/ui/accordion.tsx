"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef(function AccordionItem(
  { className, ...props }: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>, 
  ref: React.ElementRef<typeof AccordionPrimitive.Item>
) {
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn("border-b", className)}
      {...props}
    />
  )
})

const AccordionTrigger = React.forwardRef(function AccordionTrigger(
  { className, children, ...props }: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>, 
  ref: React.ElementRef<typeof AccordionPrimitive.Trigger>
) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
})

const AccordionContent = React.forwardRef(function AccordionContent(
  { className, children, ...props }: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>, 
  ref: React.ElementRef<typeof AccordionPrimitive.Content>
) {
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={cn(
        "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        className
      )}
      {...props}
    >
      <div className="pb-4 pt-0">{children}</div>
    </AccordionPrimitive.Content>
  )
})

AccordionItem.displayName = "AccordionItem"
AccordionTrigger.displayName = "AccordionTrigger"
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }