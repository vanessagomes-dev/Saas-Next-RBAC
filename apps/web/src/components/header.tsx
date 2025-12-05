import React from 'react'
import { Slash } from 'lucide-react'
import { ability } from '@/auth/auth'
import { ProfileButton } from './profile-button'
import { OrganizationSwitcher } from './organization-switcher'
import { ThemeSwitcher } from './theme/theme-switcher'
import { Separator } from './ui/separator'


export async function Header() {
  const permissions = await ability()
  return (
    <div className="mx-auto flex max-w-[1200px] items-center justify-between">
      <div className="flex items-center gap-3">
        {/* <Image
          src=""
          className="size-6 dark:invert"
          alt="logo"
        /> */}

        <Slash className="size-3 -rotate-[24deg] text-border" />

        <OrganizationSwitcher />
        {permissions?.can('get', 'Project') && <p>Project</p>}
      </div>

      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <Separator orientation="vertical" className="h-5" />
        <ProfileButton />
      </div>
    </div>
  )
}