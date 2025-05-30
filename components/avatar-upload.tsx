"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, Camera, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUser } from "@/context/user-context"
import { useToast } from "@/hooks/use-toast"

interface AvatarUploadProps {
  currentAvatar?: string | null
  onAvatarChange?: (avatarUrl: string) => void
}

export function AvatarUpload({ currentAvatar, onAvatarChange }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user, updateUser } = useUser()
  const { toast } = useToast()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 5MB",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
      setPendingFile(file)
      setHasChanges(true)

      // Show toast with save button
      toast({
        title: "Avatar ready to save",
        description: "Click Save Changes to update your avatar",
        action: (
          <Button size="sm" onClick={saveChanges} className="ml-2">
            <Save className="h-3 w-3 mr-1" />
            Save Changes
          </Button>
        ),
      })
    }
    reader.readAsDataURL(file)
  }

  const saveChanges = async () => {
    if (!pendingFile) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", pendingFile)

      const response = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()

      // Update user avatar in database
      const updateResponse = await fetch("/api/user/avatar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ avatarUrl: data.url }),
      })

      if (!updateResponse.ok) {
        throw new Error("Failed to update avatar")
      }

      // Update user context
      if (user) {
        updateUser({ avatar: data.url })
      }

      onAvatarChange?.(data.url)
      setPendingFile(null)
      setHasChanges(false)

      toast({
        title: "Success!",
        description: "Avatar updated successfully",
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Error",
        description: "Failed to upload avatar",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const discardChanges = () => {
    setPreview(currentAvatar || null)
    setPendingFile(null)
    setHasChanges(false)

    toast({
      title: "Changes discarded",
      description: "Avatar changes have been discarded",
    })
  }

  const removeAvatar = async () => {
    try {
      const response = await fetch("/api/user/avatar", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to remove avatar")
      }

      setPreview(null)
      setPendingFile(null)
      setHasChanges(false)

      if (user) {
        updateUser({ avatar: null })
      }
      onAvatarChange?.("")

      toast({
        title: "Success",
        description: "Avatar removed successfully",
      })
    } catch (error) {
      console.error("Remove error:", error)
      toast({
        title: "Error",
        description: "Failed to remove avatar",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive ? "border-foreground bg-muted/50" : "border-muted-foreground/25 hover:border-muted-foreground/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />

        {preview ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img
                src={preview || "/placeholder.svg"}
                alt="Avatar preview"
                className={`w-24 h-24 rounded-full object-cover ${hasChanges ? "ring-2 ring-blue-500" : ""}`}
              />
              {hasChanges && <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>}
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -left-2 h-6 w-6 rounded-full"
                onClick={removeAvatar}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                <Camera className="h-4 w-4 mr-2" />
                Change
              </Button>

              {hasChanges && (
                <>
                  <Button onClick={saveChanges} disabled={uploading}>
                    <Save className="h-4 w-4 mr-2" />
                    {uploading ? "Saving..." : "Save"}
                  </Button>
                  <Button variant="outline" onClick={discardChanges}>
                    Discard
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <Upload className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium">Upload your avatar</p>
              <p className="text-xs text-muted-foreground">Drag and drop or click to select</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, WebP up to 5MB</p>
            </div>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              <Upload className="h-4 w-4 mr-2" />
              Select File
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
