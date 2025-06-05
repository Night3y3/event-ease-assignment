"use client"

import { useState } from "react"
import { type Control, useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
      options: [],
    })
  }

  return (
    <div className="space-y-4">
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
                <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name={`customFields.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Dietary Requirements" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`customFields.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select field type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="checkbox">Checkbox</SelectItem>
                          <SelectItem value="select">Dropdown</SelectItem>
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

              {control._formValues.customFields[index]?.type === "select" && (
                <OptionsField control={control} index={index} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function OptionsField({ control, index }: { control: Control<any>; index: number }) {
  const [newOption, setNewOption] = useState("")
  const { fields, append, remove } = useFieldArray({
    control,
    name: `customFields.${index}.options`,
  })

  const handleAddOption = () => {
    if (newOption.trim()) {
      append(newOption.trim())
      setNewOption("")
    }
  }

  return (
    <div className="space-y-2">
      <FormLabel>Options</FormLabel>
      <div className="flex gap-2">
        <Input
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          placeholder="Add an option"
          className="flex-1"
        />
        <Button type="button" onClick={handleAddOption} size="sm">
          Add
        </Button>
      </div>
      <div className="space-y-2 mt-2">
        {fields.length === 0 ? (
          <p className="text-sm text-muted-foreground">No options added yet</p>
        ) : (
          fields.map((option, optionIndex) => (
            <div key={option.id} className="flex items-center gap-2">
              <div className="bg-muted rounded px-3 py-1 text-sm flex-1">
                {Object.values(option).filter(val => val !== option.id).join('')}
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => remove(optionIndex)}>
                <Trash className="h-3 w-3" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}