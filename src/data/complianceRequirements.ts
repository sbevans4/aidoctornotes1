
import { ComplianceItem } from "@/components/security/ComplianceChecklist";

export const complianceRequirements: ComplianceItem[] = [
  {
    id: "hipaa-risk-assessment",
    name: "HIPAA Risk Assessment",
    description: "Conduct and document a comprehensive risk assessment covering all systems handling PHI.",
    status: "complete",
    requiredFor: ["HIPAA"]
  },
  {
    id: "baa-agreements",
    name: "Business Associate Agreements",
    description: "Ensure all vendors with access to PHI have signed BAAs in place.",
    status: "complete",
    requiredFor: ["HIPAA"]
  },
  {
    id: "access-controls",
    name: "Role-Based Access Controls",
    description: "Implement and document role-based access control system for all systems with PHI.",
    status: "in-progress",
    requiredFor: ["HIPAA", "SOC 2"]
  },
  {
    id: "encryption-rest",
    name: "Encryption at Rest",
    description: "All stored PHI must be encrypted with AES-256 or equivalent encryption.",
    status: "complete",
    requiredFor: ["HIPAA", "SOC 2", "GDPR"]
  },
  {
    id: "encryption-transit",
    name: "Encryption in Transit",
    description: "All PHI in transit must be encrypted using TLS 1.2 or higher.",
    status: "complete",
    requiredFor: ["HIPAA", "SOC 2", "GDPR"]
  },
  {
    id: "audit-trails",
    name: "Audit Trails",
    description: "Maintain comprehensive audit logs for all PHI access and modification.",
    status: "in-progress",
    requiredFor: ["HIPAA", "SOC 2"]
  },
  {
    id: "breach-notification",
    name: "Breach Notification Process",
    description: "Document and implement breach notification procedures.",
    status: "not-started",
    requiredFor: ["HIPAA", "GDPR"]
  },
  {
    id: "security-training",
    name: "Security Awareness Training",
    description: "Conduct regular security awareness training for all staff.",
    status: "in-progress",
    requiredFor: ["HIPAA", "SOC 2"]
  },
  {
    id: "backup-dr",
    name: "Backup & Disaster Recovery",
    description: "Implement and test backup and disaster recovery procedures.",
    status: "not-started",
    requiredFor: ["SOC 2"]
  },
  {
    id: "vendor-management",
    name: "Vendor Risk Management",
    description: "Implement vendor risk assessment and management program.",
    status: "not-started",
    requiredFor: ["SOC 2"]
  }
];
