const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "youremail@gmail.com", 
    pass: "yourpassword"          
  }
});


exports.sendNotification = functions.firestore
  .document("activityFeed/{docId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const msg = {
      from: "BookFlix <youremail@gmail.com>",
      to: data.userEmail, // email-ul userului
      subject: `Progress update by ${data.userName}`,
      text: `${data.userName} updated progress: ${data.progress} on ${data.itemTitle}`
    };
    try {
      await transporter.sendMail(msg);
      console.log("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  });
