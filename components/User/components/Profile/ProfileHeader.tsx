'use client'
import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { Pencil, Camera } from 'lucide-react'

const ProfileHeader = () => {
  const [profileImage, setProfileImage] = useState("/images/one.png")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#023e8a]/10 p-6">
      <div className="flex items-center gap-6">
        <div className="relative group">
          <div className="relative h-24 w-24">
            <Image
              src={profileImage}
              alt="Profile"
              fill
              className="object-cover rounded-full ring-4 ring-[#023e8a]/10"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-black/40 
                         rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Camera className="w-6 h-6 text-white" />
            </button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-[#023e8a]">John Doe</h1>
          <p className="text-gray-500">john.doe@example.com</p>
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
