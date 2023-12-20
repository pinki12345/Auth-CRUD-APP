import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { supabase } from "../createClient";
import { Graph } from "./Graph";

const UserTable = () => {
  let navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserAge, setNewUserAge] = useState("");
  const [newUserPrice, setNewUserPrice] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigate("/userTable");
    }, 60000);
  }, [navigate]);

  const handleEditRow = (editedUser) => {
    setSelectedUser(editedUser);
    setOpenModal(true);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    height: 250,
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const { data } = await supabase.from("users").select("*");
    setUsers(data);
  }

  const handleAddUser = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewUserName("");
    setNewUserAge("");
    setNewUserPrice("");
  };

  const handleAddNewUser = async () => {
    try {
      await supabase
        .from("users")
        .insert({ name: newUserName, age: newUserAge, price: newUserPrice });

      handleCloseModal();
      fetchUsers();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEditCloseModel = () => {
    setOpenModal(false);
    setSelectedUser(null);
  };

  const handleEditUser = async (editedUser) => {
    try {
      const { id, name, age, price } = editedUser;

      const { data, error } = await supabase
        .from("users")
        .update({ name, age, price })
        .match({ id });

      if (error) {
        console.error("Error editing user:", error.message);
        return;
      }

      const updatedUsers = users.map((user) =>
        user.id === id ? { ...user, name, age, price } : user
      );
      setUsers(updatedUsers);
      setOpenModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error editing user:", error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .delete()
        .match({ id: userId });

      if (error) {
        console.error("Error deleting user:", error.message);
        return;
      }

      const updatedUsers = users.filter((user) => user.id !== userId);
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };

  function handleLogout() {
    sessionStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleAddUser}>
        Add New User
      </Button>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Salary</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.age}</TableCell>
                <TableCell>{user.price}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleEditRow(user)}
                    style={{ marginRight: "8px" }}
                    variant="contained"
                    color="primary"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      handleDeleteUser(user.id);
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Graph userdata={users}/>

      <Button
        variant="contained"
        color="primary"
        onClick={handleLogout}
        className="logout"
      >
        Logout
      </Button>

      <Modal
        open={openModal || !!selectedUser}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 300,
              bgcolor: "background.paper",
              boxShadow: 24,
            }}
          >
            <TextField
              label="Name"
              fullWidth
              value={selectedUser ? selectedUser.name : newUserName}
              onChange={(e) => {
                if (selectedUser) {
                  const updatedUser = { ...selectedUser, name: e.target.value };
                  setSelectedUser(updatedUser);
                } else {
                  setNewUserName(e.target.value);
                }
              }}
              sx={{ marginTop: 2 }}
            />
            <TextField
              label="Age"
              fullWidth
              value={selectedUser ? selectedUser.age : newUserAge}
              onChange={(e) => {
                if (selectedUser) {
                  const updatedUser = { ...selectedUser, age: e.target.value };
                  setSelectedUser(updatedUser);
                } else {
                  setNewUserAge(e.target.value);
                }
              }}
              sx={{ marginTop: 2 }}
            />

            <TextField
              label="price"
              fullWidth
              value={selectedUser ? selectedUser.price : newUserPrice}
              onChange={(e) => {
                if (selectedUser) {
                  const updatedUser = {
                    ...selectedUser,
                    price: e.target.value,
                  };
                  setSelectedUser(updatedUser);
                } else {
                  setNewUserPrice(e.target.value);
                }
              }}
              sx={{ marginTop: 2 }}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                if (selectedUser) {
                  handleEditUser(selectedUser);
                } else {
                  handleAddNewUser();
                }
              }}
              style={{ marginTop: 10 }}
            >
              {selectedUser ? "Update User" : " Add User"}
            </Button>
            <Button
              variant="contained"
              onClick={selectedUser ? handleEditCloseModel : handleCloseModal}
              style={{ marginTop: 10, marginLeft: 5 }}
            >
              Close
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default UserTable;
