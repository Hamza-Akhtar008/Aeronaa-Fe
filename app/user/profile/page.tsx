'use client'
import React from 'react'
import ProfileHeader from '@/components/User/components/Profile/ProfileHeader'
import TravelStats from '@/components/User/components/Profile/TravelStats'
import PersonalInformation from '@/components/User/components/Profile/PersonalInformation'
import ActivityAndDestinations from '@/components/User/components/Profile/ActivityAndDestinations'

const Profile = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PersonalInformation />
      {/* <TravelStats />
      <ActivityAndDestinations /> */}
    </div>
  )
}

export default Profile
