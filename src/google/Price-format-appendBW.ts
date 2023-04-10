import { sheets, auth } from "../auth/authGoogle";
import { toFormatPricesBWK } from "../batch/gecom-data";
import "dotenv/config";

export async function priceFormatAppendBWK() {
  const request = {
    // The ID of the spreadsheet to update.
    spreadsheetId: process.env.BWK_PRICE_FORMAT_SHEET_APPEND, // TODO: Update placeholder value.

    // The A1 notation of a range to search for a logical table of data.
    // Values are appended after the last row of the table.
    range: "price21!A2:B", // TODO: Update placeholder value.

    // How the input data should be interpreted.
    valueInputOption: "USER_ENTERED", // TODO: Update placeholder value.    

    resource: {
      majorDimension: "ROWS",
      values: toFormatPricesBWK,
    },

    auth: auth,
  };

  var valueRangeBody: object = {
    majorDimension: "ROWS",
    values: toFormatPricesBWK,
  };

  try {
      sheets.spreadsheets.values.update(request, valueRangeBody)
  } catch (err) {
    console.error(err);
  }
}
