//create connection without returning anything
/**'
 * function parameter -
 * connections string, logger(connection bn jaye able to see it )
 *
 */
//why we write things ?
/**
 * connect krne ke liye database se 
 * connect bs krna hai hame jo ki sb cheezo mai populate hojaye jo bhi ham bnaye esme jisse connected rahe db se 
 * esiliye ham return nahi krate, bs ek event loop bnta hai jo ki pura hote hi it get connected 
 */
//where it is written ?
/**
 * mongoose db se connect krna chahte hai toh hmko usse import krana tha phir uske baad .env mai hmari connection string securely present thi toh usse bhi import kraya 
 * makeConnection jse upr bhi likha hai do cheze parameter m legi ki string kya hai jo ki aygi jb ham call krenge or logger( same thing )
 *agr connect hogye toh we want ki message show ho jaye connected successfully jo ki obviously done inside the function first an event is called async and then 
 catch mai error is shown 
 
 
 ab esko actually implement krne ke liye ki ye sbme use ho ham esko index.js mai use krenge 
 */

import { config } from "dotenv";
import mongoose from "mongoose";
async function makeConnection(connectionString, logger) {
  mongoose.connection.on("connected", () => {
    logger.info("Connected successfully");
  });
  try {
    await mongoose.connect(connectionString);
  } catch (err) {
    logger.info(err);
  }
}
export default makeConnection