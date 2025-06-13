"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Event } from "@/lib/types"
import { submitRSVP } from "@/lib/actions"
import { useSession } from "next-auth/react"
import { Calendar, Phone } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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
    phone: z.string().min(10, { message: "Please enter a valid phone number" }),
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
      phone: "",
      ...event.customFields?.reduce(
        (acc, field) => ({
          ...acc,
          [field.name]: "",
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
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
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
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="relative overflow-hidden border-border/50 bg-background/50 backdrop-blur-sm">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          style={{
            backgroundSize: "200% 200%",
          }}
        />

        <CardHeader className="relative z-10">
          <CardTitle>RSVP for this Event</CardTitle>
          <CardDescription>Fill out the form below to register for this event</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <Input
                          placeholder="John Doe"
                          className="transition-all duration-300 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10"
                          {...field}
                        />
                      </motion.div>
                    </FormControl>
                    <AnimatePresence>
                      {form.formState.errors.name && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <FormMessage />
                        </motion.div>
                      )}
                    </AnimatePresence>
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
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <Input
                          placeholder="john@example.com"
                          className="transition-all duration-300 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10"
                          {...field}
                        />
                      </motion.div>
                    </FormControl>
                    <AnimatePresence>
                      {form.formState.errors.email && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <FormMessage />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <Input
                          placeholder="+1 (555) 123-4567"
                          className="transition-all duration-300 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10"
                          type="tel"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          name={field.name}
                          ref={field.ref}
                          value={field.value || ""}
                          onChange={(e) => {
                            const numericValue = e.target.value.replace(/\D/g, "");
                            field.onChange(numericValue);
                          }}
                          onBlur={(e) => {

                            const stringValue = String(e.target.value);
                            field.onBlur();
                            field.onChange(stringValue);
                          }}
                          maxLength={15}
                        />
                      </motion.div>
                    </FormControl>
                    <AnimatePresence>
                      {form.formState.errors.phone && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <FormMessage />
                        </motion.div>
                      )}
                    </AnimatePresence>
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
                        <motion.div
                          whileFocus={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                          {field.type === "text" && (
                            <Input
                              className="transition-all duration-300 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10"
                              {...formField}
                            />
                          )}
                          {field.type === "number" && (
                            <Input
                              type="number"
                              className="transition-all duration-300 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10"
                              {...formField}
                            />
                          )}
                        </motion.div>
                      </FormControl>
                      <AnimatePresence>
                        {form.formState.errors[field.name as keyof typeof form.formState.errors] && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <FormMessage />
                          </motion.div>
                        )}
                      </AnimatePresence>
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

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 relative overflow-hidden group"
                  disabled={isSubmitting}
                >
                  <AnimatePresence mode="wait">
                    {isSubmitting ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <motion.div
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        />
                        <span>Submitting...</span>
                      </motion.div>
                    ) : (
                      <motion.div key="rsvp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        RSVP Now
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
