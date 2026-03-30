export const isDocumentUrl = (url: string) =>
  /\.(pdf|doc|docx|xls|xlsx|txt)$/i.test(url);
