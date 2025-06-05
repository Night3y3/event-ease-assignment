"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Event } from "@/lib/types"
import { submitRSVP } from "@/lib/actions"
import { useSession } from "next-auth/react"
import { Calendar } from "lucide-react"

interface RSVPFormProps {
  event: Event
}

export function RSVPForm({ event }: RSVPFormProps) {
  const { toast } = useToast()
  const { data: session } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [addToCalendar, setAddToCalendar] = useState(false)

  // Build dynamic schema based on custom fields
  const baseSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
  })

  // Add custom fields to schema
  const customFieldsSchema =
    event.customFields?.reduce((acc, field) => {
      let fieldSchema: any

      switch (field.type) {
        case "text":
          fieldSchema = field.required
            ? z.string().min(1, { message: `${field.name} is required` })
            : z.string().optional()
          break
        case "number":
          fieldSchema = field.required
            ? z.string().min(1, { message: `${field.name} is required` })
            : z.string().optional()
          break
        case "checkbox":
          fieldSchema = field.required
            ? z.boolean().refine((val) => val === true, { message: `${field.name} is required` })
            : z.boolean().optional()
          break
        case "select":
          fieldSchema = field.required
            ? z.string().min(1, { message: `${field.name} is required` })
            : z.string().optional()
          break
        default:
          fieldSchema = z.string().optional()
      }

      return { ...acc, [field.name]: fieldSchema }
    }, {}) || {}

  const rsvpSchema = baseSchema.extend(customFieldsSchema)
  type RSVPFormValues = z.infer<typeof rsvpSchema>

  const form = useForm<RSVPFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      ...event.customFields?.reduce(
        (acc, field) => ({
          ...acc,
          [field.name]: field.type === "checkbox" ? false : "",
        }),
        {},
      ),
    },
  })

  async function onSubmit(data: RSVPFormValues) {
    setIsSubmitting(true)
    try {
      await submitRSVP(event.id, data, addToCalendar)
      toast({
        title: "RSVP Successful!",
        description: "Thank you for registering for this event.",
      })
      setIsSubmitted(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error submitting your RSVP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">RSVP Confirmed!</CardTitle>
          <CardDescription>Thank you for registering. We look forward to seeing you at the event!</CardDescription>
        </CardHeader>
        {addToCalendar && (
          <CardContent>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p className="text-sm">This event has been added to your Google Calendar.</p>
            </div>
          </CardContent>
        )}
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>RSVP for this Event</CardTitle>
        <CardDescription>Fill out the form below to register for this event</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Render custom fields */}
            {event.customFields?.map((field, index) => (
              <FormField
                key={index}
                control={form.control}
                name={field.name as any}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>
                      {field.name}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </FormLabel>
                    <FormControl>
                      {field.type === "text" && <Input {...formField} />}
                      {field.type === "number" && <Input type="number" {...formField} />}
                      {field.type === "checkbox" && (
                        <div className="flex items-center space-x-2">
                          <Checkbox checked={formField.value} onCheckedChange={formField.onChange} />
                          <span className="text-sm">{field.name}</span>
                        </div>
                      )}
                      {field.type === "select" && field.options && (
                        <Select onValueChange={formField.onChange} value={formField.value}>
                          <SelectTrigger>
                            <SelectValue placeholder={`Select ${field.name}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options.map((option, optionIndex) => (
                              <SelectItem key={optionIndex} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            {session?.accessToken && (
              <div className="flex items-center space-x-2 py-2">
                <Checkbox
                  id="add-to-calendar"
                  checked={addToCalendar}
                  onCheckedChange={(checked) => setAddToCalendar(checked as boolean)}
                />
                <label
                  htmlFor="add-to-calendar"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Add to my Google Calendar
                </label>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting RSVP..." : "RSVP Now"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
