import api from "@/lib/api";

// Fetch all pending users
export const fetchPendingUsers = async () => {
  const res = await api.get("/admin/pending-users");
  return res.data.users;
};

// Verify (approve/reject) a user
export const verifyUser = async (userId, action) => {
  const res = await api.patch(`/admin/verify-user/${userId}`, { action });
  return res.data;
};
