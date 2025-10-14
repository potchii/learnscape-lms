'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button'; // using ShadCN button

export default function LogoutButton() {
    return (
        <Button
            variant="destructive"
            onClick={() => signOut({ callbackUrl: '/' })}
            className="mt-4"
        >
            Logout
        </Button>
    );
}
