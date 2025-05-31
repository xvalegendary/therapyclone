"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
	const [strengthLevel, setStrengthLevel] = useState<
		'low' | 'medium' | 'high' | 'fully secure'
	>('low')
	const [strengthColor, setStrengthColor] = useState('bg-red-500')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()


  const calculatePasswordStrength = useMemo(
		() => (pass: string) => {
			if (!pass) return 0

			let strength = 0
			const length = pass.length

			// Критерии сложности
			if (length >= 8) strength += 25
			if (length >= 12) strength += 15
			if (/[A-Z]/.test(pass)) strength += 20
			if (/[a-z]/.test(pass)) strength += 20
			if (/\d/.test(pass)) strength += 20
			if (/[^A-Za-z0-9]/.test(pass)) strength += 20

			return Math.min(strength, 100)
		},
		[]
	)

  useEffect(() => {
		const strength = calculatePasswordStrength(password)
		setPasswordStrength(strength)

		setTimeout(() => {
			if (strength < 40) {
				setStrengthLevel('low')
				setStrengthColor('bg-red-500')
			} else if (strength < 70) {
				setStrengthLevel('medium')
				setStrengthColor('bg-yellow-500')
			} else if (strength < 90) {
				setStrengthLevel('high')
				setStrengthColor('bg-orange-500')
			} else {
				setStrengthLevel('fully secure')
				setStrengthColor('bg-green-500')
			}
		}, 10)
	}, [password, calculatePasswordStrength])
  
  // $$$ TATARSTAN WORLD WIDE $$$
  // SHAYTAN MASHINA PROTECTIONS $$$
  const checkPasswordStrength = (pass: string): boolean => {
		const hasMinLength = pass.length >= 8
		const hasUpperCase = /[A-Z]/.test(pass)
		const hasLowerCase = /[a-z]/.test(pass)
		const hasNumber = /\d/.test(pass)
		return hasMinLength && hasUpperCase && hasLowerCase && hasNumber
	}

  const validateName = (name: string): boolean => {
		return /^[a-zA-Zа-яА-Я\s]+$/.test(name)
	} 

  const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!validateName(name)) {
			toast({
				title: 'Invalid Name',
				description: 'Name should only contain letters and spaces',
				variant: 'destructive',
			})
			return
		}

		if (!checkPasswordStrength(password)) {
			toast({
				title: 'Weak Password',
				description:
					'Password must be at least 8 characters with uppercase, lowercase letters and numbers',
				variant: 'destructive',
			})
			return
		}

		if (password !== confirmPassword) {
			toast({
				title: 'Error',
				description: 'Passwords do not match',
				variant: 'destructive',
			})
			return
		}

		setIsLoading(true)

		try {
			const response = await fetch('/api/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name,
					email,
					password,
					username: email.split('@')[0], // Генерируем username из email
					avatar: '', // Добавляем пустой avatar
				}),
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Registration failed')
			}

			toast({
				title: 'Success',
				description: 'Account created successfully. Please sign in.',
			})

			router.push('/login')
		} catch (error: any) {
			toast({
				title: 'Error',
				description: error.message || 'Registration failed',
				variant: 'destructive',
			})
		} finally {
			setIsLoading(false)
		}
	}

  return (
		<div className='min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
			<Card className='w-full max-w-md'>
				<CardHeader className='space-y-1'>
					<CardTitle className='text-2xl font-bold text-center'>
						Create an account
					</CardTitle>
					<CardDescription className='text-center'>
						Enter your details to create your SDFM account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='name'>Full Name</Label>
							<Input
								id='name'
								type='text'
								placeholder='Enter your full name'
								value={name}
								onChange={e => setName(e.target.value)}
								required
							/>
							<p className='text-xs text-muted-foreground mt-1'>
								Only letters and spaces allowed
							</p>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								type='email'
								placeholder='Enter your email'
								value={email}
								onChange={e => setEmail(e.target.value)}
								required
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='password'>Password</Label>
							<div className='relative'>
								<Input
									id='password'
									type={showPassword ? 'text' : 'password'}
									placeholder='Create a password'
									value={password}
									onChange={e => setPassword(e.target.value)}
									required
								/>
								<Button
									type='button'
									variant='ghost'
									size='icon'
									className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? (
										<EyeOff className='h-4 w-4' />
									) : (
										<Eye className='h-4 w-4' />
									)}
								</Button>
							</div>
							{password && (
								<div className='mt-2 space-y-1'>
									<div className='w-full bg-gray-200 rounded-full h-2 overflow-hidden'>
										<div
											className={`h-full rounded-full transition-all duration-500 ease-out ${strengthColor}`}
											style={{ width: `${passwordStrength}%` }}
										/>
									</div>
									<div className='flex justify-between text-xs'>
										<span
											className={strengthLevel === 'low' ? 'font-bold' : ''}
										>
											Low
										</span>
										<span
											className={strengthLevel === 'medium' ? 'font-bold' : ''}
										>
											Medium
										</span>
										<span
											className={strengthLevel === 'high' ? 'font-bold' : ''}
										>
											High
										</span>
										<span
											className={
												strengthLevel === 'fully secure' ? 'font-bold' : ''
											}
										>
											Fully Secure
										</span>
									</div>
									<p className='text-xs text-muted-foreground'>
										Strength:{' '}
										<span className='font-medium capitalize'>
											{strengthLevel}
										</span>
									</p>
								</div>
							)}
							<p className='text-xs text-muted-foreground mt-1'>
								Must include uppercase, lowercase letters, and numbers
							</p>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='confirmPassword'>Confirm Password</Label>
							<div className='relative'>
								<Input
									id='confirmPassword'
									type={showConfirmPassword ? 'text' : 'password'}
									placeholder='Confirm your password'
									value={confirmPassword}
									onChange={e => setConfirmPassword(e.target.value)}
									required
								/>
								<Button
									type='button'
									variant='ghost'
									size='icon'
									className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								>
									{showConfirmPassword ? (
										<EyeOff className='h-4 w-4' />
									) : (
										<Eye className='h-4 w-4' />
									)}
								</Button>
							</div>
						</div>

						<Button type='submit' className='w-full' disabled={isLoading}>
							{isLoading ? (
								<>
									<Loader2 className='mr-2 h-4 w-4 animate-spin' />
									Creating account...
								</>
							) : (
								'Create Account'
							)}
						</Button>
					</form>

					<div className='mt-6 text-center text-sm'>
						<span className='text-muted-foreground'>
							Already have an account?{' '}
						</span>
						<Link href='/login' className='font-medium hover:underline'>
							Sign in
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
