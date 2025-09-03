import NotFound from "@/app/not-found";
import { db } from "@/libs/core/db/ExtendedPrisma";
import ContactsViewList, { DisplayTypes } from "./ContactsViewList";
import ContactsFormView from "./ContactsFormView";
import { fetchParterById } from "../actions";
import { PartnerContacts } from "@/libs/definitions";
import { User } from "@/generate/prisma";
import { prisma } from "@/libs/prisma";

async function ContactsViewMain({
  viewMode,
  page,
  search = "",
  filter = "displayName",
  displayType,
  id,
}: {
  viewMode: string;
  page: string;
  search: string;
  filter: string;
  displayType: string;
  id: string;
}) {
  const skip: number = parseInt(page) || 1;
  const perPage = 50;
  let partner: PartnerContacts | null = null;
  let users: User[] | null = null;

  const [contacts, total] = await Promise.all([
    await db.find(
      "partner",
      ["and", [filter, "ilike", search], ["displayType", "=", displayType]],
      {
        include: {
          Image: true,
          relatedUser: true,
        },
        skip: (skip - 1) * perPage,
        take: perPage,
        orderBy: { id: "asc" },
      }
    ),
    await db.find("partner", [
      "and",
      [filter, "ilike", search],
      ["displayType", "=", displayType],
    ]),
  ]);

  if (id && id !== "null") {
    const resParter = await fetchParterById({ id });
    partner = resParter.data || null;
  } else {
    partner = null;
  }

  users = await db.find("user", ["and", ["active", "=", true]]);
  const allcontacts = await prisma.partner.findMany({
    where: {
      NOT: {
        id,
      },
    },
  });

  if (viewMode === "list") {
    return (
      <ContactsViewList
        total={total.length}
        perPage={perPage}
        page={parseInt(page)}
        filter={filter}
        displayType={displayType as keyof DisplayTypes}
        partners={contacts}
      />
    );
  } else if (viewMode === "form") {
    return (
      <ContactsFormView
        partner={partner || null}
        users={users}
        displayType={displayType}
        modelId={id}
        partners={allcontacts}
      />
    );
  } else {
    return <NotFound />;
  }
}

export default ContactsViewMain;
