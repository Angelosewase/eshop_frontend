import React, { useState } from "react";

import { toast } from "sonner";
import SectionCard from "../ui-elements/Section-card";
import EditableField from "../ui-elements/Editabe-field";

interface PersonalInfoProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthdate?: string;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  firstName: initialFirstName,
  lastName: initialLastName,
  email: initialEmail,
  phone: initialPhone,
  birthdate: initialBirthdate,
}) => {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [birthdate, setBirthdate] = useState(initialBirthdate || "");

  const validateEmail = (value: string): string | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
    return null;
  };

  const validatePhone = (value: string): string | null => {
    // Simple validation for demonstration
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(value)) {
      return "Please enter a valid phone number";
    }
    return null;
  };

  const handleFieldSave = (field: string, value: string) => {
    console.log(`Saving ${field}: ${value}`);
    toast.message("Saved successfully");
  };

  return (
    <SectionCard
      title="Personal Information"
      description="Manage your personal details"
      tag="Profile"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EditableField
          label="First Name"
          value={firstName}
          onSave={(value) => {
            setFirstName(value);
            handleFieldSave("first name", value);
          }}
          required
        />

        <EditableField
          label="Last Name"
          value={lastName}
          onSave={(value) => {
            setLastName(value);
            handleFieldSave("last name", value);
          }}
          required
        />

        <EditableField
          label="Email Address"
          value={email}
          type="email"
          onSave={(value) => {
            setEmail(value);
            handleFieldSave("email", value);
          }}
          validate={validateEmail}
          required
        />

        <EditableField
          label="Phone Number"
          value={phone}
          type="tel"
          onSave={(value) => {
            setPhone(value);
            handleFieldSave("phone number", value);
          }}
          validate={validatePhone}
        />

        <EditableField
          label="Date of Birth"
          value={birthdate}
          type="date"
          onSave={(value) => {
            setBirthdate(value);
            handleFieldSave("birthdate", value);
          }}
          className="md:col-span-2"
        />
      </div>
    </SectionCard>
  );
};

export default PersonalInfo;
