# Proiect_SSD_books


### A Web Application for Tracking, Sharing, and Reviewing Books & Movies

---

##  Project Description

**Proiect_SSD_Books** is a collaborative web application that allows users to:
- Add **books** and **movies** to their personal library
- Keep **track of their progress** (pages read / movies watched)
- **Share and review** titles with others
- **Upload images** (cover, poster, or user profile)
- **Receive notifications/emails** when important events happen 

All data is securely stored and synchronized in **real time** using **Firebase Cloud Firestore**, allowing users to see updates instantly without refreshing the page.

---

##  Team Members


Oancea Maria   Authentication & User Profiles ,
Ioja Cristina  Book/Movie CRUD & Progress Tracking 


---

##  Actors in the System

 **User**  A registered person who can log in, manage their books/movies, track progress, and write reviews. 
 **System **  Manages data storage, authentication, image uploads, and real-time synchronization. 
 **Email Service (Firebase Functions)**  Sends confirmation or notification emails after events such as registration. 

---

##  Use Cases

### **Use Case 1 – Search for Movies/Books**

**Primary Actor:** User  
**Goal:** Find movies or books by title.  
**Interacting with the System:**
1. The user enters a title in the search bar and submits.  
2. The system searches in its internal Firestore database for matching titles.  
3. The system displays paginated search results with title, year, and cover images.  

---

### **Use Case 2 – View Item Details**

**Primary Actor:** User  
**Goal:** Inspect full details of a selected title.  
**Interacting with the System:**
1. The user clicks on a movie or book from the list.  
2. The app displays details such as title, description, author/director, year, rating, and user reviews.  

---

### **Use Case 3 – Add New Book or Movie**

**Primary Actor:** User  
**Goal:** Add a new book or movie entry into the system.  
**Interacting with the System:**
1. The user selects “Add New Item.”  
2. Enters details (title, author/director, year, description).  
3. Uploads a cover image (stored in Firebase Storage).  
4. The system saves the new item in Firestore and updates the list in real time.  

---

### **Use Case 4 – Add Item to Personal List**

**Primary Actor:** User  
**Goal:** Save a book or movie to a personal “To-Read” or “To-Watch” list.  
**Interacting with the System:**
1. User clicks “Add to List.”  
2. System stores the item reference under the user’s Firestore document.  
3. Item immediately appears in the user’s personal list.  

---

### **Use Case 5 – Track Reading/Watching Progress**

**Primary Actor:** User  
**Goal:** Update progress on a saved book or movie.  
**Interacting with the System:**
1. User selects an item from their list.  
2. Updates their progress  
3. System updates the user’s progress field in Firestore.  

---

### **Use Case 6 – Review a Book/Movie**

**Primary Actor:** User  
**Goal:** Write a review or rate an item.  
**Interacting with the System:**
1. User selects an item.  
2. Enters rating and a text review.  
3. System saves the review in Firestore and displays it on the item page.  

---

### **Use Case 7 – Register and Log In**

**Primary Actor:** User  
**Goal:** Access personalized features through authentication.  
**Interacting with the System:**
1. User registers with email/password or Google login.  
2. System creates a user profile in Firestore.  
3. Confirmation email is sent using Firebase Functions.  
4. User can now access personalized content.  

---

### **Use Case 8 – Share Progress**

**Primary Actor:** User  
**Goal:** Share progress updates publicly with other users.  
**Interacting with the System:**
1. User clicks “Share Progress.”  
2. System posts an update to the shared “Activity Feed.”  
3. All users see the new update instantly.  

---

### **Use Case 9 – Receive Notifications**

**Primary Actor:** User  
**Goal:** Receive email or in-app notifications.  
**Interacting with the System:**
1. A system event occurs.  
2. Firebase Functions sends a notification email to the affected user.  
3. Notification appears in the user’s dashboard.  



