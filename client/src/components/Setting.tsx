import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DeleteAccount from "@/components/DeleteAccount";
import { UserCircle2, Github, User, CalendarDays, CheckCircle2 } from "lucide-react";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const Setting = () => {
  const { user, refreshUser } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (avatarFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(avatarFile);
    }
  }, [avatarFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("displayName", displayName);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      const response = await fetch(`${SERVER_URL}/user/profile`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      await refreshUser();
      setSuccess("Profile updated successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Profile Information */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Section */}
          <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Profile Information
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Manage your account details
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 dark:bg-[#0A0A0A] border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-colors">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserCircle2 className="w-full h-full text-gray-400 dark:text-gray-600 p-4" />
                      )}
                    </div>
                    <Input
                      type="file"
                      id="avatar"
                      accept="image/*"
                      onChange={(e) => setAvatarFile(e.target.files ? e.target.files[0] : null)}
                      className="hidden"
                    />
                    <label
                      htmlFor="avatar"
                      className="absolute bottom-0 right-0 bg-purple-500 hover:bg-purple-600 text-white rounded-full p-2 cursor-pointer shadow-lg transform transition-transform duration-200 hover:scale-110">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="displayName"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Display Name
                    </label>
                    <Input
                      id="displayName"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="mt-1 block w-full bg-gray-50 dark:bg-black border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500"
                      placeholder="Enter your display name"
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-purple-500 hover:bg-purple-600 text-white shadow-sm dark:shadow-purple-900/20">
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Saving...
                        </span>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}
                {success && (
                  <div className="p-3 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* GitHub Connection */}
          <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <Github className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">GitHub Connection</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Your GitHub account connection details
                  </p>
                </div>
              </div>
              <div className="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-[#171717] border border-gray-200 dark:border-gray-800">
                {user?.githubId ? (
                  <>
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {user?.username ? `@${user.username}` : user?.email || "-"}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Connected since {formatDate(user?.createdAt || new Date())}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Active
                      </span>
                      <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                        GitHub ID:
                        <span className="font-mono text-gray-700 dark:text-gray-200">
                          {user.githubId}
                        </span>
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user?.email || "-"}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 mt-2">
                      Not Connected
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Account Information */}
        <div className="space-y-6">
          {/* Account Details */}
          <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Account Details</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm">
                    <CalendarDays className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">Joined</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(user?.createdAt || new Date())}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">Plan</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {user?.plan?.name || "Free Tier"}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">Provider</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {user?.provider || "-"}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">Email</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {user?.email || "-"}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">GitHub ID</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {user?.githubId || "-"}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-400">User ID</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {user?._id || user?.id || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Plan Features */}
          <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Plan Features</h3>
              <ul className="space-y-3">
                {user?.plan?.features?.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Stats */}
          {user?.stats && (
            <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Usage Stats</h3>
                <ul className="space-y-2">
                  <li className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Apps</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {user.stats.totalApps}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Active Sessions</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {user.stats.activeSessions}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Sessions</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {user.stats.totalSessions}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Danger Zone */}
          <div className="bg-white dark:bg-[#0A0A0A] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-6">
              <div className="rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 p-4">
                <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-4">
                  Once deleted, there is no going back.
                </p>
                <DeleteAccount>
                  <Button
                    variant="destructive"
                    className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600">
                    Delete Account
                  </Button>
                </DeleteAccount>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
