// "Sales_Account_Executive_Resume" -> "Sales Account Executive Resume"
export const formatTemplateName = (name: string): string =>
  name.replace(/_/g, " ").trim();
