"use client";

import { useCallback, useEffect, useState } from "react";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { newVerification } from "@/actions/new-verification";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
   //if(success || error) return

    if (!token) {
      setError("Missing token!");
      return;
    }
    console.log({ token });

    newVerification(token)
      .then((data) => {
        setError(data.error);
        setSuccess(data.success);
        // redirect to home page or any other page you want
        //router.push("/")  // assuming you are using nextjs router
      })
      .catch(() => {
        setError("Something went Wrong!");
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to Login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <BeatLoader />}
        <FormSuccess message={success} />
        {/* {
            !success && <FormError message={success} />
        } */}
         <FormError message={success} /> 
        
      </div>
    </CardWrapper>
  );
};
