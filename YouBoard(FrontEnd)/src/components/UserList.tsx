import {
  LockKeyhole,
  LockKeyholeOpen,
  Pencil,
  CircleUserRound,
  UserRoundPlus,
  UsersRound,
  Search,
} from "lucide-react";
import { UserListProps } from "../types";
import { formatDate } from "../utils/formatDate";
import { formatTime } from "../utils/formatTime";
import Pagination from "./Pagination";
import { useState } from "react";
import { Link } from "react-router-dom";

const UserList = ({ users, rows, handleUserAccess }: UserListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users
    .filter((user) => {
      const query = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      return b.createdAt.localeCompare(a.createdAt);
    });

  const totalPages = Math.ceil(filteredUsers.length / rows);

  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * rows,
    currentPage * rows
  );

  return (
    <main className="min-h-auto py-8 px-4 sm:px-6 lg:px-10 z-10 mx-4 sm:mx-10 lg:mx-30 xl:mx-50 rounded-lg bg-gray-800 shadow-2xl overflow-x-auto">
      <div className="flex flex-col items-center justify-center sm:flex-row">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-white uppercase flex items-center gap-2">
            <UsersRound className="h-6 w-6" />
            Users {`(${filteredUsers.length})`}
          </h1>
        </div>

        <div className="mt-5 sm:mt-0">
          <form className="relative w-fit">
            <input
              type="text"
              placeholder="Search Users..."
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="border-2 border-white rounded-full px-4 ps-10 py-[5.2px] outline-0 text-white w-55 sm:mr-5"
            />
            <Search className="absolute left-2 text-white -translate-y-1/2 top-1/2 cursor-pointer" />
          </form>
        </div>

        <div className="mt-4 sm:mt-0 sm:flex-none w-fit sm:w-auto">
          <Link to={"/admin/add-user"}>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-800 gap-2 transition-all cursor-pointer"
            >
              <UserRoundPlus className="h-4 w-4" />
              Add User
            </button>
          </Link>
        </div>
      </div>

      <div className="sm:mt-6 flex flex-col space-y-4 overflow-hidden">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 p-4 sm:px-6 md:px-4">
          <div className="inline-block min-w-full py-2 align-middle md:px-2 lg:px-4">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-white">
                <thead className="bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pr-3 text-left text-sm font-semibold text-white"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 min-w-24 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Joined On
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="relative divide-y divide-white bg-gray-800">
                  {currentUsers.map((user) => (
                    <tr
                      key={user.email}
                      className="hover:bg-white/5 transition-all"
                    >
                      <td>
                        <div className="flex items-center mr-4">
                          <div className="relative h-10 w-10 flex-shrink-0">
                            {user.imageUrl ? (
                              <img
                                src={user.imageUrl}
                                alt=""
                                className="w-10 h-auto rounded-full object-cover"
                              />
                            ) : (
                              <CircleUserRound
                                size={40}
                                className="border-2 rounded-full text-white"
                              />
                            )}
                            <span
                              className={`absolute w-3 h-3 right-0 bottom-0 rounded-full animate-pulse ${
                                user.isBlocked ? "bg-red-500" : "bg-green-500"
                              }`}
                            ></span>
                          </div>

                          <div className="ml-4 space-y-1">
                            <div className="font-medium text-white">
                              {user.name}
                            </div>
                            <div className="text-white font-extralight">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-3 py-4 space-y-1">
                        <div className="text-white">
                          {formatDate(user.createdAt)}
                        </div>
                        <div className="text-white">
                          {formatTime(user.createdAt)}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-3 py-4">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            user.isBlocked
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.isBlocked ? "Blocked" : "Unblocked"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-3 py-4 text-white">
                        <div className="flex gap-x-6">
                          <div
                            className="relative cursor-pointer"
                            onClick={() => handleUserAccess(user._id)}
                          >
                            {user.isBlocked && <LockKeyhole />}
                            {!user.isBlocked && <LockKeyholeOpen />}
                            <span className="absolute w-9 h-9 hover:bg-white/15 transition-all rounded-lg top-1/2 left-1/2 -translate-1/2"></span>
                          </div>

                          <Link to={`/admin/edit-user/${user._id}`}>
                            <div className="relative cursor-pointer">
                              <Pencil />
                              <span className="absolute w-9 h-9 hover:bg-white/15 transition-all rounded-lg top-1/2 left-1/2 -translate-1/2"></span>
                            </div>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                  <td></td>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {currentUsers.length ? (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      ) : (
        <h1 className="text-center text-white mt-4">No Users Found!</h1>
      )}
    </main>
  );
};

export default UserList;
