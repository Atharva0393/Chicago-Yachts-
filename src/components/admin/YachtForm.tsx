"use client"

import * as React from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { yachtSchema, type YachtFormValues } from "@/lib/validations/yacht"
import { Yacht } from "@/types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, X, UploadCloud, GripVertical } from "lucide-react"
import Image from "next/image"

interface YachtFormProps {
  initialData?: Yacht
  onSubmit: (data: YachtFormValues) => Promise<void>
  isSubmitting?: boolean
}

const COMMON_AMENITIES = [
  "Bluetooth Audio",
  "Restroom",
  "Swim Platform",
  "Floating Mat",
  "Cooler with Ice",
  "Air Conditioning",
  "Snorkeling Gear",
  "Kitchen/Grill",
  "Wi-Fi",
  "Water Toys"
]

export function YachtForm({ initialData, onSubmit, isSubmitting }: YachtFormProps) {
  const form = useForm<YachtFormValues>({
    resolver: zodResolver(yachtSchema) as any,
    defaultValues: initialData ? {
      ...initialData,
      amenities: initialData.amenities || [],
      images: initialData.images || [],
    } : {
      name: "",
      manufacturer: "",
      model: "",
      year: new Date().getFullYear(),
      length: 40,
      capacity: 12,
      cabins: 1,
      bathrooms: 1,
      description: "",
      pricePerHour: 300,
      rating: 0,
      reviewCount: 0,
      location: "Chicago, IL",
      amenities: [],
      images: [],
      availabilityStatus: "Available Today",
      isActive: true,
      isFeatured: false,
      instantBook: false,
    }
  })

  const { register, handleSubmit, control, formState: { errors }, watch, setValue } = form

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: "images" as never
  })

  // Simulated Mock Image Upload
  const handleSimulateUpload = () => {
    const mockImages = [
      "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&q=80&w=1000"
    ]
    const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)]
    appendImage(randomImage)
  }

  // Handle Amenity Checkbox
  const currentAmenities = watch("amenities") || []
  const toggleAmenity = (amenity: string) => {
    if (currentAmenities.includes(amenity)) {
      setValue("amenities", currentAmenities.filter(a => a !== amenity), { shouldValidate: true })
    } else {
      setValue("amenities", [...currentAmenities, amenity], { shouldValidate: true })
    }
  }

  return (
    <form id="yacht-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 p-6 pb-24">
      
      {/* Basic Info Section */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h3 className="text-lg font-medium text-slate-900">Basic Information</h3>
          <p className="text-sm text-slate-500">Essential details about the yacht.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Listing Title / Name *</Label>
            <Input id="name" {...register("name")} placeholder="e.g. The Grand Cruiser" />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Marina Location *</Label>
            <Input id="location" {...register("location")} placeholder="e.g. Burnham Harbor, Dock D" />
            {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" {...register("description")} placeholder="Describe the yacht experience..." />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <Label htmlFor="manufacturer">Make *</Label>
            <Input id="manufacturer" {...register("manufacturer")} placeholder="e.g. Sea Ray" />
            {errors.manufacturer && <p className="text-xs text-red-500">{errors.manufacturer.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Model *</Label>
            <Input id="model" {...register("model")} placeholder="e.g. Sundancer" />
            {errors.model && <p className="text-xs text-red-500">{errors.model.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Year *</Label>
            <Input id="year" type="number" {...register("year")} />
            {errors.year && <p className="text-xs text-red-500">{errors.year.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="length">Length (ft) *</Label>
            <Input id="length" type="number" {...register("length")} />
            {errors.length && <p className="text-xs text-red-500">{errors.length.message}</p>}
          </div>
        </div>
      </div>

      {/* Accommodations & Pricing Section */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h3 className="text-lg font-medium text-slate-900">Accommodations & Pricing</h3>
          <p className="text-sm text-slate-500">Set the capacity and charter rates.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <Label htmlFor="capacity">Max Guests *</Label>
            <Input id="capacity" type="number" {...register("capacity")} />
            {errors.capacity && <p className="text-xs text-red-500">{errors.capacity.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="cabins">Cabins</Label>
            <Input id="cabins" type="number" {...register("cabins")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input id="bathrooms" type="number" {...register("bathrooms")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pricePerHour">Price / Hour ($) *</Label>
            <Input id="pricePerHour" type="number" {...register("pricePerHour")} />
            {errors.pricePerHour && <p className="text-xs text-red-500">{errors.pricePerHour.message}</p>}
          </div>
        </div>

        <div className="space-y-2 max-w-xs">
          <Label htmlFor="availabilityStatus">Current Availability</Label>
          <select 
            id="availabilityStatus"
            {...register("availabilityStatus")}
            className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="Available Today">Available Today</option>
            <option value="Few Dates Left">Few Dates Left</option>
            <option value="Fully Booked">Fully Booked</option>
          </select>
        </div>
      </div>

      {/* Visibility & Configuration Section */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h3 className="text-lg font-medium text-slate-900">Visibility & Configuration</h3>
          <p className="text-sm text-slate-500">Manage how this yacht appears to customers.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
            <input 
              type="checkbox" 
              {...register("isActive")}
              className="mt-0.5 w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-900"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-900">Active</span>
              <span className="text-xs text-slate-500">Visible on the public fleet page</span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
            <input 
              type="checkbox" 
              {...register("isFeatured")}
              className="mt-0.5 w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-900"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-900">Featured</span>
              <span className="text-xs text-slate-500">Display prominently on the homepage</span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
            <input 
              type="checkbox" 
              {...register("instantBook")}
              className="mt-0.5 w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-900"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-900">Instant Book</span>
              <span className="text-xs text-slate-500">Allow booking without manual approval</span>
            </div>
          </label>
        </div>
      </div>

      {/* Amenities Section */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h3 className="text-lg font-medium text-slate-900">Amenities</h3>
          <p className="text-sm text-slate-500">Select what is included with the charter.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {COMMON_AMENITIES.map(amenity => (
            <label key={amenity} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-slate-900 border-slate-300 rounded focus:ring-slate-900"
                checked={currentAmenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
              />
              <span className="text-sm font-medium text-slate-700">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Images Section (Mock Upload) */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <h3 className="text-lg font-medium text-slate-900">Gallery</h3>
          <p className="text-sm text-slate-500">Upload photos of the yacht. The first photo will be the cover image.</p>
        </div>

        {errors.images && <p className="text-xs text-red-500">{errors.images.message}</p>}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {imageFields.map((field, index) => (
            <div key={field.id} className="group relative aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
              <Image 
                src={field as unknown as string} // RHF field array typing quirk when flat string array
                alt={`Upload ${index + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button 
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          
          <button 
            type="button"
            onClick={handleSimulateUpload}
            className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 hover:border-slate-400 transition-colors text-slate-500"
          >
            <UploadCloud className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">Upload Image</span>
            <span className="text-xs text-slate-400 mt-1">(Simulated)</span>
          </button>
        </div>
      </div>

    </form>
  )
}
