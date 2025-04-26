import { useEffect, useState } from "react";
import UserList from "./UserList";
import api from "../api/axios";
import { UserProps } from "../types";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import Loader from "./Loader";

const DashboardContainer = () => {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);

        const res = await api.get(`/admin/get-users`);

        setUsers(res.data.users);
      } catch (error) {
        if (isAxiosError(error)) {
          toast.error(error.response?.data.message, {
            id: "toast",
          });
        }

        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserAccess = async (userId: string) => {
    try {
      const res = await api.put("/admin/edit-user-access", { userId });
      const updatedUser = res.data.updatedUser;

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? { ...user, ...updatedUser } : user,
        ),
      );

      toast.success(res.data.message, {
        id: "toast",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.message, {
          id: "toast",
        });
      }

      console.log(error);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <UserList users={users} rows={3} handleUserAccess={handleUserAccess} />
    </>
  );
};

export default DashboardContainer;
