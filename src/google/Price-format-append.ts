import { sheets, auth } from '../auth/authGoogle'
import { toFormatPricesATO } from '../batch/gecom-data';
import "dotenv/config";


export async function priceFormatAppendATO(): Promise<void> {
  const request = {
    // The ID of the spreadsheet to update.
    spreadsheetId: process.env.ATO_PRICE_FORMAT_SHEET_APPEND, // TODO: Update placeholder value.

    // The A1 notation of a range to search for a logical table of data.
    // Values are appended after the last row of the table.
    range: "price1000!A2:B", // TODO: Update placeholder value.

    // How the input data should be interpreted.
    valueInputOption: "USER_ENTERED", // TODO: Update placeholder value.    

    resource: {
      majorDimension: "ROWS",
      values: toFormatPricesATO,
    },

    auth: auth,
  };

  var valueRangeBody: object = {
    majorDimension: "ROWS",
    values: toFormatPricesATO,
  };

  try {
    sheets.spreadsheets.values.update(request, valueRangeBody);
  } catch (err) {
    console.error(err);
  }
}
