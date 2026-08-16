import { useState } from "react";
import { UserPlus } from "lucide-react";
import { axiosInstance } from "../lib/axios";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import Modal from "./ui/Modal";

const AddContactModal = ({ onClose }) => {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { getUsers } = useChatStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setIsLoading(true);
    try {
      await axiosInstance.post("/contacts/add", { phone: phone.trim() });
      toast.success("Contact added successfully");
      getUsers();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add contact");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal onClose={onClose} title="Add Contact">
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="contact-phone" className="block text-sm font-medium text-foreground mb-1.5">
            Phone Number
          </label>
          <input
            id="contact-phone"
            type="tel"
            className="w-full px-3.5 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-foreground bg-surface-secondary rounded-lg hover:bg-border transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !phone.trim()}
            className="flex-1 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isLoading ? "Adding..." : "Add Contact"}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddContactModal;
