export function getOrgInfo() {
  return {
    name: process.env.NEXT_PUBLIC_COMPANY_NAME ?? "SMOKIN DUDES RECORDS S.R.L.",
    cui: process.env.NEXT_PUBLIC_COMPANY_CUI ?? "51944860",
    reg: process.env.NEXT_PUBLIC_COMPANY_J ?? "J2025041466004",
    address:
      process.env.NEXT_PUBLIC_COMPANY_ADDRESS ??
      "Jud. Iași, Municipiul Iași, Strada Aurora, Nr. 21",
    email:
      process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@smokindudesrecords.com",
    phone:
      process.env.NEXT_PUBLIC_PHONE_NUMBER ??
      process.env.NEXT_PUBLIC_CONTACT_PHONE ??
      "+40743065632",
    website:
      process.env.NEXT_PUBLIC_WEBSITE_URL ?? "https://smokindudesrecords.com",
  };
}

export const PRINTIFY_HELP_URL = "https://help.printify.com/";
