
import { ProfileButton } from './profile-button'
import React from 'react'

export function Header() {
  return (
    <div className="mx-auto flex max-w-[1200px] items-center justify-between">
      <div className="flex items-center gap-3">
        {/* <Image
          src=""
          className="size-6 dark:invert"
          alt="logo"
        /> */}
      </div>

      <div className="flex items-center gap-4">
        <ProfileButton />
      </div>
    </div>
  )
}