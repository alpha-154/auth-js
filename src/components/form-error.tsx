import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface FormErrorProps {
  message?: string;
}

export default function FormError({ message }: FormErrorProps) {
  return (
    message && (
      <div className="bg-red-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-500">
        <ExclamationTriangleIcon className="w-4 h-4" />
        {message}
      </div>
    )
  );
}
