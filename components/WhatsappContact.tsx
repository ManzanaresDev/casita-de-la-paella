"use client";
// components/WhatsappContact.tsx
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsappContact() {
  const phoneNumber = process.env.NEXT_PUBLIC_PhoneNumber;
  return (
    <a
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-container"
    >
      <FaWhatsapp size={28} />
      <span>{phoneNumber}</span>

      <style jsx>{`
        .whatsapp-container {
          display: flex;
          align-items: center;
          gap: 12px;
          width: fit-content;
          padding: 12px 20px;
          background: #1e1e1e;
          border: 1px solid #25d366;
          border-radius: 12px;
          color: white;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .whatsapp-container:hover {
          background: #25d366;
          transform: translateY(-2px);
        }

        .whatsapp-container span {
          font-size: 1rem;
          font-weight: 500;
        }
      `}</style>
    </a>
  );
}
