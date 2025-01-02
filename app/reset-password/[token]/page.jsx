'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Page({ params }) {
    const token = params.token;
    const [newPassword, setNewPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/update-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                newPassword, resetToken: token
            }),
        });
        if (res.ok) {
            router.push("/login")
        }
    }

    return (
        <div className="max-w-md mx-auto mt-64 p-6 bg-white rounded-md shadow-xl">
            <h1 className="text-3xl font-bold mb-5 text-center font-serif text-purple-800">Update Password</h1>
            <form onSubmit={handleSubmit}>
                <input
                    className="w-full p-2 mb-4 border rounded-md border-1 hover:border-purple-500 focus:border-purple-700 active:border-purple-700"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <button
                    className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-800 transition duration-300"
                    type="submit"
                >
                    Update Password
                </button>
            </form>
        </div>
    );
};
