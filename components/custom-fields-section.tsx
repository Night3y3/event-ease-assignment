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
    <div className="space-y-4 max-w-screen-md w-full mx-auto px-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Custom Fields</h3>
        <Button type="button" variant="outline" size="sm" onClick={addCustomField}>
          <Plus className="mr-2 h-4 w-4" />
          Add Field
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-sm text-muted-foreground border rounded-md p-4 text-center">
          No custom fields added. Add fields to collect additional information from attendees.
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="border rounded-md p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Field {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name={`customFields.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="min-w-0">
                      <FormLabel>Field Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Phone Number" className="w-full" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`customFields.${index}.type`}
                  render={({ field }) => (
                    <FormItem className="min-w-0">
                      <FormLabel>Field Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select field type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={control}
                name={`customFields.${index}.required`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Required Field</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
