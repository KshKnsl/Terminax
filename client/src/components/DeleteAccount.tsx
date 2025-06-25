import { useState } from 'react';
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "./ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/contexts/AuthContext';
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000';

const DeleteAccount = ({ children }: { children: React.ReactNode }) => {
  const [confirmation, setConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const { logout } = useAuth();

  const handleDelete = async () => {
    if (confirmation !== "delete my account") {
      setError("Please type the confirmation phrase correctly.");
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      const response = await fetch(`${SERVER_URL}/auth/user`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete account. Please try again.');
      }
      logout();
      window.location.href = '/';

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 shadow-lg dark:shadow-purple-900/20">
        <DialogHeader>
          <DialogTitle className="text-red-600 dark:text-red-400 font-mono">Delete Account</DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            This action is <span className="font-semibold">irreversible</span>. All your data will be permanently deleted. 
            Please type <span className='text-red-600 dark:text-red-400 font-bold font-mono'>delete my account</span> to confirm.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Input 
            type="text"
            value={confirmation}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmation(e.target.value)}
            placeholder="delete my account"
            className="bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-700 focus:border-red-500 dark:focus:border-red-500 focus:ring-red-500 dark:focus:ring-red-500 font-mono"
            autoComplete="off"
          />
          {error && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-2 font-mono animate-pulse">
              {error}
            </p>
          )}
        </div>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button 
              type="button" 
              variant="secondary" 
              className="bg-gray-100 dark:bg-black hover:bg-gray-200 dark:hover:bg-[#0A0A0A] text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 transition-all duration-200"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button 
            type="button" 
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || confirmation !== "delete my account"}
            className={`text-white transition-all duration-200 ${isDeleting ? 'opacity-70' : ''} bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-600 border border-red-700 dark:border-red-800 shadow-sm dark:shadow-red-900/30`}
          >
            {isDeleting ? (
              <><span className="animate-pulse">Deleting</span>...</>
            ) : (
              'Delete Account'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccount;
