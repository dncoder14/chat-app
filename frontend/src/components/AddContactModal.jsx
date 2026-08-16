import { useState } from "react";
import { UserPlus } from "lucide-react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { axiosInstance } from "../lib/axios";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";
import Modal from "./ui/Modal";

const AddContactModal = ({ onClose }) => {
  const [phone, setPhone] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { getUsers } = useChatStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !isValidPhoneNumber(phone)) return;

    setIsLoading(true);
    try {
      await axiosInstance.post("/contacts/add", { phone });
      toast.success("Contact added successfully");
      getUsers(true);
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
          <PhoneInput
            id="contact-phone"
            international
            defaultCountry="IN"
            value={phone}
            onChange={setPhone}
            placeholder="Enter phone number"
            className="phone-input-field"
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
            disabled={isLoading || !phone || !isValidPhoneNumber(phone)}
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
