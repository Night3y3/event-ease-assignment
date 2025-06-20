"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { createEvent, updateEvent } from "@/lib/actions"
import type { Event } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { CustomFieldsSection } from "@/components/custom-fields-section"

const eventSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  date: z.string().min(1, { message: "Date is required" }),
  location: z.string().optional(),
  description: z.string().optional(),
  published: z.boolean().default(false),
  customFields: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Field name is required" }),
        type: z.enum(["text", "number"]),
        required: z.boolean().default(false),
      }),
    )
    .default([]),
})

type EventFormValues = z.infer<typeof eventSchema>

interface EventFormProps {
  userId: string | undefined
  event?: Event
}

export function EventForm({ userId, event }: EventFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title || "",
      date: event?.date ? new Date(event.date).toISOString().split("T")[0] : "",
      location: event?.location || "",
      description: event?.description || "",
      published: event?.published || false,
      customFields: event?.customFields || [],
    },
  })

  async function onSubmit(data: EventFormValues) {
    setIsSubmitting(true)
    try {
      if (event) {
        await updateEvent(event.id, data)
        toast({
          title: "Event updated",
          description: "Your event has been updated successfully.",
        })
        router.push(`/dashboard/events/${event.id}`)
      } else {
        const newEvent = await createEvent({
          ...data,
          userId,
        })
        toast({
          title: "Event created",
          description: "Your event has been created successfully.",
        })
        router.push(`/dashboard/events/${newEvent.id}`)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4 sm:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {/* Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Event Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Annual Conference 2025"
                      className="h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date & Location Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Date
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Location
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="City Convention Center"
                        className="h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your event..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Custom Fields Section */}
            <div>
              <CustomFieldsSection control={form.control} />
            </div>

            {/* Published Checkbox */}
            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-start gap-3 rounded-lg border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-0.5"
                      />
                    </FormControl>
                    <div className="flex-1 space-y-1">
                      <FormLabel className="text-sm font-medium cursor-pointer">
                        Publish Event
                      </FormLabel>
                      <FormDescription className="text-xs text-muted-foreground">
                        Make this event visible to the public
                      </FormDescription>
                    </div>
                  </div>
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="w-full sm:w-auto h-10"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto h-10"
              >
                {isSubmitting
                  ? event
                    ? "Updating..."
                    : "Creating..."
                  : event
                    ? "Update Event"
                    : "Create Event"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}