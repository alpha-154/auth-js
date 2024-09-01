"use client"

import { z } from "zod"
import { useTransition, useState } from "react"
import { RegisterSchema } from "@/schemas"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormItem,
  FormField,
  FormLabel,
  FormMessage
} from "@/components/ui/form"


import { CardWrapper } from "@/components/auth/card-wrapper"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import FormError from "@/components/form-error"
import FormSuccess from "@/components/form-success"
import { register } from "@/actions/register"


export default function RegisterForm() {
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
     //console.log("LoginForm submitted: ", values)
     // axios.post("/api/sign-in", values)  ->> here , to send the data to api routs you can use
     setError("");
     setSuccess("");

     startTransition(() => {
      register(values)
      .then((data) => {
        setSuccess(data.success)
        setError(data.error)
      })
     })
  }

  return (
    <CardWrapper
     headerLabel="Create an account"
     backButtonLabel="Already have an account?"
     backButtonHref="/auth/login"
     showSocial
    >
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
          <FormField
             control={form.control}
             name= "name"
             render={({field}) => (
              <FormItem>
                <FormLabel>Username: </FormLabel>
                <FormControl>
                  <Input
                   {...field}
                   disabled={isPending}
                   placeholder="Johndoe"
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
             )}
            />
            <FormField
             control={form.control}
             name= "email"
             render={({field}) => (
              <FormItem>
                <FormLabel>Email: </FormLabel>
                <FormControl>
                  <Input
                   {...field}
                   disabled={isPending}
                   placeholder="JohnDoe@gmail.com"
                   type="email"
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
             )}
            />
            <FormField
             control={form.control}
             name= "password"
             render={({field}) => (
              <FormItem>
                <FormLabel>Password: </FormLabel>
                <FormControl>
                  <Input
                   {...field}
                   placeholder="hK7s_w13H#d"
                   disabled={isPending}
                   type="password"
                  />
                </FormControl>
                <FormMessage/> 
              </FormItem>
             )}
            />
          </div>
          <FormError 
           message={error}
          />
          <FormSuccess
            message={success}
          />
          
          <Button
           type="submit"
           className="w-full"
           disabled={isPending}
          >
            Create an account
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
