import { Group, Image, Partner, User } from "@/generate/prisma";

export interface ActionResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ModalBasicProps {
  show: boolean;
  onHide?: () => void;
  action?: () => void;
  string?: string;
}

export interface PartnerWithAttrs extends Partner {
  createBy: User | null;
  relatedUser: User | null;
  Image: Image | null;
}

export interface PartnerContacts extends PartnerWithAttrs {
  userAgent: User | null;
}

export interface UserWithPartner extends User {
  partner: PartnerWithAttrs | null;
  group: Group | null;
  partenerLeads: Partner[] | null;
}

export interface UserWithLeads extends User {
  partenerLeads: PartnerWithAttrs[];
  partner: Pick<Partner, "name" | "imageId">;
}
