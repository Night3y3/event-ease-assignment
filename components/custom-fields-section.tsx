"use client"

import { type Control, useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trash, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface CustomFieldsProps {
  control: Control<any>
}

export function CustomFieldsSection({ control }: CustomFieldsProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "customFields",
  })

  const addCustomField = () => {
    append({
      name: "",
      type: "text",
      required: false,
    })
  }

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-foreground">
          Custom Fields
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addCustomField}
          className="w-full sm:w-auto h-9 sm:h-10 lg:h-11 text-sm sm:text-base font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          Add Field
        </Button>
      </div>

      {/* Empty State */}
      {fields.length === 0 ? (
        <Card className="w-full border-dashed border-2 border-muted-foreground/25">
          <CardContent className="p-6 sm:p-8 lg:p-10">
            <div className="text-center space-y-2">
              <div className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                No custom fields added yet.
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground/80">
                Add fields to collect additional information from attendees.
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Fields List */
        <div className="w-full space-y-4 sm:space-y-6">
          {fields.map((field, index) => (
            <Card key={field.id} className="w-full border border-border bg-card hover:shadow-sm transition-shadow">
              <CardContent className="p-4 sm:p-5 lg:p-6">
                <div className="space-y-4 sm:space-y-5">
                  {/* Field Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                    <h4 className="text-sm sm:text-base font-medium text-foreground">
                      Field {index + 1}
                    </h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="w-full sm:w-auto h-8 sm:h-9 text-sm font-medium text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Remove Field
                    </Button>
                  </div>

                  {/* Field Inputs Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                    {/* Field Name */}
                    <FormField
                      control={control}
                      name={`customFields.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="w-full min-w-0">
                          <FormLabel className="text-sm sm:text-base font-semibold">
                            Field Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Phone Number, Dietary Requirements"
                              className="w-full text-sm sm:text-base h-10 sm:h-11 lg:h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Field Type */}
                    <FormField
                      control={control}
                      name={`customFields.${index}.type`}
                      render={({ field }) => (
                        <FormItem className="w-full min-w-0">
                          <FormLabel className="text-sm sm:text-base font-semibold">
                            Field Type
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full text-sm sm:text-base h-10 sm:h-11 lg:h-12">
                                <SelectValue placeholder="Select field type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="text" className="text-sm sm:text-base">
                                Text
                              </SelectItem>
                              <SelectItem value="number" className="text-sm sm:text-base">
                                Number
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Required Checkbox */}
                  <FormField
                    control={control}
                    name={`customFields.${index}.required`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <div className="flex items-start gap-3 sm:gap-4 rounded-lg border border-border bg-muted/30 p-3 sm:p-4 lg:p-5">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                          </FormControl>
                          <div className="flex-1 space-y-1 leading-none">
                            <FormLabel className="text-sm sm:text-base font-semibold cursor-pointer">
                              Required Field
                            </FormLabel>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              Attendees must fill this field to register
                            </div>
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Helper Text */}
      {fields.length > 0 && (
        <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left px-1">
          💡 Custom fields will appear in the registration form for attendees to fill out.
        </div>
      )}
    </div>
  )
}