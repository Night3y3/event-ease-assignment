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
    <div className="w-full min-h-screen bg-background">
      {/* Container with responsive padding and max-width */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4 sm:py-6 lg:py-8">
        <div className="w-full max-w-none lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto">
          <Card className="w-full shadow-lg border-0 sm:border sm:shadow-xl">
            <CardContent className="p-4 sm:p-6 lg:p-8 xl:p-10">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 lg:space-y-8">
                  {/* Title - Full width on all screens */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-sm sm:text-base font-semibold">
                          Event Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Annual Conference 2025"
                            className="w-full text-sm sm:text-base h-10 sm:h-11 lg:h-12"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Date & Location - Responsive grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-sm sm:text-base font-semibold">
                            Date
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              className="w-full text-sm sm:text-base h-10 sm:h-11 lg:h-12"
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
                        <FormItem className="w-full">
                          <FormLabel className="text-sm sm:text-base font-semibold">
                            Location
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="City Convention Center"
                              className="w-full text-sm sm:text-base h-10 sm:h-11 lg:h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Description - Full width with responsive height */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-sm sm:text-base font-semibold">
                          Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your event..."
                            className="w-full text-sm sm:text-base min-h-[100px] sm:min-h-[120px] lg:min-h-[140px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Custom Fields - Full width */}
                  <div className="w-full">
                    <CustomFieldsSection control={form.control} />
                  </div>

                  {/* Published Checkbox - Responsive padding */}
                  <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <div className="flex items-start gap-3 sm:gap-4 rounded-lg border border-border bg-card p-4 sm:p-5 lg:p-6">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                          </FormControl>
                          <div className="flex-1 space-y-1 leading-none">
                            <FormLabel className="text-sm sm:text-base font-semibold cursor-pointer">
                              Publish Event
                            </FormLabel>
                            <FormDescription className="text-xs sm:text-sm text-muted-foreground">
                              Make this event visible to the public
                            </FormDescription>
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Action Buttons - Responsive layout */}
                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-4 sm:pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      className="w-full sm:w-auto sm:min-w-[120px] h-10 sm:h-11 lg:h-12 text-sm sm:text-base font-medium"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto sm:min-w-[140px] h-10 sm:h-11 lg:h-12 text-sm sm:text-base font-medium"
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
        </div>
      </div>
    </div>
  )
}