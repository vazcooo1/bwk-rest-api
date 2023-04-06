import { google } from "googleapis";

export const auth = new google.auth.GoogleAuth({
  keyFile: "./google-auth/gkey.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
export const sheets = google.sheets({ version: "v4", auth });
google.options({
  auth: auth,
});